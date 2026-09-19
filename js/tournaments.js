/**
 * tournaments.js — builds the tournament accordion cards from data/academy.js
 * (academy.tournamentResults). To add, remove, or correct a tournament by
 * hand, edit that list in data/academy.js.
 *
 * If the admin CMS (Supabase) is configured, public-content.js appends any
 * admin-added tournaments into academy.tournamentResults BEFORE calling
 * window.renderTournaments() again, so this file never needs to change.
 *
 * Also renders the "Latest Result" card on the Achievements page (whichever
 * tournament has featured: true) from the exact same data — so the two pages
 * can never disagree with each other.
 */
function medalStatGrid(medals) {
  return '<div class="stat-grid" style="grid-template-columns: repeat(3,1fr); margin-top: var(--space-2);">' +
    '<div class="stat" style="border-top:none; padding-left:0;"><span class="value">' + medals.gold + '</span><span class="label">Gold</span></div>' +
    '<div class="stat" style="border-top:none;"><span class="value">' + medals.silver + '</span><span class="label">Silver</span></div>' +
    '<div class="stat" style="border-top:none;"><span class="value">' + medals.bronze + '</span><span class="label">Bronze</span></div>' +
    '</div>';
}
function totalMedals(medals) {
  return medals ? (medals.gold || 0) + (medals.silver || 0) + (medals.bronze || 0) : null;
}

function renderTournaments() {
  if (typeof academy === "undefined" || !academy.tournamentResults) return;

  // ---------- tournaments.html: full accordion list ----------
  var list = document.querySelector("#tournament-list");
  if (list) {
    list.innerHTML = "";
    academy.tournamentResults.forEach(function (t) {
      var card = document.createElement("div");
      // Note: no "reveal" class here — see earlier note; dynamically added
      // content is shown immediately rather than relying on the scroll-fade
      // system, which only ever observes elements present at page load.
      card.className = "card tournament-card";
      card.style.marginBottom = "var(--space-3)";

      var total = totalMedals(t.medals);
      var detailsHtml = "<p>" + t.dateVenue + "</p>";
      if (total !== null) {
        detailsHtml += "<p><strong>Result:</strong> " + total + " medals"
          + (t.studentsCompeted ? " (out of " + t.studentsCompeted + " students who competed)" : "") + "</p>"
          + medalStatGrid(t.medals);
      }
      if (t.notes) detailsHtml += "<p>" + t.notes + "</p>";

      card.innerHTML =
        '<button class="tournament-toggle" aria-expanded="false">' +
          "<span>" +
            '<span class="eyebrow" style="margin-bottom:6px; display:block;">' + t.eyebrowLabel + "</span>" +
            '<h3 style="margin:0;">' + t.title + "</h3>" +
          "</span>" +
          '<span class="toggle-icon" aria-hidden="true">+</span>' +
        "</button>" +
        '<div class="tournament-details" hidden>' + detailsHtml + "</div>";

      list.appendChild(card);
    });

    list.querySelectorAll(".tournament-toggle").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var expanded = btn.getAttribute("aria-expanded") === "true";
        var details = btn.nextElementSibling;
        btn.setAttribute("aria-expanded", expanded ? "false" : "true");
        if (details) details.hidden = expanded;
      });
    });
  }

  // ---------- achievements.html: featured result card ----------
  var featuredCard = document.querySelector("#featured-result-card");
  var featuredTitle = document.querySelector("#featured-result-title");
  if (featuredCard) {
    var featured = academy.tournamentResults.filter(function (t) { return t.featured; })[0];
    if (featured) {
      if (featuredTitle) featuredTitle.textContent = featured.title;
      var total = totalMedals(featured.medals);
      var html = "<p><strong>Date &amp; Venue:</strong> " + featured.dateVenue + "</p>";
      if (total !== null) {
        html += "<p><strong>Result:</strong> " + total + " medals"
          + (featured.studentsCompeted ? " (out of " + featured.studentsCompeted + " students who competed)" : "") + "</p>"
          + medalStatGrid(featured.medals);
      }
      featuredCard.innerHTML = html;
    }
  }
}
window.renderTournaments = renderTournaments;

document.addEventListener("DOMContentLoaded", renderTournaments);
