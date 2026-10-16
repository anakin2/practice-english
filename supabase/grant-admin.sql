-- Run ONLY in Supabase SQL Editor as project owner.
-- First create your own user in Authentication > Users > Add user.
-- Replace the email below with YOUR existing admin user's email.
-- This script preserves all other app_metadata fields.
do $$
declare
  admin_id uuid;
begin
  select id into admin_id from auth.users
    where lower(email) = lower('REPLACE_WITH_YOUR_EMAIL');
  if admin_id is null then
    raise exception 'Account not found. Create the user first and replace the email placeholder.';
  end if;
  update auth.users
    set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
      || jsonb_build_object('role', 'word_admin')
    where id = admin_id;
end $$;
-- Sign out and sign in again after any role change.
-- To revoke access, remove the role from raw_app_meta_data. Already issued JWTs
-- retain claims until expiry; revoke sessions and account access as appropriate.
