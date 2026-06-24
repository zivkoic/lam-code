(() => {
  const root = window.LamaticHero = window.LamaticHero || {};

  root.triggerIds = root.triggerIds || [];

  root.createScrollTrigger = (id, config) => {
    const existing = ScrollTrigger.getById(id);
    if (existing) existing.kill();

    const trigger = ScrollTrigger.create({
      id,
      invalidateOnRefresh: true,
      ...config
    });

    if (!root.triggerIds.includes(id)) root.triggerIds.push(id);

    return trigger;
  };

  root.refresh = () => {
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  root.initLenis = (reduceMotion) => {
    if (reduceMotion || !window.Lenis || root.lenis) return root.lenis || null;

    root.lenis = new Lenis({
      duration: 0.9,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.4,
      syncTouch: false
    });

    root.lenis.on("scroll", ScrollTrigger.update);

    root.lenisTicker = root.lenisTicker || ((time) => {
      root.lenis.raf(time * 1000);
    });

    gsap.ticker.remove(root.lenisTicker);
    gsap.ticker.add(root.lenisTicker);
    gsap.ticker.lagSmoothing(0);

    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";

    return root.lenis;
  };

  window.addEventListener("load", root.refresh, { once: true });
})();

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const scrollTrack = document.querySelector(".scroll-track");
  const video = document.querySelector(".brian-video video");

  if (!scrollTrack || !video) return;

  /*
    Same idea as localhost:
    - Lenis smooths scroll
    - ScrollTrigger reads progress
    - video.currentTime is updated max once per RAF
  */

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  window.LamaticHero.initLenis(reduceMotion);

  let pendingProgress = 0;
  let rafId = null;
  let isReady = false;

  video.pause();
  video.removeAttribute("autoplay");
  video.removeAttribute("loop");
  video.autoplay = false;
  video.loop = false;
  video.muted = true;
  video.playsInline = true;
  video.preload = "auto";
  video.style.backgroundImage = "none";

  const clamp = (value, min, max) => {
    return Math.min(Math.max(value, min), max);
  };

  const seekToProgress = () => {
    rafId = null;

    if (!isReady) return;

    const duration = video.duration;
    if (!duration || !isFinite(duration)) return;

    const progress = clamp(pendingProgress, 0, 1);
    const targetTime = progress * duration;
    const safeTime = clamp(targetTime, 0, duration - 0.02);

    try {
      video.currentTime = safeTime;
    } catch (e) {}
  };

  const scheduleSeek = () => {
    if (rafId !== null) return;
    rafId = requestAnimationFrame(seekToProgress);
  };

  const initVideo = () => {
    isReady = true;

    try {
      video.currentTime = 0.001;
    } catch (e) {}

    scheduleSeek();
    window.LamaticHero.refresh();
  };

  video.addEventListener("loadedmetadata", initVideo);

  if (video.readyState >= 1) {
    initVideo();
  }

  window.LamaticHero.createScrollTrigger("lamatic-hero-1", {
    trigger: scrollTrack,
    start: "top top",
    end: "bottom bottom",
    scrub: 0.25,
    onUpdate: (self) => {
      pendingProgress = self.progress;
      scheduleSeek();
    }
  });

  window.LamaticHero.refresh();

  window.addEventListener("load", window.LamaticHero.refresh, { once: true });
});

