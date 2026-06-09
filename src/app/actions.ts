"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb } from "@/db";
import { matchPredictions, matches, tournamentPredictions, users } from "@/db/schema";
import { canSubmitMatchPrediction } from "@/lib/scoring";
import { groups } from "@/lib/tournament";

const scoreSchema = z.object({
  matchId: z.coerce.number().int().positive(),
  homeScore: z.coerce.number().int().min(0).max(30),
  awayScore: z.coerce.number().int().min(0).max(30),
});

const teamCodes = new Set(groups.flatMap((group) => group.teams.map((team) => team.code)));
const tournamentSchema = z.object({
  groupRankings: z.record(z.string(), z.array(z.string())),
  thirdPlaceGroups: z.array(z.string()),
  bracket: z.record(z.string(), z.string()),
}).superRefine((prediction, context) => {
  const groupIds = groups.map((group) => group.id);
  if (
    Object.keys(prediction.groupRankings).length !== groupIds.length ||
    groupIds.some((groupId) => {
      const ranking = prediction.groupRankings[groupId];
      return (
        ranking?.length !== 4 ||
        new Set(ranking).size !== 4 ||
        ranking.some((code) => !teamCodes.has(code))
      );
    })
  ) {
    context.addIssue({
      code: "custom",
      message: "Every group must contain four uniquely ranked teams.",
    });
  }
  if (
    prediction.thirdPlaceGroups.length !== 8 ||
    new Set(prediction.thirdPlaceGroups).size !== 8 ||
    prediction.thirdPlaceGroups.some((groupId) => !groupIds.includes(groupId))
  ) {
    context.addIssue({
      code: "custom",
      message: "Exactly eight unique third-place groups must be selected.",
    });
  }
  if (
    Object.keys(prediction.bracket).length !== 32 ||
    Object.values(prediction.bracket).some((code) => !teamCodes.has(code))
  ) {
    context.addIssue({
      code: "custom",
      message: "All 32 knockout winners must be selected.",
    });
  }
});

async function ensureCurrentUser(db: ReturnType<typeof getDb>) {
  const { userId } = await auth();
  if (!userId) throw new Error("You must sign in to submit a prediction.");
  const profile = await currentUser();
  const displayName =
    profile?.fullName ??
    profile?.username ??
    profile?.primaryEmailAddress?.emailAddress.split("@")[0] ??
    "Worldie Player";
  await db
    .insert(users)
    .values({
      id: userId,
      displayName,
      email: profile?.primaryEmailAddress?.emailAddress,
      avatarUrl: profile?.imageUrl,
    })
    .onConflictDoUpdate({
      target: users.id,
      set: {
        displayName,
        email: profile?.primaryEmailAddress?.emailAddress,
        avatarUrl: profile?.imageUrl,
      },
    });
  return userId;
}

export async function saveMatchPrediction(input: z.input<typeof scoreSchema>) {
  const prediction = scoreSchema.parse(input);
  const db = getDb();
  const userId = await ensureCurrentUser(db);
  const [match] = await db
    .select({ kickoff: matches.kickoff })
    .from(matches)
    .where(eq(matches.id, prediction.matchId))
    .limit(1);

  if (!match || !canSubmitMatchPrediction(match.kickoff)) {
    throw new Error("Predictions close 10 minutes before kickoff.");
  }

  await db
    .insert(matchPredictions)
    .values({ userId, ...prediction })
    .onConflictDoUpdate({
      target: [matchPredictions.userId, matchPredictions.matchId],
      set: {
        homeScore: prediction.homeScore,
        awayScore: prediction.awayScore,
        submittedAt: new Date(),
      },
    });
  revalidatePath("/");
  return {
    matchId: prediction.matchId,
    homeScore: prediction.homeScore,
    awayScore: prediction.awayScore,
  };
}

export async function saveTournamentPrediction(
  input: z.input<typeof tournamentSchema>,
) {
  const prediction = tournamentSchema.parse(input);
  const lockTime = new Date("2026-06-11T18:50:00Z");
  if (Date.now() > lockTime.getTime()) {
    throw new Error("Tournament predictions are closed.");
  }

  const db = getDb();
  const userId = await ensureCurrentUser(db);
  const inserted = await db
    .insert(tournamentPredictions)
    .values({
      userId,
      groupRankings: prediction.groupRankings,
      thirdPlaceGroups: prediction.thirdPlaceGroups,
      bracket: prediction.bracket,
    })
    .onConflictDoNothing()
    .returning({ userId: tournamentPredictions.userId });

  if (inserted.length === 0) {
    throw new Error("Your tournament prediction has already been submitted.");
  }

  revalidatePath("/");
  return { submitted: true };
}
