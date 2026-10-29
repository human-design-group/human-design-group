/* ============================================================
   Human Design Group — nahOS (notahuman) · Studio Cockpit Engine
   Director of Design Standard · Anti-AI Slop · Impeccable Craft
   ============================================================ */

(() => {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const prefersReducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Dynamic Year ---- */
  const yearEl = $("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Stat Count-Up Animation (Miller's Law / Doherty) ---- */
  const statNumbers = $$("[data-count]");
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    if (prefersReducedMotion || target === 0) {
      el.textContent = target;
      return;
    }
    const duration = 1200;
    const start = performance.now();
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const step = (now) => {
      const elapsed = Math.min(1, (now - start) / duration);
      const val = Math.round(easeOutCubic(elapsed) * target);
      el.textContent = val;
      if (elapsed < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if (statNumbers.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    statNumbers.forEach((el) => observer.observe(el));
  }

  /* ---- Studio Cockpit Mode Tabs (Sub-100ms Switching) ---- */
  const modeTabs = $$(".mode-tab");
  const views = {
    canvas: $("#view-canvas"),
    diff: $("#view-diff"),
    stream: $("#view-stream")
  };

  modeTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetMode = tab.dataset.mode;
      modeTabs.forEach((t) => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");

      Object.entries(views).forEach(([modeKey, viewEl]) => {
        if (viewEl) {
          if (modeKey === targetMode) {
            viewEl.classList.add("active");
          } else {
            viewEl.classList.remove("active");
          }
        }
      });
    });
  });

  /* ---- Interactive Token Controls (Mode 1: Canvas) ---- */
  const radiusSlider = $("#token-radius-slider");
  const radiusReadout = $("#radius-readout");
  const interactiveCard = $("#interactive-card");

  if (radiusSlider && interactiveCard && radiusReadout) {
    radiusSlider.addEventListener("input", (e) => {
      const val = e.target.value;
      radiusReadout.textContent = `${val}px`;
      interactiveCard.style.borderRadius = `${val}px`;
    });
  }

  /* ---- Multimodal Visual QA Diff Slider (Mode 2: Diff) ---- */
  const diffStage = $("#diff-stage");
  const diffAfterLayer = $("#diff-after-layer");
  const diffHandle = $("#diff-handle");

  if (diffStage && diffAfterLayer && diffHandle) {
    let isDragging = false;

    const updateSlider = (clientX) => {
      const rect = diffStage.getBoundingClientRect();
      const rawX = clientX - rect.left;
      const clampedX = Math.max(0, Math.min(rawX, rect.width));
      const percentage = (clampedX / rect.width) * 100;

      diffHandle.style.left = `${percentage}%`;
      diffAfterLayer.style.clipPath = `polygon(${percentage}% 0, 100% 0, 100% 100%, ${percentage}% 100%)`;
    };

    // Mouse Listeners
    diffStage.addEventListener("mousedown", (e) => {
      isDragging = true;
      updateSlider(e.clientX);
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      updateSlider(e.clientX);
    });

    window.addEventListener("mouseup", () => {
      isDragging = false;
    });

    // Touch Listeners
    diffStage.addEventListener("touchstart", (e) => {
      isDragging = true;
      if (e.touches[0]) updateSlider(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener("touchmove", (e) => {
      if (!isDragging || !e.touches[0]) return;
      updateSlider(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener("touchend", () => {
      isDragging = false;
    });
  }

  /* ---- 9-Stage SDLC Scrubber Data & Controller ---- */
  const sdlcStages = [
    {
      num: "STAGE 01 OF 09",
      title: "Opportunity Discovery & PRD Synthesis",
      lead: "Uno (Chief of Staff & Orchestration)",
      desc: "Autonomous market research, problem framing, and PRD synthesis. Agents scan user pain points, competitor gaps, and product requirements to produce a formal PRD and architecture RFC specification.",
      tags: ["PRD Synthesis", "Opportunity Modeling", "Architecture RFC", "Cost Projection"],
      fileName: "orchestration/01-ideation.ts",
      code: `// Stage 01: Opportunity & PRD Synthesis
const opportunity = await nahMarket.analyze("Autonomous AgentOS Landscape");
const prd = await nahUno.synthesizePRD({
  target: "Solo Product Creators",
  requirements: opportunity.coreGaps
});
console.log("PRD Approved. Dispatching to Stage 02: Feasibility.");`
    },
    {
      num: "STAGE 02 OF 09",
      title: "Technical Feasibility & Cost Modeling",
      lead: "Omo (Lead Developer & Systems Architect)",
      desc: "Deep technical evaluation, cloud compute modeling, dependency verification, and API schema design. Evaluates Google Vertex AI vs local inference and designs ordered fallback gateways.",
      tags: ["Stack Selection", "Cloud Cost Modeling", "API Schemas", "Security Clearance"],
      fileName: "orchestration/02-feasibility.ts",
      code: `// Stage 02: Feasibility & Verification
const stack = await nahOmo.evaluateStack({
  inference: "Google Vertex AI (Gemini 1.5 Pro & Flash)",
  database: "Cloud SQL PostgreSQL + pgvector",
  edge: "Cloudflare Workers & Assets"
});
assert(stack.p99LatencyMs < 250, "Latency ceiling met");`
    },
    {
      num: "STAGE 03 OF 09",
      title: "Rapid Interactive Prototyping",
      lead: "Astro & Omo (Engineering & Design Team)",
      desc: "Generates functional HTML/CSS/JS prototype harnesses in sandboxed browser sidecars. Validates key interaction flows, state transitions, and responsive behavior with human-in-the-loop review.",
      tags: ["Interactive Wireframes", "Browser Sandboxes", "State Machines", "Human Sign-off"],
      fileName: "orchestration/03-prototyping.ts",
      code: `// Stage 03: Interactive Browser Sandbox
const prototype = await nahSandbox.create({
  template: "edge-vanilla",
  spec: prd.interactionFlows
});
await prototype.renderSidecar();
console.log("Interactive prototype live on http://localhost:8080");`
    },
    {
      num: "STAGE 04 OF 09",
      title: "The Native Design Layer (Figma & Paper)",
      lead: "Astro (AI Systems & Design Architect)",
      desc: "Autonomous bi-directional synchronization with Figma canvases and Paper sketches. Translates typography scales (Calvert MT + Aktiv Grotesk), layout frames, and color palettes into living CSS variables with Google Vertex AI multimodal verification.",
      tags: ["Figma API Sync", "Paper Live WebUIs", "Multimodal Vision", "Design System Invariants"],
      fileName: "orchestration/04-design-layer.ts",
      code: `// Stage 04: Design-to-Code Pipeline
const tokens = await nahFigma.getVariables({ fileKey: "nahOS-Core" });
const sidecar = await nahPaper.renderSidecar(tokens);
const audit = await vertexAI.verifyParity(tokens, sidecar);
assert(audit.score >= 0.98, "Visual parity threshold met (99.8%)");`
    },
    {
      num: "STAGE 05 OF 09",
      title: "Multi-Agent Git Worktree Development",
      lead: "Omo & Kodo (Implementation Specialists)",
      desc: "Engineers the production codebase across isolated Git worktrees. Test-driven development with automated pre-commit linters, unit tests, and adversarial code reviews before generating pull requests.",
      tags: ["Git Worktree Isolation", "TDD Test Suites", "Adversarial Code Review", "Zero Race Conditions"],
      fileName: "orchestration/05-development.ts",
      code: `// Stage 05: Isolated Concurrency
const worktree = await nahGit.createWorktree("feat-studio-engine");
await nahKodo.implementComponents(worktree, tokens);
const testSuite = await nahOmo.runTests(worktree);
assert(testSuite.passed === 18, "All 18 regression suites passed");`
    },
    {
      num: "STAGE 06 OF 09",
      title: "Automated Edge & Cloud Deployment",
      lead: "Uno & Omo (DevOps & Infrastructure)",
      desc: "Containerized deployment to Cloudflare edge networks and Google Cloud Run. Verifies SSL certificates, custom DNS hostnames, database migrations, and health check endpoints.",
      tags: ["Cloudflare Workers", "Google Cloud Run", "Automated SSL", "Health Check Probes"],
      fileName: "orchestration/06-deployment.ts",
      code: `// Stage 06: Zero-Downtime Deployment
const deploy = await nahDeploy.push({
  worker: "thehumandesigngroup",
  assets: "./dist",
  domain: "thehumandesigngroup.com"
});
assert(deploy.statusCode === 200, "Production edge responding OK");`
    },
    {
      num: "STAGE 07 OF 09",
      title: "Production Store & Ecosystem Launch",
      lead: "Humano (Community & Experience Design)",
      desc: "Packaging distribution assets, App Store / Chrome Web Store submissions, Product Hunt kits, social release cards, and investor/community launch announcements.",
      tags: ["Product Hunt Kit", "Release Notes", "Store Packaging", "Social Distribution"],
      fileName: "orchestration/07-launch.ts",
      code: `// Stage 07: Public Launch & Packaging
const kit = await nahHumano.generateLaunchKit({
  product: "nahOS Studio v6.0",
  channels: ["ProductHunt", "X/Twitter", "LinkedIn", "GitHub"]
});
console.log("Release package compiled with verified brand assets.");`
    },
    {
      num: "STAGE 08 OF 09",
      title: "Growth Marketing & Distribution Loops",
      lead: "Humano & Uno (Growth Operations)",
      desc: "Automated user acquisition analysis, conversion telemetry, documentation indexing, and community feedback synthesis to inform ongoing roadmap prioritization.",
      tags: ["Conversion Telemetry", "User Feedback Synthesis", "Docs Indexing", "Roadmap Steering"],
      fileName: "orchestration/08-marketing.ts",
      code: `// Stage 08: Growth Telemetry
const telemetry = await nahAnalytics.getMetrics();
const sentiment = await nahHumano.synthesizeUserFeedback(telemetry);
console.log("Customer feedback parsed into 3 feature requests.");`
    },
    {
      num: "STAGE 09 OF 09",
      title: "Continuous Synthesis & Iteration",
      lead: "Uno & Astro (Executive Steering)",
      desc: "Feeds production telemetry and error logs back into the Second Brain (pgvector). Begins the next iteration loop automatically, ensuring continuous product refinement.",
      tags: ["Second Brain Recall", "Post-Mortem Archiving", "Continuous Improvement", "Closed Loop"],
      fileName: "orchestration/09-iteration.ts",
      code: `// Stage 09: Closed-Loop Second Brain Indexing
await nahKnows.ingestPostMortem({
  version: "v6.0",
  learnings: ["Zero layout shift verified", "Sub-200ms latency maintained"]
});
console.log("Cycle complete. nahOS initiates next product sprint.");`
    }
  ];

  const scrubberSteps = $$(".scrubber-step");
  const dossierNum = $("#dossier-num");
  const dossierTitle = $("#dossier-title");
  const dossierLead = $("#dossier-lead");
  const dossierDesc = $("#dossier-desc");
  const dossierTags = $("#dossier-tags");
  const dossierFileTitle = $("#dossier-file-title");
  const dossierCode = $("#dossier-code");

  scrubberSteps.forEach((step) => {
    step.addEventListener("click", () => {
      const idx = parseInt(step.dataset.stage, 10);
      if (isNaN(idx) || !sdlcStages[idx]) return;

      scrubberSteps.forEach((s) => {
        s.classList.remove("active");
        s.setAttribute("aria-selected", "false");
      });
      step.classList.add("active");
      step.setAttribute("aria-selected", "true");

      const data = sdlcStages[idx];
      if (dossierNum) dossierNum.textContent = data.num;
      if (dossierTitle) dossierTitle.textContent = data.title;
      if (dossierLead) dossierLead.textContent = data.lead;
      if (dossierDesc) dossierDesc.textContent = data.desc;
      if (dossierFileTitle) dossierFileTitle.textContent = data.fileName;
      if (dossierCode) dossierCode.textContent = data.code;

      if (dossierTags) {
        dossierTags.innerHTML = data.tags
          .map((tag) => `<span class="d-tag">${tag}</span>`)
          .join("");
      }
    });
  });

})();
