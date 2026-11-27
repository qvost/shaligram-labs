# Website verification — 28 November 2026

Verified the production static export locally with Chromium 156.0.8078.4.

## Landing page refinement

Rechecked the revised homepage and research library at 1440, 390, and 320 pixels. The homepage has three sections: the lab introduction, one short Reify preview, and the lab's approach. Product explorers, benchmark tables, metrics, and the pinned compilation pipeline are absent from the landing page. The research library lists publications and downloads; detailed evaluation remains in the individual paper.

All revised layouts passed overflow, image, heading, unique-ID, palette, and browser-error checks. Links from the landing page to the Reify system, paper, and manifesto worked. The protocol explorer and pipeline remain on the system page; the paper retains its benchmark evaluation, SVG plot, booking trace, and negative results. Normal-motion review confirmed the landing page has no pinned product sequence and the interactive mark still renders.

The final production build and lint checks passed. Current landing-page screenshots are in `/tmp/shaligram-landing-review/`; earlier screenshots below document the preceding full-site verification.

## Build gates

- `npm run lint`: passed with zero errors and zero warnings, using Next.js core web vitals and TypeScript rules.
- `npm run build`: passed compilation, lint/type validation, page generation, and static export.
- Code whitespace check passed. The copied LaTeX retains the supplied file's original whitespace so the download remains byte-identical.

## Routes and responsive layout

| Route | 1440 × 1000 | 390 × 844 | 320 × 740 |
| --- | --- | --- | --- |
| `/` | Pass | Pass | Pass |
| `/systems/reify` | Pass | Pass | Pass |
| `/research` | Pass | Pass | Pass |
| `/research/reify` | Pass | Pass | Pass |
| `/manifesto` | Pass | Pass | Pass |
| `/paper.pdf`, `/brand/mark.svg`, `/reify_paper.tex` | HTTP 200 | HTTP 200 | HTTP 200 |

Page checks included horizontal overflow, image loading, a single page heading, unique element IDs, tab/panel relationships, exact stone/charcoal colors, and browser errors. Logos, favicon, app icons, the previous PDF path, and the benchmark-method download also resolved successfully.

## Interaction checks

- All five protocol panels; keyboard arrows, Home, and End; wrapped mobile tab selection.
- Warm p50, warm p95, and cold-readiness values; expandable reproduction command and input-classification results.
- CLI, Rust, Python, and TypeScript examples; SSR and CDP discovery traces.
- Both schema-budget controls, SVG plot fading, benchmark search, and benchmark sorting.
- Five-step booking playback, next/reset controls, automatic stop, and BibTeX clipboard feedback.
- Archive empty state and reset; PDF and catalog-derived LaTeX download links.
- Visible ASCII hero glyphs sampled from the transparent mark.
- Main navigation across all routes; desktop pipeline pinning and horizontal advancement; pinned-state cleanup after navigation.
- Reduced-motion layout, with no pinned pipeline or route curtain.

Screenshots are available locally in `/tmp/shaligram-verification/`, including desktop/mobile page views, `featured-paper-desktop.png`, `pipeline-desktop.png`, and `bench-mobile.png`.

## Artifact and source checks

Both public PDF paths are byte-identical to the supplied five-page PDF. SHA-256: `80915884be924ca0d6ed5a80ee3d6c2bcddd1ce1666a44164eb8cb294ae6301f`. The browser received the PDF signature and `application/pdf` MIME type, and its first page rendered locally with Poppler. The LaTeX download is byte-identical to the supplied source.

The alternate supplied logo lockup contains exactly the same vector mark geometry as the requested scanline mark. Asset filenames and transparent/current-color adaptations are recorded in [component provenance](component-provenance.md).

The displayed 710 passing workspace tests and zero Clippy warnings come from Reify's November 27 release verification in the copied benchmark report. This website verification did not rerun the Rust workspace. The interface distinguishes the 20-app paper evaluation, router microbenchmark, five-run optimization audit, and local Chromium comparison; the loopback benchmark does not measure QUIC, WAN, or model inference.
