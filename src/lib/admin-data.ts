import "server-only";

import { asc, desc, eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import {
  matchPredictions,
  matches,
  officialGroupStandings,
  teams,
  tournamentPredictions,
  users,
} from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { knockoutMatches } from "@/lib/knockout";

const stageMap = {
  "Round of 32": "round_of_32",
  "Round of 16": "round_of_16",
  "Quarter-finals": "quarter_final",
  "Semi-finals": "semi_final",
  "Medal matches": "final",
} as const;

export async function ensureKnockoutFixtures() {
  const db = getDb();
  await db
    .insert(matches)
    .values(
      knockoutMatches.map((match) => ({
        id: match.id,
        stage: match.id === 103 ? "third_place" as const : stageMap[match.stage],
        kickoff: new Date(`2026-${match.date.startsWith("Jun") ? "06" : "07"}-${match.date.split(" ")[1].padStart(2, "0")}T12:00:00Z`),
        venue: match.venue,
      })),
    )
    .onConflictDoNothing();
}

export async function getAdminData() {
  await requireAdmin();
  await ensureKnockoutFixtures();
  const db = getDb();

  const [
    userRows,
    teamRows,
    matchRows,
    standingRows,
    matchPredictionRows,
    tournamentPredictionRows,
  ] = await Promise.all([
    db.select().from(users).orderBy(asc(users.createdAt)),
    db.select().from(teams).orderBy(asc(teams.group), asc(teams.name)),
    db.select().from(matches).orderBy(asc(matches.kickoff), asc(matches.id)),
    db.select().from(officialGroupStandings).orderBy(asc(officialGroupStandings.group)),
    db
      .select({
        userId: matchPredictions.userId,
        userName: users.displayName,
        matchId: matchPredictions.matchId,
        homeScore: matchPredictions.homeScore,
        awayScore: matchPredictions.awayScore,
        points: matchPredictions.points,
        submittedAt: matchPredictions.submittedAt,
      })
      .from(matchPredictions)
      .innerJoin(users, eq(users.id, matchPredictions.userId))
      .orderBy(desc(matchPredictions.submittedAt)),
    db
      .select({
        userId: tournamentPredictions.userId,
        userName: users.displayName,
        groupRankings: tournamentPredictions.groupRankings,
        thirdPlaceGroups: tournamentPredictions.thirdPlaceGroups,
        bracket: tournamentPredictions.bracket,
        points: tournamentPredictions.points,
        submittedAt: tournamentPredictions.submittedAt,
      })
      .from(tournamentPredictions)
      .innerJoin(users, eq(users.id, tournamentPredictions.userId))
      .orderBy(desc(tournamentPredictions.submittedAt)),
  ]);

  const counts = {
    users: userRows.length,
    teams: teamRows.length,
    matches: matchRows.length,
    completedMatches: matchRows.filter((match) => match.complete).length,
    matchPredictions: matchPredictionRows.length,
    tournamentPredictions: tournamentPredictionRows.length,
    totalPoints:
      matchPredictionRows.reduce((total, prediction) => total + prediction.points, 0) +
      tournamentPredictionRows.reduce((total, prediction) => total + prediction.points, 0),
  };

  return {
    currentTime: new Date(),
    counts,
    users: userRows,
    teams: teamRows,
    matches: matchRows,
    standings: standingRows,
    matchPredictions: matchPredictionRows,
    tournamentPredictions: tournamentPredictionRows,
  };
}

export async function getAdminLeaderboard() {
  await requireAdmin();
  const db = getDb();
  return db
    .select({
      userId: users.id,
      name: users.displayName,
      email: users.email,
      tournamentPoints: sql<number>`coalesce(${tournamentPredictions.points}, 0)`.mapWith(Number),
    })
    .from(users)
    .leftJoin(tournamentPredictions, eq(tournamentPredictions.userId, users.id));
}
