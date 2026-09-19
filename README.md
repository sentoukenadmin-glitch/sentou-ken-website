# Sentou-Ken Martial Arts Academy — Website

A clean, modular, multi-page static website (HTML/CSS/JS, no build tools required).

## How to preview it locally

You don't need to install anything complicated. Easiest options:

1. **VS Code + Live Server extension** (recommended): open this folder in VS Code, install the "Live Server" extension, right-click `index.html` → "Open with Live Server."
2. **Just double-click `index.html`** — it will open in your browser directly (some things like the WhatsApp/YouTube links will still work fine).

## Project structure

```
karate-academy/
├── index.html          Home
├── about.html
├── classes.html
├── achievements.html
├── tournaments.html
├── gallery.html
├── contact.html
├── css/
│   ├── style.css        Design tokens (colors, fonts, spacing) + base layout
│   ├── responsive.css    Mobile/tablet breakpoint overrides
│   └── components.css    Nav, buttons, cards, footer, form, etc.
├── js/
│   ├── main.js           Mobile nav toggle, footer year, pulls data from academy.js
│   ├── gallery.js        Gallery filter buttons
│   └── contact.js        Enquiry form handling
├── data/
│   └── academy.js        ← EDIT THIS FIRST. One file with all academy info.
├── images/                Add your real photos here (logo, students, tournaments, training, gallery)
├── favicon/                Site icon
├── robots.txt
└── sitemap.xml
```

## Where to make edits

- **Contact info, phone numbers, social links:** edit `data/academy.js` — several places on the site pull from it automatically via `data-academy="..."` attributes.
- **Page text:** edit directly inside each `.html` file — content is plain HTML, no templating engine.
- **Colors / fonts:** edit the `:root` variables at the top of `css/style.css`.
- **Photos:** replace the placeholder gray boxes in `gallery.html`, `tournaments.html`, etc. with real `<img>` tags pointing to files you add under `images/`.

## Before you publish — checklist

This site intentionally ships with a few things flagged so nothing unverified goes live. Search the project for `TODO` and `badge-todo` — each marks something to confirm or fill in:

- [ ] Confirm karate style / federation affiliation (currently placeholder text)
- [ ] Confirm chief instructor name, rank, and whether it should be public
- [ ] Confirm class age ranges and timings for Kids/Teen/Adult programs
- [ ] Confirm whether trial classes are offered
- [ ] Confirm academy founding year, total students trained, years training, number of branches
- [ ] Verify the 29th AISKC 2026 result details before publishing (dates, venue, 23 medals)
- [ ] Confirm Yokohama international selection details, or remove that section
- [ ] Add a real Google Maps embed link on `contact.html` (see comment in the file)
- [ ] Replace gray placeholder gallery tiles with real, permission-cleared photos
- [ ] Connect the contact form to a real backend (Formspree.io free tier is the easiest — see comment in `js/contact.js`; right now it opens the visitor's email app instead)
- [x] `sitemap.xml`, `robots.txt`, canonical and Open Graph tags now point to the real live site (`https://sentoukenadmin-glitch.github.io/sentou-ken-website/`) instead of the old placeholder domain. If you ever connect a custom domain, these all need updating again to match it.
- [ ] Add Facebook/other social links in `data/academy.js` if applicable

## Deploying for free

**Option A — GitHub Pages**
1. Create a free GitHub account and a new repository (e.g. `sentou-ken-website`).
2. Upload this whole `karate-academy` folder's contents to the repository (drag-and-drop works, or use GitHub Desktop / `git push`).
3. In the repo, go to Settings → Pages → set Source to your main branch, root folder.
4. GitHub gives you a free URL like `https://yourusername.github.io/sentou-ken-website/`.
5. Later, if you get a custom domain, you can connect it in the same Pages settings.

**Option B — Cloudflare Pages**
1. Create a free Cloudflare account, go to Pages → Create a project → Upload assets (or connect a GitHub repo).
2. Upload this folder's contents; Cloudflare deploys it and gives you a free `*.pages.dev` URL immediately.
3. Custom domains can be connected free later under the project's custom domain settings.

Either option is genuinely free with no card required, and both support HTTPS automatically.

## After it's live

1. Submit the site to **Google Search Console** (search.google.com/search-console) and submit `sitemap.xml`.
2. Set up / verify your **Google Business Profile** with the same name, address, and phone number as this site (consistency here matters for local search ranking).
3. Link the site from your Instagram bio and YouTube channel description.
