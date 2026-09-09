# ANKUSHMUSIC3 — Supabase setup

1. Create a free Supabase project.
2. Open SQL Editor and run `supabase/schema.sql`.
3. In Authentication, create your admin user with your email/password.
4. Copy your project URL and anon key into `.env.local`:
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
5. Deploy the project to Vercel.
6. Add the same two environment variables in Vercel Project Settings → Environment Variables.

IMPORTANT:
- Never put a Supabase service-role key in browser/client code.
- The schema uses Row Level Security. Review policies before adding more admin roles.
- The current `/admin` page is the visual starter. The secure login + CRUD form should be wired to Supabase next.

Recommended publishing workflow:
Admin login → Add Song → Upload cover → Paste lyrics → Add YouTube/Spotify URLs → Save → Publish.
