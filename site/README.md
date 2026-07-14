# Shikha & Amit — Wedding Site v2

Pastel, animated wedding invitation site: tap-to-open envelope, scratch-to-reveal date and event cards, falling petals/fireflies/diyas, mini-games, a "Getting There" travel guide, and an RSVP flow that sends WhatsApp + logs to a Google Sheet.

## Develop

```sh
npm install
npm run dev       # http://localhost:5173
npm run build     # type-checks (tsc -b) then builds to dist/
npm run preview   # serve the production build locally
npm run lint       # oxlint
```

## Configuration

Copy `.env.example` to `.env` and fill in the WhatsApp number, RSVP deadline, venue maps link, and Google Apps Script URL. The site builds and runs fine with these unset — components show a "not configured yet" state until you do. See [SETUP.md](SETUP.md) for the full walkthrough, including deploying the Apps Script that logs RSVPs to a Google Sheet.

## Stack

React + TypeScript + Vite, no backend beyond a self-deployed Google Apps Script Web App (see `apps-script/Code.gs`). Deploys as a static site (Vercel recommended, root directory `site`).
