-- ============================================================================
-- ONE-TIME MIGRATION — run this ONCE if your database was created before
-- 19 Sep 2026 (i.e. you already ran the original schema.sql and it's working,
-- but your site's original tournaments/photos/Google-rating were still
-- hardcoded in data/academy.js instead of living in the database).
--
-- This script:
--   1. Adds the new site_settings table + the is_portrait column
--   2. Copies the 3 original tournament results into the tournaments table
--   3. Copies the 14 original gallery photos into a new "Original Academy
--      Photos" gallery (pointing at the same image files already hosted on
--      GitHub Pages — no images are moved or re-uploaded)
--   4. Seeds the Google rating summary (4.8 / 31 reviews) so the homepage
--      number stays exactly the same as before, but is now admin-editable
--
-- If you're setting up a brand-new project instead, you don't need this file
-- — just run supabase/schema.sql, which already includes everything below.
-- ============================================================================

-- 1a. New table: site_settings
create table if not exists site_settings (
  key text primary key,
  value text,
  updated_at timestamptz default now()
);

alter table site_settings enable row level security;

create policy "Public can view site settings" on site_settings for select using (true);
create policy "Admin can insert site settings" on site_settings for insert to authenticated with check (true);
create policy "Admin can update site settings" on site_settings for update to authenticated using (true);
create policy "Admin can delete site settings" on site_settings for delete to authenticated using (true);

-- 1b. New column on gallery_photos
alter table gallery_photos add column if not exists is_portrait boolean default false;

-- 2. Migrate the 3 original tournament results (created_at set to match each
--    event's actual date, so they still sort newest-first exactly as before)
insert into tournaments (title, eyebrow_label, date_venue, students_competed, medals_gold, medals_silver, medals_bronze, notes, featured, created_at) values
('29th All India Shitoryu Karate-Do Championship', 'National — 2026', '24–26 July 2026 · Chamundi Vihaar Stadium, Mysuru', 18, 7, 7, 9, '', true, '2026-07-26T00:00:00Z'),
('State Level Invitational Open Karate Championship', 'State Level — 2020', 'Organised by Okinawa Goju-Ryu Karate-Do Kyokai India', null, 5, 12, 4, '', false, '2020-01-01T00:00:00Z'),
('International Jiu Jitsu Seminar & National WFJ Tournament', 'International Seminar — 2015', '27–29 November 2015 · Vashi, Navi Mumbai', null, null, null, null, 'Academy representatives trained and competed alongside international instructors.', false, '2015-11-29T00:00:00Z');

-- 3. Migrate the 14 original gallery photos into one "Original Academy
--    Photos" gallery (edit/delete individual photos or the whole album from
--    /admin/galleries.html — the image files themselves stay on GitHub Pages)
with new_gallery as (
  insert into galleries (title, description)
  values ('Original Academy Photos', 'Photos from the original website launch')
  returning id
)
insert into gallery_photos (gallery_id, photo_url, caption, category, is_portrait, sort_order)
select new_gallery.id, v.photo_url, v.caption, v.category, v.is_portrait, v.sort_order
from new_gallery, (values
  ('https://sentoukenadmin-glitch.github.io/sentou-ken-website/images/training/sensei-technique.jpg', 'Sensei P. M. Gnanasekar demonstrating a technique', 'training', false, 1),
  ('https://sentoukenadmin-glitch.github.io/sentou-ken-website/images/training/kenjutsu-demo.jpg', 'Kenjutsu sword technique demonstration', 'training', false, 2),
  ('https://sentoukenadmin-glitch.github.io/sentou-ken-website/images/training/judo-throw.jpg', 'Students practicing a Judo throw', 'training', false, 3),
  ('https://sentoukenadmin-glitch.github.io/sentou-ken-website/images/training/kicks-row-girls.jpg', 'Students practicing side kicks in formation', 'training', false, 4),
  ('https://sentoukenadmin-glitch.github.io/sentou-ken-website/images/training/kicks-row-boys.jpg', 'Students practicing side kicks in formation', 'training', false, 5),
  ('https://sentoukenadmin-glitch.github.io/sentou-ken-website/images/training/training-demo-01.jpg', 'Student demonstrating a self-defence throw in front of the class', 'training', false, 6),
  ('https://sentoukenadmin-glitch.github.io/sentou-ken-website/images/tournaments/aiskc-2026-group-1.jpg', 'Students and officials at the 29th All India Shitoryu Karate-Do Championship 2026', 'tournaments', false, 7),
  ('https://sentoukenadmin-glitch.github.io/sentou-ken-website/images/tournaments/aiskc-2026-group-2.jpg', 'Medal-winning students at the 29th All India Shitoryu Karate-Do Championship 2026', 'tournaments', false, 8),
  ('https://sentoukenadmin-glitch.github.io/sentou-ken-website/images/tournaments/girls-trophies.jpg', 'Students with tournament trophies', 'tournaments', false, 9),
  ('https://sentoukenadmin-glitch.github.io/sentou-ken-website/images/tournaments/boys-trophies.jpg', 'Students with tournament trophies', 'tournaments', false, 10),
  ('https://sentoukenadmin-glitch.github.io/sentou-ken-website/images/tournaments/state-open-2020-group.jpg', 'Students at the State Level Invitational Open Karate Championship 2020', 'tournaments', false, 11),
  ('https://sentoukenadmin-glitch.github.io/sentou-ken-website/images/tournaments/okinawa-gojuryu-state-2020.jpg', 'Students at a state-level Karate championship', 'tournaments', false, 12),
  ('https://sentoukenadmin-glitch.github.io/sentou-ken-website/images/gallery/certificates-collage.jpg', 'Students receiving grading certificates', 'belt-exams', true, 13),
  ('https://sentoukenadmin-glitch.github.io/sentou-ken-website/images/gallery/jiujitsu-seminar-2015.jpg', 'International Jiu Jitsu Seminar and National WFJ Tournament, 2015', 'camps', false, 14)
) as v(photo_url, caption, category, is_portrait, sort_order);

-- 4. Seed the Google rating summary with the same numbers already shown on
--    the site, so nothing visually changes until you next update them from
--    /admin/settings.html
insert into site_settings (key, value) values
  ('google_rating', '4.8'),
  ('google_review_count', '31')
on conflict (key) do update set value = excluded.value;

-- ============================================================================
-- DONE. Refresh the live site — the homepage rating line, the Gallery page
-- photos, and the Tournaments/Achievements pages will look identical to
-- before, but every item above is now editable/removable from the admin
-- panel instead of being fixed in code.
-- ============================================================================
