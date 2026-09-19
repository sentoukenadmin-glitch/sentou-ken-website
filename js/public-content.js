/**
 * public-content.js — makes admin-uploaded content (via the /admin panel)
 * appear automatically on the public website.
 *
 * RESILIENCE: every query below is wrapped so a real failure (Supabase
 * unreachable, timed out, project asleep for too long, etc.) never leaves a
 * visitor looking at an empty section. Each successful fetch is cached in
 * this browser's localStorage; if a later fetch on this same browser fails,
 * we fall back to that last-known-good copy instead of showing nothing. A
 * genuinely empty result (nothing added yet, or everything deleted in the
 * admin panel) is NOT treated as a failure — that correctly shows/stays
 * empty, and is itself cached so a later outage doesn't wrongly resurrect
 * old deleted content.
 * Note: this only helps a RETURNING visitor on the same browser/device — a
 * brand-new visitor whose browser has never loaded the site before, hitting
 * it at the exact moment of a rare outage, has no local cache to fall back
 * to. See .github/workflows/keep-supabase-awake.yml, which pings the
 * database every few days so it never has a reason to pause in the first
 * place — that's the main defence; this cache is the backup for it.
 *
 * IMPORTANT DESIGN CHOICE: this file only ADDS to what's already on the
 * site — it never replaces or removes the existing hardcoded content in
 * data/academy.js. If Supabase isn't configured yet (js/supabase-config.js
 * still has placeholder values), this script quietly does nothing and the
 * site behaves exactly as it did before the CMS existed.
 *
 * Include this AFTER data/academy.js and gallery.js/tournaments.js, and
 * AFTER the Supabase CDN script + js/supabase-config.js.
 */
