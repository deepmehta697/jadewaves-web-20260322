const header = document.querySelector("[data-header]");
const reveals = document.querySelectorAll("[data-reveal]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const requestLinks = document.querySelectorAll("[data-set-request]");
const formTargets = document.querySelectorAll("[data-inquiry-form]");
const yearTargets = document.querySelectorAll("[data-current-year]");
const parallaxNodes = document.querySelectorAll("[data-parallax]");
const routeNetworks = document.querySelectorAll("[data-route-network]");
const portfolioAnchors = document.querySelectorAll(".portfolio-anchor");
const portfolioStages = document.querySelectorAll(".portfolio-stage[id]");
const corridorStages = document.querySelectorAll("[data-corridor-stage]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

requestAnimationFrame(() => {
  document.body.classList.add("is-ready");
});

const syncHeader = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

const syncParallax = () => {
  if (!parallaxNodes.length || prefersReducedMotion.matches) return;

  parallaxNodes.forEach((node) => {
    const speed = Number(node.dataset.parallax || 0.14);
    const rect = node.getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;
    const viewportMid = window.innerHeight / 2;
    const offset = (midpoint - viewportMid) * speed * -0.12;
    node.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
  });
};

const initRouteNetwork = (canvas) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  let width = 0;
  let height = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let frameId = 0;
  let nodes = [];
  let lanes = [];
  let contours = [];

  const density = Number(canvas.dataset.networkDensity || 18);
  const theme = canvas.dataset.networkTheme || "home";
  const mode = canvas.dataset.motionMode || "harbor";
  const palettes = {
    home: { line: "92, 121, 164", glow: "205, 223, 248", node: "255, 255, 255", contour: "110, 140, 184" },
    portfolio: { line: "104, 126, 164", glow: "216, 229, 247", node: "255, 255, 255", contour: "118, 143, 181" },
    silica: { line: "109, 139, 186", glow: "220, 233, 248", node: "255, 255, 255", contour: "115, 149, 198" },
    quartz: { line: "118, 145, 190", glow: "224, 235, 249", node: "255, 255, 255", contour: "125, 154, 197" },
    clay: { line: "124, 138, 168", glow: "225, 231, 239", node: "255, 255, 255", contour: "128, 142, 172" },
    kaolin: { line: "132, 145, 176", glow: "228, 234, 243", node: "255, 255, 255", contour: "138, 151, 183" },
    talc: { line: "128, 143, 179", glow: "226, 233, 243", node: "255, 255, 255", contour: "132, 148, 184" },
    feldspar: { line: "120, 142, 180", glow: "223, 234, 247", node: "255, 255, 255", contour: "128, 150, 191" },
    salt: { line: "132, 150, 184", glow: "231, 238, 247", node: "255, 255, 255", contour: "138, 159, 194" },
    ash: { line: "126, 138, 164", glow: "226, 232, 238", node: "255, 255, 255", contour: "132, 143, 171" },
    copper: { line: "116, 132, 165", glow: "220, 229, 239", node: "255, 255, 255", contour: "122, 138, 171" },
  };
  const palette = palettes[theme] || palettes.home;

  const roundRect = (x, y, w, h, r) => {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  const buildHarbor = () => {
    nodes = [];
    lanes = [];

    const columns = width > 920 ? [0.14, 0.36, 0.62, 0.84] : [0.18, 0.5, 0.82];
    const kinds = columns.length === 4
      ? ["packing", "spec", "port", "shipment"]
      : ["packing", "port", "shipment"];

    columns.forEach((ratio, columnIndex) => {
      const count = Math.max(3, Math.min(6, Math.round(height / density) + (columnIndex % 2)));
      const spread = height / (count + 1);

      for (let row = 0; row < count; row += 1) {
        nodes.push({
          id: `${columnIndex}-${row}`,
          column: columnIndex,
          kind: kinds[columnIndex] || "shipment",
          x: width * ratio + (Math.random() - 0.5) * width * 0.03,
          y: spread * (row + 1) + (Math.random() - 0.5) * spread * 0.22,
          rangeX: 5 + Math.random() * 10,
          rangeY: 4 + Math.random() * 8,
          phase: Math.random() * Math.PI * 2,
          size: 2.4 + Math.random() * 1.6,
        });
      }
    });

    const columnMap = Array.from({ length: columns.length }, () => []);
    nodes.forEach((node) => columnMap[node.column].push(node));
    columnMap.forEach((group) => group.sort((a, b) => a.y - b.y));

    columnMap.forEach((group) => {
      for (let index = 0; index < group.length - 1; index += 1) {
        lanes.push({ a: group[index], b: group[index + 1], emphasis: 0.24 });
      }
    });

    for (let columnIndex = 0; columnIndex < columnMap.length - 1; columnIndex += 1) {
      columnMap[columnIndex].forEach((node, nodeIndex) => {
        const targetGroup = columnMap[columnIndex + 1];
        const connections = [...targetGroup]
          .sort((a, b) => Math.abs(a.y - node.y) - Math.abs(b.y - node.y))
          .slice(0, columnIndex === columnMap.length - 2 ? 2 : 1 + (nodeIndex % 2));

        connections.forEach((target) => {
          lanes.push({
            a: node,
            b: target,
            emphasis: columnIndex === columnMap.length - 2 ? 0.4 : 0.3,
          });
        });
      });
    }

    const deduped = [];
    const seen = new Set();
    lanes.forEach((lane) => {
      const key = [lane.a.id, lane.b.id].sort().join(":");
      if (seen.has(key)) return;
      seen.add(key);
      deduped.push({
        ...lane,
        glowPhase: Math.random() * Math.PI * 2,
      });
    });
    lanes = deduped;
  };

  const buildContour = () => {
    contours = Array.from({ length: Math.max(7, Math.min(12, Math.round(height / 68))) }, (_, index) => ({
      baseY: height * 0.14 + (height * 0.72 / Math.max(6, Math.min(11, Math.round(height / 68)))) * index,
      amp: 8 + (index % 4) * 2.8 + Math.random() * 3.2,
      freq: 0.007 + Math.random() * 0.004,
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 0.45,
      drift: 5 + Math.random() * 8,
      alpha: 0.08 + (index % 3) * 0.025,
      width: 0.9 + (index % 4) * 0.18,
    }));
  };

  const pointFor = (node, time) => ({
    x: node.x + Math.sin(time * 0.00042 + node.phase) * node.rangeX,
    y: node.y + Math.cos(time * 0.00036 + node.phase) * node.rangeY,
  });

  const drawNode = (node, point) => {
    ctx.save();
    ctx.translate(point.x, point.y);
    ctx.fillStyle = "rgba(" + palette.node + ", 0.88)";
    ctx.strokeStyle = "rgba(" + palette.line + ", 0.14)";
    ctx.lineWidth = 0.8;

    if (node.kind === "packing") {
      roundRect(-4.8, -3.3, 9.6, 6.6, 2.3);
      ctx.fill();
      ctx.stroke();
    } else if (node.kind === "port") {
      ctx.rotate(Math.PI / 4);
      roundRect(-3.5, -3.5, 7, 7, 1.8);
      ctx.fill();
      ctx.stroke();
    } else if (node.kind === "shipment") {
      roundRect(-5.3, -2.8, 10.6, 5.6, 2.8);
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, node.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    ctx.restore();
  };

  const drawHarbor = (time = 0) => {
    if (!width || !height) return;
    ctx.clearRect(0, 0, width, height);

    const points = new Map();
    nodes.forEach((node) => points.set(node.id, pointFor(node, time)));

    [
      { x: width * 0.16, y: height * 0.22, r: Math.min(width, height) * 0.18, alpha: 0.055 },
      { x: width * 0.78, y: height * 0.72, r: Math.min(width, height) * 0.22, alpha: 0.045 },
    ].forEach((glow) => {
      const gradient = ctx.createRadialGradient(glow.x, glow.y, 0, glow.x, glow.y, glow.r);
      gradient.addColorStop(0, "rgba(" + palette.glow + ", " + glow.alpha + ")");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(glow.x, glow.y, glow.r, 0, Math.PI * 2);
      ctx.fill();
    });

    lanes.forEach((lane) => {
      const a = points.get(lane.a.id);
      const b = points.get(lane.b.id);
      const shimmer = prefersReducedMotion.matches ? 0.5 : (Math.sin(time * 0.00026 + lane.glowPhase) + 1) / 2;
      const gradient = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
      gradient.addColorStop(0, "rgba(" + palette.line + ", 0.025)");
      gradient.addColorStop(0.5, "rgba(" + palette.line + ", " + (0.08 + lane.emphasis * 0.18 + shimmer * 0.08).toFixed(3) + ")");
      gradient.addColorStop(1, "rgba(" + palette.line + ", 0.03)");
      ctx.strokeStyle = gradient;
      ctx.lineWidth = lane.emphasis > 0.35 ? 1.15 : 0.9;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    });

    nodes.forEach((node) => {
      const point = points.get(node.id);
      const halo = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, 12);
      halo.addColorStop(0, "rgba(" + palette.glow + ", 0.1)");
      halo.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 12, 0, Math.PI * 2);
      ctx.fill();
      drawNode(node, point);
    });
  };

  const drawContour = (time = 0) => {
    if (!width || !height) return;
    ctx.clearRect(0, 0, width, height);

    const driftTime = prefersReducedMotion.matches ? 0 : time * 0.00022;

    [
      { x: width * 0.2, y: height * 0.26, r: Math.min(width, height) * 0.2, alpha: 0.045 },
      { x: width * 0.74, y: height * 0.7, r: Math.min(width, height) * 0.24, alpha: 0.05 },
    ].forEach((glow) => {
      const gradient = ctx.createRadialGradient(glow.x, glow.y, 0, glow.x, glow.y, glow.r);
      gradient.addColorStop(0, "rgba(" + palette.glow + ", " + glow.alpha + ")");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(glow.x, glow.y, glow.r, 0, Math.PI * 2);
      ctx.fill();
    });

    contours.forEach((contour, index) => {
      ctx.beginPath();
      const steps = Math.max(26, Math.round(width / 18));
      for (let step = 0; step <= steps; step += 1) {
        const x = (width / steps) * step;
        const waveA = Math.sin(x * contour.freq + driftTime * contour.speed + contour.phase) * contour.amp;
        const waveB = Math.cos(x * contour.freq * 0.52 - driftTime * contour.speed * 0.78 + contour.phase * 1.2) * contour.amp * 0.56;
        const lift = Math.sin(driftTime * 0.8 + contour.phase) * contour.drift;
        const y = contour.baseY + waveA + waveB + lift;
        if (step === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.strokeStyle = "rgba(" + palette.contour + ", " + contour.alpha + ")";
      ctx.lineWidth = contour.width;
      ctx.stroke();

      if (index % 3 === 0) {
        ctx.beginPath();
        for (let step = 0; step <= steps; step += 1) {
          const x = (width / steps) * step;
          const waveA = Math.sin(x * contour.freq + driftTime * contour.speed + contour.phase + 0.16) * (contour.amp * 0.92);
          const waveB = Math.cos(x * contour.freq * 0.52 - driftTime * contour.speed * 0.78 + contour.phase * 1.2) * contour.amp * 0.42;
          const lift = Math.sin(driftTime * 0.8 + contour.phase) * contour.drift;
          const y = contour.baseY + waveA + waveB + lift + 5.5;
          if (step === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.strokeStyle = "rgba(" + palette.glow + ", 0.09)";
        ctx.lineWidth = 0.9;
        ctx.stroke();
      }
    });
  };

  const draw = (time = 0) => {
    if (mode === "contour") {
      drawContour(time);
    } else {
      drawHarbor(time);
    }
  };

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(260, Math.round(rect.width));
    height = Math.max(180, Math.round(rect.height));
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (mode === "contour") {
      buildContour();
    } else {
      buildHarbor();
    }
    draw(performance.now());
  };

  const loop = (time) => {
    draw(time);
    if (!prefersReducedMotion.matches) {
      frameId = window.requestAnimationFrame(loop);
    }
  };

  resize();
  if (!prefersReducedMotion.matches) {
    frameId = window.requestAnimationFrame(loop);
  }

  const onResize = () => resize();
  window.addEventListener("resize", onResize);

  return () => {
    if (frameId) window.cancelAnimationFrame(frameId);
    window.removeEventListener("resize", onResize);
  };
};

if (reveals.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal", "is-visible");
        }
      });
    },
    { threshold: 0.14 }
  );

  reveals.forEach((element) => {
    element.classList.add("reveal");
    observer.observe(element);
  });
}

