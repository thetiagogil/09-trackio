# Trackio

Trackio is a private tracker directory for the apps, sites, profiles, docs,
spreadsheets, and custom URLs where a user already tracks things.

V1 deliberately does not track movies, anime episodes, songs, concerts, habits,
goals, streaks, achievements, social feeds, or public progress.

## Local Setup

Create `.env.local` from `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Then run:

```bash
npm run dev
```

## Supabase Requirements

Trackio uses the shared Supabase project from:

```text
C:\Users\talme\Documents\Web Development\Tiago\00-databases
```

The app reads `core.profiles` for shared identity and `trackio.trackers` for
the private tracker directory. Tracker writes go through the `trackio` RPCs.

The Supabase Data API must expose these schemas:

- `core`
- `trackio`

If the dashboard shows `Invalid schema: trackio`, the database is reachable but
the `trackio` schema is not exposed to PostgREST. Add `trackio` to the project's
exposed schemas and reload the PostgREST schema cache.

The database repo's local Supabase config already includes `trackio` in
`projects/shared/supabase/config.toml`.
