-- ============================================================================
-- ONE-TIME MIGRATION — run this ONCE to add the new "Team" feature (the
-- "Led By Experience" section on the About page) to a database that was set
-- up before 19 Sep 2026's Team update.
--
-- This script:
--   1. Creates the team_members table + its security rules
--   2. Copies the 5 team members currently shown on the About page into it,
--      in the same order, with the same photos (or "photo to be added" left
--      blank, exactly as today)
--
-- If you're setting up a brand-new project instead, you don't need this file
-- — just run supabase/schema.sql, which already includes everything below.
-- ============================================================================

create table if not exists team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  photo_url text,
  sort_order int default 99,
  created_at timestamptz default now()
);

alter table team_members enable row level security;

create policy "Public can view team members" on team_members for select using (true);
create policy "Admin can insert team members" on team_members for insert to authenticated with check (true);
create policy "Admin can update team members" on team_members for update to authenticated using (true);
create policy "Admin can delete team members" on team_members for delete to authenticated using (true);

insert into team_members (name, role, photo_url, sort_order) values
('SENSEI P.M.G.', 'Founder, Chief Instructor & Technical Director', 'https://sentoukenadmin-glitch.github.io/sentou-ken-website/images/students/sensei-pmg.jpg', 1),
('Grandmaster B. M. Narasimhan', 'Founder, Self Defence School of Indian Karate', 'https://sentoukenadmin-glitch.github.io/sentou-ken-website/images/students/grandmaster-narasimhan.jpg', 2),
('Sempai Madhavan', 'Admin', null, 3),
('Sempai Shashank', 'Instructor', null, 4),
('Sempai Sakshin', 'Instructor', null, 5);

-- ============================================================================
-- DONE. Refresh the live site — the About page's "Led By Experience" section
-- will look identical to before, but every person there is now editable
-- (name, role, photo) or removable from /admin/team.html, and you can add
-- new instructors the same way — no coding, no waiting on a developer.
-- ============================================================================
