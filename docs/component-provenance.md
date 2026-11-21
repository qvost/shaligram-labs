# Component and content sources

The current interface is an original implementation for Shaligram Labs. The lab homepage uses the supplied Shaligram emblem. The archive and paper template share the publication catalog in `lib/research.ts`.

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

Reify's current PDF is `public/research/reify/paper.pdf`. The separate repository audit is `public/research/reify/performance.md`. Source scopes and implementation differences appear in the paper's measurement notes and limitations. The earlier illustrative booking trace has been removed.

Barlow Condensed, Manrope, and IBM Plex Mono are self-hosted in `public/fonts/`, with their SIL Open Font Licenses. They replace the previous external typefaces, whose host returned HTTP 403 during this update.

Historical BLANK-inspired recipes in the retained tab and animation controls are local adaptations. No authenticated registry component was downloaded as part of this update.

## Logo assets

The original supplied logo is preserved at `public/shaligram-logo.svg`. The shared emblem in `public/shaligram-mark.svg` reuses its vector paths, with the background and wordmark removed for compact use. The footer uses `public/shaligram-logo-lockup.svg`, retaining the supplied emblem and wordmark on a transparent background. The original file is not modified.

`public/icon.svg`, `public/favicon.ico`, `public/apple-touch-icon.png`, and the 192/512 px app icons are derived from the same emblem. The favicon includes 16, 32, 48, and 64 px sizes. `public/site.webmanifest` references the app icons.
