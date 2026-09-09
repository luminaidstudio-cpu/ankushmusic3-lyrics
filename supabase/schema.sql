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

drop policy if exists "Published songs are public" on public.songs;
create policy "Published songs are public"
on public.songs for select
using (published = true);

drop policy if exists "Authenticated admins can manage songs" on public.songs;
create policy "Authenticated admins can manage songs"
on public.songs for all
to authenticated
using (true)
with check (true);

create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists songs_updated_at on public.songs;
create trigger songs_updated_at
before update on public.songs
for each row
execute function public.update_updated_at();

-- Cover-image storage bucket.
insert into storage.buckets (id, name, public)
values ('covers', 'covers', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can view cover images" on storage.objects;
create policy "Public can view cover images"
on storage.objects for select
using (bucket_id = 'covers');

drop policy if exists "Authenticated admins can upload cover images" on storage.objects;
create policy "Authenticated admins can upload cover images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'covers');

drop policy if exists "Authenticated admins can update cover images" on storage.objects;
create policy "Authenticated admins can update cover images"
on storage.objects for update
to authenticated
using (bucket_id = 'covers')
with check (bucket_id = 'covers');

drop policy if exists "Authenticated admins can delete cover images" on storage.objects;
create policy "Authenticated admins can delete cover images"
on storage.objects for delete
to authenticated
using (bucket_id = 'covers');
