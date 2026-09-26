-- Kharvie site identity CMS
-- IMPORTANT: this project already uses a key/value site_settings table.
-- Safe to run repeatedly in Supabase SQL Editor.

insert into public.site_settings (setting_key, setting_value, updated_at)
values
 ('artist_name','Kharvie',now()),
 ('real_name','Victor Avannah',now()),
 ('profession','Singer and songwriter',now()),
 ('genre','Afrobeats',now()),
 ('origin','Delta State',now()),
 ('booking_email','avannahvictor3@gmail.com',now()),
 ('short_bio','Kharvie is a singer and songwriter from Delta State. His real name is Victor Avannah. Born on April 12, 2003, Kharvie is part of a new generation of artists shaping the evolving sound of Afrobeats.',now()),
 ('hero_intro','Kharvie is building a distinct Afrobeats identity from Delta State, blending melody, rhythm and modern energy into music made to move.',now())
on conflict (setting_key) do update set setting_value=excluded.setting_value, updated_at=now();

alter table public.site_settings enable row level security;
drop policy if exists "Public can read site settings" on public.site_settings;
drop policy if exists "Admins can manage site settings" on public.site_settings;
create policy "Public can read site settings" on public.site_settings for select using (true);
create policy "Admins can manage site settings" on public.site_settings for all to authenticated using (exists (select 1 from public.admin_users au where au.user_id=auth.uid())) with check (exists (select 1 from public.admin_users au where au.user_id=auth.uid()));