document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  gsap.registerPlugin(ScrollTrigger);

  const scrollTrack = document.querySelector(".scroll-track");
  const hero = document.querySelector(".home-hero");

  const activePaths = document.querySelectorAll(".brain-path-active");
  const chips = document.querySelectorAll(".brain-chip-wrap");
  const nodes = document.querySelectorAll(".brain-node");

  const chipLabels = document.querySelectorAll("[data-chip-label]");
  const chipIcons = document.querySelectorAll("[data-chip-icon]");
  const industryTitle = document.querySelector("[data-industry-title]");

  if (!scrollTrack || !activePaths.length || !chips.length || !nodes.length) return;

  const icons = {
    key: `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="8" cy="15" r="3"></circle>
        <path d="M10.5 13L20 4M16 8l3 3M14 10l2 2"></path>
      </svg>
    `,
    doc: `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"></path>
        <path d="M14 3v5h5"></path>
        <path d="M9 13h6M9 17h4"></path>
      </svg>
    `,
    flag: `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 21V4M5 4h11l-2 3 2 3H5"></path>
      </svg>
    `,
    send: `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 3L3 11l7 2 2 7z"></path>
      </svg>
    `,
    shield: `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>
    `,
    search: `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="7"></circle>
        <path d="M21 21l-4.3-4.3"></path>
      </svg>
    `,
    alert: `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"></path>
        <path d="M12 9v4M12 17h.01"></path>
      </svg>
    `,
    check: `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 6L9 17l-5-5"></path>
      </svg>
    `
  };

  const industryData = {
    banking: {
      title: "banking",
      chips: [
        { label: "Read application", icon: "doc" },
        { label: "Verify KYC", icon: "shield" },
        { label: "Score risk", icon: "alert" },
        { label: "Approve loan", icon: "check" }
      ]
    },

    legal: {
      title: "legal",
      chips: [
        { label: "Extract clauses", icon: "key" },
        { label: "Draft redlines", icon: "doc" },
        { label: "Flag deviations", icon: "flag" },
        { label: "Send to client", icon: "send" }
      ]
    },

    security: {
      title: "security",
      chips: [
        { label: "Parse alerts", icon: "alert" },
        { label: "Investigate threat", icon: "search" },
        { label: "Prioritize risk", icon: "shield" },
        { label: "Escalate incident", icon: "send" }
      ]
    }
  };

  let currentIndustry = "";
  let currentActiveIndex = -999;
  let currentLineProgress = -1;

  const clamp = (value, min, max) => {
    return Math.min(Math.max(value, min), max);
  };

  const setIndustry = (industry) => {
    if (industry === currentIndustry) return;

    currentIndustry = industry;

    const data = industryData[industry];
    if (!data) return;

    if (hero) {
      hero.setAttribute("data-industry", industry);
    }

    if (industryTitle) {
      industryTitle.textContent = data.title;
    }

    data.chips.forEach((chip, index) => {
      const labelEl = chipLabels[index];
      const iconEl = chipIcons[index];

      if (labelEl) {
        labelEl.textContent = chip.label;
      }

      if (iconEl) {
        iconEl.innerHTML = icons[chip.icon] || icons.doc;
      }
    });

    // Reset chip state briefly so transition feels like a new industry
    chips.forEach((chip) => {
      chip.classList.remove("is-visible", "is-active", "is-done");
    });

    nodes.forEach((node) => {
      node.classList.remove("is-lit");
    });

    currentActiveIndex = -999;
    currentLineProgress = -1;
  };

  const setLineProgress = (value) => {
    const lineProgress = clamp(value, 0, 1);

    if (Math.abs(lineProgress - currentLineProgress) < 0.001) return;

    currentLineProgress = lineProgress;

    activePaths.forEach((path) => {
      path.style.strokeDashoffset = 1 - lineProgress;
    });
  };

  const setActiveIndex = (activeIndex) => {
    if (activeIndex === currentActiveIndex) return;

    currentActiveIndex = activeIndex;

    chips.forEach((chip, index) => {
      chip.classList.remove("is-visible", "is-active", "is-done");

      if (index <= activeIndex) {
        chip.classList.add("is-visible");

        if (index === activeIndex) {
          chip.classList.add("is-active");
        } else {
          chip.classList.add("is-done");
        }
      }
    });

    nodes.forEach((node, index) => {
      node.classList.toggle("is-lit", index <= activeIndex);
    });
  };

  const updateBrainOverlay = (progress) => {
    const p = clamp(progress, 0, 1);

    let industry = "banking";
    let industryIndex = 0;

    if (p < 1 / 3) {
      industry = "banking";
      industryIndex = 0;
    } else if (p < 2 / 3) {
      industry = "legal";
      industryIndex = 1;
    } else {
      industry = "security";
      industryIndex = 2;
    }

    setIndustry(industry);

    const segmentStart = industryIndex / 3;
    const sub = clamp((p - segmentStart) * 3, 0, 1);

    let activeIndex = -1;
    let lineProgress = 0;

    if (sub < 0.20) {
      activeIndex = -1;
      lineProgress = 0;
    } else if (sub < 0.60) {
      const t = (sub - 0.20) / (0.60 - 0.20);

      activeIndex = Math.min(3, Math.floor(t * 4));
      lineProgress = Math.min(1, (activeIndex + 1) / 4);
    } else {
      activeIndex = 3;
      lineProgress = 1;
    }

    setActiveIndex(activeIndex);
    setLineProgress(lineProgress);
  };

  window.LamaticHero.createScrollTrigger("lamatic-hero-2", {
    trigger: scrollTrack,
    start: "top top",
    end: "bottom bottom",
    scrub: 0.25,
    onUpdate: (self) => {
      updateBrainOverlay(self.progress);
    }
  });

  updateBrainOverlay(0);

  window.LamaticHero.refresh();
});

