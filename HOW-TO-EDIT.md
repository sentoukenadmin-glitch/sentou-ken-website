# How To Edit Your Website Text (No Coding Needed)

This guide is for editing words and numbers on the site — things like Sensei's bio,
class timings, or fixing a typo. You do NOT need to know how to code.

## The golden rule

Every page is a text file full of words wrapped in things like `<p>...</p>`.
Think of those `< >` bits like the "container" and the text inside is what
actually shows on the website.

**Safe to change:** any plain English words you can read and understand.
**Don't touch:** anything with `<`, `>`, `=`, or that looks like `class="..."` —
just leave those exactly as they are and edit the words around them.

Example — to change Sensei's rank from "7th Dan" to something else, you'd find this line in `about.html`:

```
<p class="eyebrow" style="margin-bottom:8px;">7th Dan &middot; Chief Technical Director</p>
```

You would only change the words **7th Dan · Chief Technical Director** — everything
else in that line stays exactly as it is.

## The easiest way to actually do this: GitHub's built-in editor

Once your site is uploaded to GitHub (see README.md for that one-time setup), you can
edit any page directly in your web browser — no software to install:

1. Go to your repository on github.com and open the file you want to change (e.g. `about.html`).
2. Click the **pencil icon** (✏️) in the top-right of the file view — this opens an editor right in your browser.
3. Find the text you want to change and edit it, same as editing text in a Word document.
4. Scroll down, click the green **"Commit changes"** button.
5. Wait about a minute — your live website updates automatically.

That's the whole process. No downloads, no installing anything, no command line.

## A few specific "find this, change this" examples for your site

| What you want to change | Which file | What to look for |
|---|---|---|
| Sensei's bio | `about.html` | The card with "Sensei P.M.G" — add a sentence inside a new `<p>...</p>` under the rank line |
| Class timings | `classes.html` | Look for "Timings to be confirmed" — replace that text with the real timing |
| Phone number | `data/academy.js` | The line starting `phone1:` |
| Address | `data/academy.js` | The line starting `address:` |
| Achievement numbers (medals, years training, students trained) | `data/academy.js` | Under `stats:` — replace `null` with the real number, e.g. `medalsWon: 23` |

## Adding a Tournament Result (no HTML editing needed)

**Two ways to add tournaments now:**
1. **Recommended: use the Admin Panel.** See `ADMIN-SETUP.md` for one-time
   setup, then just log into `/admin/tournaments.html` and fill in a form —
   no file editing at all, and it appears on the site within seconds.
2. **Manual (no admin panel set up yet):** follow the steps below.

Open `data/academy.js` and find `tournamentResults:` near the top. Each tournament
is one block that looks like this:

```
{
  id: "state-open-2020",
  eyebrowLabel: "State Level — 2020",
  title: "State Level Invitational Open Karate Championship",
  dateVenue: "Organised by Okinawa Goju-Ryu Karate-Do Kyokai India",
  studentsCompeted: null,
  medals: { gold: 5, silver: 12, bronze: 4 },
  notes: "",
  featured: false
}
```

**To add a new tournament:** copy one whole block (from the `{` to the `}` and
the comma after it), paste it as a new item in the list, and change the values.
The total medal count and Gold/Silver/Bronze breakdown appear automatically on
both the Tournaments page and (if `featured: true`) the Achievements page — you
never need to type the total yourself.

**To mark a different tournament as the "Latest Result"** on the Achievements
page, set `featured: true` on that one and `featured: false` on the others (only
one should be `true` at a time).

**For an event with no medals** (like a seminar), set `medals: null` and use
`notes` for a short description instead.

## Adding a Gallery Photo (no HTML editing needed)

**Two ways to add photos now:**
1. **Recommended: use the Admin Panel.** See `ADMIN-SETUP.md`, then log into
   `/admin/galleries.html` — upload multiple photos at once with previews,
   no file editing.
2. **Manual (no admin panel set up yet):** follow the steps below.

Open `data/academy.js` and find `galleryPhotos:`. Each photo is one line:

```
{ src: "images/training/judo-throw.jpg", alt: "Students practicing a Judo throw", category: "training" }
```

**To add a new photo:**
1. Put the actual image file into the matching folder inside `images/`
   (`images/training/`, `images/tournaments/`, or `images/gallery/`).
2. Copy one line above, paste it as a new item, and change `src` to your new
   file's path, `alt` to a short description, and `category` to one of:
   `training`, `tournaments`, `belt-exams`, `camps`.
3. For a tall/narrow image (like a certificate), add `, portrait: true` at the
   end of the line so it displays whole instead of being cropped to a square.

That's it — no HTML, no CSS, just this one list.

## Adding a Google Review (no HTML editing needed)

**Use the Admin Panel** — see `ADMIN-SETUP.md` for one-time setup, then log
into `/admin/reviews.html` and fill in the reviewer's name, star rating, and
the review text (copy-paste it straight from Google). It appears
automatically in the "What Our Students Say" section on the homepage —
no file editing at all. If you never add one, that section stays completely
hidden, just like Announcements.

The "4.8 rated on Google · 31 reviews" line near the top of the homepage is
a separate, manually-typed summary number (it lives in `data/academy.js`
under `googleReviews`) — update it by hand whenever your overall Google
rating changes.

## Instagram On The Homepage

The homepage has a "Follow Us On Instagram" section with a button linking straight to
**@sentouken_martial_arts_academy** — this is deliberate, not a placeholder.

A live, auto-updating grid of Instagram posts was considered (via a service called
SnapWidget), but their "free" plan turned out to actually require a credit card and
auto-bills $8–14/month after a 14-day trial — so it was skipped to avoid any future
surprise charge. The simple link button costs nothing, requires no account, and never
breaks. If you ever want a live photo grid instead, a couple of options to look into
first (compare their actual free tiers carefully, terms change):
- **Elfsight** (elfsight.com) — has a free plan with a small "Powered by Elfsight" badge
- **LightWidget** (lightwidget.com) — similar model, worth checking their current terms


GitHub keeps every previous version of every file. On the file's page, click **"History"**
to see old versions — you can always go back if something breaks. You genuinely cannot
"lose" your website by editing text.

## When you DO need help

Anything involving colors, layout, moving sections around, or adding a brand-new page
is a good time to come back and ask — that part is worth getting help with rather than
guessing.