if (menuToggle && mobileMenu) {
  const mobileBreakpoint = window.matchMedia("(max-width: 900px)");
  const closeMobileMenu = () => {
    mobileMenu.setAttribute("hidden", "");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  const syncMobileMenuState = () => {
    if (!mobileBreakpoint.matches) {
      closeMobileMenu();
    }
  };

  closeMobileMenu();

  menuToggle.addEventListener("click", () => {
    if (!mobileBreakpoint.matches) {
      closeMobileMenu();
      return;
    }
    const open = mobileMenu.hasAttribute("hidden");
    if (open) {
      mobileMenu.removeAttribute("hidden");
    } else {
      closeMobileMenu();
    }
    menuToggle.setAttribute("aria-expanded", String(open));
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMobileMenu();
    });
  });

  document.addEventListener("click", (event) => {
    if (mobileMenu.hasAttribute("hidden")) return;
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (mobileMenu.contains(target) || menuToggle.contains(target)) return;
    closeMobileMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileMenu();
    }
  });

  if (mobileBreakpoint.addEventListener) {
    mobileBreakpoint.addEventListener("change", syncMobileMenuState);
  } else if (mobileBreakpoint.addListener) {
    mobileBreakpoint.addListener(syncMobileMenuState);
  }
  window.addEventListener("resize", syncMobileMenuState);
}

