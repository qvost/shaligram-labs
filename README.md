# Shaligram Labs

Shaligram Labs is an independent research lab based in Kathmandu, Nepal, focused on deterministic foundations and runtime infrastructure for autonomous agents.

This repository contains the web platform and interactive research publication for **Reify**, an edge compiler that synthesizes ephemeral, task-scoped Model Context Protocol (MCP) servers from live web application traffic.

---

## Thesis

Current web agents face a structural dilemma: hand-crafting static tool definitions consumes thousands of context tokens before execution begins, while visual browser-use agents suffer from high latency, non-deterministic action spaces, and significant cost per step.

Reify treats the live web as an implicit API. By intercepting HTTP and Server-Side Rendering (SSR) hydration state at the socket layer, Reify parameterizes dynamic routes and deterministically induces Draft 2020-12 JSON Schemas. Sprawling backend interfaces are pruned down to 3–5 task-scoped endpoints exposed over a stateless Streamable HTTP MCP server in Rust.

```
Unstructured Web Traffic (1,420 frames)
   │
   ├── [01] Wire Interception (zero-browser hydration sniffer; visual assets dropped)
   ├── [02] Dynamic Path Clustering (UUID/integer route collapse)
   ├── [03] Deterministic Schema Induction (Draft 2020-12 types inferred from payloads)
   └── [04] Stateless MCP Mount (Axum Streamable HTTP endpoint)
   │
Task-Scoped Tools (4 tools · 380 tokens · 4.1 µs dispatch)
```

### Benchmark Summary (Author-Reported)

| Metric | Visual Browser-Use | Full Static MCP | Reify (SSR) |
| :--- | :--- | :--- | :--- |
| **Initial Schema Tokens** | 0 | 24,100 | **380** (-98.4%) |
| **Task Completion Rate** | 61.0% | 89.0% | **92.5%** |
| **Cold Compilation** | — | Manual | **14.8 ms** |
| **Warm Dispatch Latency** | — | 420.0 µs | **4.1 µs** |

*Note: Aggregate evaluation conducted across 20 web applications using Claude 3.5 Sonnet. Warm latency represents in-process Axum microbenchmarks. Detailed methodology and limitations are documented in [`public/reify_paper.tex`](public/reify_paper.tex) and the interactive [`/research`](app/research/page.tsx) interface.*

---

## Site Architecture

The platform is built with the Next.js 15 App Router as a fully static export (`output: 'export'`), designed with an editorial, paper-and-stone aesthetic reflecting the Kali Gandaki shaligram stones.

```
shaligram-labs/
├── app/
│   ├── layout.tsx              # Root HTML shell, typography, and metadata
│   ├── page.tsx                # Home: Hero wire visualization and compiler pipeline
│   ├── research/               # Living paper: Interactive trade-off curve, benchmarks, citation
│   ├── systems/reify/          # Reify compiler: Terminal simulation and agent configurations
│   ├── manifesto/              # Core philosophy: "Intelligence scales. Foundations endure."
│   └── globals.css             # Semantic styles, typography scale, responsive breakpoints
├── components/
│   ├── shell.tsx               # Lenis scroll coordination, GSAP curtain transitions, SplitText reveals
│   ├── home.tsx                # Wire vector graphic, pinned horizontal pipeline track
│   ├── research.tsx            # Benchmark filters, trade-off SVG scatter-plot, trace simulator
│   ├── research-controls.tsx   # Measured-geometry IntegrationTabs and native BudgetScrubber
│   ├── quickstart.tsx          # Terminal session replay, multi-client MCP snippets
│   ├── lab-cursor.tsx          # Physics-damped pointer with context-aware morphing modes
│   └── lab-mark.tsx            # SVG identity mark
├── docs/
│   └── component-provenance.md # Adaptation notes, accessibility verification, and design specs
└── public/
    └── reify_paper.tex         # LaTeX publication source
```

### Key Technical Implementations

- **Lenis & ScrollTrigger Integration**: Native scroll position is continuously piped to GSAP `ScrollTrigger` instances across page transitions.
- **Font-Ready SplitText Initialization**: Header and display typography line-masking triggers only after `document.fonts.ready` resolves, preventing layout reflow jitter.
- **Measured Dynamic Tabs**: The agent integration switchers in `components/research-controls.tsx` measure selected DOM element geometry directly (`offsetLeft`, `offsetWidth`) and interpolate a single indicator element with full keyboard roving focus (`ArrowLeft`, `ArrowRight`, `Home`, `End`).
- **Context-Aware Micro-Cursor**: `components/lab-cursor.tsx` runs an autonomous RAF spring loop switching between `idle`, `link` (magnetic snapping), `range`, `wire` (crosshair), and `native` input passthrough. Gracefully disables on touch devices, forced colors, and reduced motion.
- **Accessibility & Reduced Motion**: Full keyboard navigation across all interactive tables, sliders, copy triggers, and tab lists. All animations, pinned scroll sections, and custom cursors observe `(prefers-reduced-motion: reduce)`.

---

## Development

### Prerequisites

- Node.js 18.18+ or 20+
- npm or pnpm

### Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Static Build & Export

```bash
# Typecheck, lint, and emit static assets to out/
npm run build
```

The resulting `out/` directory can be deployed to any static host, CDN, or object store (Cloudflare Pages, Vercel, AWS S3, GitHub Pages).

---

## Paper & Citation

The complete LaTeX manuscript is available in [`public/reify_paper.tex`](public/reify_paper.tex). If you build on this research or reference the compiler architecture, please cite:

```bibtex
@article{pandey2026reify,
  title={Ephemeral Tool Synthesis for Web Agents via Wire-Level Interception},
  author={Pandey, Siddid},
  institution={Shaligram Labs},
  year={2026}
}
```

---

## Author & Contact

**Siddid Pandey**  
Shaligram Labs — Kathmandu, Nepal  
Email: [qvostwon@gmail.com](mailto:qvostwon@gmail.com)  
Research: [https://github.com/qvost/reify](https://github.com/qvost/reify)
