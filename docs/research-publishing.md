# Add a research publication

The catalog in `lib/research.ts` supplies the archive and individual paper pages. No new route or navigation entry is required for each paper.

1. Choose a unique, URL-safe slug, such as `agent-memory`.
2. Put the PDF in `public/research/agent-memory/paper.pdf`.
3. Add a `Publication` entry to the `publications` array. Keep the most recent entry first when publishing multiple papers in the same year.
4. Run `npm run build` to generate the new static page.

A minimal entry:

```ts
{
  slug: 'agent-memory',
  name: 'Agent memory',
  title: 'The full title of your paper',
  summary: 'A short description of the research question and contribution.',
  year: 2027,
  category: 'Agent infrastructure',
  tags: ['Memory', 'Long-horizon tasks'],
  author: 'Author name',
  pdf: '/research/agent-memory/paper.pdf',
  source: null,
  system: null,
  metrics: [],
  abstractTitle: 'A short introduction to the research.',
  abstract: ['The abstract, split into readable paragraphs.'],
  sections: [
    {
      kind: 'text',
      id: 'method',
      title: 'Method',
      paragraphs: ['Describe the method.'],
    },
    {
      kind: 'table',
      id: 'results',
      title: 'Results',
      columns: ['Method', 'Outcome'],
      rows: [['Your method', 'Reported measurement']],
    },
  ],
  resources: [],
  citation: '@article{yourCitationKey,\n  title={The full title},\n  year={2027}\n}',
}
```

Use `source` for a repository URL and `system` for an existing system page, or leave them `null`. Optional supplementary links belong in `resources` as `{ label, href }` entries. `metrics` can contain a small set of `{ value, label }` highlights, or be empty. Use source-qualified values and explain each measurement's scope in the paper.

Sections support prose (`text`), arbitrary tables (`table`), and Reify-style schema-token/task-success comparisons (`benchmarks`). Reify additionally uses `tradeoff`, `trace`, and `latency` for its interactive figures. All section IDs must be unique within a paper. The contents sidebar is derived from the sections. New section kinds should be added to the `ResearchSection` union and handled in `SectionContent`.

The archive derives category filters, search results, publication counts, and year/title sorting from the catalog. The homepage currently features the exported `reify` entry; change that selection and its supporting headline/visual when choosing another featured project.

The current Reify PDF is `public/paper.pdf`, with an identical compatibility copy at `public/research/reify/paper.pdf`. `public/reify_paper.tex` is its matching updated source. A `.tex` link in a publication's `resources` also appears as a download beside its primary PDF button.