document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  gsap.registerPlugin(ScrollTrigger);

  const scrollTrack = document.querySelector(".scroll-track");
  const outcomeRail = document.querySelector(".outcome-rail");
  const hero = document.querySelector(".home-hero");

  if (!scrollTrack || !outcomeRail) return;

  const cards = outcomeRail.querySelectorAll("[data-outcome-item]");
  const dashboard = outcomeRail.querySelector("[data-outcome-dashboard]");
  const stats = outcomeRail.querySelector("[data-outcome-stats]");

  const dashboardTitle = outcomeRail.querySelector("[data-dashboard-title]");
  const metricLabels = outcomeRail.querySelectorAll("[data-metric-label]");
  const metricValues = outcomeRail.querySelectorAll("[data-count-target], [data-static-value]");
  const bars = outcomeRail.querySelectorAll("[data-bar-height]");
  const ring = outcomeRail.querySelector("[data-ring-percent]");
  const linePath = outcomeRail.querySelector(".outcome-line-path");

  const statValues = outcomeRail.querySelectorAll("[data-stat-value]");
  const statLabels = outcomeRail.querySelectorAll("[data-stat-label]");

  const outcomeData = {
    banking: {
      cards: [
        "Credit memo generated",
        "KYC verified",
        "Exception queue ready",
        "Decision sent",
        "Portfolio review triggered",
        "Compliance logged"
      ],
      dashboardTitle: "Loan operations dashboard",
      metrics: [
        { label: "Applications", value: "1248", type: "count" },
        { label: "Approval rate", value: "72", suffix: "%", type: "count", ring: 72 },
        { label: "Turnaround", value: "1.8d", type: "static" }
      ],
      stats: [
        { value: "4 weeks", label: "from project start to deployed" },
        { value: "Positive ROI", label: "in year 1" },
        { value: "2× faster", label: "loan decision turnaround" }
      ]
    },

    legal: {
      cards: [
        "First-pass review completed",
        "Redline draft ready",
        "Clause risk summary",
        "Compliance memo generated",
        "Client-ready report",
        "Audit-ready"
      ],
      dashboardTitle: "Matter operations",
      metrics: [
        { label: "Matters", value: "342", type: "count" },
        { label: "First-pass accuracy", value: "94", suffix: "%", type: "count", ring: 94 },
        { label: "Cycle time", value: "−60%", type: "static" }
      ],
      stats: [
        { value: "2× faster", label: "review cycles" },
        { value: "60% lower", label: "repetitive drafting effort" },
        { value: "Full audit trail", label: "every decision traceable" }
      ]
    },

    security: {
      cards: [
        "Access controls enforced",
        "End-to-end encryption",
        "Detailed audit logs",
        "Pen test verified",
        "Workflow executed",
        "Trust dashboard"
      ],
      dashboardTitle: "Trust dashboard",
      metrics: [
        { label: "Security posture", value: "Excellent", type: "static" },
        { label: "Controls", value: "98", suffix: "%", type: "count", ring: 98 },
        { label: "Audit events", value: "12842", type: "count" }
      ],
      stats: [
        { value: "SOC 2 aligned", label: "security & availability controls" },
        { value: "SSO / SAML", label: "enterprise-ready access" },
        { value: "Pen tested", label: "third-party verified defenses" }
      ]
    }
  };

  let currentIndustry = "";
  let currentMode = "";
  let activeTimeouts = [];

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const clearActiveTimeouts = () => {
    activeTimeouts.forEach((timeout) => clearTimeout(timeout));
    activeTimeouts = [];
  };

  const addTimeout = (callback, delay) => {
    const timeout = setTimeout(callback, delay);
    activeTimeouts.push(timeout);
  };

  const getIndustryFromProgress = (p) => {
    if (p < 1 / 3) return { key: "banking", index: 0 };
    if (p < 2 / 3) return { key: "legal", index: 1 };
    return { key: "security", index: 2 };
  };

  const setMetricPreviewValues = () => {
    outcomeRail.querySelectorAll("[data-count-target], [data-static-value]").forEach((valueEl) => {
      valueEl.textContent = "—";
    });
  };

  const setFinalMetricValues = () => {
    outcomeRail.querySelectorAll("[data-count-target], [data-static-value]").forEach((valueEl) => {
      const staticValue = valueEl.getAttribute("data-static-value");
      const target = valueEl.getAttribute("data-count-target");
      const suffix = valueEl.getAttribute("data-count-suffix") || "";

      if (staticValue) {
        valueEl.textContent = staticValue;
      } else if (target) {
        valueEl.textContent = Number(target).toLocaleString("en-US") + suffix;
      }
    });
  };

  const setPreviewState = () => {
    if (currentMode === "preview") return;

    currentMode = "preview";
    clearActiveTimeouts();

    outcomeRail.classList.remove("is-active");
    outcomeRail.classList.add("is-preview");

    cards.forEach((card) => {
      card.classList.remove("is-visible");
    });

    if (dashboard) dashboard.classList.remove("is-visible");
    if (stats) stats.classList.remove("is-visible");

    bars.forEach((bar) => {
      bar.style.height = "0px";
    });

    if (ring) {
      const total = parseFloat(ring.getAttribute("stroke-dasharray")) || 87.96459430051421;
      ring.style.strokeDashoffset = total;
    }

    if (linePath) {
      linePath.style.strokeDasharray = "0 1";
      linePath.style.strokeDashoffset = "0";
    }

    setMetricPreviewValues();
  };

  const setIndustry = (industryKey) => {
    if (industryKey === currentIndustry) return;

    currentIndustry = industryKey;
    currentMode = "";

    const data = outcomeData[industryKey];
    if (!data) return;

    cards.forEach((card, index) => {
      const title = card.querySelector(".outcome-title");

      if (title && data.cards[index]) {
        title.textContent = data.cards[index];
      }
    });

    if (dashboardTitle) {
      dashboardTitle.textContent = data.dashboardTitle;
    }

    data.metrics.forEach((metric, index) => {
      const labelEl = metricLabels[index];
      const valueEl = metricValues[index];

      if (labelEl) {
        labelEl.textContent = metric.label;
      }

      if (valueEl) {
        valueEl.removeAttribute("data-count-target");
        valueEl.removeAttribute("data-count-suffix");
        valueEl.removeAttribute("data-static-value");

        if (metric.type === "count") {
          valueEl.setAttribute("data-count-target", metric.value);

          if (metric.suffix) {
            valueEl.setAttribute("data-count-suffix", metric.suffix);
          }
        } else {
          valueEl.setAttribute("data-static-value", metric.value);
        }
      }

      if (index === 1 && ring && metric.ring) {
        ring.setAttribute("data-ring-percent", metric.ring);
      }
    });

    data.stats.forEach((stat, index) => {
      if (statValues[index]) statValues[index].textContent = stat.value;
      if (statLabels[index]) statLabels[index].textContent = stat.label;
    });

    setPreviewState();
  };

  const animateCounter = (el) => {
    const target = Number(el.getAttribute("data-count-target") || 0);
    const suffix = el.getAttribute("data-count-suffix") || "";
    const startTime = performance.now();
    const duration = 850;

    const tick = (now) => {
      if (currentMode !== "active") return;

      const progress = clamp((now - startTime) / duration, 0, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);

      el.textContent = value.toLocaleString("en-US") + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    el.textContent = "0" + suffix;
    requestAnimationFrame(tick);
  };

  const setActiveState = () => {
    if (currentMode === "active") return;

    currentMode = "active";
    clearActiveTimeouts();

    outcomeRail.classList.remove("is-preview");
    outcomeRail.classList.add("is-active");

    cards.forEach((card, index) => {
      addTimeout(() => {
        card.classList.add("is-visible");
      }, index * 70);
    });

    addTimeout(() => {
      if (dashboard) dashboard.classList.add("is-visible");

      outcomeRail.querySelectorAll("[data-count-target]").forEach((counter) => {
        animateCounter(counter);
      });

      outcomeRail.querySelectorAll("[data-static-value]").forEach((valueEl) => {
        valueEl.textContent = valueEl.getAttribute("data-static-value") || "";
      });

      bars.forEach((bar, index) => {
        const height = bar.getAttribute("data-bar-height") || "0";

        addTimeout(() => {
          bar.style.height = height + "px";
        }, index * 60);
      });

      if (ring) {
        const total = parseFloat(ring.getAttribute("stroke-dasharray")) || 87.96459430051421;
        const percent = Number(ring.getAttribute("data-ring-percent") || 0);
        const offset = total - total * (percent / 100);

        addTimeout(() => {
          ring.style.strokeDashoffset = offset;
        }, 120);
      }

      if (linePath) {
        linePath.style.strokeDasharray = "1 1";
        linePath.style.strokeDashoffset = "1";

        addTimeout(() => {
          linePath.style.strokeDashoffset = "0";
        }, 140);
      }
    }, 430);

    addTimeout(() => {
      if (stats) stats.classList.add("is-visible");
    }, 760);
  };

  const updateHeroPhase = (sub) => {
    if (!hero) return;

    hero.classList.remove("is-ingest", "is-process", "is-output", "is-settle");

    if (sub < 0.20) {
      hero.classList.add("is-ingest");
    } else if (sub < 0.60) {
      hero.classList.add("is-process");
    } else if (sub < 0.92) {
      hero.classList.add("is-output");
    } else {
      hero.classList.add("is-settle");
    }
  };

  const update = (progress) => {
    const p = clamp(progress, 0, 1);

    const industry = getIndustryFromProgress(p);
    setIndustry(industry.key);

    const segmentStart = industry.index / 3;
    const sub = clamp((p - segmentStart) * 3, 0, 1);

    updateHeroPhase(sub);

    /*
      Original logic:
      0.00 - 0.20 ingest
      0.20 - 0.60 brain/process overlay animates
      0.60 - 0.92 outcome active
      0.92 - 1.00 settle
    */
    if (sub < 0.60) {
      setPreviewState();
    } else {
      setActiveState();
    }
  };

  setIndustry("banking");
  setPreviewState();

  window.LamaticHero.createScrollTrigger("lamatic-hero-3", {
    trigger: scrollTrack,
    start: "top top",
    end: "bottom bottom",
    scrub: 0.25,
    onUpdate: (self) => {
      update(self.progress);
    }
  });

  window.LamaticHero.refresh();

  window.addEventListener("load", window.LamaticHero.refresh, { once: true });
});

