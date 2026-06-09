# WORLDIE26

Fantasy football for the 2026 FIFA World Cup. Players make one full-tournament prediction and predict each match until 10 minutes before kickoff.

## Stack

- Next.js 16 App Router with React 19
- Bun
- Drizzle ORM with Neon serverless Postgres
- Clerk authentication
- TheSportsDB live fixture feed with a checked-in fallback
- Tailwind CSS and shadcn/ui

## Local development

```bash
bun install
cp .env.example .env.local
bun dev
```

The interface can render the public fixture schedule without environment variables, but accounts and predictions require Neon and Clerk. There is no demo user or placeholder prediction data.

The app reads fixtures and scores server-side from TheSportsDB league `4429`, cached for six hours. The public key `123` is used by default; set `SPORTSDB_API_KEY` when moving to a paid API key. If the provider is unavailable, the verified local fixture data is used automatically.

## Database

Create a Neon database, set `DATABASE_URL`, then run:

```bash
bun run db:generate
bun run db:push
```

The schema stores users, teams, fixtures, one immutable tournament prediction per user, and one editable prediction per user/match.

On the linked Vercel project, Neon and Clerk are provisioned through Marketplace and their environment variables are available in Production, Preview, and Development.

## Rules

- Tournament prediction: one submission before the tournament lock.
- Match prediction: editable until 10 minutes before kickoff.
- Exact score: 5 points total.
- Correct match outcome: 2 points.
- Correct team group position: 2 points.
- Perfect four-team group: 2 bonus points, for 10 total.
- Correct champion: 20 points.
- The leaderboard combines tournament and match points.
