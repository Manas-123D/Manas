# NexServ

**An AI-powered everyday ecosystem, orchestrated by Myra.**

NexServ connects the essential services a person needs — mobility, food, medicines and household
services — through one intelligent companion. Instead of `User → App → Search → Select → Book`,
the flow is `User → Myra → Context → Insight → Decision → Action`: Myra understands the situation
and helps the user decide, then acts only once they approve.

Launch scope (v1): **NexRide** (mobility), **NexFood** (food delivery), **NexMeds** (medicine
logistics), **NexHome** (household services) — plus **Myra**, and the beginnings of **NexCare**
(the partner-facing loyalty/growth system for drivers, delivery partners and technicians).

This repo is a real, working full-stack implementation of that vision — a monorepo with a
production-shaped backend and a real Expo mobile app — sized to run end-to-end today and to be
extended toward a genuine multi-city launch.

## Architecture

```
nexserv/
├── packages/shared/    TypeScript domain types shared by API and app
├── services/api/       Express + Prisma backend, including Myra's intelligence layer
└── apps/mobile/        Expo (React Native + TypeScript) app
```

### Myra, concretely

Myra is implemented as three cooperating pieces in `services/api/src/myra/`:

1. **`contextEngine.ts`** — builds one `AggregatedContext` snapshot per request: user profile,
   preferences, recent service history across all four modules, time-of-day, and
   weather/traffic (currently mocked with deterministic placeholders — swap in a real provider
   per launch city).
2. **`insightEngine.ts`** — a small set of deterministic, explainable rules that turn context into
   proactive insights ("Rain is expected during your commute — leave 15 minutes earlier",
   "Your AC was serviced 6 months ago — schedule maintenance?"). This is what makes Myra *act
   before being asked* rather than just answering questions, and every insight traces back to a
   concrete signal, which matters for user trust.
3. **`chatService.ts` + `tools.ts`** — the open-ended conversational layer, powered by Claude via
   the Anthropic SDK with tool use. Myra can freely call read-only tools (quotes, restaurant
   listings, medicine catalog) but can only call a *mutating* tool (`book_ride`,
   `place_food_order`, `refill_last_medicine_order`, `book_home_service`) after the user has
   explicitly approved that specific action in the conversation. NexMeds is deliberately scoped to
   logistics and reminders — Myra is instructed never to give medical/dosage advice.

### Data model

One Prisma schema (`services/api/prisma/schema.prisma`) covers users/preferences, Myra's
context/insight/chat tables, the four service modules, and NexCare partner + incentive tables —
so Myra can join across a user's whole history when reasoning, and so partner growth data lives
next to the services partners actually work on.

## Running it locally

```bash
npm install                          # installs all workspaces

# 1. Backend
cd services/api
cp .env.example .env                 # set DATABASE_URL + ANTHROPIC_API_KEY
npm run prisma:migrate
npm run seed                         # demo user + Hyderabad launch-area data
npm run dev                          # http://localhost:4000

# 2. Mobile app (separate terminal)
cd apps/mobile
npm install
EXPO_PUBLIC_API_URL=http://<your-ip>:4000 npm run start
```

Demo login: `demo@nexserv.app` / `password123`.

See `services/api/README.md` and `apps/mobile/README.md` for module-level details.

## What's real here vs. what a global launch still needs

Everything in this repo runs — auth, all four booking flows, Myra's proactive insight feed, and a
full tool-using chat assistant backed by a real Claude model. What a genuine "one city, then
global" Play Store / App Store launch adds on top:

- **Real environmental data** — swap the mocked weather/traffic in `contextEngine.ts` for a live
  provider (OpenWeather, Google/Mapbox Traffic), city by city.
- **Real-time matching & partner apps** — ride/technician assignment here is a simplified
  stand-in; a live launch needs dispatch, live location, and a companion NexCare partner app.
- **Payments** — no payment gateway is wired in; add Razorpay/Stripe (or local equivalents) before
  real transactions.
- **App store readiness** — icon/splash art, EAS build & signing, privacy policy and data-safety
  disclosures (Myra's context collection needs explicit, granular consent), and production
  infrastructure for the API (hosted Postgres, deployed server, monitoring).
- **NexCare depth** — the partner model supports loyalty tiers, points and incentives today;
  wellbeing programs, training content and insurance partnerships are product/ops work beyond
  what a codebase can pre-build.

None of that changes the architecture — it's filling in real providers and operational pieces
around the core that's already built and running.
