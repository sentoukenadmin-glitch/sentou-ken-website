-- ============================================================================
-- ONE-TIME MIGRATION — run this ONCE to add the new "Members" page (a simple
-- photo + name directory, separate from the "Led By Experience" Team section
-- on the About page) to a database set up before this feature existed.
--
-- This creates the `members` table + its security rules. The public
-- members.html page starts out empty — add people from /admin/members.html
-- (name + optional photo), no coding needed.
--
-- HOW TO RUN: Supabase project -> SQL Editor -> paste this whole file -> Run.
--
-- If you're setting up a brand-new project instead, you don't need this file
-- — just run supabase/schema.sql, which already includes this.
-- ============================================================================

create table if not exists members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  photo_url text,
  sort_order int default 0,
  created_at timestamptz default now()
);

alter table members enable row level security;

create policy "Public can view members" on members for select using (true);
create policy "Admin can insert members" on members for insert to authenticated with check (true);
create policy "Admin can update members" on members for update to authenticated using (true);
create policy "Admin can delete members" on members for delete to authenticated using (true);

-- ============================================================================
-- DONE. Open /admin/members.html to start adding members — each one appears
-- automatically on the public members.html page, in the order you arrange
-- them with the Move Up/Down buttons.
-- ============================================================================
