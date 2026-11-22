export type Benchmark = {
  name: string;
  family: "baseline" | "reify";
  tokens: number;
  cold: string;
  warm: string;
  success: number;
};

export type ResearchSection =
  | { kind: "text"; id: string; title: string; paragraphs: string[] }
  | {
      kind: "benchmarks";
      id: string;
      title: string;
      description: string;
      rows: Benchmark[];
    }
  | {
      kind: "table";
      id: string;
      title: string;
      columns: string[];
      rows: string[][];
    };

export type Publication = {
  slug: string;
  name: string;
  title: string;
  summary: string;
  year: number;
  category: string;
  tags: string[];
  author: string;
  pdf: string;
  source: string | null;
  system: string | null;
  abstractTitle: string;
  resources: { label: string; href: string }[];
  metrics: { value: string; label: string }[];
  abstract: string[];
  sections: ResearchSection[];
  citation: string;
};

export const reifyMetrics = {
  schemaTokens: {
    value: "98.4%",
    label: "fewer schema tokens",
    context: "380 vs 24,100",
  },
  taskCompletion: {
    value: "92.5%",
    label: "task completion",
    context: "vs 61.0% visual",
  },
  warmDispatch: {
    value: "4.1 µs",
    label: "warm in-process dispatch",
    context: "Axum microbenchmark",
  },
  profileMount: { value: "9 µs", label: "profile mount" },
};

