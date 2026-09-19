-- ============================================================================
-- SENTOU-KEN ACADEMY CMS — SUPABASE DATABASE SETUP
-- ============================================================================
-- HOW TO USE THIS FILE:
-- 1. Create a free account at https://supabase.com and a new project.
-- 2. In your Supabase project, go to the "SQL Editor" tab.
-- 3. Paste this ENTIRE file in and click "Run".
-- 4. That's it — every table, security rule, and storage bucket needed for
--    the admin panel is created in one go.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. GALLERIES (photo albums, e.g. "29th AISKC 2026")
-- ---------------------------------------------------------------------------
create table if not exists galleries (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  event_date date,
  location text,
  description text,
  cover_photo_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- 2. GALLERY PHOTOS (individual photos belonging to a gallery)
-- ---------------------------------------------------------------------------
create table if not exists gallery_photos (
  id uuid primary key default gen_random_uuid(),
  gallery_id uuid references galleries(id) on delete cascade,
  photo_url text not null,
  caption text,
  category text default 'tournaments', -- training | tournaments | belt-exams | camps
  is_portrait boolean default false, -- true = tall/narrow image, shown uncropped
  sort_order int default 0,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- 3. TOURNAMENTS
-- ---------------------------------------------------------------------------
create table if not exists tournaments (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  eyebrow_label text,           -- e.g. "National — 2026"
  date_venue text,               -- e.g. "24–26 July 2026 · Chamundi Vihaar Stadium, Mysuru"
  students_competed int,
  medals_gold int default 0,
  medals_silver int default 0,
  medals_bronze int default 0,
  notes text,
  featured boolean default false, -- shown as "Latest Result" on Achievements page
  gallery_id uuid references galleries(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- 4. ANNOUNCEMENTS
-- ---------------------------------------------------------------------------
create table if not exists announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  announcement_date date default current_date,
  image_url text,
  is_important boolean default false,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- 5. ACHIEVEMENTS (standalone recognitions not tied to a specific tournament,
--    e.g. "Best Fighter" title, an award, a certification milestone)
-- ---------------------------------------------------------------------------
create table if not exists achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  year text,
  result text,
  medal_count int,
  student_names text,   -- optional, keep minimal — avoid publishing sensitive info
  image_url text,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- 6. REVIEWS (Google-style testimonials shown on the homepage)
-- ---------------------------------------------------------------------------
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  reviewer_name text not null,
  rating int not null default 5,      -- 1 to 5
  review_text text,
  review_date date default current_date,
  source text default 'Google',       -- where the review actually came from
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- 7. SITE SETTINGS (single editable values with no natural table of their
--    own — currently just the homepage's "X rated on Google · Y reviews"
--    summary line, edited from /admin/settings.html)
-- ---------------------------------------------------------------------------
create table if not exists site_settings (
  key text primary key,
  value text,
  updated_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- 8. TEAM MEMBERS (photos + names shown in the "Led By Experience" section
--    of the About page, managed from /admin/team.html)
-- ---------------------------------------------------------------------------
create table if not exists team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  photo_url text,
  sort_order int default 99,
  created_at timestamptz default now()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- Rule for every table: ANYONE can read (public website needs this).
-- ONLY a logged-in authenticated user can create/edit/delete (the admin).
-- This project uses a single admin account — every authenticated user is
-- treated as an admin. If you ever add more logins, tighten this further.
-- ============================================================================

alter table galleries enable row level security;
alter table gallery_photos enable row level security;
alter table tournaments enable row level security;
alter table announcements enable row level security;
alter table achievements enable row level security;
alter table reviews enable row level security;
alter table site_settings enable row level security;
alter table team_members enable row level security;

-- Public read access (used by the public website, no login needed)
create policy "Public can view galleries" on galleries for select using (true);
create policy "Public can view gallery photos" on gallery_photos for select using (true);
create policy "Public can view tournaments" on tournaments for select using (true);
create policy "Public can view announcements" on announcements for select using (true);
create policy "Public can view achievements" on achievements for select using (true);
create policy "Public can view reviews" on reviews for select using (true);
create policy "Public can view site settings" on site_settings for select using (true);
create policy "Public can view team members" on team_members for select using (true);

-- Authenticated (admin) write access
create policy "Admin can insert galleries" on galleries for insert to authenticated with check (true);
create policy "Admin can update galleries" on galleries for update to authenticated using (true);
create policy "Admin can delete galleries" on galleries for delete to authenticated using (true);

create policy "Admin can insert gallery photos" on gallery_photos for insert to authenticated with check (true);
create policy "Admin can update gallery photos" on gallery_photos for update to authenticated using (true);
create policy "Admin can delete gallery photos" on gallery_photos for delete to authenticated using (true);

create policy "Admin can insert tournaments" on tournaments for insert to authenticated with check (true);
create policy "Admin can update tournaments" on tournaments for update to authenticated using (true);
create policy "Admin can delete tournaments" on tournaments for delete to authenticated using (true);

create policy "Admin can insert announcements" on announcements for insert to authenticated with check (true);
create policy "Admin can update announcements" on announcements for update to authenticated using (true);
create policy "Admin can delete announcements" on announcements for delete to authenticated using (true);

create policy "Admin can insert achievements" on achievements for insert to authenticated with check (true);
create policy "Admin can update achievements" on achievements for update to authenticated using (true);
create policy "Admin can delete achievements" on achievements for delete to authenticated using (true);

create policy "Admin can insert reviews" on reviews for insert to authenticated with check (true);
create policy "Admin can update reviews" on reviews for update to authenticated using (true);
create policy "Admin can delete reviews" on reviews for delete to authenticated using (true);

create policy "Admin can insert site settings" on site_settings for insert to authenticated with check (true);
create policy "Admin can update site settings" on site_settings for update to authenticated using (true);
create policy "Admin can delete site settings" on site_settings for delete to authenticated using (true);

create policy "Admin can insert team members" on team_members for insert to authenticated with check (true);
create policy "Admin can update team members" on team_members for update to authenticated using (true);
create policy "Admin can delete team members" on team_members for delete to authenticated using (true);

-- Sensible defaults for a brand-new project (safe to leave — edit them from
-- /admin/settings.html once your site is live).
insert into site_settings (key, value) values
  ('google_rating', '5.0'),
  ('google_review_count', '0')
on conflict (key) do nothing;

-- ============================================================================
-- STORAGE (photo uploads)
-- ============================================================================
-- Run this section too — creates a public storage bucket called "academy-photos".
insert into storage.buckets (id, name, public)
values ('academy-photos', 'academy-photos', true)
on conflict (id) do nothing;

create policy "Public can view photos" on storage.objects
  for select using (bucket_id = 'academy-photos');

create policy "Admin can upload photos" on storage.objects
  for insert to authenticated with check (bucket_id = 'academy-photos');

create policy "Admin can delete photos" on storage.objects
  for delete to authenticated using (bucket_id = 'academy-photos');

-- ============================================================================
-- DONE. Next step: create your admin login user.
-- In Supabase: Authentication -> Users -> "Add User" -> enter an email and
-- password for the academy administrator. Use that to log into /admin/.
-- ============================================================================
