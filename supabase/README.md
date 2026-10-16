# Supabase setup

Project URL: https://khlkqrcejdjdsffcuhva.supabase.co

## 1. Create and seed the database

In Supabase Dashboard > SQL Editor, execute `schema.sql`, followed by `seed.sql`.
The schema enables RLS: visitors can SELECT, while writes require a signed-in user
with server-controlled `app_metadata.role = word_admin`. No admin is created by these scripts.
Only the project owner or a trusted backend may assign this role, never frontend code.
Personal favorites and notes are not implemented in this migration.

The seed imports 100 words, omits identity IDs, and skips existing English words so
rerunning it preserves edits. Subsequent content edits can be made in Table Editor > words.
Deleting a seeded word and running the seed again will reinsert it.
The browser has read access only in the current UI; an admin UI and Auth are future work.
Do not add permissive write policies to make an admin page work.

## 2. Set deployment configuration securely

In GitHub repository Settings > Secrets and variables > Actions, add repository secrets:

- `VITE_SUPABASE_URL`: the project URL above.
- `VITE_SUPABASE_PUBLISHABLE_KEY`: the `sb_publishable_...` key from Supabase's Connect/API Keys settings.

Never use `sb_secret_...`, service_role, database passwords, or connection strings.
Secrets are not committed to source, but the public publishable key necessarily appears
in deployed browser assets. RLS, not key concealment, protects data.

In GitHub Settings > Pages, change Source to **GitHub Actions**.
Then Actions > Deploy Word Garden > Run workflow (main).
The previous website remains live until a successful deployment replaces it.
Later pushes to main deploy automatically. Missing settings fail before deployment.

For local development, copy `.env.example` to `.env.local` and fill the same two public values.
Without both settings the site uses the bundled vocabulary for local development;
partial settings or database failures display errors rather than silently using stale data.
The production workflow requires both settings. Restart Vite after changing local variables.

## 3. Verify permissions before enabling management

Using the public API key, confirm SELECT returns words and INSERT/UPDATE/DELETE are denied.
Then test an ordinary signed-in user is also denied writes; once an admin is deliberately
assigned, test that account separately. This repository contains no real key, admin identity,
or authenticated remote permission-test result. Inspect existing database policies before
applying this migration to a database containing other policies; permissive policies combine.

The data loader pages through all rows in ID order. Category names and counts come from
the database. New words require no rebuild; existing visitors refresh the page to reload.
