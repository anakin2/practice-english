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

## Admin editing page

Open `https://anakin2.github.io/practice-english/#/admin/words`.

1. In Supabase Dashboard > Authentication > Users > Add user > Create new user,
   create your own email/password account. Enable auto-confirm if offered, or
   complete email verification. Do not send your password to anyone.
2. Open `grant-admin.sql`, replace `REPLACE_WITH_YOUR_EMAIL` with that account's
   email, and execute the complete script in SQL Editor as project owner.
3. Sign in on the admin page. If already signed in, sign out and back in to get
   a fresh role claim. Only `app_metadata.role = word_admin` permits writes.

The admin page supports adding, editing, searching, and deleting vocabulary.
Deletion requires confirmation. RLS rejects writes even if browser UI is bypassed.
Sessions are held in memory, not localStorage; page reload requires signing in again.
There is no public sign-up or password recovery UI; account recovery is managed
through Supabase. Keep default Auth rate limits enabled. Enable MFA for your
Supabase project-owner account. This page is not a user-role management interface.
Real administrator credentials and production write tests are not included.

Revoking a role does not invalidate already-issued JWT claims immediately. For
urgent revocation, remove the role, revoke the user's sessions and handle any
remaining access-token lifetime according to Supabase Auth settings.
