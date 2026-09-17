-- Kharvie site identity CMS
-- Safe to run more than once in Supabase SQL Editor.

create table if not exists public.site_settings (
  id integer primary key default 1,
  artist_name text,
  real_name text,
  profession text,
  genre text,
  origin text,
  booking_email text,
  short_bio text,
  hero_intro text,
  updated_at timestamptz default now()
);

insert into public.site_settings
  (id, artist_name, real_name, profession, genre, origin, booking_email, short_bio, hero_intro)
values
  (1,
   'Kharvie',
   'Victor Avannah',
   'Nigerian singer and songwriter',
   'Afrobeats',
   'Delta State, Nigeria',
   'avannahvictor3@gmail.com',
   'Victor Avannah, professionally known as Kharvie, is a Nigerian singer and songwriter from Delta State, Nigeria. Born on April 12, 2003, he is part of a new generation of Nigerian artists shaping the evolving sound of Afrobeats.',
   'Kharvie is building a distinct Afrobeats identity from Delta State, blending melody, rhythm and modern Nigerian energy into music made to move.')
on conflict (id) do update set
  artist_name = excluded.artist_name,
  real_name = excluded.real_name,
  profession = excluded.profession,
  genre = excluded.genre,
  origin = excluded.origin,
  booking_email = excluded.booking_email,
  short_bio = excluded.short_bio,
  hero_intro = excluded.hero_intro,
  updated_at = now();

alter table public.site_settings enable row level security;

drop policy if exists "Public can read site settings" on public.site_settings;
drop policy if exists "Admins can manage site settings" on public.site_settings;

create policy "Public can read site settings"
on public.site_settings
for select
using (true);

create policy "Admins can manage site settings"
on public.site_settings
for all
to authenticated
using (exists (
  select 1 from public.admin_users au
  where au.user_id = auth.uid()
))
with check (exists (
  select 1 from public.admin_users au
  where au.user_id = auth.uid()
));
