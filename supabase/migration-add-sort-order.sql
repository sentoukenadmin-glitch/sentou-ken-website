-- ============================================================================
-- ONE-TIME MIGRATION — run this ONCE to add manual photo/item ordering to
-- Achievements and Announcements (Gallery Photos and Team already have this).
--
-- WHY: the admin panel now has Move Up / Move Down buttons on Galleries,
-- Team, Achievements and Announcements so you can arrange things yourself
-- without touching code. Achievements and Announcements didn't have a
-- "sort_order" column yet — this adds it and fills it in based on the order
-- those items already appear in today, so nothing jumps around the moment
-- you run this.
--
-- HOW TO RUN: Supabase project -> SQL Editor -> paste this whole file -> Run.
-- Safe to run more than once.
--
-- If you're setting up a brand-new project instead, you don't need this file
-- — just run supabase/schema.sql, which already includes this.
-- ============================================================================

alter table achievements add column if not exists sort_order int default 0;
alter table announcements add column if not exists sort_order int default 0;

-- Backfill: give existing rows a sequential order matching how they display
-- today (oldest first), but only for rows still sitting at the untouched
-- default of 0 — safe to re-run without disturbing any ordering you've
-- already set from the admin panel.
with ranked as (
  select id, row_number() over (order by created_at asc) as rn from achievements
)
update achievements set sort_order = ranked.rn
from ranked
where ranked.id = achievements.id and achievements.sort_order = 0;

with ranked as (
  select id, row_number() over (order by created_at asc) as rn from announcements
)
update announcements set sort_order = ranked.rn
from ranked
where ranked.id = announcements.id and announcements.sort_order = 0;

-- ============================================================================
-- DONE. Refresh /admin/achievements.html and /admin/announcements.html —
-- you'll see Move Up / Move Down arrows next to each row.
-- ============================================================================
