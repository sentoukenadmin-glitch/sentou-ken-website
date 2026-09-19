/**
 * public-content.js — makes admin-uploaded content (via the /admin panel)
 * appear automatically on the public website.
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
    var { data, error } = await supabaseClient.from("tournaments").select("*").order("created_at", { ascending: false });
    if (error || !data || !data.length) return;

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
    var { data, error } = await supabaseClient
      .from("gallery_photos")
      .select("photo_url, caption, category")
      .order("created_at", { ascending: false });
    if (error || !data || !data.length) return;

    data.forEach(function (p) {
      academy.galleryPhotos.unshift({
        src: p.photo_url,
        alt: p.caption || "Academy photo",
        category: p.category || "tournaments"
      });
    });

    if (typeof window.renderGalleryGrid === "function") window.renderGalleryGrid();
  }

  async function loadAnnouncementsFromCMS() {
    var container = document.querySelector("#announcements-strip");
    if (!container) return; // homepage only

    var { data, error } = await supabaseClient
      .from("announcements")
      .select("*")
      .order("announcement_date", { ascending: false })
      .limit(3);
    if (error || !data || !data.length) return; // stays hidden — zero visual change if no announcements

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

    var { data, error } = await supabaseClient
      .from("achievements")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data || !data.length) return; // stays hidden — zero visual change if none added yet

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

    var { data, error } = await supabaseClient
      .from("reviews")
      .select("*")
      .order("review_date", { ascending: false })
      .limit(6);
    if (error || !data || !data.length) return; // stays hidden — zero visual change if none added yet

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

  document.addEventListener("DOMContentLoaded", function () {
    loadTournamentsFromCMS();
    loadGalleryFromCMS();
    loadAnnouncementsFromCMS();
    loadAchievementsFromCMS();
    loadReviewsFromCMS();
  });
})();
