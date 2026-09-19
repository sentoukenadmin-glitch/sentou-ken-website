# Admin Panel Setup Guide

This guide gets your admin panel (`/admin`) fully working. It uses **Supabase**
— one free account gives you the database, login system, and photo storage
all together. No coding required for any of this.

## Why Supabase (and not Firebase or a separate image host)

| Requirement | Why Supabase fits |
|---|---|
| GitHub Pages compatibility | Supabase is called directly from browser JavaScript — no server needed, works perfectly with a static site |
| Database + Auth + Storage | All three in one free account, instead of stitching together 2-3 separate services |
| No build step | Works via a single `<script>` tag — your site stays plain HTML/CSS/JS, nothing new to learn |
| Free tier | 500MB database, 1GB file storage, 50,000 monthly active users — enormous headroom for a single academy site |
| Security | Row Level Security (built into Postgres) — public visitors can only ever read, only a logged-in admin can write |

**Free tier limitation to know (already handled for you):** Supabase pauses
free projects after 7 days of *total* inactivity (no visits at all). Two
things make sure your visitors never actually see an empty site because of
this:
1. A scheduled task (`.github/workflows/keep-supabase-awake.yml`) quietly
   pings your database every 3 days, so it never sits idle long enough to
   pause in the first place — you don't need to do anything for this to work.
2. As a backup, `js/public-content.js` remembers the last successfully
   loaded content in each visitor's browser, so even a rare failed request
   shows the last-known version instead of a blank section.
The only case this can't cover is a brand-new visitor's very first-ever load
of the site landing at the exact moment of a real outage — vanishingly
unlikely, and even then the site heals itself as soon as the connection
returns.

## Step 1 — Create your Supabase project

1. Go to **supabase.com** → Sign up (free, no card required) → "New Project"
2. Choose any name (e.g. "sentou-ken-academy") and a database password —
   **save that password somewhere safe**, you may need it later
3. Pick the region closest to Chennai (e.g. Singapore) for best speed
4. Wait ~2 minutes while Supabase sets up your project

## Step 2 — Run the database setup

1. In your new project, click **SQL Editor** in the left sidebar
2. Open the file `supabase/schema.sql` from this project (in a text editor,
   or GitHub's editor), copy **all** of it
3. Paste into the Supabase SQL Editor and click **Run**
4. You should see "Success. No rows returned" — this created every table, all
   the security rules, and your photo storage bucket in one step

**Already set this up before and just need the new Team feature?** Run
`supabase/migration-team.sql` instead — it only adds what's new (the Team
table, seeded with the 5 people already shown on the About page) without
touching anything else.

## Step 3 — Get your API keys

1. In Supabase: **Settings** (gear icon) → **API**
2. Copy the **Project URL** (looks like `https://xxxxx.supabase.co`)
3. Copy the **anon / public** key (a long string) — **do NOT use the
   "service_role" key anywhere in this project, that one must stay private**
4. Open `js/supabase-config.js` in this project and paste both values in:
   ```js
   const SUPABASE_URL = "https://xxxxx.supabase.co";
   const SUPABASE_ANON_KEY = "eyJhbGciOi...";
   ```
5. Save the file. That's it — both the public website and the admin panel
   now know how to talk to your Supabase project.

**Is it safe to have this key visible in the code?** Yes — the "anon" key is
specifically designed to be public. It can only do what your Row Level
Security rules (already set up in step 2) allow: anyone can *read* content,
but only a *logged-in* user can create, edit, or delete anything.

## Step 4 — Create your admin login

1. In Supabase: **Authentication** → **Users** → **Add User**
2. Enter the email and password the academy administrator should log in with
3. Click **Create User**

That email/password combination is now how you log into `/admin/login.html`.

## Step 5 — Deploy and log in

1. Push this whole project (including your filled-in `supabase-config.js`)
   to GitHub as usual (see the main README.md for GitHub Pages steps)
2. Visit `https://yoursite.com/admin/` (or `/admin/login.html`)
3. Log in with the email/password from Step 4

## Using the admin panel day-to-day

- **Dashboard**: quick overview and shortcuts to add new content
- **Galleries**: create an album (e.g. a tournament name + date), upload
  multiple photos at once with a live preview, remove any before or after
  saving. Every photo you upload here appears automatically in the public
  Gallery page.
- **Tournaments**: add a tournament with its Gold/Silver/Bronze medal
  counts — it appears automatically on the public Tournaments page, and (if
  you tick "Show as Latest Result") on the Achievements page too.
- **Announcements**: short updates that appear on the homepage automatically.
  If you never add one, that part of the homepage stays completely hidden —
  it doesn't show an empty box.
- **Achievements**: for one-off recognitions not tied to a specific
  tournament (an award, a title, etc). These appear automatically in a new
  "Awards & Titles" section on the Achievements page.
- **Reviews**: add reviews (copy-paste from Google, or anywhere else) with a
  name, star rating, and the review text. The latest few appear automatically
  in a "What Our Students Say" section on the homepage.
- **Settings**: edit the "★★★★★ 4.8 rated on Google · 31 reviews" summary line
  shown near the top of the homepage — just two numbers, updated instantly.
- **Team**: add, edit, remove, or reorder the photos and names shown in the
  "Led By Experience" section of the About page — a name and role, plus an
  optional photo (shows "Photo to be added" until you upload one). Add a new
  instructor here any time and they appear on the site automatically, no
  coding needed.

All of your original launch content (the first tournaments, gallery photos,
and the Google rating number) has also been moved into this same database, so
it's just as editable/removable as anything you add going forward — nothing
about your site is still "stuck in code" waiting on a developer.

Every section works the same way: fill in the form, click Save, it's live on
the public website within seconds — no code, no GitHub, no waiting for a
deploy.

## Backup & data safety

- **Photos**: Supabase Storage keeps everything until you delete it — deleting
  a gallery in the admin panel also removes its photos permanently, so the
  confirmation prompts before deleting are there for a reason.
- **Database backup**: In Supabase, **Database** → **Backups** — free-tier
  projects get automatic daily backups kept for 7 days. For extra safety,
  you can manually export your data anytime: **Table Editor** → select a
  table → **Export as CSV**.
- **Accidental deletion**: there is no "undo" — the confirmation dialogs
  before every delete are the safety net, so read them before clicking OK.

## Troubleshooting

| Problem | Likely cause |
|---|---|
| "Supabase not configured yet" message | `js/supabase-config.js` still has the placeholder text — go back to Step 3 |
| Login says invalid credentials | Double-check the email/password created in Step 4, or reset it in Supabase → Authentication → Users |
| Photos won't upload | Check the file is JPG/PNG/WEBP and under 8MB; also confirm Step 2's SQL ran successfully (creates the storage bucket) |
| New content isn't showing on the public site | Hard-refresh the public page (Ctrl+Shift+R) — content is fetched fresh on each page load |
| Everything feels slow on first visit after a while | Normal — see the free-tier note above about projects pausing after 7 days of no visits |

## What costs money, and when

Everything above is on Supabase's **free tier**, which is genuinely
sufficient for a single academy website for a very long time. You would only
need to pay if you eventually exceed 500MB of database storage or 1GB of
photos (thousands of tournament photos worth), at which point Supabase's
paid tier starts around $25/month — not something to worry about now.
