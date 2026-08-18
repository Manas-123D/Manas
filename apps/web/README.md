# NexServ — marketing site

The public marketing site (Home + About Us) for NexServ, at `nexserv.com`. This is a separate,
standalone Vite + React + TypeScript app — not the product (that's `apps/mobile`), and it has no
backend dependency, so it can run entirely on its own.

## Stack

- **Vite + React + TypeScript**
- **react-router-dom** for the two routes (`/` and `/about`)
- **framer-motion** for scroll-in reveals
- Plain CSS (no framework) — design tokens live in `src/styles/global.css` and mirror the brand
  palette used by `apps/mobile` (see `apps/mobile/src/theme/colors.ts`) so the site and app read
  as one brand.

## Running locally

```bash
npm install     # from the repo root — installs all workspaces
cd apps/web
npm run dev      # http://localhost:5173
```

## About page team photos

`src/data/team.ts` defines the three founders. Each entry supports an optional `photoUrl` — until
real photos are added, cards fall back to a gradient initials avatar. To add a real photo: drop
the image at `public/team/<file>` and set that member's `photoUrl` to `/team/<file>`.
