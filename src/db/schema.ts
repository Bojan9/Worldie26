import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const matchStage = pgEnum("match_stage", [
  "group",
  "round_of_32",
  "round_of_16",
  "quarter_final",
  "semi_final",
  "third_place",
  "final",
]);

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  displayName: text("display_name").notNull(),
  email: text("email"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const teams = pgTable("teams", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  group: text("group_name").notNull(),
  flag: text("flag").notNull(),
});

export const matches = pgTable("matches", {
  id: integer("id").primaryKey(),
  stage: matchStage("stage").notNull(),
  group: text("group_name"),
  homeTeamId: text("home_team_id").references(() => teams.id),
  awayTeamId: text("away_team_id").references(() => teams.id),
  kickoff: timestamp("kickoff", { withTimezone: true }).notNull(),
  venue: text("venue").notNull(),
  homeScore: integer("home_score"),
  awayScore: integer("away_score"),
  winnerTeamId: text("winner_team_id").references(() => teams.id),
  complete: boolean("complete").default(false).notNull(),
});

export const officialGroupStandings = pgTable("official_group_standings", {
  group: text("group_name").primaryKey(),
  rankings: jsonb("rankings").$type<string[]>().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const tournamentPredictions = pgTable(
  "tournament_predictions",
  {
    userId: text("user_id").references(() => users.id).notNull(),
    groupRankings: jsonb("group_rankings").$type<Record<string, string[]>>().notNull(),
    thirdPlaceGroups: jsonb("third_place_groups").$type<string[]>().notNull(),
    bracket: jsonb("bracket").$type<Record<string, string>>().notNull(),
    submittedAt: timestamp("submitted_at", { withTimezone: true }).defaultNow().notNull(),
    points: integer("points").default(0).notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId] })],
);

export const matchPredictions = pgTable(
  "match_predictions",
  {
    userId: text("user_id").references(() => users.id).notNull(),
    matchId: integer("match_id").references(() => matches.id).notNull(),
    homeScore: integer("home_score").notNull(),
    awayScore: integer("away_score").notNull(),
    points: integer("points").default(0).notNull(),
    submittedAt: timestamp("submitted_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.matchId] }),
    uniqueIndex("match_prediction_user_match_idx").on(table.userId, table.matchId),
  ],
);