const initCorridorStage = (stage) => {
  const items = Array.from(stage.querySelectorAll("[data-corridor-item]"));
  if (!items.length) {
    return;
  }

  let activeIndex = items.findIndex((item) => item.classList.contains("is-active"));
  let timerId = 0;

  if (activeIndex < 0) {
    activeIndex = 0;
  }

  const update = (nextIndex) => {
    activeIndex = (nextIndex + items.length) % items.length;

    items.forEach((item, index) => {
      const isActive = index === activeIndex;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });
  };

  const stopAutoplay = () => {
    if (!timerId) return;
    window.clearInterval(timerId);
    timerId = 0;
  };

  const startAutoplay = () => {
    if (prefersReducedMotion.matches || items.length < 2) return;
    stopAutoplay();
    timerId = window.setInterval(() => {
      update(activeIndex + 1);
    }, 3600);
  };

  items.forEach((item, index) => {
    item.addEventListener("click", () => {
      update(index);
      startAutoplay();
    });
  });

  stage.addEventListener("mouseenter", stopAutoplay);
  stage.addEventListener("mouseleave", startAutoplay);
  stage.addEventListener("focusin", stopAutoplay);
  stage.addEventListener("focusout", startAutoplay);

  update(activeIndex);
  startAutoplay();
};

