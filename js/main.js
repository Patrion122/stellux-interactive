(function () {
  "use strict";

  // ── Starfield ──
  const canvas = document.getElementById("stars");
  const ctx = canvas.getContext("2d");
  let stars = [];
  let w, h;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    initStars();
  }

  function initStars() {
    const count = prefersReducedMotion ? 40 : Math.min(180, Math.floor((w * h) / 8000));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.4 + 0.3,
      a: Math.random() * 0.5 + 0.2,
      speed: Math.random() * 0.15 + 0.02,
      twinkle: Math.random() * Math.PI * 2,
    }));
  }

  function drawStars() {
    ctx.clearRect(0, 0, w, h);
    const t = Date.now() * 0.001;
    for (const s of stars) {
      const alpha = prefersReducedMotion
        ? s.a
        : s.a * (0.6 + 0.4 * Math.sin(t * s.speed * 3 + s.twinkle));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220, 225, 255, ${alpha})`;
      ctx.fill();
      if (!prefersReducedMotion) {
        s.y += s.speed;
        if (s.y > h) {
          s.y = 0;
          s.x = Math.random() * w;
        }
      }
    }
    if (!prefersReducedMotion) requestAnimationFrame(drawStars);
  }

  window.addEventListener("resize", resize);
  resize();
  drawStars();

  // ── Header scroll state ──
  const header = document.querySelector(".site-header");
  const scrollHint = document.querySelector(".hero-scroll");
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 20);
    if (scrollHint) scrollHint.classList.toggle("is-hidden", window.scrollY > 48);
  }, { passive: true });

  // ── Mobile menu ──
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  // ── Scroll reveal ──
  const revealEls = document.querySelectorAll("[data-reveal]");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add("revealed"), i * 80);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => observer.observe(el));

  // ── Footer year ──
  document.getElementById("year").textContent = new Date().getFullYear();
})();
