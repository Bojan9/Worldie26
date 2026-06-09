CREATE TABLE "award_predictions" (
	"user_id" text PRIMARY KEY NOT NULL,
	"golden_boot_player_id" text NOT NULL,
	"golden_glove_player_id" text NOT NULL,
	"golden_ball_player_id" text NOT NULL,
	"young_player_id" text NOT NULL,
	"points" integer DEFAULT 0 NOT NULL,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "official_awards" (
	"id" integer PRIMARY KEY NOT NULL,
	"golden_boot_player_id" text,
	"golden_glove_player_id" text,
	"golden_ball_player_id" text,
	"young_player_id" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "players" (
	"id" text PRIMARY KEY NOT NULL,
	"team_id" text NOT NULL,
	"name" text NOT NULL,
	"position" text NOT NULL,
	"date_of_birth" timestamp with time zone,
	"jersey_number" integer,
	"image_url" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "award_predictions" ADD CONSTRAINT "award_predictions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "award_predictions" ADD CONSTRAINT "award_predictions_golden_boot_player_id_players_id_fk" FOREIGN KEY ("golden_boot_player_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "award_predictions" ADD CONSTRAINT "award_predictions_golden_glove_player_id_players_id_fk" FOREIGN KEY ("golden_glove_player_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "award_predictions" ADD CONSTRAINT "award_predictions_golden_ball_player_id_players_id_fk" FOREIGN KEY ("golden_ball_player_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "award_predictions" ADD CONSTRAINT "award_predictions_young_player_id_players_id_fk" FOREIGN KEY ("young_player_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "official_awards" ADD CONSTRAINT "official_awards_golden_boot_player_id_players_id_fk" FOREIGN KEY ("golden_boot_player_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "official_awards" ADD CONSTRAINT "official_awards_golden_glove_player_id_players_id_fk" FOREIGN KEY ("golden_glove_player_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "official_awards" ADD CONSTRAINT "official_awards_golden_ball_player_id_players_id_fk" FOREIGN KEY ("golden_ball_player_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "official_awards" ADD CONSTRAINT "official_awards_young_player_id_players_id_fk" FOREIGN KEY ("young_player_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "players" ADD CONSTRAINT "players_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "players_team_name_idx" ON "players" USING btree ("team_id","name");