document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  gsap.registerPlugin(ScrollTrigger);

  const scrollTrack = document.querySelector(".scroll-track");
  const hero = document.querySelector(".home-hero");

  const inputRail = document.querySelector("[data-input-rail]");
  const industryIcon = document.querySelector("[data-input-industry-icon]");
  const industryLabel = document.querySelector("[data-input-industry-label]");
  const inputCards = document.querySelectorAll("[data-input-card]");
  const inputIcons = document.querySelectorAll("[data-input-icon]");
  const inputTitles = document.querySelectorAll("[data-input-title]");
  const inputSubtitles = document.querySelectorAll("[data-input-subtitle]");

  const toolWrap = document.querySelector("[data-tool-column-wrap]");
  const toolIcons = document.querySelectorAll("[data-tool-icon]");

  if (!scrollTrack || !inputRail || !toolWrap) return;

  const icons = {
    industryBank: `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 10l9-6 9 6"></path>
        <path d="M5 10v8M9 10v8M15 10v8M19 10v8"></path>
        <path d="M3 20h18"></path>
      </svg>
    `,
    industryLegal: `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"></path>
        <path d="M14 3v5h5"></path>
        <path d="M9 13h6M9 17h4"></path>
      </svg>
    `,
    industrySecurity: `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"></path>
      </svg>
    `,
    pdf: `
      <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="1" y="1" width="22" height="22" rx="4.68" ry="4.68" fill="#E2342D" stroke="rgba(0,0,0,0.06)" stroke-width="0.5"></rect>
        <text x="12" y="15.6" text-anchor="middle" font-size="7.4" font-weight="800" fill="#fff" font-family="system-ui, -apple-system, sans-serif" letter-spacing="-0.3">PDF</text>
      </svg>
    `,
    xlsx: `
      <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="1" y="1" width="22" height="22" rx="4.68" ry="4.68" fill="#1E7B40" stroke="rgba(0,0,0,0.06)" stroke-width="0.5"></rect>
        <text x="12" y="16" text-anchor="middle" font-size="11" font-weight="800" fill="#fff" font-family="system-ui, sans-serif">X</text>
      </svg>
    `,
    kyc: `
      <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="1" y="1" width="22" height="22" rx="4.68" ry="4.68" fill="#3B82F6" stroke="rgba(0,0,0,0.06)" stroke-width="0.5"></rect>
        <circle cx="12" cy="10" r="2.6" fill="#fff"></circle>
        <path d="M6.5 18c1.4-2.6 3.6-3.6 5.5-3.6S16.1 15.4 17.5 18" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"></path>
      </svg>
    `,
    bureau: `
      <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="1" y="1" width="22" height="22" rx="4.68" ry="4.68" fill="#7C3AED" stroke="rgba(0,0,0,0.06)" stroke-width="0.5"></rect>
        <path d="M4 11l8-5 8 5" stroke="#fff" stroke-width="1.6" fill="none" stroke-linejoin="round"></path>
        <path d="M6 11v7M10 11v7M14 11v7M18 11v7" stroke="#fff" stroke-width="1.4" stroke-linecap="round"></path>
        <path d="M4 19h16" stroke="#fff" stroke-width="1.6" stroke-linecap="round"></path>
      </svg>
    `,
    gmail: `
      <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="1" y="1" width="22" height="22" rx="4.68" ry="4.68" fill="#ffffff" stroke="rgba(0,0,0,0.08)" stroke-width="0.5"></rect>
        <path d="M3 7.5l9 6 9-6" fill="none" stroke="#EA4335" stroke-width="2.4" stroke-linejoin="round"></path>
        <path d="M3 7.5v10a1 1 0 001 1h16a1 1 0 001-1v-10" fill="none" stroke="#34A853" stroke-width="1.8"></path>
        <path d="M3 7.5L7 5h10l4 2.5" fill="none" stroke="#FBBC04" stroke-width="1.8"></path>
      </svg>
    `,
    docBlue: `
      <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="1" y="1" width="22" height="22" rx="4.68" ry="4.68" fill="#3478C7" stroke="rgba(0,0,0,0.06)" stroke-width="0.5"></rect>
        <rect x="6" y="6" width="12" height="2" rx="0.6" fill="#fff"></rect>
        <rect x="6" y="10" width="12" height="2" rx="0.6" fill="#fff" opacity="0.85"></rect>
        <rect x="6" y="14" width="9" height="2" rx="0.6" fill="#fff" opacity="0.7"></rect>
      </svg>
    `,
    docPurple: `
      <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="1" y="1" width="22" height="22" rx="4.68" ry="4.68" fill="#7C3AED" stroke="rgba(0,0,0,0.06)" stroke-width="0.5"></rect>
        <path d="M8 6h8M8 10h8M8 14h5" stroke="#fff" stroke-width="1.6" stroke-linecap="round"></path>
      </svg>
    `,
    shieldRed: `
      <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="1" y="1" width="22" height="22" rx="4.68" ry="4.68" fill="#F33736" stroke="rgba(0,0,0,0.06)" stroke-width="0.5"></rect>
        <path d="M12 4l6 2.4v5.2c0 3.6-2.5 5.9-6 7-3.5-1.1-6-3.4-6-7V6.4z" fill="none" stroke="#fff" stroke-width="1.7" stroke-linejoin="round"></path>
      </svg>
    `,
    lock: `
      <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="1" y="1" width="22" height="22" rx="4.68" ry="4.68" fill="#111827" stroke="rgba(0,0,0,0.06)" stroke-width="0.5"></rect>
        <rect x="6" y="10" width="12" height="8" rx="1.5" fill="#fff"></rect>
        <path d="M8.5 10V8a3.5 3.5 0 017 0v2" fill="none" stroke="#fff" stroke-width="1.6"></path>
      </svg>
    `,
    key: `
      <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="1" y="1" width="22" height="22" rx="4.68" ry="4.68" fill="#F59E0B" stroke="rgba(0,0,0,0.06)" stroke-width="0.5"></rect>
        <circle cx="8" cy="14" r="2.5" fill="#fff"></circle>
        <path d="M10.2 12.3L18 4.5M15.5 7l2.5 2.5M13.8 8.7l2 2" stroke="#fff" stroke-width="1.6" stroke-linecap="round"></path>
      </svg>
    `,
    toolTeams: `
      <svg width="32" height="32" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="1" y="1" width="22" height="22" rx="5.76" ry="5.76" fill="#4B53BC" stroke="rgba(0,0,0,0.06)" stroke-width="0.5"></rect>
        <rect x="10" y="6.5" width="9" height="11" rx="1.4" fill="#fff"></rect>
        <text x="14.5" y="14.6" text-anchor="middle" font-size="8" font-weight="800" fill="#4B53BC" font-family="system-ui, sans-serif">T</text>
        <circle cx="7" cy="9.5" r="2.2" fill="#fff"></circle>
        <rect x="4.5" y="11" width="5" height="5" rx="0.8" fill="#fff"></rect>
      </svg>
    `,
    toolDb: `
      <svg width="32" height="32" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="1" y="1" width="22" height="22" rx="5.76" ry="5.76" fill="#036C70" stroke="rgba(0,0,0,0.06)" stroke-width="0.5"></rect>
        <circle cx="9" cy="11" r="3.6" fill="#fff"></circle>
        <circle cx="14.5" cy="14.5" r="2.6" fill="#fff" opacity="0.85"></circle>
        <circle cx="16.5" cy="9.5" r="1.8" fill="#fff" opacity="0.7"></circle>
      </svg>
    `,
    toolZap: `
      <svg width="32" height="32" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="1" y="1" width="22" height="22" rx="5.76" ry="5.76" fill="#0066FF" stroke="rgba(0,0,0,0.06)" stroke-width="0.5"></rect>
        <path d="M13 4l-7 11h4l-1 5 7-11h-4z" fill="#fff"></path>
      </svg>
    `,
    toolDoc: `
      <svg width="32" height="32" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="1" y="1" width="22" height="22" rx="5.76" ry="5.76" fill="#7C3AED" stroke="rgba(0,0,0,0.06)" stroke-width="0.5"></rect>
        <path d="M8 5h6l3 3v11H8z" fill="#fff"></path>
        <path d="M14 5v4h4" fill="none" stroke="#7C3AED" stroke-width="1.2"></path>
      </svg>
    `,
    toolShield: `
      <svg width="32" height="32" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="1" y="1" width="22" height="22" rx="5.76" ry="5.76" fill="#F33736" stroke="rgba(0,0,0,0.06)" stroke-width="0.5"></rect>
        <path d="M12 4l6 2.3v5.2c0 3.6-2.4 6-6 7-3.6-1-6-3.4-6-7V6.3z" fill="none" stroke="#fff" stroke-width="1.7"></path>
      </svg>
    `
  };

  const inputData = {
    banking: {
      label: "banking",
      industryIcon: "industryBank",
      tools: ["toolTeams", "toolDb", "toolZap"],
      cards: [
        { title: "Loan application.pdf", subtitle: "Application form", icon: "pdf" },
        { title: "Borrower financials.xlsx", subtitle: "P&L, Balance sheet", icon: "xlsx" },
        { title: "KYC documents", subtitle: "ID proof, Address", icon: "kyc" },
        { title: "Credit bureau report", subtitle: "Experian / CIBIL", icon: "bureau" },
        { title: "Email: lending request", subtitle: "From: relationship.mgr", icon: "gmail" },
        { title: "Underwriting policy", subtitle: "Guidelines.pdf", icon: "docBlue" }
      ]
    },

    legal: {
      label: "legal",
      industryIcon: "industryLegal",
      tools: ["toolDoc", "toolDb", "toolZap"],
      cards: [
        { title: "Master services agreement", subtitle: "Client contract", icon: "docPurple" },
        { title: "Statement of work.docx", subtitle: "Scope, fees, timeline", icon: "docBlue" },
        { title: "Clause library", subtitle: "Fallback positions", icon: "pdf" },
        { title: "Regulatory checklist", subtitle: "Compliance requirements", icon: "bureau" },
        { title: "Email: counsel notes", subtitle: "From: legal team", icon: "gmail" },
        { title: "Prior redlines", subtitle: "Negotiation history", icon: "docPurple" }
      ]
    },

    security: {
      label: "security",
      industryIcon: "industrySecurity",
      tools: ["toolShield", "toolDb", "toolZap"],
      cards: [
        { title: "Security questionnaire", subtitle: "Vendor review", icon: "shieldRed" },
        { title: "Access policy", subtitle: "RBAC / SSO rules", icon: "lock" },
        { title: "Audit logs export", subtitle: "Events, sessions", icon: "docBlue" },
        { title: "Pen test report", subtitle: "Findings summary", icon: "pdf" },
        { title: "Encryption keys", subtitle: "KMS / rotation", icon: "key" },
        { title: "SOC 2 evidence", subtitle: "Controls package", icon: "bureau" }
      ]
    }
  };

  let currentIndustry = "";
  let currentPhase = "";

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const getIndustryFromProgress = (p) => {
    if (p < 1 / 3) return { key: "banking", index: 0 };
    if (p < 2 / 3) return { key: "legal", index: 1 };
    return { key: "security", index: 2 };
  };

  const setInputContent = (industryKey) => {
    if (industryKey === currentIndustry) return;

    currentIndustry = industryKey;

    const data = inputData[industryKey];
    if (!data) return;

    inputRail.classList.add("is-switching");
    toolWrap.classList.add("is-switching");

    setTimeout(() => {
      if (industryLabel) industryLabel.textContent = data.label;
      if (industryIcon) industryIcon.innerHTML = icons[data.industryIcon] || "";

      data.cards.forEach((card, index) => {
        if (inputIcons[index]) inputIcons[index].innerHTML = icons[card.icon] || "";
        if (inputTitles[index]) inputTitles[index].textContent = card.title;
        if (inputSubtitles[index]) inputSubtitles[index].textContent = card.subtitle;
      });

      data.tools.forEach((toolKey, index) => {
        if (toolIcons[index]) toolIcons[index].innerHTML = icons[toolKey] || "";
      });

      requestAnimationFrame(() => {
        inputRail.classList.remove("is-switching");
        toolWrap.classList.remove("is-switching");
      });
    }, 180);
  };

  const setPhase = (phase) => {
    if (phase === currentPhase) return;

    currentPhase = phase;

    inputRail.classList.remove("is-active", "is-dimmed");
    toolWrap.classList.remove("is-active", "is-dimmed");

    toolIcons.forEach((icon) => icon.classList.remove("is-active"));

    if (phase === "ingest") {
      inputRail.classList.add("is-active");
      toolWrap.classList.add("is-dimmed");
      if (toolIcons[0]) toolIcons[0].classList.add("is-active");
    } else if (phase === "process") {
      inputRail.classList.add("is-dimmed");
      toolWrap.classList.add("is-active");
      if (toolIcons[1]) toolIcons[1].classList.add("is-active");
    } else if (phase === "output") {
      inputRail.classList.add("is-dimmed");
      toolWrap.classList.add("is-active");
      if (toolIcons[2]) toolIcons[2].classList.add("is-active");
    } else {
      inputRail.classList.add("is-dimmed");
      toolWrap.classList.add("is-dimmed");
      if (toolIcons[2]) toolIcons[2].classList.add("is-active");
    }
  };

  const update = (progress) => {
    const p = clamp(progress, 0, 1);

    const industry = getIndustryFromProgress(p);
    setInputContent(industry.key);

    const segmentStart = industry.index / 3;
    const sub = clamp((p - segmentStart) * 3, 0, 1);

    if (hero) {
      hero.setAttribute("data-industry", industry.key);
    }

    if (sub < 0.20) {
      setPhase("ingest");
    } else if (sub < 0.60) {
      setPhase("process");
    } else if (sub < 0.92) {
      setPhase("output");
    } else {
      setPhase("settle");
    }
  };

  setInputContent("banking");
  setPhase("ingest");

  window.LamaticHero.createScrollTrigger("lamatic-hero-4", {
    trigger: scrollTrack,
    start: "top top",
    end: "bottom bottom",
    scrub: 0.25,
    onUpdate: (self) => {
      update(self.progress);
    }
  });

  window.LamaticHero.refresh();

  window.addEventListener("load", window.LamaticHero.refresh, { once: true });
});

