# ANKUSHMUSIC3 Lyrics

Next.js + Supabase lyrics website.

## Environment variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

The publishable key is intended for browser use. Never put a Supabase secret/service-role key in the client app.

## Admin

Open `/admin` and sign in with the Supabase Auth email/password user created for the site.

The admin can add, edit, publish/unpublish, and delete songs. Public pages show only published songs.