const inquiryEndpoint = "https://jadewaves-crm.pages.dev/api/inquiry";
const fallbackContactMessage = "Please email deep@jadewavesenterprise.com or call +91-999-883-5503.";

const stripHtml = (value) => {
  const template = document.createElement("template");
  template.innerHTML = String(value ?? "");
  return (template.content.textContent || template.innerText || "")
    .replace(/[\u0000-\u001F\u007F]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const sanitizePayload = (data) => {
  const payload = {};

  data.forEach((value, key) => {
    if (key === "g-recaptcha-response") {
      payload[key] = String(value || "").trim();
      return;
    }

    payload[key] = stripHtml(value);
  });

  payload.source_page = window.location.href;
  payload.page_title = document.title;
  return payload;
};

const setRequestType = (requestType) => {
  formTargets.forEach((form) => {
    const select = form.querySelector('[name="request_type"]');
    if (select) {
      select.value = requestType;
    }
  });
};

requestLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const requestType = link.dataset.setRequest;
    if (requestType) {
      setRequestType(requestType);
    }
  });
});

formTargets.forEach((form) => {
  const note = form.querySelector("[data-form-note]");
  const submitButton = form.querySelector('button[type="submit"]');
  note?.setAttribute("aria-live", "polite");

  if (submitButton) {
    submitButton.dataset.defaultLabel = submitButton.textContent.trim();
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!submitButton) return;

    const data = new FormData(form);
    const captchaConfigured = form.dataset.recaptchaConfigured === "true";
    const captchaResponse = data.get("g-recaptcha-response")?.toString().trim() || "";
    const payload = sanitizePayload(data);

    if (!captchaConfigured) {
      if (note) {
        note.textContent = `Form security is not configured yet. ${fallbackContactMessage}`;
      }
      return;
    }

    if (!captchaResponse) {
      if (note) {
        note.textContent = "Please complete the Google reCAPTCHA check before submitting.";
      }
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    if (note) {
      note.textContent = "Sending the inquiry directly. Please wait a moment.";
    }

    try {
      const response = await fetch(inquiryEndpoint, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const result = await response.json().catch(() => null);
      if (!response.ok || result?.success === false || result?.success === "false") {
        throw new Error(result?.message || "Submission failed");
      }

      form.reset();
      if (window.grecaptcha) {
        window.grecaptcha.reset();
      }
  if (note) {
    note.textContent = result?.message || "Inquiry sent. We will review the requirement and respond by email.";
  }
    } catch (error) {
      if (note) {
        note.textContent = error?.message
          ? `${error.message} ${fallbackContactMessage}`
          : `Submission did not go through. ${fallbackContactMessage}`;
      }
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = submitButton.dataset.defaultLabel || "Send Inquiry";
    }
  });
});

