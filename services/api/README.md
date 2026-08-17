# NexServ API

Express + TypeScript + Prisma backend for NexServ, including Myra's context, insight and chat engine.

## Setup

```bash
cp .env.example .env        # fill in DATABASE_URL and ANTHROPIC_API_KEY
npm install
npm run prisma:migrate      # creates tables
npm run seed                # demo user + Bengaluru launch-area data
npm run dev                 # http://localhost:4000
```

Demo login after seeding: `demo@nexserv.app` / `password123`.

## Layout

- `src/myra/` — Myra's intelligence layer.
  - `contextEngine.ts` builds the single `AggregatedContext` snapshot (user, service history, time, weather, traffic).
  - `insightEngine.ts` — deterministic, explainable rules that turn context into proactive insights (the "Myra doesn't just respond" behavior).
  - `tools.ts` / `chatService.ts` — Claude-powered conversational layer with tool use, restricted to a fixed set of booking/order actions that only fire after the user approves in-chat.
- `src/modules/{rides,food,meds,home,care}` — one service module each, holding the actual booking/order/loyalty logic that both the REST routes and Myra's tools call into.
- `src/routes/` — REST endpoints per module, plus `myra.routes.ts` for the insight feed and chat.

## Notes on scaling to a real launch

`contextEngine.ts` currently mocks weather/traffic with deterministic placeholders — swap `fetchWeather`/`fetchTraffic` for a real provider (OpenWeather, Google/Mapbox traffic) per launch city. Matching/dispatch for rides and partner assignment for NexHome are simplified stand-ins for a real-time matching engine and would need a dedicated service (with partner apps, geofencing, live location) before a genuine multi-city rollout.