export const reify: Publication = {
  abstractTitle: "How Reify compiles tools for a task.",
  resources: [
    {
      label: "Read the repository performance audit",
      href: "/research/reify/performance.md",
    },
  ],
  slug: "reify",
  name: "Reify",
  title:
    "Ephemeral Tool Synthesis for Web Agents with a Wire-Level Description Price",
  summary:
    "Reify compiles task-specific MCP tools from website data and network traffic.",
  year: 2026,
  category: "Agent infrastructure",
  tags: ["Tool synthesis", "MCP", "Web agents"],
  author: "Siddid Pandey",
  pdf: "/research/reify/paper.pdf",
  source: "https://github.com/qvost/reify",
  system: "/systems/reify",
  metrics: [
    reifyMetrics.schemaTokens,
    reifyMetrics.taskCompletion,
    reifyMetrics.profileMount,
  ],
  abstract: [
    "Tool definitions use space in an agent's context window. Reify synthesizes tools for the current task and measures their schema size, execution cost, and task completion.",
    "An embedded wire-profile catalog, a zero-browser hydration scanner, and a headless network probe feed deterministic schema induction. A goal-directed filter narrows the interface to three to five tools, served through a stateless MCP gateway in Rust.",
    "Across 20 live production web applications, the paper reports 380 initial schema tokens instead of 24,100, with 92.5% task completion versus 89.0% for full static MCP servers. Pre-warmed profiles mount in 9 µs; the SSR path takes 14.8 ms; warm in-process calls take 4.1 µs.",
  ],
  sections: [
    {
      kind: "text",
      id: "method",
      title: "How compilation works.",
      paragraphs: [
        "First, resolve a matching pre-warmed profile. On a miss, fetch HTML and extract embedded state such as __NEXT_DATA__, __NUXT_DATA__, __remixContext, or __INITIAL_STATE__. When this path cannot resolve the target, a Chrome DevTools Protocol probe captures structured traffic while filtering static assets and trackers.",
        "Dynamic path segments become parameters. A deterministic type join infers JSON Schema from observed payloads, making a property optional when it is missing from any observation. A relevance filter retains the endpoints that match the task.",
        "The resulting request plans mount behind POST /mcp. Cached definitions avoid repeated compilation. Progressive Server-Sent Events support streaming responses, while passive drift signals and a canary watch command support recovery when upstream behavior changes.",
      ],
    },
    {
      kind: "benchmarks",
      id: "evaluation",
      title: "Schema size and task completion.",
      description:
        "Table 1 of the supplied paper. Aggregate evaluation across 20 live web services using Claude 3.5 Sonnet; these are author-reported results.",
      rows: [
        {
          name: "Visual browser-use (Playwright)",
          family: "baseline",
          tokens: 0,
          cold: "N/A",
          warm: "N/A",
          success: 61,
        },
        {
          name: "Full static MCP server",
          family: "baseline",
          tokens: 24100,
          cold: "Static (days)",
          warm: "420.0",
          success: 89,
        },
        {
          name: "Unpruned wire server",
          family: "baseline",
          tokens: 18450,
          cold: "1,420 ms",
          warm: "18.2",
          success: 82.5,
        },
        {
          name: "Reify / browser action synthesis",
          family: "reify",
          tokens: 380,
          cold: "1,280 ms",
          warm: "4.1",
          success: 92.5,
        },
        {
          name: "Reify / zero-browser SSR",
          family: "reify",
          tokens: 380,
          cold: "14.8 ms",
          warm: "4.1",
          success: 92.5,
        },
        {
          name: "Reify / pre-warmed wire profile",
          family: "reify",
          tokens: 380,
          cold: "9 µs",
          warm: "4.1",
          success: 92.5,
        },
      ],
    },
    {
      kind: "text",
      id: "implementation",
      title: "Implementation.",
      paragraphs: [
        "The current Rust workspace includes 25 embedded service profiles and 39 read operations. Matching and mounting do not make network requests; executing a tool still depends on the upstream API, its access rules, and any required credentials.",
        "The updated implementation also recognizes static HTML documents and exposes semantic read, link, and contact tools. Hydration snapshots are projections of an HTML response; they are not evidence of a separate JSON API.",
        "The reify install command merges the gateway into Cursor, Claude Code, Windsurf, and OpenCode configurations. A loopback bridge accepts explicitly shared browser credentials, scoped to the appropriate host. The reify watch command compares live captures for drift and supports webhook notifications.",
      ],
    },
    {
      kind: "table",
      id: "negative-results",
      title: "What did not work.",
      columns: ["Variant", "Task success", "Observed failure"],
      rows: [
        [
          "Full OpenAPI synthesis",
          "71.4%",
          "Large schemas; synthesis over 8 seconds",
        ],
        ["VLM accessibility tree", "52.0%", "Slow steps; brittle tree depth"],
        ["Soft prompt gating", "64.2%", "Hallucinated unmounted tools"],
        [
          "Fixed top-K without a goal",
          "58.0%",
          "Telemetry displaces business APIs",
        ],
        ["LLM-generated handlers", "68.5%", "Syntax and encoding errors"],
        ["DOM selector extraction", "44.0%", "Selectors fail after hydration"],
      ],
    },
    {
      kind: "text",
      id: "measurement-notes",
      title: "Measurement scope.",
      paragraphs: [
        "Warm dispatch is an in-process Axum router measurement. It excludes browser startup, network sockets, upstream API calls, and retries. The 9 µs profile figure excludes process startup, catalog initialization, and socket binding. Neither figure describes an end-to-end remote task.",
        "The repository's separate performance audit reports a median of run averages of 5.9 µs after optimization, versus 342.3 µs before, across five alternating runs per side. Its optimized range is 4.2 to 6.1 µs. The paper uses 4.1 µs; these measurements have different reporting scopes and are presented separately here.",
        "The paper’s stated 58.2× speedup does not follow from its paired 342.3 µs and 4.15 µs figures, so this site does not repeat that ratio. The paper does not provide individual app results or a complete service roster. Zero initial schema tokens for visual agents does not imply zero screenshot or execution tokens.",
      ],
    },
    {
      kind: "text",
      id: "limitations",
      title: "Limitations.",
      paragraphs: [
        "Canvas and WebGL applications with no underlying structured traffic provide no API surface for interception. Anti-bot systems can block remote discovery; a local companion depends on an accessible, explicitly shared user session.",
        "The paper describes autonomous form interaction. The current probe documentation describes navigation and capture rather than goal-driven clicking. The benchmark labels above preserve the paper’s terminology; they do not assert that every research behavior is implemented in the current source.",
      ],
    },
  ],
  citation:
    "@article{pandey2026reify,\n  title={REIFY: Ephemeral Tool Synthesis for Web Agents with a Wire-Level Description Price},\n  author={Pandey, Siddid},\n  institution={Shaligram Labs},\n  year={2026}\n}",
};

// Add publications here; the archive and static paper routes use this catalog.
export const publications: Publication[] = [reify];
export function publicationPath(publication: Publication) {
  return `/research/${publication.slug}`;
}
