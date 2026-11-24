/**
 * RAIJUN ZOO — Main Interactive Controller
 * - Lenis Smooth Scroll synced with GSAP ScrollTrigger
 * - Dynamic Portfolio Exhibition & Case Study Modal
 * - Interactive Skill Arsenal Bento Grid with Spotlight Hover
 * - Multi-Layer Parallax, Magnetic Buttons, Custom Luxury Cursor
 * - Smooth Section Anchor Scrolling, Dynamic Year, Floating TOP Button
 */

document.addEventListener("DOMContentLoaded", () => {
  /* ========================================================================
     1. DYNAMIC CURRENT YEAR IN FOOTER
  ======================================================================== */
  const yearEl = document.getElementById("currentYear");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ========================================================================
     2. RENDER PORTFOLIO CARDS & SKILL ARSENAL
  ======================================================================== */
  const portfolioGrid = document.getElementById("portfolioGrid");
  const skillsGrid = document.getElementById("skillsGrid");

  const SKILL_ICONS = {
    sparkles: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3l1.9 5.3L19 10.2l-5.1 1.9L12 17.5l-1.9-5.4L5 10.2l5.1-1.9L12 3z"/><path d="M19 3l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2z"/></svg>`,
    film: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2" y="4" width="20" height="16" rx="2.5"/><path d="M7 4v16M17 4v16M2 9h5M2 15h5M17 9h5M17 15h5"/></svg>`,
    mic: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M8.5 21h7"/></svg>`,
    music: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
    scissors: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"/></svg>`,
    cpu: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3"/></svg>`,
    code: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
    globe: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>`
  };

  function renderPortfolio(filter = "all") {
    if (!portfolioGrid || !Array.isArray(window.PORTFOLIO_DATA)) return;

    const items =
      filter === "all"
        ? window.PORTFOLIO_DATA
        : window.PORTFOLIO_DATA.filter((item) => item.category === filter);

    portfolioGrid.innerHTML = items
      .map(
        (item) => `
        <article class="portfolio-card spotlight-card" data-project-id="${item.id}" tabindex="0" role="button" aria-label="${item.title} 상세 보기">
          <div class="portfolio-media-wrap">
            <img src="${item.cover}" alt="${item.title}" class="parallax-img" loading="lazy" />
            <div class="portfolio-media-scrim"></div>
            <div class="portfolio-top-badges">
              <span class="p-index-badge">${item.index}</span>
              <span class="p-cat-badge">${item.categoryLabel}</span>
            </div>
          </div>
          <div class="portfolio-body">
            <div class="portfolio-title-row">
              <div>
                <h3 class="portfolio-title">${item.title}</h3>
                <p class="portfolio-subtitle">${item.subtitle}</p>
              </div>
              <span class="portfolio-open-icon" aria-hidden="true">↗</span>
            </div>
            <p class="portfolio-summary">${item.summary}</p>
            <div class="portfolio-tags">
              ${item.tools.slice(0, 4).map((t) => `<span class="p-tag">${t}</span>`).join("")}
            </div>
          </div>
        </article>
      `
      )
      .join("");

    attachSpotlightHandlers(portfolioGrid);
    attachPortfolioCardTriggers();
  }

  function renderSkills() {
    if (!skillsGrid || !Array.isArray(window.SKILLS_DATA)) return;

    skillsGrid.innerHTML = window.SKILLS_DATA.map(
      (group) => `
      <article class="skill-card spotlight-card ${group.featured ? "is-wide" : ""}">
        <div class="skill-card-head">
          <div class="skill-icon-box" aria-hidden="true">
            ${SKILL_ICONS[group.icon] || SKILL_ICONS.sparkles}
          </div>
          <span class="skill-index">${group.index}</span>
        </div>
        <div>
          <h3 class="skill-cat-title">${group.category}</h3>
          <p class="skill-cat-sub">${group.subtitle}</p>
        </div>
        <div class="skill-pills">
          ${group.items.map((tool) => `<span class="skill-pill">${tool}</span>`).join("")}
        </div>
      </article>
    `
    ).join("");

    attachSpotlightHandlers(skillsGrid);
  }

  function attachSpotlightHandlers(container) {
    const cards = container.querySelectorAll(".spotlight-card");
    cards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
        card.style.setProperty("--my", `${e.clientY - rect.top}px`);
      });
    });
  }

  renderPortfolio("all");
  renderSkills();

  /* ========================================================================
     3. LENIS SMOOTH SCROLL + GSAP SCROLLTRIGGER INTEGRATION
  ======================================================================== */
  let lenis = null;
  const hasGSAP = typeof gsap !== "undefined";
  const hasScrollTrigger = typeof ScrollTrigger !== "undefined";

  if (hasGSAP && hasScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  if (typeof Lenis !== "undefined") {
    lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5
    });

    if (hasGSAP && hasScrollTrigger) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }

  function smoothScrollToTarget(targetSelector) {
    if (!targetSelector) return;
    if (targetSelector === "#home" || targetSelector === "top") {
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.45 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    const el = document.querySelector(targetSelector);
    if (!el) return;

    if (lenis) {
      lenis.scrollTo(el, { offset: -68, duration: 1.35 });
    } else {
      const y = el.getBoundingClientRect().top + window.scrollY - 68;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }

  // Attach smooth scroll to all [data-scroll-to] links & buttons
  document.querySelectorAll("[data-scroll-to]").forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      const target = trigger.getAttribute("data-scroll-to");
      if (target && target.startsWith("#")) {
        e.preventDefault();
        closeMobileDrawer();
        smoothScrollToTarget(target);
      }
    });
  });

  /* ========================================================================
     4. HEADER SCROLL STATE, SCROLL PROGRESS & FLOATING TOP BUTTON
  ======================================================================== */
  const siteHeader = document.getElementById("siteHeader");
  const siteFooter = document.querySelector(".site-footer");
  const scrollProgressFill = document.getElementById("scrollProgressFill");
  const backToTopBtn = document.getElementById("backToTop");
  const topRingFill = document.getElementById("topRingFill");
  const RING_CIRCUMFERENCE = 2 * Math.PI * 25; // r = 25

  function updateScrollUI() {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0;
    const footerInView = siteFooter
      ? siteFooter.getBoundingClientRect().top < window.innerHeight - 16
      : false;

    if (siteHeader) {
      siteHeader.classList.toggle("is-scrolled", scrollY > 36);
    }
    if (scrollProgressFill) {
      scrollProgressFill.style.width = `${progress * 100}%`;
    }
    if (backToTopBtn) {
      backToTopBtn.classList.toggle("is-visible", scrollY > 380 && !footerInView);
    }
    if (topRingFill) {
      topRingFill.style.strokeDashoffset = String(RING_CIRCUMFERENCE * (1 - progress));
    }
  }

  if (lenis) {
    lenis.on("scroll", updateScrollUI);
  }
  window.addEventListener("scroll", updateScrollUI, { passive: true });
  updateScrollUI();

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => smoothScrollToTarget("top"));
  }

  /* ========================================================================
     5. MOBILE MENU DRAWER
  ======================================================================== */
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileDrawer = document.getElementById("mobileDrawer");

  function openMobileDrawer() {
    if (!mobileMenuBtn || !mobileDrawer) return;
    mobileMenuBtn.classList.add("is-open");
    mobileMenuBtn.setAttribute("aria-expanded", "true");
    mobileDrawer.classList.add("is-open");
    mobileDrawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("drawer-open");
    if (lenis) lenis.stop();
  }

  function closeMobileDrawer() {
    if (!mobileMenuBtn || !mobileDrawer) return;
    mobileMenuBtn.classList.remove("is-open");
    mobileMenuBtn.setAttribute("aria-expanded", "false");
    mobileDrawer.classList.remove("is-open");
    mobileDrawer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("drawer-open");
    if (lenis && !document.body.classList.contains("modal-open")) lenis.start();
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
      if (mobileDrawer && mobileDrawer.classList.contains("is-open")) {
        closeMobileDrawer();
      } else {
        openMobileDrawer();
      }
    });
  }

  /* ========================================================================
     6. PRELOADER & GSAP SCROLLTRIGGER + PARALLAX CHOREOGRAPHY
  ======================================================================== */
  const preloader = document.getElementById("preloader");
  const preloaderBar = document.getElementById("preloaderBar");

  function runIntroAndScrollAnimations() {
    if (!hasGSAP) return;

    // Hero Staggered Entrance
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".hero-title-reveal", {
      yPercent: 115,
      opacity: 0,
      duration: 1.05,
      stagger: 0.14
    })
      .from(
        ".hero-reveal",
        {
          y: 26,
          opacity: 0,
          duration: 0.85,
          stagger: 0.1
        },
        "-=0.6"
      )
      .from(
        ".astrolabe-stage",
        {
          scale: 0.9,
          opacity: 0,
          duration: 1.15,
          ease: "power3.out"
        },
        "-=0.85"
      );

    if (!hasScrollTrigger) return;

    // Hero Multi-Layer Depth Parallax on Scroll
    document.querySelectorAll("[data-parallax]").forEach((el) => {
      const amount = parseFloat(el.getAttribute("data-parallax") || "0");
      gsap.to(el, {
        y: amount * 1.8,
        ease: "none",
        scrollTrigger: {
          trigger: "#home",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
    });

    // Generic Reveal-Up Elements
    gsap.utils.toArray(".reveal-up").forEach((el) => {
      gsap.from(el, {
        y: 44,
        opacity: 0,
        duration: 0.95,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 86%",
          once: true
        }
      });
    });

    // Staggered Skill Cards
    gsap.from(".skill-card", {
      y: 38,
      opacity: 0,
      duration: 0.8,
      stagger: 0.08,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#skillsGrid",
        start: "top 82%",
        once: true
      }
    });

    // Staggered Portfolio Cards + Image Parallax
    initPortfolioScrollEffects();

    // Profile Persona Image Parallax
    const personaImg = document.querySelector(".persona-img");
    if (personaImg) {
      gsap.fromTo(
        personaImg,
        { yPercent: -7 },
        {
          yPercent: 7,
          ease: "none",
          scrollTrigger: {
            trigger: ".persona-frame",
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        }
      );
    }

    // Active Navigation Highlight Sync with ScrollTrigger
    const sections = ["home", "portfolio", "profile", "skill", "contact"];
    sections.forEach((secId) => {
      const secEl = document.getElementById(secId);
      if (!secEl) return;
      ScrollTrigger.create({
        trigger: secEl,
        start: "top 42%",
        end: "bottom 42%",
        onEnter: () => setActiveNav(secId),
        onEnterBack: () => setActiveNav(secId)
      });
    });
  }

  function initPortfolioScrollEffects() {
    if (!hasGSAP || !hasScrollTrigger) return;

    const cards = gsap.utils.toArray(".portfolio-card");
    gsap.fromTo(
      cards,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.75,
        stagger: 0.09,
        ease: "power3.out",
        clearProps: "transform",
        scrollTrigger: {
          trigger: "#portfolioGrid",
          start: "top 86%",
          once: true
        }
      }
    );

    // Subtle parallax inside each portfolio image frame
    cards.forEach((card) => {
      const img = card.querySelector(".parallax-img");
      if (!img) return;
      gsap.fromTo(
        img,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        }
      );
    });
  }

  function setActiveNav(sectionId) {
    document.querySelectorAll(".nav-link").forEach((link) => {
      const target = link.getAttribute("data-scroll-to");
      link.classList.toggle("is-active", target === `#${sectionId}`);
    });
  }

  // Smooth fast preloader release
  if (preloader && preloaderBar) {
    requestAnimationFrame(() => {
      preloaderBar.style.width = "65%";
    });
    window.setTimeout(() => {
      preloaderBar.style.width = "100%";
    }, 240);
    window.setTimeout(() => {
      preloader.classList.add("is-done");
      runIntroAndScrollAnimations();
    }, 520);
  } else {
    runIntroAndScrollAnimations();
  }

  /* ========================================================================
     7. PORTFOLIO CATEGORY FILTERS
  ======================================================================== */
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => {
        b.classList.remove("is-active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");

      const filter = btn.getAttribute("data-filter") || "all";
      renderPortfolio(filter);
      if (hasGSAP) {
        gsap.fromTo(
          ".portfolio-card",
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, stagger: 0.06, ease: "power3.out", clearProps: "transform" }
        );
      }
      if (hasScrollTrigger) {
        ScrollTrigger.refresh();
      }
    });
  });

  /* ========================================================================
     8. PORTFOLIO LIGHTBOX / CASE STUDY MODAL
  ======================================================================== */
  const modal = document.getElementById("portfolioModal");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const modalMediaViewport = document.getElementById("modalMediaViewport");
  const modalMediaCaption = document.getElementById("modalMediaCaption");
  const modalThumbs = document.getElementById("modalThumbs");
  const modalIndex = document.getElementById("modalIndex");
  const modalCategory = document.getElementById("modalCategory");
  const modalYear = document.getElementById("modalYear");
  const modalTitle = document.getElementById("modalTitle");
  const modalSubtitle = document.getElementById("modalSubtitle");
  const modalSummary = document.getElementById("modalSummary");
  const modalRole = document.getElementById("modalRole");
  const modalTools = document.getElementById("modalTools");
  const modalYoutubeLink = document.getElementById("modalYoutubeLink");

  function renderModalMedia(project, galleryIndex = 0) {
    if (!modalMediaViewport) return;

    // If the user configured a YouTube video ID or local movie file, display it first when index === 0
    if (galleryIndex === 0 && project.youtubeId) {
      modalMediaViewport.innerHTML = `
        <iframe
          src="https://www.youtube.com/embed/${project.youtubeId}?rel=0"
          title="${project.title}"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      `;
      if (modalMediaCaption) {
        modalMediaCaption.textContent = `${project.title} — YouTube 공식 영상`;
        modalMediaCaption.style.display = "block";
      }
      return;
    }

    if (galleryIndex === 0 && project.localVideo) {
      modalMediaViewport.innerHTML = `
        <video src="${project.localVideo}" controls playsinline poster="${project.cover}"></video>
      `;
      if (modalMediaCaption) {
        modalMediaCaption.textContent = `${project.title} — 로컬 시네마 프리뷰`;
        modalMediaCaption.style.display = "block";
      }
      return;
    }

    const media = project.gallery[galleryIndex] || { src: project.cover, caption: project.title };
    modalMediaViewport.innerHTML = `
      <img src="${media.src}" alt="${media.caption || project.title}" />
    `;
    if (modalMediaCaption) {
      if (media.caption) {
        modalMediaCaption.textContent = media.caption;
        modalMediaCaption.style.display = "block";
      } else {
        modalMediaCaption.style.display = "none";
      }
    }
  }

  function openProjectModal(projectId) {
    if (!modal || !Array.isArray(window.PORTFOLIO_DATA)) return;
    const project = window.PORTFOLIO_DATA.find((p) => p.id === projectId);
    if (!project) return;

    modalIndex.textContent = project.index;
    modalCategory.textContent = project.categoryLabel;
    modalYear.textContent = project.year;
    modalTitle.textContent = project.title;
    modalSubtitle.textContent = project.subtitle;
    modalSummary.textContent = project.summary;
    modalRole.textContent = project.role;
    modalTools.innerHTML = project.tools.map((t) => `<span class="p-tag">${t}</span>`).join("");
    modalYoutubeLink.href = project.youtubeUrl || "https://www.youtube.com/@raijunzoo";

    renderModalMedia(project, 0);

    if (modalThumbs) {
      if (project.gallery && project.gallery.length > 1) {
        modalThumbs.innerHTML = project.gallery
          .map(
            (img, idx) => `
            <button type="button" class="modal-thumb-btn ${idx === 0 ? "is-active" : ""}" data-thumb-idx="${idx}" aria-label="이미지 ${idx + 1} 보기">
              <img src="${img.src}" alt="${img.caption || project.title}" />
            </button>
          `
          )
          .join("");

        modalThumbs.querySelectorAll(".modal-thumb-btn").forEach((tb) => {
          tb.addEventListener("click", () => {
            modalThumbs.querySelectorAll(".modal-thumb-btn").forEach((x) => x.classList.remove("is-active"));
            tb.classList.add("is-active");
            renderModalMedia(project, Number(tb.getAttribute("data-thumb-idx")));
          });
        });
      } else {
        modalThumbs.innerHTML = "";
      }
    }

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    if (lenis) lenis.stop();
  }

  function closeProjectModal() {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    if (modalMediaViewport) modalMediaViewport.innerHTML = "";
    if (lenis) lenis.start();
  }

  function attachPortfolioCardTriggers() {
    document.querySelectorAll(".portfolio-card").forEach((card) => {
      const id = card.getAttribute("data-project-id");
      card.addEventListener("click", () => openProjectModal(id));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openProjectModal(id);
        }
      });
    });
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeProjectModal);
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeProjectModal();
    });
  }
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeProjectModal();
      closeMobileDrawer();
    }
  });

  /* ========================================================================
     9. HERO 3D TILT CARD, MAGNETIC BUTTONS & CUSTOM CURSOR
  ======================================================================== */
  const heroTiltCard = document.getElementById("heroTiltCard");
  if (heroTiltCard && window.matchMedia("(hover: hover)").matches) {
    const crestCard = heroTiltCard.querySelector(".hero-crest-card");
    heroTiltCard.addEventListener("mousemove", (e) => {
      const rect = heroTiltCard.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rotY = (px - 0.5) * 18;
      const rotX = (0.5 - py) * 16;

      if (crestCard) {
        crestCard.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
        crestCard.style.setProperty("--shine-x", `${px * 100}%`);
        crestCard.style.setProperty("--shine-y", `${py * 100}%`);
      }
    });

    heroTiltCard.addEventListener("mouseleave", () => {
      if (crestCard) {
        crestCard.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
      }
    });
  }

  // Magnetic Buttons
  if (window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".magnetic").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.18;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.22;
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
      });
    });

    // Custom Luxury Cursor
    const dot = document.getElementById("cursorDot");
    const ring = document.getElementById("cursorRing");
    if (dot && ring) {
      let cx = 0;
      let cy = 0;
      let rx = 0;
      let ry = 0;
      let visible = false;

      window.addEventListener("mousemove", (e) => {
        cx = e.clientX;
        cy = e.clientY;
        if (!visible) {
          visible = true;
          dot.style.opacity = "1";
          ring.style.opacity = "1";
        }
        dot.style.left = `${cx}px`;
        dot.style.top = `${cy}px`;
      });

      function tickCursor() {
        rx += (cx - rx) * 0.16;
        ry += (cy - ry) * 0.16;
        ring.style.left = `${rx}px`;
        ring.style.top = `${ry}px`;
        requestAnimationFrame(tickCursor);
      }
      tickCursor();

      document.addEventListener("mouseover", (e) => {
        const interactive = e.target.closest("a, button, .portfolio-card, input, textarea");
        ring.classList.toggle("is-hovering", Boolean(interactive));
      });
    }
  }

  /* ========================================================================
     10. COPY EMAIL TOAST & CONTACT INQUIRY FORM
  ======================================================================== */
  const toastEl = document.getElementById("luxuryToast");
  let toastTimer = null;

  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("is-shown");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove("is-shown");
    }, 2800);
  }

  const copyEmailBtn = document.getElementById("copyEmailBtn");
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener("click", async () => {
      const email = copyEmailBtn.getAttribute("data-email") || "00000000@gmail.com";
      try {
        await navigator.clipboard.writeText(email);
        showToast(`이메일 주소(${email})가 클립보드에 복사되었습니다.`);
      } catch {
        showToast(`이메일 주소: ${email}`);
      }
    });
  }

  const contactForm = document.getElementById("contactForm");
  const formFeedback = document.getElementById("formFeedback");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = (document.getElementById("senderName")?.value || "").trim();
      const email = (document.getElementById("senderEmail")?.value || "").trim();
      const message = (document.getElementById("senderMessage")?.value || "").trim();

      if (!name || !email || !message) {
        if (formFeedback) formFeedback.textContent = "성함, 이메일, 문의 내용을 모두 입력해 주세요.";
        return;
      }

      const recipient = copyEmailBtn?.getAttribute("data-email") || "00000000@gmail.com";
      const subject = encodeURIComponent(`[RAIJUN ZOO 포트폴리오 문의] ${name}님`);
      const body = encodeURIComponent(
        `보낸 분: ${name}\n회신 이메일: ${email}\n\n문의 내용:\n${message}`
      );

      if (formFeedback) {
        formFeedback.textContent = "메일 앱을 열어 문의를 준비했습니다. 소중한 연락 감사합니다!";
      }
      showToast("이메일 작성 창이 열립니다.");
      window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
      contactForm.reset();
    });
  }
});