yearTargets.forEach((target) => {
  target.textContent = String(new Date().getFullYear());
});

if (portfolioAnchors.length && portfolioStages.length) {
  const anchorMap = new Map(
    Array.from(portfolioAnchors).map((anchor) => [anchor.getAttribute("href"), anchor])
  );

  const setActiveAnchor = (id) => {
    anchorMap.forEach((anchor, href) => {
      anchor.classList.toggle("is-active", href === `#${id}`);
    });
  };

  const stageObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visibleEntry?.target?.id) {
        setActiveAnchor(visibleEntry.target.id);
      }
    },
    {
      rootMargin: "-20% 0px -55% 0px",
      threshold: [0.2, 0.45, 0.7],
    }
  );

  portfolioStages.forEach((stage) => stageObserver.observe(stage));

  const firstStage = portfolioStages[0];
  if (firstStage?.id) {
    setActiveAnchor(firstStage.id);
  }
}

routeNetworks.forEach((canvas) => {
  initRouteNetwork(canvas);
});

corridorStages.forEach((stage) => {
  initCorridorStage(stage);
});

syncHeader();
syncParallax();
window.addEventListener("scroll", syncHeader, { passive: true });
window.addEventListener("scroll", syncParallax, { passive: true });
window.addEventListener("resize", syncParallax);
