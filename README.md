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
```

## Pages

- `/`: lab overview, featured Reify research, and the lab's approach.
- `/research`: searchable publication archive, with category filters and sorting.
- `/research/[slug]`: individual papers, generated from the publication catalog.
- `/systems/reify`: discovery paths, source installation, and client integration.
- `/manifesto`: the lab's research philosophy.

## Publish research

Add a publication to `lib/research.ts` and place its PDF and supporting artifacts in `public/research/<slug>/`. The archive, filters, counts, metadata, and static paper route use this catalog. See [the publishing guide](docs/research-publishing.md) for a complete example.

The homepage features Reify as the lab's current research system. Its publication content and metrics come from the same catalog entry as the archive and paper page.

## Reify sources

The current publication uses the supplied `REIFY_ResearchPaper.pdf`, included at `public/research/reify/paper.pdf`, and the updated local Reify workspace. All six methods from the paper's primary benchmark table are included, including the 9 µs pre-warmed profile mount.

Paper results are labeled as author-reported. Warm dispatch is an in-process router measurement, not upstream API latency. The paper page describes the repository audit's separate 5.9 µs median, the paper's inconsistent speedup ratio, and differences between the research description and current probe behavior. The repository performance audit is included at `public/research/reify/performance.md`.

`public/reify_paper.tex` is a legacy source retained for existing links. It is not the source of the current PDF or publication data.

## Typography

Barlow Condensed, Manrope, and IBM Plex Mono are served locally from `public/fonts/`. Their SIL Open Font Licenses are included alongside them. The site does not depend on the previous external font host.

## Logo

The supplied Shaligram logo is preserved at `public/shaligram-logo.svg`. Its emblem is shared by the header, homepage, wire diagrams, manifesto, favicon, and touch/app icons. The footer uses the supplied emblem and wordmark. SVG derivatives and icon sizes are documented in [component provenance](docs/component-provenance.md).