document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  gsap.registerPlugin(ScrollTrigger);

  const scrollTrack = document.querySelector(".scroll-track");
  const chipsWrap = document.querySelector("[data-capability-chips]");

  if (!scrollTrack || !chipsWrap) return;

  const chipEls = chipsWrap.querySelectorAll("[data-capability-chip]");
  const iconEls = chipsWrap.querySelectorAll("[data-capability-icon]");
  const labelEls = chipsWrap.querySelectorAll("[data-capability-label]");

  const icons = {
    doc: `
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"></path>
        <path d="M14 3v5h5"></path>
        <path d="M9 13h6M9 17h4"></path>
      </svg>
    `,
    key: `
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="8" cy="15" r="3"></circle>
        <path d="M10.5 13L20 4M16 8l3 3M14 10l2 2"></path>
      </svg>
    `,
    shield: `
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"></path>
      </svg>
    `,
    check: `
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="9"></circle>
        <path d="M8 12l3 3 5-6"></path>
      </svg>
    `,
    chart: `
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 20h16"></path>
        <path d="M6 16V10M11 16V6M16 16v-4"></path>
      </svg>
    `,
    lock: `
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="10" width="18" height="11" rx="2"></rect>
        <path d="M7 10V7a5 5 0 0 1 10 0v3"></path>
      </svg>
    `,
    zap: `
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M13 3L4 14h7l-1 7 9-12h-7z"></path>
      </svg>
    `
  };

  const capabilityData = {
    banking: [
      { label: "KYC checks", icon: "shield" },
      { label: "Credit policies", icon: "doc" },
      { label: "Decision logs", icon: "check" }
    ],

    legal: [
      { label: "Redline history", icon: "doc" },
      { label: "Clause controls", icon: "shield" },
      { label: "Audit-ready review", icon: "check" }
    ],

    security: [
      { label: "Audit trails", icon: "doc" },
      { label: "E2E encryption", icon: "key" },
      { label: "Access controls", icon: "shield" }
    ]
  };

  let currentIndustry = "";
  let currentMode = "";

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const getIndustryFromProgress = (p) => {
    if (p < 1 / 3) return { key: "banking", index: 0 };
    if (p < 2 / 3) return { key: "legal", index: 1 };
    return { key: "security", index: 2 };
  };

  const setMode = (mode) => {
    if (mode === currentMode) return;

    currentMode = mode;

    chipsWrap.classList.remove("is-preview", "is-active");

    if (mode === "active") {
      chipsWrap.classList.add("is-active");
    } else {
      chipsWrap.classList.add("is-preview");
    }
  };

  const setIndustry = (industryKey) => {
    if (industryKey === currentIndustry) return;

    currentIndustry = industryKey;

    const data = capabilityData[industryKey];
    if (!data) return;

    chipsWrap.classList.add("is-switching");

    setTimeout(() => {
      data.forEach((chip, index) => {
        if (iconEls[index]) iconEls[index].innerHTML = icons[chip.icon] || "";
        if (labelEls[index]) labelEls[index].textContent = chip.label;
      });

      requestAnimationFrame(() => {
        chipsWrap.classList.remove("is-switching");
      });
    }, 160);
  };

  const update = (progress) => {
    const p = clamp(progress, 0, 1);

    const industry = getIndustryFromProgress(p);
    setIndustry(industry.key);

    const segmentStart = industry.index / 3;
    const sub = clamp((p - segmentStart) * 3, 0, 1);

    /*
      Same phase logic as the rest:
      0.00 - 0.20 ingest
      0.20 - 0.60 brain/process
      0.60 - 0.92 output
      0.92 - 1.00 settle
    */
    if (sub >= 0.60) {
      setMode("active");
    } else {
      setMode("preview");
    }
  };

  setIndustry("banking");
  setMode("preview");

  window.LamaticHero.createScrollTrigger("lamatic-hero-5", {
    trigger: scrollTrack,
    start: "top top",
    end: "bottom bottom",
    scrub: 0.25,
    onUpdate: (self) => {
      update(self.progress);
    }
  });

  window.LamaticHero.refresh();

  window.addEventListener("load", window.LamaticHero.refresh, { once: true });
});

