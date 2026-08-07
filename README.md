# NovaHub Dashboard

A simple, mobile-first dashboard for managing NovaHub cybercafe: daily
sales, expenses, services, and plain-English reports.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 (all colors driven by CSS variables in `src/app/globals.css`)
- Zustand, persisted to the browser's localStorage — no backend/database needed
- Recharts (via a small shadcn-style chart wrapper) for the weekly trend chart
- Framer Motion for the small entrance/tab animations

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000. Data is stored in your browser's
localStorage under the key `novahub-storage`, so it stays on the device
you use it on (clearing browser data will clear it too).

## What's included

- **Dashboard** (`/`) — today's sales, expenses, net, and a 7-day chart
- **Daily Log** (`/log`) — every entry, browsable by day
- **Services** (`/services`) — add/edit/delete services and their prices
- **Reports** (`/reports`) — plain-English summary ("Chidi came today to
  do Browsing, for ₦300" / "I spent ₦2,000 today for printer ink"),
  filterable by Today / Last 7 days / All time, with a print button

Tap the orange **+** button (bottom-right) from anywhere to log a new
customer sale or expense.

## Customizing colors

Everything runs off the CSS variables at the top of
`src/app/globals.css` (`--accent`, `--income`, `--expense`, etc.) — change
them there and the whole app updates.

## Deploying

This is a static/client-heavy app with no server requirements, so it
deploys cleanly to Vercel (`vercel deploy`) or any static host that
supports Next.js.
