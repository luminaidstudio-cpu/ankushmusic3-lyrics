-- ANKUSHMUSIC3 lyrics database
-- Run this in Supabase SQL Editor.

create table if not exists public.songs (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  artist text not null default 'Ankush X',
  lyrics text not null,
  youtube_url text,
  spotify_url text,
  cover_url text,
  release_date date,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.songs enable row level security;

create policy "Published songs are public"
on public.songs for select
using (published = true);

create policy "Authenticated admins can manage songs"
on public.songs for all
to authenticated
using (true)
with check (true);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists songs_updated_at on public.songs;
create trigger songs_updated_at
before update on public.songs
for each row execute function public.set_updated_at();