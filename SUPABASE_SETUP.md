# Supabase setup

1. Create the Supabase project.
2. Run `supabase/schema.sql` in SQL Editor.
3. Create an email/password user under Authentication → Users.
4. Copy the Project URL and Publishable key into Vercel environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
5. Redeploy the Vercel project after code changes.

Do not expose the Supabase secret/service-role key in the website or GitHub.