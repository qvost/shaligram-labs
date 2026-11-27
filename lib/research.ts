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
  | { kind: "tradeoff" | "trace" | "latency"; id: string; title: string }
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
    value: "4.15 µs",
    label: "warm in-process dispatch",
    context: "Axum microbenchmark",
  },
  profileMount: { value: "9.0 µs", label: "profile mount" },
  verification: { tests: 710, clippyWarnings: 0, date: "27 Nov 2026" },
};

export const reify: Publication = {
  abstractTitle: "How Reify compiles tools for a task.",
  resources: [
    { label: "Download LaTeX Source", href: "/reify_paper.tex" },
    {
      label: "Reproducible benchmark method",
      href: "/research/reify/benchmarks.md",
    },
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
    "Reify compiles REST, GraphQL, gRPC-Web, WebSocket, and document interfaces into typed, task-scoped MCP tools.",
  year: 2026,
  category: "Agent infrastructure",
  tags: ["Tool synthesis", "MCP", "Multi-protocol", "Web agents"],
  author: "Siddid Pandey",
  pdf: "/paper.pdf",
  source: "https://github.com/qvost/reify",
  system: "/systems/reify",
  metrics: [
    reifyMetrics.schemaTokens,
    reifyMetrics.taskCompletion,
    reifyMetrics.profileMount,
  ],
  abstract: [
    "Tool definitions use space in an agent's context window. Reify synthesizes tools for the current task and measures their schema size, execution cost, and task completion.",
    "An embedded wire-profile catalog, a zero-browser hydration scanner, and a headless network probe feed deterministic Draft 2020-12 schema induction. REST/JSON, GraphQL, gRPC-Web, WebSocket streams, and sequential workflows share a stateless MCP interface. Static documents receive semantic tools, Resources, and Prompts rather than an empty tool set.",
    "Across 20 live production web applications, the paper reports 380 initial schema tokens instead of 24,100, with 92.5% task completion versus 89.0% for full static MCP servers. Pre-warmed profiles mount in 9.0 µs; the SSR path takes 14.8 ms; in-process router dispatch takes 4.15 µs. A separate reproducible loopback benchmark measures 0.804 ms p50 HTTP MCP dispatch versus 3.331 ms for scripted Chromium.",
  ],
  sections: [
    {
      kind: "text",
      id: "method",
      title: "How compilation works.",
      paragraphs: [
        "First, resolve a matching pre-warmed profile. On a miss, fetch HTML and extract embedded state such as __NEXT_DATA__, __NUXT_DATA__, __remixContext, or __INITIAL_STATE__. When this path cannot resolve the target, a Chrome DevTools Protocol probe captures structured traffic while filtering static assets and trackers.",
        "Dynamic path segments become parameters. A deterministic type join infers JSON Schema from observed payloads, making a property optional when it is missing from any observation. A relevance filter retains the endpoints that match the task.",
        "The resulting request plans mount behind POST /mcp. Sequential workflow macros compile bounded ExecutionSpec chains, passing extracted fields into later steps through one atomic MCP tool interface. Steps execute in order and can report partial progress; upstream mutations are not transactional.",
        "GraphQL introspection, queries, mutations, SSE and graphql-transport-ws subscriptions sit alongside binary/text gRPC-Web codecs (+proto/+json) and real-time WebSocket stream tools. When no relevant API frames exist, read_document, list_links, and get_contact_points expose the page, including Cloudflare email decoding, reify:// Resources, and task Prompts. Successful synthesis never returns tools: [].",
      ],
    },
    {
      kind: "tradeoff",
      id: "tradeoff",
      title: "The price of a tool definition.",
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
      kind: "latency",
      id: "reproducible-bench",
      title: "Reproducible reify bench evaluation.",
    },
    { kind: "trace", id: "trace", title: "Same goal. A shorter path." },
    {
      kind: "text",
      id: "implementation",
      title: "Implementation.",
      paragraphs: [
        "The current Rust workspace includes 25 embedded service profiles and 39 read operations. Matching and mounting do not make network requests; executing a tool still depends on the upstream API, its access rules, and any required credentials.",
        "The reify-transport crate pools HTTP/1.1, HTTP/2, and HTTP/3 connections, with replay-safe QUIC 0-RTT early data for eligible anonymous reads. Credentials, bodies, and mutations are excluded from early flight. Dual-stack Happy Eyeballs dialing and UDP-blackhole fallback preserve reachability.",
        "HTTP-aware concurrent Stale-While-Revalidate caching and adaptive circuit breaking manage upstream load. A 64-partition multi-tenant Auth Vault isolates credentials using --tenant-tokens and X-Reify-Tenant. OpenTelemetry OTLP export and Prometheus /metrics are opt-in.",
        "Native Python (PyO3 abi3) and TypeScript (NAPI-RS) bindings call the Rust compiler and transport in-process. Build the source packages locally; the bindings are not published to PyPI or npm. The signed Community Profile Registry supports reify pull with configured trust; no hosted public registry is assumed.",
        "The reify install command merges the gateway into Cursor, Claude Code, Windsurf, and OpenCode configurations. A loopback bridge accepts explicitly shared browser credentials, scoped to the appropriate host. The reify watch canary daemon detects upstream drift and supports self-healing. The November 27 release verification reports 710 passing workspace tests and zero Clippy warnings.",
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
        "The 4.15 µs in-process Axum router microbenchmark excludes browser startup, network sockets, upstream API calls, and retries. The 9.0 µs profile figure excludes process startup, catalog initialization, and socket binding. Neither figure describes an end-to-end remote task.",
        "The paper reports a 58.2× optimization speedup. The separate repository audit measures a median of run averages of 5.9 µs after optimization versus 342.3 µs before, across five alternating runs per side, with an optimized range of 4.2–6.1 µs. The 58.2× claim and the 4.15 µs microbenchmark have different reporting scopes; the ratio cannot be derived from 342.3 / 4.15.",
        "The November 27 reify bench run uses a Fat-LTO release binary, five alternating trials, 100 warm calls per side, 100 ms pacing, 10 warmups, and 25 discovery calls. All 200 timed calls complete with zero errors and matching full-result hashes. HTTP MCP measures 0.804 / 0.959 ms p50 / p95; scripted Chromium measures 3.331 / 3.877 ms. No WAN, TLS, QUIC, model inference, or screenshot loop is measured.",
        "The single-form benchmark retains 866 MCP context tokens versus 536 DOM tokens and classifies 18/20 inputs versus 20/20. These are different representations and a separate workload from the 20-app paper evaluation. The paper does not provide individual app measurements or a complete service roster. Zero initial schema tokens for visual agents does not imply zero screenshot or execution tokens.",
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