(function () {
  if (typeof SUPABASE_CONFIGURED === "undefined" || !SUPABASE_CONFIGURED || !supabaseClient) return;
  if (typeof academy === "undefined") return;

  // ---------- Small helpers: local cache + a timeout so a hung request can't leave the page waiting forever ----------
  function cacheGet(key) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }
  function cacheSet(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // localStorage unavailable (private browsing, storage full, etc.) — fine, just skip caching
    }
  }

  // Races a Supabase query against a timeout. If the query hasn't settled in
  // time, we treat it like an error so the caller falls back to cache — but
  // if the real request finishes late anyway, it's simply ignored.
  function withTimeout(queryPromise, ms) {
    return new Promise(function (resolve) {
      var settled = false;
      var timer = setTimeout(function () {
        if (settled) return;
        settled = true;
        resolve({ data: null, error: new Error("timed out") });
      }, ms);
      Promise.resolve(queryPromise).then(
        function (result) {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          resolve(result);
        },
        function (err) {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          resolve({ data: null, error: err });
        }
      );
    });
  }

  // Runs a Supabase query, using the local cache as a fallback on any real
  // error (including a timeout) but never on a genuine empty result.
  async function fetchWithFallback(cacheKey, queryPromise, timeoutMs) {
    var result = await withTimeout(queryPromise, timeoutMs || 8000);
    if (result.error) {
      var cached = cacheGet(cacheKey);
      return { data: cached, fromCache: true };
    }
    cacheSet(cacheKey, result.data || []);
    return { data: result.data, fromCache: false };
  }

  // Basic HTML-escaping for any admin-entered text we insert with innerHTML,
  // so a stray "<" or "&" in a review/achievement typed into the admin panel
  // can never be interpreted as markup on the public site.
  function esc(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function starString(rating) {
    var n = Math.max(0, Math.min(5, parseInt(rating, 10) || 0));
    return "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n);
  }

  async function loadTournamentsFromCMS() {
    var { data } = await fetchWithFallback(
      "cms_tournaments",
      supabaseClient.from("tournaments").select("*").order("created_at", { ascending: false })
    );
    if (!data || !data.length) return;

    data.forEach(function (t) {
      academy.tournamentResults.push({
        id: "cms-" + t.id,
        eyebrowLabel: t.eyebrow_label || "",
        title: t.title,
        dateVenue: t.date_venue || "",
        studentsCompeted: t.students_competed,
        medals: (t.medals_gold || t.medals_silver || t.medals_bronze)
          ? { gold: t.medals_gold || 0, silver: t.medals_silver || 0, bronze: t.medals_bronze || 0 }
          : null,
        notes: t.notes || "",
        featured: !!t.featured
      });
    });

    if (typeof window.renderTournaments === "function") window.renderTournaments();
  }

  async function loadGalleryFromCMS() {
    var { data } = await fetchWithFallback(
      "cms_gallery_photos",
      supabaseClient.from("gallery_photos").select("photo_url, caption, category, is_portrait").order("created_at", { ascending: false })
    );
    if (!data || !data.length) return;

    data.forEach(function (p) {
      var photo = {
        src: p.photo_url,
        alt: p.caption || "Academy photo",
        category: p.category || "tournaments"
      };
      if (p.is_portrait) photo.portrait = true;
      academy.galleryPhotos.unshift(photo);
    });

    if (typeof window.renderGalleryGrid === "function") window.renderGalleryGrid();
  }

  async function loadAnnouncementsFromCMS() {
    var container = document.querySelector("#announcements-strip");
    if (!container) return; // homepage only

    var { data } = await fetchWithFallback(
      "cms_announcements",
      supabaseClient.from("announcements").select("*").order("announcement_date", { ascending: false }).limit(3)
    );
    if (!data || !data.length) return; // stays hidden — zero visual change if no announcements

    container.innerHTML = data.map(function (a) {
      return '<div class="card reveal" style="margin-bottom: var(--space-2);">' +
        (a.is_important ? '<span class="badge-todo" style="background:rgba(166,27,43,0.12); color:var(--crimson); border-color:rgba(166,27,43,0.4);">Important</span>' : '') +
        '<h3 style="margin:8px 0 4px;">' + esc(a.title) + '</h3>' +
        (a.description ? '<p style="margin:0;">' + esc(a.description) + '</p>' : '') +
        '</div>';
    }).join("");
    container.closest("section").hidden = false;
  }

  // ---------- Achievements (standalone recognitions added in /admin/achievements.html) ----------
  async function loadAchievementsFromCMS() {
    var container = document.querySelector("#cms-achievements-grid");
    if (!container) return; // achievements.html only

    var { data } = await fetchWithFallback(
      "cms_achievements",
      supabaseClient.from("achievements").select("*").order("created_at", { ascending: false })
    );
    if (!data || !data.length) return; // stays hidden — zero visual change if none added yet

    container.innerHTML = data.map(function (a) {
      var html = '<div class="card reveal">';
      if (a.image_url) html += '<img src="' + esc(a.image_url) + '" alt="" style="width:100%; aspect-ratio:4/3; object-fit:cover; margin-bottom:12px; border:1px solid rgba(20,17,15,0.15);">';
      html += '<h3 style="margin:0 0 4px;">' + esc(a.title) + '</h3>';
      if (a.year) html += '<p class="eyebrow" style="margin:0 0 8px;">' + esc(a.year) + '</p>';
      if (a.result) html += '<p>' + esc(a.result) + '</p>';
      if (a.medal_count) html += '<p><strong>' + esc(a.medal_count) + '</strong> medal(s)</p>';
      if (a.student_names) html += '<p style="margin:0; color: var(--bone-dim);">' + esc(a.student_names) + '</p>';
      html += '</div>';
      return html;
    }).join("");

    var section = container.closest("section");
    if (section) section.hidden = false;
  }

  // ---------- Google Reviews (added in /admin/reviews.html, shown on the homepage) ----------
  async function loadReviewsFromCMS() {
    var container = document.querySelector("#google-reviews-grid");
    if (!container) return; // homepage only

    var { data } = await fetchWithFallback(
      "cms_reviews",
      supabaseClient.from("reviews").select("*").order("review_date", { ascending: false }).limit(6)
    );
    if (!data || !data.length) return; // stays hidden — zero visual change if none added yet

    container.innerHTML = data.map(function (r) {
      return '<div class="card reveal">' +
        '<div style="color:var(--bronze); letter-spacing:0.1em;">' + starString(r.rating) + '</div>' +
        (r.review_text ? '<p style="margin:10px 0;">“' + esc(r.review_text) + '”</p>' : '') +
        '<p style="margin:0; font-weight:600;">' + esc(r.reviewer_name) + '</p>' +
        '<p style="margin:0; font-size:0.85rem; color:var(--bone-dim);">via ' + esc(r.source || "Google") + '</p>' +
        '</div>';
    }).join("");

    var section = container.closest("section");
    if (section) section.hidden = false;
  }

  // ---------- Site Settings (edited in /admin/settings.html) ----------
  async function loadSiteSettingsFromCMS() {
    var el = document.querySelector("#google-rating-text");
    if (!el) return; // homepage only

    var { data } = await fetchWithFallback(
      "cms_site_settings",
      supabaseClient.from("site_settings").select("key, value").in("key", ["google_rating", "google_review_count"])
    );
    if (!data || !data.length) return;

    var map = {};
    data.forEach(function (row) { map[row.key] = row.value; });
    if (map.google_rating && map.google_review_count) {
      el.textContent = map.google_rating + " rated on Google · " + map.google_review_count + " reviews";
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    loadTournamentsFromCMS();
    loadGalleryFromCMS();
    loadAnnouncementsFromCMS();
    loadAchievementsFromCMS();
    loadReviewsFromCMS();
    loadSiteSettingsFromCMS();
  });
})();
