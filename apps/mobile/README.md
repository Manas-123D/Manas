# NexServ Mobile

Expo (React Native + TypeScript) app: Myra's chat + insight feed, and the four launch services.

## Setup

```bash
npm install
cp .env.example .env   # if you add one; otherwise export EXPO_PUBLIC_API_URL
EXPO_PUBLIC_API_URL=http://<your-machine-ip>:4000 npm run start
```

Scan the QR code with Expo Go, or press `a`/`i` for an emulator/simulator. On a physical device, `localhost` won't reach your dev machine — use your LAN IP.

Log in with the seeded demo account: `demo@nexserv.app` / `password123`.

## Layout

- `src/theme/` — color tokens (light/dark), spacing, radius and type scale shared by every screen.
- `src/screens/HomeScreen.tsx` — Myra's proactive insight feed plus quick access to the four services.
- `src/screens/MyraChatScreen.tsx` — full conversational interface, backed by `/myra/chat`.
- `src/screens/NexRide|NexFood|NexMeds|NexHome*.tsx` — one booking flow per service.
- `src/context/AuthContext.tsx` + `src/api/client.ts` — token-based auth and a thin fetch wrapper.

## Before this can ship to the Play Store / App Store

This is a real, running app, not a mockup — but a couple of things are still needed before a store submission:

1. **App icon & splash assets** — `app.json` currently has no `icon`/`splash.image` so Expo uses defaults. Add real 1024×1024 icon art and adaptive-icon assets under `assets/`.
2. **EAS Build / signing** — run `npx eas build:configure` and set up Android keystore / iOS provisioning via [EAS](https://docs.expo.dev/build/introduction/).
3. **Store listing** — screenshots, privacy policy URL, data-safety form (Myra's context collection needs to be disclosed), and Play Console / App Store Connect accounts.
4. **Production API URL** — point `EXPO_PUBLIC_API_URL` at your deployed backend (see `services/api`), not localhost.
5. **Maps/geocoding for real pickup & dropoff selection** — `NexRideScreen` currently uses fixed demo coordinates; wire in a maps SDK for real address search before launch.
