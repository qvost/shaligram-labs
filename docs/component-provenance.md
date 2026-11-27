# Component and content sources

The current interface is an original implementation for Shaligram Labs. The lab homepage uses the supplied Shaligram emblem. The archive and paper template share the publication catalog in `lib/research.ts`.

The landing page presents Shaligram Labs, one concise project preview, and the lab's approach. The technical protocol explorer, horizontal compilation pipeline, and system architecture live on `/systems/reify`. `/research` is the publication library; the full evaluation and interactive research figures live on `/research/reify`. Product statistics and technical demos are kept off the lab landing page.

## Existing components retained

- `components/shell.tsx`: Lenis scrolling, GSAP route curtains, and reduced-motion-aware SplitText on existing reveal elements. Nested paper routes now mark Research as the active navigation item.
- `components/lab-cursor.tsx`: existing pointer feedback, disabled for touch and reduced motion.
- `components/research-controls.tsx`: existing measured-tab indicator and native schema-budget range control. The tabs support arrow keys, Home/End, and roving focus.
- `components/lab-mark.tsx`: the supplied Shaligram emblem, referenced from one shared SVG asset.

## New components

- `components/wire.tsx`: schematic of requests converging into typed tools; no implied measured frame count.
- `components/benchmarks.tsx`: all six paper benchmark rows, with a budget-controlled bar comparison. Faded bars indicate methods exceeding the selected initial schema budget.
- `components/research.tsx`: searchable publication archive with derived category filters, sorting, and an empty-results state.
- `components/copy.tsx`: clipboard feedback with timer cleanup.
- `app/research/[slug]/page.tsx`: static publication template with derived contents, paper links, citations, and supplementary resources.

## Content and typography

Reify's current PDF is `public/paper.pdf`; `public/research/reify/paper.pdf` is an identical compatibility copy. Both PDFs and `public/reify_paper.tex` come from the supplied November 28 documents. `public/research/reify/benchmarks.md` is copied from the local Reify checkout. The separate earlier router audit remains at `public/research/reify/performance.md`.

The horizontal GSAP compilation pipeline, SVG tradeoff plot, and five-step booking playback restore interactions present before the publication-catalog migration. The playback explains architecture and does not claim recorded booking times or costs. The paper retains all six method rows from its aggregate 20-service evaluation, the budget scrubber, negative results, and BibTeX copy. No individual service results are invented.

`components/protocol-explorer.tsx` presents architecture examples for REST/JSON, GraphQL, gRPC-Web, WebSockets, and static documents. `components/latency-bench.tsx` switches between recorded p50/p95 and cold-readiness observations; it does not execute a benchmark. Shared tabs have unique panel relationships, arrow/Home/End navigation, and an indicator that follows wrapped mobile rows. All new motion respects reduced motion.

Barlow Condensed, Manrope, and IBM Plex Mono are self-hosted in `public/fonts/`, with their SIL Open Font Licenses. They replace the previous external typefaces, whose host returned HTTP 403 during this update.

Historical BLANK-inspired recipes in the retained tab and animation controls are local adaptations. No authenticated registry component was downloaded as part of this update.

## Logo assets

The scanline mark was copied from `Pictures/shaligram-labs/shaligram-lines-clean-mark-only.svg` into `public/brand/mark.svg`. Its white background is removed; its unchanged vector paths use `currentColor`, and the group has the shared `shaligram-symbol` identifier for external SVG use. Default ink is #141414; the site ground is #e5e3dc.

The requested `shaligram-lines-clean-logo.svg` and `.png` filenames were absent. Matching supplied scanline lockups from the same directory, `shaligramlogo.svg` and `shaligramlabslogo.png`, provide `public/brand/logo.svg` and `logo.png`. The SVG background is removed and its ink normalized. Earlier brand files remain available for existing links.

The existing ASCII hero interaction samples the new mark's opacity, allowing dark paths on transparency to remain visible. The vector fallback uses the same mark. No external image or new rendering framework is needed.

`public/icon.svg`, `public/favicon.ico`, `public/apple-touch-icon.png`, and the 192/512 px app icons are derived from the same emblem. The favicon includes 16, 32, 48, and 64 px sizes. `public/site.webmanifest` references the app icons.
