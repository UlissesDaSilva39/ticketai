# Archived migrations (do not apply)

These SQL files were written before the project used the Supabase CLI.
Some were run by hand in the SQL Editor, some never ran, and the live
database has no migration history for them. They are kept for reference only.

New database changes go in `supabase/migrations/` as
`<YYYYMMDDHHMMSS>_name.sql` and are applied with `npx supabase db push --remote`.
