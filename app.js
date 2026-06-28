/* Human Design Group — notahuman · interactions */
(() => {
  "use strict";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* year */
  const y = $("[data-year]"); if (y) y.textContent = new Date().getFullYear();

  /* ---- Reveal on scroll ---- */
  const reveals = $$("[data-reveal]");
  if (reduce) {
    reveals.forEach(el => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver((ents) => {
      ents.forEach(e => {
        if (e.isIntersecting) {
          const host = e.target.closest("section") || e.target;
          host.classList.add("is-in");
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(el => io.observe(el));
  }

  /* ---- Stat count-up ---- */
  const stats = $$("[data-count]");
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const prefix = el.dataset.prefix || "";
    const plain = el.dataset.plain === "1"; // years: no grouping
    if (reduce || target === 0) { el.textContent = prefix + (plain ? target : target.toLocaleString()); return; }
    const dur = 1300, t0 = performance.now();
    const ease = t => 1 - Math.pow(1 - t, 3);
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      const v = Math.round(ease(p) * target);
      el.textContent = prefix + (plain ? v : v.toLocaleString());
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (stats.length) {
    const sio = new IntersectionObserver((ents) => {
      ents.forEach(e => { if (e.isIntersecting) { animateCount(e.target); sio.unobserve(e.target); } });
    }, { threshold: 0.6 });
    stats.forEach(s => sio.observe(s));
  }

  /* ---- Header: shrink + hide-on-scroll-down ---- */
  const head = $("[data-head]");
  if (head) {
    let last = 0;
    const onScroll = () => {
      const y = window.scrollY;
      head.classList.toggle("shrink", y > 24);
      if (y > 480 && y > last + 4) head.classList.add("hide");
      else if (y < last - 4 || y < 200) head.classList.remove("hide");
      last = y;
    };
    addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- Magnetic buttons ---- */
  if (!reduce && matchMedia("(pointer:fine)").matches) {
    $$("[data-magnetic]").forEach(el => {
      const str = 0.32;
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * str;
        const yy = (e.clientY - r.top - r.height / 2) * str;
        el.style.transform = `translate(${x}px,${yy}px)`;
      });
      el.addEventListener("pointerleave", () => { el.style.transform = ""; });
    });
  }

  /* ---- Hero agent-network canvas ---- */
  const canvas = $("[data-net]");
  if (canvas && !reduce) {
    const ctx = canvas.getContext("2d");
    let w, h, dpr, nodes = [], links = [], pulses = [], raf, mouse = { x: -1e3, y: -1e3 };
    const INK = "22,24,28", CYAN = "0,148,217";

    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };
    const build = () => {
      const count = Math.round(Math.min(64, Math.max(26, (w * h) / 26000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - .5) * .18, vy: (Math.random() - .5) * .18,
        r: Math.random() * 1.6 + 1, hub: Math.random() < .14
      }));
      pulses = [];
    };
    const step = () => {
      ctx.clearRect(0, 0, w, h);
      // links
      links = [];
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > w) a.vx *= -1;
        if (a.y < 0 || a.y > h) a.vy *= -1;
        // mouse repel (subtle)
        const mdx = a.x - mouse.x, mdy = a.y - mouse.y, md = Math.hypot(mdx, mdy);
        if (md < 120) { a.x += (mdx / md) * .6; a.y += (mdy / md) * .6; }
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 132) {
            const o = (1 - d / 132) * .5;
            ctx.strokeStyle = `rgba(${INK},${o * .5})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
            links.push([a, b]);
          }
        }
      }
      // routing pulses along random links (the "handoff / gateway routing" motif)
      if (links.length && pulses.length < 5 && Math.random() < .04) {
        const [a, b] = links[(Math.random() * links.length) | 0];
        pulses.push({ a, b, t: 0, sp: .012 + Math.random() * .012 });
      }
      pulses = pulses.filter(p => {
        p.t += p.sp; if (p.t >= 1) return false;
        const x = p.a.x + (p.b.x - p.a.x) * p.t, yy = p.a.y + (p.b.y - p.a.y) * p.t;
        ctx.beginPath(); ctx.arc(x, yy, 2.2, 0, 7);
        ctx.fillStyle = `rgba(${CYAN},${.9 * (1 - Math.abs(p.t - .5) * 2 * .4)})`; ctx.fill();
        return true;
      });
      // nodes
      nodes.forEach(n => {
        ctx.beginPath(); ctx.arc(n.x, n.y, n.hub ? n.r + 1.4 : n.r, 0, 7);
        ctx.fillStyle = n.hub ? `rgba(${CYAN},.85)` : `rgba(${INK},.55)`;
        ctx.fill();
        if (n.hub) { ctx.beginPath(); ctx.arc(n.x, n.y, n.r + 5, 0, 7); ctx.strokeStyle = `rgba(${CYAN},.25)`; ctx.lineWidth = 1; ctx.stroke(); }
      });
      raf = requestAnimationFrame(step);
    };
    addEventListener("resize", () => { cancelAnimationFrame(raf); resize(); step(); }, { passive: true });
    canvas.addEventListener("pointermove", e => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
    canvas.addEventListener("pointerleave", () => { mouse.x = mouse.y = -1e3; });
    document.addEventListener("visibilitychange", () => { if (document.hidden) cancelAnimationFrame(raf); else { resize(); step(); } });
    resize(); step();
  }
})();
