/* ============================================================
   Human Design Group — nahOS (notahuman) · Interactive Engine
   Director of Design Standard · Anti-AI Slop · Fluid Apple Motion
   ============================================================ */

(() => {
  "use strict";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* Year */
  const y = $("[data-year]");
  if (y) y.textContent = new Date().getFullYear();

  /* ---- Header: Shrink on Scroll ---- */
  const head = $("[data-head]");
  if (head) {
    let last = 0;
    const onScroll = () => {
      const curY = window.scrollY;
      head.classList.toggle("shrink", curY > 30);
      last = curY;
    };
    addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- Stat Count-Up ---- */
  const stats = $$("[data-count]");
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const prefix = el.dataset.prefix || "";
    if (reduce || target === 0) {
      el.textContent = prefix + target;
      return;
    }
    const dur = 1200, t0 = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      const v = Math.round(ease(p) * target);
      el.textContent = prefix + v;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (stats.length) {
    const sio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          animateCount(e.target);
          sio.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    stats.forEach((s) => sio.observe(s));
  }

  /* ---- Studio Cockpit Tab Switching ---- */
  const cockpitTabs = $$("[data-cockpit-tab]");
  const viewFigma = $("#view-figma");
  const viewStream = $("#view-stream");

  cockpitTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      cockpitTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const target = tab.dataset.cockpitTab;

      if (target === "figma") {
        if (viewFigma) viewFigma.style.display = "flex";
        if (viewStream) viewStream.style.display = "none";
      } else if (target === "stream") {
        if (viewFigma) viewFigma.style.display = "none";
        if (viewStream) viewStream.style.display = "flex";
      } else if (target === "preview") {
        // Toggle side-by-side view
        if (viewFigma) viewFigma.style.display = "flex";
        if (viewStream) viewStream.style.display = "flex";
      }
    });
  });

  /* ---- 9-Stage SDLC Interactive Matrix ---- */
  const sdlcStages = [
    {
      title: "01. Opportunity & Ideation",
      desc: "Autonomous market research, problem framing, and PRD synthesis. Agents scan user needs, competitor gaps, and product requirements to produce a formal PRD and architecture specification.",
      tags: ["PRD Synthesis", "Opportunity Discovery", "User Persona Modeling", "Architecture RFC"],
      code: `// Stage 01: Autonomous Ideation
const opp = await nahMarket.analyze("AgentOS landscape");
const prd = await nahUno.synthesizePRD(opp);
console.log("PRD Generated: 9-Stage Autonomous SDLC");`
    },
    {
      title: "02. Technical Feasibility & Architecture",
      desc: "Deep technical evaluation, cloud cost modeling, dependency verification, and API schema design. Agents evaluate Vertex AI vs local inference and design failover routes.",
      tags: ["Stack Selection", "Cost Modeling", "API Schema Design", "Security Verification"],
      code: `// Stage 02: Feasibility & Verification
const audit = await nahOmo.evaluateStack({
  cloud: "Google Cloud / Cloudflare",
  inference: "Vertex AI Gemini 1.5 Pro",
  memory: "PostgreSQL pgvector"
});
// Feasibility Score: 99.4%`
    },
    {
      title: "03. Rapid Prototyping & Sandboxing",
      desc: "Interactive spikes and throwaway proofs in sandboxed virtual environments. Proving latency, data flows, and state management before writing production code.",
      tags: ["Isolated Sandboxes", "Latency Benchmarking", "Data Flow Proofs", "State Contracts"],
      code: `// Stage 03: Prototyping Spike
const sandbox = await nahRuntime.createSandbox("prototype-v1");
await sandbox.testLatency({ target: "OmniRoute" });
// Result: 12ms average latency confirmed`
    },
    {
      title: "04. The Native Design Layer (Figma & Paper)",
      desc: "Autonomous bi-directional synchronization with Figma canvases and Paper sketches. Translating design tokens, typography scales, layout frames, and responsive variables directly into production-grade HTML/CSS with Google Vertex AI multimodal verification.",
      tags: ["Figma API / MCP", "Paper Live WebUIs", "Multimodal Vision", "Design Token Governance"],
      code: `// Stage 04: Design-to-Code Pipeline
const tokens = await nahFigma.getVariables();
const comp = await nahPaper.renderSidecar(tokens);
verifyVisualParity(comp, { threshold: 0.98 });
// Status: Pixel-perfect parity verified`
    },
    {
      title: "05. Multi-Agent Development",
      desc: "Autonomous development across isolated git worktrees. Agents write modular code, run test suites, execute peer reviews, and verify code diffs before proposing pull requests.",
      tags: ["Git Worktrees", "Test-Driven Development", "Adversarial Code Review", "Deterministic Rails"],
      code: `// Stage 05: Git Worktree Engineering
const worktree = await nahGit.spawnWorktree("feat-agent-ui");
await nahOmo.implement(worktree);
await nahTest.runSuite({ worktree, coverageMin: 0.90 });
// 14/14 Unit & Integration Tests Passed`
    },
    {
      title: "06. Serverless Edge Deployment",
      desc: "Zero-downtime automated deployment to Cloudflare edge workers and Google Cloud Run microservices. Environment secrets managed via encrypted nah-nexus vault.",
      tags: ["Cloudflare Workers", "Google Cloud Run", "nah-nexus Vault", "CI/CD Verification"],
      code: `// Stage 06: Zero-Downtime Deployment
await nahDeploy.push({
  edge: "Cloudflare Workers",
  microservices: "Google Cloud Run",
  ssl: "TLS 1.3 Strict"
});
// Status: Live in 280+ edge data centers`
    },
    {
      title: "07. Production Store & Web Launch",
      desc: "Automated distribution packaging: App Store submission readiness, Product Hunt asset generation, OpenGraph visual card rendering, and press announcement curation.",
      tags: ["Store Packaging", "Product Hunt Assets", "OG Card Rendering", "Distribution Ready"],
      code: `// Stage 07: Launch Engine
const assets = await nahHumano.generateLaunchKit();
await nahLaunch.packageDistribution(assets);
// Generated: Press brief, Product Hunt kit, Store binaries`
    },
    {
      title: "08. Growth Marketing & Brand Voice",
      desc: "Multi-channel content storytelling, SEO structural optimization, customer sentiment tracking, and acquisition telemetry aligned to the Human Design Group brand voice.",
      tags: ["Growth Storytelling", "SEO Structural Schema", "Sentiment Telemetry", "Brand Voice"],
      code: `// Stage 08: Growth & Marketing
await nahMarketing.publishCampaign({
  voice: "Authentic, high-craft, visionary",
  channels: ["Technical X", "GitHub", "Product Communities"]
});
// Telemetry active: 0 tracking pixels, 100% privacy-first`
    },
    {
      title: "09. Continuous Autonomous Iteration",
      desc: "Real-time error trace telemetry, customer feedback synthesis, and performance monitoring automatically ingested into the backlog to trigger the next product cycle.",
      tags: ["Telemetry Synthesis", "Error Trace Ingestion", "Automated Backlogs", "Closed-Loop Evolution"],
      code: `// Stage 09: Closed-Loop Evolution
const telemetry = await nahOptics.getTelemetry();
if (telemetry.hasOptimizations) {
  await nahUno.queueNextCycle(telemetry.recommendations);
}
// Closed loop: Iteration begins again`
    }
  ];

  const sdlcBtns = $$(".sdlc-btn");
  const stageTitle = $("#sdlc-stage-title");
  const stageDesc = $("#sdlc-stage-desc");
  const stageTags = $("#sdlc-stage-tags");
  const stageVisual = $("#sdlc-stage-visual");

  sdlcBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      sdlcBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const idx = parseInt(btn.dataset.stage, 10);
      const data = sdlcStages[idx];

      if (stageTitle) stageTitle.textContent = data.title;
      if (stageDesc) stageDesc.textContent = data.desc;
      if (stageTags) {
        stageTags.innerHTML = data.tags.map((t) => `<span class="sdlc-tag">${t}</span>`).join("");
      }
      if (stageVisual) {
        stageVisual.innerHTML = `<pre><code>${data.code}</code></pre>`;
      }
    });
  });

  /* ---- Hero Neural Network Background Canvas ---- */
  const canvas = $("[data-net]");
  if (canvas && !reduce) {
    const ctx = canvas.getContext("2d");
    let w, h, dpr, nodes = [], links = [], pulses = [], raf;
    const CYAN = "0,148,217", YELLOW = "255,242,0", BLUE = "0,88,129";

    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };

    const build = () => {
      const count = Math.round(Math.min(50, Math.max(22, (w * h) / 28000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 2 + 1,
        hub: Math.random() < 0.18
      }));
      pulses = [];
    };

    const step = () => {
      ctx.clearRect(0, 0, w, h);
      links = [];
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        a.x += a.vx;
        a.y += a.vy;
        if (a.x < 0 || a.x > w) a.vx *= -1;
        if (a.y < 0 || a.y > h) a.vy *= -1;

        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 140) {
            const o = (1 - d / 140) * 0.35;
            ctx.strokeStyle = `rgba(${CYAN}, ${o})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
            links.push([a, b]);
          }
        }
      }

      // Live Agent Routing Pulses
      if (links.length && pulses.length < 6 && Math.random() < 0.05) {
        const [a, b] = links[(Math.random() * links.length) | 0];
        pulses.push({ a, b, t: 0, sp: 0.015 + Math.random() * 0.015, col: Math.random() < 0.2 ? YELLOW : CYAN });
      }

      pulses = pulses.filter((p) => {
        p.t += p.sp;
        if (p.t >= 1) return false;
        const px = p.a.x + (p.b.x - p.a.x) * p.t;
        const py = p.a.y + (p.b.y - p.a.y) * p.t;
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.col}, 0.9)`;
        ctx.fill();
        return true;
      });

      // Draw Nodes
      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.hub ? n.r + 2 : n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.hub ? `rgba(${CYAN}, 0.95)` : `rgba(${BLUE}, 0.7)`;
        ctx.fill();
        if (n.hub) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r + 6, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${CYAN}, 0.3)`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      raf = requestAnimationFrame(step);
    };

    addEventListener("resize", () => {
      cancelAnimationFrame(raf);
      resize();
      step();
    }, { passive: true });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else { resize(); step(); }
    });

    resize();
    step();
  }
})();
