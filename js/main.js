/**
 * main.js — shared behavior for every page.
 */
document.addEventListener("DOMContentLoaded", function () {
  // Mobile nav toggle
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var isOpen = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Header gains a shadow once scrolled, for depth
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Scroll-reveal: fades/slides elements in as they enter the viewport.
  // Content is already present and readable in the DOM without JS — this is
  // a visual flourish only. Two safety nets guarantee nothing stays hidden:
  // (1) a generous rootMargin so elements reveal well before they're fully
  // in view, and (2) a hard timeout that force-reveals everything shortly
  // after load regardless (covers slow JS, crawlers that don't scroll, or
  // any IntersectionObserver edge case).
  var revealTargets = document.querySelectorAll(".reveal");
  if (revealTargets.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.01, rootMargin: "0px 0px -10% 0px" });
      revealTargets.forEach(function (el) { io.observe(el); });

      // Safety net: force everything visible after 1.8s no matter what.
      setTimeout(function () {
        revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
      }, 1800);
    }
  }

  // Auto-updating "years since founding" and "years of experience" figures —
  // computed from data/academy.js so these NEVER need manual yearly updates.
  // Must run before the count-up animation block below, since it reads these
  // same data-count attributes.
  if (typeof academy !== "undefined") {
    var currentYear = new Date().getFullYear();

    if (academy.establishedYear) {
      var yearsSinceFounding = currentYear - academy.establishedYear;
      document.querySelectorAll('[data-dynamic="years-since-founding"]').forEach(function (el) {
        el.setAttribute("data-count", yearsSinceFounding);
        el.textContent = yearsSinceFounding;
      });
    }

    if (academy.chiefInstructor && academy.chiefInstructor.trainingStartYear) {
      var yearsExperience = currentYear - academy.chiefInstructor.trainingStartYear;
      document.querySelectorAll('[data-dynamic="years-experience"]').forEach(function (el) {
        el.textContent = yearsExperience;
      });
    }
  }

  // Animated count-up for stat numbers, e.g. <span class="value" data-count="23">0</span>
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length && !reduceMotion && "IntersectionObserver" in window) {
    var countIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.getAttribute("data-count"), 10);
        if (isNaN(target)) return;
        var start = performance.now();
        var duration = 1200;
        function tick(now) {
          var progress = Math.min((now - start) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target);
          if (progress < 1) requestAnimationFrame(tick);
          else el.textContent = target;
        }
        requestAnimationFrame(tick);
        countIo.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { countIo.observe(el); });
  } else {
    counters.forEach(function (el) { el.textContent = el.getAttribute("data-count"); });
  }

  // (Tournament accordion behavior now lives in js/tournaments.js, since the
  // cards themselves are built dynamically from data/academy.js on that page.)

  // Footer year
  document.querySelectorAll("[data-current-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Populate contact-related elements from the central academy data file
  if (typeof academy !== "undefined") {
    document.querySelectorAll('[data-academy="phone1"]').forEach(function (el) { el.textContent = academy.phone1; el.setAttribute("href", "tel:+91" + academy.phone1.replace(/\s/g, "")); });
    document.querySelectorAll('[data-academy="phone2"]').forEach(function (el) { el.textContent = academy.phone2; });
    document.querySelectorAll('[data-academy="email"]').forEach(function (el) { el.textContent = academy.email; el.setAttribute("href", "mailto:" + academy.email); });
    document.querySelectorAll('[data-academy="address"]').forEach(function (el) { el.textContent = academy.address; });
    document.querySelectorAll('[data-academy="youtube-href"]').forEach(function (el) { el.setAttribute("href", academy.youtube); });
    document.querySelectorAll('[data-academy="instagram-href"]').forEach(function (el) { el.setAttribute("href", academy.instagram); });
    document.querySelectorAll('[data-academy="facebook-href"]').forEach(function (el) { el.setAttribute("href", academy.facebook); });
    document.querySelectorAll('[data-academy="google-reviews-href"]').forEach(function (el) { if (academy.googleMapsLink) el.setAttribute("href", academy.googleMapsLink); });

    var waLink = document.querySelector('[data-academy="whatsapp-href"]');
    if (waLink) waLink.setAttribute("href", "https://wa.me/" + academy.whatsapp);
  }
});
