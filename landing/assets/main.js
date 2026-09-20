// Page behavior for the one-page landing site: smooth same-page scrolling
// (with a nav "scrollspy" that highlights the section you're in), and
// revealing a scanned parish token in the #join section — replaces the old
// standalone join.html now that everything lives on this one page.
(function () {
  var HEADER_OFFSET = 128; // matches section[id] { scroll-margin-top } in style.css

  function smoothScrollTo(target) {
    var top = target.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET;
    window.scrollTo({ top: top, behavior: "smooth" });
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      var hash = link.getAttribute("href");
      if (hash.length < 2) return; // bare "#"
      var target = document.querySelector(hash);
      if (!target) return;
      link.addEventListener("click", function (event) {
        event.preventDefault();
        smoothScrollTo(target);
        history.pushState(null, "", hash);
      });
    });
  }

  function initScrollSpy() {
    var navLinks = Array.prototype.slice.call(document.querySelectorAll(".site-nav a[href^='#']"));
    if (!navLinks.length) return;
    var sections = navLinks
      .map(function (link) {
        return document.querySelector(link.getAttribute("href"));
      })
      .filter(Boolean);
    if (!sections.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (link) {
            var isCurrent = link.getAttribute("href") === "#" + entry.target.id;
            link.classList.toggle("current", isCurrent);
          });
        });
      },
      { rootMargin: "-" + HEADER_OFFSET + "px 0px -70% 0px" }
    );
    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  function initJoinToken() {
    var token = new URLSearchParams(window.location.search).get("token");
    if (!token) return;
    var wrap = document.getElementById("join-token-wrap");
    var box = document.getElementById("join-token-box");
    if (!wrap || !box) return;
    box.textContent = token;
    wrap.style.display = "block";
  }

  document.addEventListener("DOMContentLoaded", function () {
    initSmoothScroll();
    initScrollSpy();
    initJoinToken();

    // A link straight to a hash (e.g. from the QR flyer, ?token=...#join)
    // needs the same header-offset correction the click handler applies.
    if (window.location.hash) {
      var initialTarget = document.querySelector(window.location.hash);
      if (initialTarget) {
        window.requestAnimationFrame(function () {
          smoothScrollTo(initialTarget);
        });
      }
    }
  });
})();
