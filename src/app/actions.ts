"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb } from "@/db";
import {
  awardPredictions,
  matchPredictions,
  matches,
  players,
  tournamentPredictions,
  users,
} from "@/db/schema";
import { canSubmitMatchPrediction } from "@/lib/scoring";
import { groups } from "@/lib/tournament";

const scoreSchema = z.object({
  matchId: z.coerce.number().int().positive(),
  homeScore: z.coerce.number().int().min(0).max(30),
  awayScore: z.coerce.number().int().min(0).max(30),
});

const awardSchema = z.object({
  goldenBootPlayerId: z.string().min(1),
  goldenGlovePlayerId: z.string().min(1),
  goldenBallPlayerId: z.string().min(1),
  youngPlayerId: z.string().min(1),
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
      message: "Секоја група мора да содржи четири различно рангирани репрезентации.",
    });
  }
  if (
    prediction.thirdPlaceGroups.length !== 8 ||
    new Set(prediction.thirdPlaceGroups).size !== 8 ||
    prediction.thirdPlaceGroups.some((groupId) => !groupIds.includes(groupId))
  ) {
    context.addIssue({
      code: "custom",
      message: "Мора да изберете точно осум различни групи со третопласирани репрезентации.",
    });
  }
  if (
    Object.keys(prediction.bracket).length !== 32 ||
    Object.values(prediction.bracket).some((code) => !teamCodes.has(code))
  ) {
    context.addIssue({
      code: "custom",
      message: "Мора да бидат избрани сите 32 победници во нокаут-фазата.",
    });
  }
});

async function ensureCurrentUser(db: ReturnType<typeof getDb>) {
  const { userId } = await auth();
  if (!userId) throw new Error("Мора да се најавите за да испратите предвидување.");
  const profile = await currentUser();
  const displayName =
    profile?.fullName ??
    profile?.username ??
    profile?.primaryEmailAddress?.emailAddress.split("@")[0] ??
    "Worldie играч";
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
    throw new Error("Предвидувањата се затвораат 10 минути пред почетокот.");
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
    throw new Error("Турнирските предвидувања се затворени.");
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
    throw new Error("Вашето турнирско предвидување веќе е испратено.");
  }

  revalidatePath("/");
  return { submitted: true };
}

export async function saveAwardPrediction(input: z.input<typeof awardSchema>) {
  const prediction = awardSchema.parse(input);
  const lockTime = new Date("2026-06-11T18:50:00Z");
  if (Date.now() > lockTime.getTime()) {
    throw new Error("Предвидувањата за наградите се затворени.");
  }

  const db = getDb();
  const userId = await ensureCurrentUser(db);
  const selectedIds = [...new Set(Object.values(prediction))];
  const selectedPlayers = await db
    .select({
      id: players.id,
      position: players.position,
      dateOfBirth: players.dateOfBirth,
    })
    .from(players)
    .where(inArray(players.id, selectedIds));
  const playerById = new Map(selectedPlayers.map((player) => [player.id, player]));

  if (selectedIds.some((id) => !playerById.has(id))) {
    throw new Error("Еден или повеќе од избраните играчи не се валидни.");
  }
  if (playerById.get(prediction.goldenGlovePlayerId)?.position !== "Goalkeeper") {
    throw new Error("За Златна ракавица мора да изберете голман.");
  }

  const youngPlayer = playerById.get(prediction.youngPlayerId);
  const openingDay = new Date("2026-06-11T00:00:00Z");
  const under21Cutoff = new Date(openingDay);
  under21Cutoff.setUTCFullYear(under21Cutoff.getUTCFullYear() - 21);
  if (!youngPlayer?.dateOfBirth || youngPlayer.dateOfBirth <= under21Cutoff) {
    throw new Error("За наградата за млад играч мора да изберете играч под 21 година.");
  }

  await db
    .insert(awardPredictions)
    .values({ userId, ...prediction })
    .onConflictDoUpdate({
      target: awardPredictions.userId,
      set: {
        ...prediction,
        updatedAt: new Date(),
      },
    });

  revalidatePath("/");
  return { saved: true };
}
