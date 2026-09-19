/**
 * cursor.js — custom eagle cursor + eagle-led page transitions.
 *
 * Pure visual enhancement, fully progressive:
 * - Skipped entirely on touch devices (no "pointer: fine") — normal mobile
 *   behavior, untouched.
 * - Skipped entirely if the person prefers reduced motion — normal cursor,
 *   instant navigation.
 * - If this script fails to load at all, every link on the site is a plain
 *   <a href="..."> and works exactly as normal.
 */
(function () {
  var canAnimate = window.matchMedia("(pointer: fine)").matches &&
                    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!canAnimate) return;

  var EAGLE_SVG = '<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">' +
    '<path class="eagle-body" d="M60,38 C56,28 50,20 44,14 C48,13 53,14 57,17 C55,10 58,3 60,0 C62,3 65,10 63,17 C67,14 72,13 76,14 C70,20 64,28 60,38 Z"/>' +
    '<path class="eagle-wing-left" d="M58,32 L4,10 L12,20 L2,24 L14,30 L4,36 L17,39 L8,46 L22,45 L16,53 L28,48 L58,40 Z"/>' +
    '<path class="eagle-wing-right" d="M62,32 L116,10 L108,20 L118,24 L106,30 L116,36 L103,39 L112,46 L98,45 L104,53 L92,48 L62,40 Z"/>' +
    '<path class="eagle-tail" d="M60,40 L52,55 L56,54 L54,64 L58,60 L60,72 L62,60 L66,64 L64,54 L68,55 Z"/>' +
    '</svg>';

  document.addEventListener("DOMContentLoaded", function () {
    document.body.classList.add("eagle-cursor-active");

    // ---------- Cursor follower ----------
    var cursor = document.createElement("div");
    cursor.className = "eagle-cursor";
    cursor.innerHTML = EAGLE_SVG;
    document.body.appendChild(cursor);

    var targetX = window.innerWidth / 2, targetY = window.innerHeight / 2;
    var curX = targetX, curY = targetY;
    var lastX = curX, lastY = curY;
    var hasMoved = false;

    window.addEventListener("mousemove", function (e) {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!hasMoved) { curX = targetX; curY = targetY; hasMoved = true; cursor.classList.add("is-visible"); }
    });
    document.addEventListener("mouseleave", function () { cursor.classList.remove("is-visible"); });
    document.addEventListener("mouseenter", function () { if (hasMoved) cursor.classList.add("is-visible"); });

    // Scale up + subtle "bank" rotation toward movement direction
    var rotation = 0;
    function tick() {
      curX += (targetX - curX) * 0.18;
      curY += (targetY - curY) * 0.18;

      var dx = curX - lastX, dy = curY - lastY;
      var speed = Math.sqrt(dx * dx + dy * dy);
      if (speed > 0.6) {
        var targetRotation = Math.max(-22, Math.min(22, dx * 1.4));
        rotation += (targetRotation - rotation) * 0.15;
      } else {
        rotation += (0 - rotation) * 0.08;
      }
      lastX = curX; lastY = curY;

      cursor.style.transform = "translate(-50%, -50%) translate(" + curX + "px," + curY + "px) rotate(" + rotation + "deg)";
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    var hoverTargets = "a, button, .btn, .filter-btn, .tournament-toggle, .nav-toggle";
    document.addEventListener("mouseover", function (e) {
      if (e.target.closest(hoverTargets)) cursor.classList.add("is-hovering");
    });
    document.addEventListener("mouseout", function (e) {
      if (e.target.closest(hoverTargets)) cursor.classList.remove("is-hovering");
    });

    // ---------- Page transition: eagle appears at a proper fitted size (with
    // a shine sweep) while water-ripple rings expand and the screen darkens —
    // all starting the exact same instant, so there's never a blank gap ----------
    var overlay = document.createElement("div");
    overlay.className = "page-transition-overlay";
    document.body.appendChild(overlay);

    var flyer = document.createElement("div");
    flyer.className = "eagle-flyer";
    flyer.innerHTML =
      '<img class="eagle-img" src="images/logo/eagle-only.png" alt="">' +
      '<div class="eagle-shine"></div>';
    document.body.appendChild(flyer);

    var ringCount = 3;
    var rings = [];
    for (var i = 0; i < ringCount; i++) {
      var ring = document.createElement("div");
      ring.className = "ripple-ring";
      document.body.appendChild(ring);
      rings.push(ring);
    }

    document.addEventListener("click", function (e) {
      var link = e.target.closest("a[href]");
      if (!link) return;

      var href = link.getAttribute("href");
      var isInternalPage = href && href.endsWith(".html") && !href.startsWith("http");
      var isPlainClick = !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0;
      var opensSameTab = link.target !== "_blank";

      if (!isInternalPage || !isPlainClick || !opensSameTab) return;

      e.preventDefault();
      cursor.classList.remove("is-visible");

      // Fit the eagle to a MEDIUM size that always stays fully on-screen —
      // constrained by BOTH width and height, whichever is tighter, so the
      // head and tail can never get cropped off on shorter screens.
      var baseBox = 90; // matches .eagle-flyer width/height in cursor.css
      var scaleByWidth = (window.innerWidth * 0.42) / baseBox;
      var scaleByHeight = (window.innerHeight * 0.62) / baseBox;
      var flyScale = Math.min(scaleByWidth, scaleByHeight);
      flyer.style.setProperty("--fly-scale", flyScale);

      // Ripple rings sized to comfortably cover the screen from center.
      var ringScale = (Math.max(window.innerWidth, window.innerHeight) * 0.9) / 24;

      // Everything starts at the same moment — eagle, shine, ripples, and the
      // darkening overlay — so there's no blank pause in between any of them.
      overlay.classList.add("is-active");
      flyer.classList.add("is-flying");
      rings.forEach(function (ring, idx) {
        ring.style.setProperty("--ring-scale", ringScale);
        setTimeout(function () { ring.classList.add("is-rippling"); }, idx * 110);
      });

      var navigated = false;
      var goNow = function () {
        if (navigated) return;
        navigated = true;
        window.location.href = href;
      };
      setTimeout(goNow, 640);
    });
  });
})();
