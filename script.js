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
const galleries = document.querySelectorAll("[data-gallery]");
const gradeWheels = document.querySelectorAll("[data-grade-wheel]");
const corridorStages = document.querySelectorAll("[data-corridor-stage]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const inquiryEndpoint = "https://formsubmit.co/ajax/deep@jadewavesenterprise.com";
const inquiryFallbackEmail = "deep@jadewavesenterprise.com";
const inquiryFallbackPhone = "+91-999-883-5503";
const inquiryAttachmentAccept = ".pdf,.png,.jpg,.jpeg";
const productDocumentCatalog = {
  "/products/silica-sand/": {
    tds: "/assets/tds/silica-sand-technical-data-sheet.pdf",
    sampleCoa: "/assets/coas/silica-sand-sample-coa.pdf",
  },
  "/products/silica-flour/": {
    tds: "/assets/tds/silica-flour-technical-data-sheet.pdf",
    sampleCoa: "/assets/coas/silica-flour-sample-coa.pdf",
  },
  "/products/quartz-sand-for-ceramics/": {
    tds: "/assets/tds/quartz-sand-technical-data-sheet.pdf",
    sampleCoa: "/assets/coas/quartz-sand-sample-coa.pdf",
  },
  "/products/bentonite/": {
    tds: "/assets/tds/bentonite-technical-data-sheet.pdf",
    sampleCoa: "/assets/coas/bentonite-sample-coa.pdf",
  },
  "/products/kaolin--china-clay/": {
    tds: "/assets/tds/china-clay-technical-data-sheet.pdf",
    sampleCoa: "/assets/coas/china-clay-sample-coa.pdf",
  },
  "/products/talc/": {
    tds: "/assets/tds/talc-technical-data-sheet.pdf",
    sampleCoa: "/assets/coas/talc-sample-coa.pdf",
  },
  "/products/feldspar/": {
    tds: "/assets/tds/feldspar-technical-data-sheet.pdf",
    sampleCoa: "/assets/coas/feldspar-sample-coa.pdf",
  },
  "/products/salt/": {
    tds: "/assets/tds/salt-technical-data-sheet.pdf",
    sampleCoa: "/assets/coas/salt-sample-coa.pdf",
  },
  "/products/fly-ash/": {
    tds: "/assets/tds/fly-ash-technical-data-sheet.pdf",
    sampleCoa: "/assets/coas/fly-ash-sample-coa.pdf",
  },
  "/products/copper-slag/": {
    tds: "/assets/tds/copper-slag-technical-data-sheet.pdf",
    sampleCoa: "/assets/coas/copper-slag-sample-coa.pdf",
  },
};

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

const setFormMessage = (note, state, text) => {
  if (!note) return;
  note.textContent = text;
  note.dataset.state = state;
  note.classList.toggle("is-success", state === "success");
  note.classList.toggle("is-error", state === "error");
  note.classList.toggle("is-loading", state === "loading");
};

const ensureAttachmentField = (form) => {
  const grid = form.querySelector(".form-grid");
  if (!grid || grid.querySelector("[data-attachment-field]")) return;

  const label = document.createElement("label");
  label.className = "form-grid__wide form-grid__attachment";
  label.dataset.attachmentField = "true";

  const title = document.createElement("span");
  title.textContent = "Attach File";

  const input = document.createElement("input");
  input.type = "file";
  input.name = "attachment";
  input.accept = inquiryAttachmentAccept;

  const caption = document.createElement("small");
  caption.className = "form-field-help";
  caption.textContent = "Optional. PDF, JPG, or PNG if you want to share a spec sheet, image, or marked requirement.";

  label.append(title, input, caption);
  grid.append(label);
};

const ensureHoneypotField = (form) => {
  if (form.querySelector('input[name="_honey"]')) return;
  const honeypot = document.createElement("input");
  honeypot.type = "text";
  honeypot.name = "_honey";
  honeypot.tabIndex = -1;
  honeypot.autocomplete = "off";
  honeypot.setAttribute("aria-hidden", "true");
  honeypot.style.position = "absolute";
  honeypot.style.left = "-9999px";
  honeypot.style.opacity = "0";
  form.prepend(honeypot);
};

const initProductDocumentActions = () => {
  const config = productDocumentCatalog[window.location.pathname];
  if (!config) return;

  const supplyCard = Array.from(document.querySelectorAll(".product-sheet"))
    .find((sheet) => sheet.querySelector(".section-label")?.textContent.trim() === "Supply Snapshot");

  const supplySection = supplyCard?.closest(".section-block");
  if (!supplySection || supplySection.nextElementSibling?.classList.contains("section-block--documents")) return;

  const docsSection = document.createElement("section");
  docsSection.className = "section-block section-block--documents";

  const shell = document.createElement("div");
  shell.className = "shell";

  const band = document.createElement("div");
  band.className = "product-documents-band";

  const intro = document.createElement("div");
  intro.className = "product-documents-band__intro";

  const label = document.createElement("p");
  label.className = "document-actions-label";
  label.textContent = "Client Documents";

  const actions = document.createElement("div");
  actions.className = "document-actions";

  if (config.tds) {
    const tdsLink = document.createElement("a");
    tdsLink.className = "doc-action";
    tdsLink.href = config.tds;
    tdsLink.target = "_blank";
    tdsLink.rel = "noopener noreferrer";
    tdsLink.textContent = "Open TDS";
    actions.append(tdsLink);
  }

  if (config.sampleCoa) {
    const coaLink = document.createElement("a");
    coaLink.className = "doc-action doc-action--ghost";
    coaLink.href = config.sampleCoa;
    coaLink.target = "_blank";
    coaLink.rel = "noopener noreferrer";
    coaLink.textContent = "Open Sample COA";
    actions.append(coaLink);
  }

  intro.append(label);
  band.append(intro, actions);
  shell.append(band);
  docsSection.append(shell);
  supplySection.after(docsSection);
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
  mobileMenu.setAttribute("hidden", "");

  menuToggle.addEventListener("click", () => {
    const open = mobileMenu.hasAttribute("hidden");
    if (open) {
      mobileMenu.removeAttribute("hidden");
    } else {
      mobileMenu.setAttribute("hidden", "");
    }
    menuToggle.setAttribute("aria-expanded", String(open));
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.setAttribute("hidden", "");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const setRequestType = (requestType) => {
  formTargets.forEach((form) => {
    const select = form.querySelector('[name="request_type"]');
    if (select) {
      select.value = requestType;
    }
  });
};

const initProductGallery = (gallery) => {
  const viewport = gallery.querySelector(".product-gallery__viewport");
  const track = gallery.querySelector("[data-gallery-track]");
  const slides = Array.from(gallery.querySelectorAll("[data-gallery-slide]"));
  const dots = Array.from(gallery.querySelectorAll("[data-gallery-dot]"));
  const prevButton = gallery.querySelector("[data-gallery-prev]");
  const nextButton = gallery.querySelector("[data-gallery-next]");
  const interval = Number(gallery.dataset.galleryInterval || 5200);
  const autoplayMode = (gallery.dataset.galleryAutoplay || "auto").toLowerCase();

  if (!viewport || !track || slides.length < 2) {
    return;
  }

  let activeIndex = 0;
  let timerId = 0;
  let slideWidth = 0;

  const measure = () => {
    const nextWidth = Math.round(viewport.getBoundingClientRect().width);
    if (!nextWidth) return;
    slideWidth = nextWidth;
    track.style.width = `${slideWidth * slides.length}px`;
    slides.forEach((slide) => {
      slide.style.flex = `0 0 ${slideWidth}px`;
      slide.style.minWidth = `${slideWidth}px`;
      slide.style.width = `${slideWidth}px`;
    });
    track.style.transform = `translate3d(${-activeIndex * slideWidth}px, 0, 0)`;
  };

  const update = (nextIndex) => {
    activeIndex = (nextIndex + slides.length) % slides.length;
    if (!slideWidth) {
      measure();
    }
    track.style.transform = `translate3d(${-activeIndex * slideWidth}px, 0, 0)`;

    slides.forEach((slide, index) => {
      slide.setAttribute("aria-hidden", String(index !== activeIndex));
    });

    dots.forEach((dot, index) => {
      const isActive = index === activeIndex;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-selected", String(isActive));
      dot.setAttribute("tabindex", isActive ? "0" : "-1");
    });
  };

  const stopAutoplay = () => {
    if (!timerId) return;
    window.clearInterval(timerId);
    timerId = 0;
  };

  const startAutoplay = () => {
    if (autoplayMode === "manual" || autoplayMode === "false") return;
    if (prefersReducedMotion.matches || slides.length < 2) return;
    stopAutoplay();
    timerId = window.setInterval(() => {
      update(activeIndex + 1);
    }, interval);
  };

  prevButton?.addEventListener("click", () => {
    update(activeIndex - 1);
    startAutoplay();
  });

  nextButton?.addEventListener("click", () => {
    update(activeIndex + 1);
    startAutoplay();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      update(index);
      startAutoplay();
    });
  });

  gallery.addEventListener("mouseenter", stopAutoplay);
  gallery.addEventListener("mouseleave", startAutoplay);
  gallery.addEventListener("focusin", stopAutoplay);
  gallery.addEventListener("focusout", startAutoplay);

  window.addEventListener("resize", measure, { passive: true });

  measure();
  update(0);
  startAutoplay();
};

const initGradeWheel = (stage) => {
  const items = Array.from(stage.querySelectorAll("[data-grade-item]"));
  const count = stage.querySelector("[data-grade-count]");
  const title = stage.querySelector("[data-grade-title]");
  const copy = stage.querySelector("[data-grade-copy]");
  const interval = 2800;

  if (!items.length || !count || !title || !copy) {
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

    const activeItem = items[activeIndex];
    count.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`;
    title.textContent = activeItem.dataset.gradeTitle || "";
    copy.textContent = activeItem.dataset.gradeCopy || "";
    stage.style.setProperty("--grade-focus-angle", activeItem.style.getPropertyValue("--grade-angle").trim() || "-90deg");
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
    }, interval);
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

  ensureHoneypotField(form);
  ensureAttachmentField(form);
  note?.setAttribute("aria-live", "polite");

  if (submitButton) {
    submitButton.dataset.defaultLabel = submitButton.textContent.trim();
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!submitButton) return;

    const data = new FormData(form);
    const requestType = data.get("request_type")?.toString().trim() || "Inquiry";
    const product = data.get("product")?.toString().trim() || "Not specified";
    const name = data.get("name")?.toString().trim() || "Buyer";
    const company = data.get("company")?.toString().trim() || "Not specified";
    const email = data.get("email")?.toString().trim() || "Not provided";
    const phone = data.get("phone")?.toString().trim() || "Not provided";
    const application = data.get("application")?.toString().trim() || "Not specified";
    const volume = data.get("volume")?.toString().trim() || "Not specified";
    const destination = data.get("destination")?.toString().trim() || "Not specified";
    const packingSize = data.get("packing_size")?.toString().trim() || "Not specified";
    const notes = data.get("notes")?.toString().trim() || "Not provided";

    data.append("_subject", `${requestType} | ${product}`);
    data.append("_template", "table");
    data.append("_captcha", "false");
    data.append("_replyto", email);
    data.append("Source Page", window.location.href);
    data.append("Page Title", document.title);
    data.set("Requirement", notes);
    data.set("Destination / Port", destination);
    data.set("Packing Size", packingSize);

    submitButton.disabled = true;
    submitButton.classList.add("is-loading");
    submitButton.textContent = "Sending...";
    form.classList.add("is-submitting");
    setFormMessage(note, "loading", "Sending the inquiry directly. Please wait a moment.");

    try {
      const response = await fetch(inquiryEndpoint, {
        method: "POST",
        body: data,
        headers: {
          Accept: "application/json",
        },
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || result?.success === false || result?.success === "false") {
        throw new Error(result?.message || "Submission failed");
      }

      form.reset();
      setFormMessage(
        note,
        "success",
        "Inquiry sent. We’ll review the requirement and respond by email."
      );
    } catch (error) {
      setFormMessage(
        note,
        "error",
        `Submission did not go through. Please email ${inquiryFallbackEmail} or call ${inquiryFallbackPhone}.`
      );
    } finally {
      submitButton.disabled = false;
      submitButton.classList.remove("is-loading");
      submitButton.textContent = submitButton.dataset.defaultLabel || "Send Inquiry";
      form.classList.remove("is-submitting");
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

galleries.forEach((gallery) => {
  initProductGallery(gallery);
});

gradeWheels.forEach((wheel) => {
  initGradeWheel(wheel);
});

corridorStages.forEach((stage) => {
  initCorridorStage(stage);
});

initProductDocumentActions();
syncHeader();
syncParallax();
window.addEventListener("scroll", syncHeader, { passive: true });
window.addEventListener("scroll", syncParallax, { passive: true });
window.addEventListener("resize", syncParallax);
