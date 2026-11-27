# Shaligram Labs

The website for Shaligram Labs, an independent research lab in Kathmandu working on infrastructure for autonomous agents. Built with Next.js 15, React, and TypeScript; exported as a static site.

## Develop

```sh
npm install
npm run dev
```

Create the static export in `out/`:

```sh
npm run build
npm run lint
```

## Pages

- `/`: lab overview, featured Reify research, protocol explorer, scroll-driven compilation pipeline, and latency comparison.
- `/research`: searchable publication archive, PDF/LaTeX downloads, and reproducible benchmark evaluation.
- `/research/[slug]`: individual papers with schema-budget controls, SVG tradeoff plot, searchable aggregate benchmark table, illustrative booking playback, negative results, and citation copy.
- `/systems/reify`: protocol/discovery inspectors, benchmark comparison, production architecture, CLI/Rust/Python/TypeScript examples, and agent integration.
- `/manifesto`: the lab's research philosophy.

## Publish research

Add a publication to `lib/research.ts` and place its PDF and supporting artifacts in `public/research/<slug>/`. The archive, filters, counts, metadata, and static paper route use this catalog. See [the publishing guide](docs/research-publishing.md) for a complete example.

The homepage features Reify as the lab's current research system. Its publication content and metrics come from the same catalog entry as the archive and paper page.

## Reify sources

The current publication uses the supplied November 28 `REIFY_ResearchPaper.pdf` at `public/paper.pdf`, with the previous PDF path retained as an identical copy. Its matching LaTeX source is `public/reify_paper.tex`. All six aggregate methods from the paper's 20-app evaluation remain available; no per-service measurements or complete service roster were supplied.

Paper results are labeled as author-reported. The 4.15 µs in-process router sample, 9.0 µs pre-warmed mount, and 58.2× reported optimization ratio have distinct scopes. The repository performance audit at `public/research/reify/performance.md` records a separate five-run aggregate (342.3 → 5.9 µs).

`public/research/reify/benchmarks.md` preserves the local workspace's reproducible benchmark specification and November 27 release evidence: 0.804/0.959 ms HTTP MCP versus 3.331/3.877 ms scripted Chromium p50/p95, 200 timed calls, zero errors, 710 passing workspace tests, and warning-denied Clippy. These are reported Reify release gates, not a Rust suite rerun by this website project. The UI also exposes cold readiness, input classification, context counts, and measurement boundaries. Interactive values are recorded observations, not a benchmark running in the visitor's browser.

## Typography

Barlow Condensed, Manrope, and IBM Plex Mono are served locally from `public/fonts/`. Their SIL Open Font Licenses are included alongside them. The site does not depend on the previous external font host.

## Logo

The current scanline ammonite mark is `public/brand/mark.svg`. The header, homepage, wire diagrams, manifesto, favicon, and touch/app icons share its geometry. The footer uses `public/brand/logo.svg`; a PNG lockup is available at `public/brand/logo.png`. Backgrounds are transparent and vector ink inherits `currentColor`. Source filenames and adaptations are documented in [component provenance](docs/component-provenance.md).
