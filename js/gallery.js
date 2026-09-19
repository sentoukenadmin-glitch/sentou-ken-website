/**
 * gallery.js — builds the gallery grid from data/academy.js (academy.galleryPhotos)
 * and wires up the category filter buttons. To add/remove a photo by hand,
 * edit the galleryPhotos list in data/academy.js.
 *
 * If the admin CMS (Supabase) is configured, public-content.js appends any
 * admin-uploaded photos into academy.galleryPhotos BEFORE calling
 * window.renderGalleryGrid() again, so this file never needs to change.
 */
function renderGalleryGrid() {
  var grid = document.querySelector("#gallery-grid");
  if (!grid || typeof academy === "undefined" || !academy.galleryPhotos) return;

  grid.innerHTML = "";
  academy.galleryPhotos.forEach(function (photo) {
    var figure = document.createElement("figure");
    figure.className = "gallery-item" + (photo.portrait ? " portrait" : "");
    figure.setAttribute("data-category", photo.category);

    var img = document.createElement("img");
    img.loading = "lazy";
    img.src = photo.src;
    img.alt = photo.alt || "";

    figure.appendChild(img);
    grid.appendChild(figure);
  });

  // Re-apply whichever filter is currently active (matters when this re-runs
  // after admin-uploaded photos arrive from Supabase)
  var activeBtn = document.querySelector(".filter-btn[aria-pressed='true']");
  var filter = activeBtn ? activeBtn.getAttribute("data-filter") : "all";
  grid.querySelectorAll(".gallery-item").forEach(function (item) {
    var show = filter === "all" || item.getAttribute("data-category") === filter;
    item.style.display = show ? "" : "none";
  });
}
window.renderGalleryGrid = renderGalleryGrid;

document.addEventListener("DOMContentLoaded", function () {
  renderGalleryGrid();

  // Category filter buttons (wired once — the grid contents can change later,
  // but the buttons themselves don't)
  var buttons = document.querySelectorAll(".filter-btn");
  if (!buttons.length) return;

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var filter = btn.getAttribute("data-filter");
      var grid = document.querySelector("#gallery-grid");

      buttons.forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
      btn.setAttribute("aria-pressed", "true");

      grid.querySelectorAll(".gallery-item").forEach(function (item) {
        var show = filter === "all" || item.getAttribute("data-category") === filter;
        item.style.display = show ? "" : "none";
      });
    });
  });
});
