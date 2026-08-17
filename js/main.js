(function () {
  "use strict";

  const GALLERIES = {
    trisector: {
      title: "Trisector",
      trailer: "iSI3nxN5IPo",
      images: [
        { src: "assets/media/trisector/01-full.webp", alt: "Trisector arcade combat" },
        { src: "assets/media/trisector/02-full.webp", alt: "Trisector wave survival" },
        { src: "assets/media/trisector/03-full.webp", alt: "Trisector upgrades" },
        { src: "assets/media/trisector/04-full.webp", alt: "Trisector gameplay" },
        { src: "assets/media/trisector/05-full.webp", alt: "Trisector arena" },
        { src: "assets/media/trisector/06-full.webp", alt: "Trisector high score run" },
      ],
    },
    swiftkill: {
      title: "SWIFTKILL",
      trailer: "tYMcud0uNGM",
      images: [
        { src: "assets/media/swiftkill/01-full.webp", alt: "SWIFTKILL arena combat" },
        { src: "assets/media/swiftkill/02-full.webp", alt: "SWIFTKILL movement" },
        { src: "assets/media/swiftkill/03-full.webp", alt: "SWIFTKILL one-hit kill" },
        { src: "assets/media/swiftkill/04-full.webp", alt: "SWIFTKILL sci-fi arena" },
        { src: "assets/media/swiftkill/05-full.webp", alt: "SWIFTKILL precision play" },
        { src: "assets/media/swiftkill/06-full.webp", alt: "SWIFTKILL prototype screenshot" },
      ],
    },
    velocity: {
      title: "Velocity — Advanced FPS Movement",
      trailer: "zc6Zkf8_k6s",
      trailerPoster: "assets/media/velocity/thumb-full.webp?v=20260817a",
      images: [
        { src: "assets/media/velocity/01-full.webp", alt: "Velocity wallrunning and sliding" },
        { src: "assets/media/velocity/02-full.webp", alt: "Velocity FPS movement demo" },
      ],
    },
    "ai-context-builder": {
      title: "AI Context Builder",
      trailer: "qbIV7_slErA",
      trailerPoster: "assets/media/ai-context-builder/thumb-full.webp?v=20260817a",
      images: [
        { src: "assets/media/ai-context-builder/01-full.webp?v=3", alt: "AI Context Builder — fully customizable export" },
        { src: "assets/media/ai-context-builder/02-full.webp?v=3", alt: "AI Context Builder — output control" },
        { src: "assets/media/ai-context-builder/03-full.webp?v=3", alt: "AI Context Builder — manual context" },
        { src: "assets/media/ai-context-builder/04-full.webp?v=3", alt: "AI Context Builder — quick presets" },
      ],
    },
    "project-doctor": {
      title: "Project Doctor Pro",
      trailer: "iEkdLeqDcug",
      trailerPoster: "assets/media/project-doctor/thumb-full.webp?v=20260817a",
      images: [
        { src: "assets/media/project-doctor/01-full.webp?v=3", alt: "Project Doctor Pro — batch rename" },
        { src: "assets/media/project-doctor/02-full.webp?v=3", alt: "Project Doctor Pro — organize with one click" },
        { src: "assets/media/project-doctor/03-full.webp?v=3", alt: "Project Doctor Pro — cleanup large and unused assets" },
        { src: "assets/media/project-doctor/04-full.webp?v=3", alt: "Project Doctor Pro — fix broken references" },
      ],
    },
  };

  // ── Starfield ──
  const canvas = document.getElementById("stars");
  const ctx = canvas.getContext("2d");
  let stars = [];
  let w = 0;
  let h = 0;
  let lastWidth = 0;
  let rafId = 0;
  let resizeTimer = 0;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resizeCanvas() {
    const cssW = window.innerWidth;
    const cssH = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);
    canvas.style.width = cssW + "px";
    canvas.style.height = cssH + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    w = cssW;
    h = cssH;
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
  }

  function loop() {
    drawStars();
    if (!prefersReducedMotion && document.visibilityState === "visible") {
      rafId = requestAnimationFrame(loop);
    }
  }

  function startLoop() {
    if (prefersReducedMotion || document.visibilityState !== "visible") {
      drawStars();
      return;
    }
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(loop);
  }

  window.addEventListener("resize", () => {
    const cssW = window.innerWidth;
    if (cssW === lastWidth) return;
    lastWidth = cssW;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resizeCanvas, 150);
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      cancelAnimationFrame(rafId);
    } else {
      startLoop();
    }
  });

  lastWidth = window.innerWidth;
  resizeCanvas();
  startLoop();

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

  function closeMenu() {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }

  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (!nav.classList.contains("open")) return;
    if (!nav.contains(event.target) && !toggle.contains(event.target)) closeMenu();
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

  // ── Lightbox ──
  const dialog = document.getElementById("lightbox");
  const stage = dialog.querySelector(".lightbox-stage");
  const caption = dialog.querySelector(".lightbox-caption");
  const titleEl = document.getElementById("lightbox-title");
  const prevBtn = dialog.querySelector(".lightbox-prev");
  const nextBtn = dialog.querySelector(".lightbox-next");
  const closeBtn = dialog.querySelector(".lightbox-close");
  let slides = [];
  let slideIndex = 0;

  function buildSlides(gallery) {
    const list = [];
    if (gallery.trailer) {
      list.push({
        type: "trailer",
        id: gallery.trailer,
        poster: gallery.trailerPoster || (gallery.images[0] ? gallery.images[0].src : ""),
        alt: gallery.title + " trailer",
      });
    }
    gallery.images.forEach((image) => {
      list.push({ type: "image", src: image.src, alt: image.alt });
    });
    return list;
  }

  function stopTrailer() {
    const iframe = stage.querySelector("iframe");
    if (iframe) iframe.remove();
  }

  function renderSlide() {
    const slide = slides[slideIndex];
    if (!slide) return;
    stopTrailer();
    stage.replaceChildren();

    if (slide.type === "trailer") {
      const facade = document.createElement("button");
      facade.type = "button";
      facade.className = "yt-facade";
      facade.setAttribute("aria-label", "Play trailer");
      const poster = document.createElement("img");
      poster.src = slide.poster;
      poster.alt = slide.alt;
      facade.append(poster);
      facade.addEventListener("click", () => {
        const iframe = document.createElement("iframe");
        iframe.src = "https://www.youtube-nocookie.com/embed/" + slide.id + "?autoplay=1";
        iframe.title = slide.alt;
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        stage.replaceChildren(iframe);
      });
      stage.appendChild(facade);
    } else {
      const img = document.createElement("img");
      img.src = slide.src;
      img.alt = slide.alt;
      stage.appendChild(img);
    }

    caption.textContent = slides.length > 1
      ? (slideIndex + 1) + " / " + slides.length + (slide.type === "trailer" ? " — click to play" : "")
      : (slide.alt || "");
    const many = slides.length > 1;
    prevBtn.hidden = !many;
    nextBtn.hidden = !many;
  }

  function openGallery(id, start) {
    const gallery = GALLERIES[id];
    if (!gallery) return;
    slides = buildSlides(gallery);
    titleEl.textContent = gallery.title;
    slideIndex = 0;
    if (start !== "trailer" && gallery.trailer) slideIndex = 1;
    if (slideIndex >= slides.length) slideIndex = 0;
    renderSlide();
    if (typeof dialog.showModal === "function") dialog.showModal();
  }

  function step(delta) {
    if (slides.length < 2) return;
    slideIndex = (slideIndex + delta + slides.length) % slides.length;
    renderSlide();
  }

  document.querySelectorAll("[data-gallery]").forEach((el) => {
    el.addEventListener("click", () => {
      openGallery(el.getAttribute("data-gallery"), el.getAttribute("data-start"));
    });
  });

  prevBtn.addEventListener("click", () => step(-1));
  nextBtn.addEventListener("click", () => step(1));
  closeBtn.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", stopTrailer);
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") step(-1);
    if (event.key === "ArrowRight") step(1);
  });

  // ── Footer year ──
  document.getElementById("year").textContent = new Date().getFullYear();
})();