document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  gsap.registerPlugin(ScrollTrigger);

  const scrollTrack = document.querySelector(".scroll-track");
  const indicator = document.querySelector("[data-industry-indicator]");

  if (!scrollTrack || !indicator) return;

  const steps = indicator.querySelectorAll("[data-industry-step]");

  let currentIndustry = "";

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const getIndustryFromProgress = (p) => {
    if (p < 1 / 3) return "banking";
    if (p < 2 / 3) return "legal";
    return "security";
  };

  const setIndustry = (industryKey) => {
    if (industryKey === currentIndustry) return;

    currentIndustry = industryKey;

    indicator.classList.add("is-switching");

    steps.forEach((step) => {
      const isActive = step.getAttribute("data-industry-step") === industryKey;
      step.classList.toggle("is-active", isActive);
    });

    setTimeout(() => {
      indicator.classList.remove("is-switching");
    }, 220);
  };

  setIndustry("banking");

  window.LamaticHero.createScrollTrigger("lamatic-hero-6", {
    trigger: scrollTrack,
    start: "top top",
    end: "bottom bottom",
    scrub: 0.25,
    onUpdate: (self) => {
      const p = clamp(self.progress, 0, 1);
      setIndustry(getIndustryFromProgress(p));
    }
  });

  window.LamaticHero.refresh();

  window.addEventListener("load", window.LamaticHero.refresh, { once: true });
});
