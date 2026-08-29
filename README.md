# Habits

A personal habit & chore tracker. Installable as an app on your phone (PWA) — no app store, no account, no server. All data stays in your browser's local storage on your device.

## Develop locally

```bash
npm install
npm run dev
```

## Deploy to GitHub Pages

1. Push this repo to GitHub.
2. In the repo settings, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Push to `main` — the included workflow (`.github/workflows/deploy.yml`) builds and deploys automatically. Your app will be live at `https://<username>.github.io/<repo-name>/`.

## Install on your phone (Android)

1. Open the deployed URL in Chrome.
2. Tap the **⋮** menu → **Add to Home screen** (or Chrome may prompt you automatically).
3. It installs with its own icon and opens full-screen, and works offline after the first load.

## Data

Everything (habits, schedules, completion history) is stored in `localStorage` on the device you're using — nothing is sent anywhere. Use **Settings → Export backup** to save a `.json` copy, and **Import backup** to restore it (e.g. after clearing browser data, or to move to a new device).
