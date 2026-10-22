# Kaipertrophy

An iPhone-friendly, offline-capable workout journal with editable programs, Numbers CSV import, previous-session comparisons, muscle-volume charts, and optional private Supabase sync.

## Run locally

Node.js 22+; no dependencies to install:

```sh
npm run dev
npm test
node build.mjs
```

The development server uses port 3000, overridden with PORT. `dist/` contains only public static assets. Deploy its contents to any HTTPS static host. URLs work below a subdirectory, including GitHub Pages.

## GitHub Pages and your iPhone

1. In this repository open Settings → Pages → Build and deployment → Source → GitHub Actions.
2. Open Actions → Deploy workout app and run the workflow (or push to main). Its successful deployment gives the actual site URL. The expected project address is https://kaischiefer.github.io/kaipertrophy/ unless a custom domain is configured.
3. Open that address in iPhone Safari while online. Choose Share → Add to Home Screen → Add.
4. Open the home-screen app online once. Wait for offline caching to finish; close and reopen in airplane mode to verify it on your phone.
5. In My routines choose Import CSV and select your Numbers export from Files. Choose pounds in Workout before logging. Personal sheet contents are not bundled in the website or committed to Git.

Updates download when online. If the app is open during a new release, close every tab/window of it and reopen to activate the updated offline worker. Offline loading requires a completed first online visit. Safari storage can be cleared or evicted: use cloud sync and JSON backups.

## Numbers import and training

The original Numbers format supports Week, Day, Category/TOD, Exercise, Sets, Reps/Duration, RIR, Weight, Reps (Act), Rest, Alternative Exercise, Notes / Execution. Blank week/day/category cells inherit preceding values. Each week/day/AM-PM block becomes a session. Ranges, timed targets, notes, alternatives, rest, and RIR are retained. Sheet weights and total actual reps remain reference data, never invented workout history. Dates and per-set results must be logged in the app.

Simple imports also accept:

```csv
day,exercise,muscle,sets,reps
Push,Bench press,Chest,4,8
```

Edit schedules in My routines using `day | exercise | muscle | sets | reps or target range`, one row per exercise. Primary muscle assignments on Numbers imports are suggestions: review and correct them. Keep exercise names and load conventions consistent. Previous values come from the most recent completed matching exercise and target. Historical sessions remain independent of routine edits. Time-based movements use seconds or minutes instead of reps. Only completed strength sets contribute to muscle volume; mobility/timed work is excluded. Pounds are normalized to kilograms for volume charts. Secondary muscle contributions and body weight are not estimated.

## Optional Supabase cloud sync

No subscription is inherently required; a personal app may fit the provider's current free tier. Check current pricing, usage limits, inactivity policy, and email delivery limits yourself. Cloud sync is optional; offline/local logging works without it.

1. Create a Supabase project in your own account. Store your database password securely; do not put it in this app or GitHub.
2. Run `supabase.sql` once using the project's SQL Editor. It enables row-level security so authenticated users access only their own row. Re-running policy creation without adjustment will report existing policies.
3. In Authentication → URL Configuration set Site URL to your deployed HTTPS app address. Configure email delivery if needed for confirmations. Keep email verification enabled. No OAuth provider is required.
4. Find the project's HTTPS URL and public publishable/anon key in its API settings. **Never use a service-role or secret key in the app.**
5. Expand Cloud sync & offline status in the app. Save that URL and public key, then create an account. Confirm the email and sign in. Passwords go directly to Supabase over HTTPS; they are not saved by the app. Session tokens stay in this browser for ongoing sign-in, so use a trusted device.
6. If the cloud is empty, local edits are uploaded automatically. You can also choose Upload this device. On another device enter the same project settings and sign in, then explicitly choose Use cloud copy. A local backup is downloaded before replacing device data.
7. Test: log a set online on one device, check sync status, load the cloud copy on a second device, then repeat after an offline workout and reconnection.

The first version syncs the complete training document with optimistic revision checks. Independent edits on two devices trigger a conflict instead of silently overwriting either copy. Export backups, then explicitly choose Use cloud copy or Upload this device. Automatic record-level merging is not implemented. Signing out retains local workout data; use separate browser profiles on shared devices. Do not change project accounts without exporting your local data first.

## Validation limits

Importer tests and static build checks run in CI. Browser smoke checks were run locally using a simulated DOM. Supabase SQL, authentication, row-level isolation, and live multi-device sync require a configured project and are not yet verified against a live backend. Real iPhone installation and airplane-mode behavior must be verified on-device after deployment.
