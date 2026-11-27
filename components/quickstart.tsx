"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { publicationPath, reify, reifyMetrics } from "@/lib/research";
import { Copy } from "./copy";
import { Wire } from "./wire";
import { IntegrationTabs } from "./research-controls";
import { DiscoveryExplorer } from "./discovery-explorer";
import { ProtocolExplorer } from "./protocol-explorer";
import { LatencyBench } from "./latency-bench";
import { SystemCapabilities } from "./system-capabilities";
import { CompilationPipeline } from "./compilation-pipeline";

const nativeExamples = {
  CLI: {
    code: 'reify https://news.ycombinator.com "search stories"\nreify profiles\nreify watch --help',
    href: "crates/reify-cli",
    note: "Install the CLI from the repository, then mount a task or inspect available profiles and canary options.",
  },
  Rust: {
    code: 'use reify_core::domain::{AuthContext, Target};\nuse reify_synth::SynthEngine;\n\nlet target = Target::new("https://example.com", Some("read docs".into()))?;\nlet catalog = SynthEngine::new().synthesize(\n    &target, &[], &AuthContext::default(),\n)?;\n// No captures: semantic document tools. No network I/O.',
    href: "crates/reify-synth",
    note: "Use the workspace crates directly. Empty captures produce document tools; synthesis itself makes no upstream request.",
  },
  "Python (PyO3)": {
    code: 'import json\nimport reify\n\ncatalog = json.loads(reify.synthesize_json(\n    "https://example.com", "[]", "read docs"\n))\nprint(catalog["tools"])',
    href: "bindings/python",
    note: "Build and install the abi3 wheel from bindings/python first. Compiler inputs and outputs are explicit UTF-8 JSON strings.",
  },
  "TypeScript (NAPI-RS)": {
    code: 'import { synthesizeJson } from "@shaligram/reify";\n\nconst catalogJson = synthesizeJson(\n  "https://example.com", "[]", "read docs"\n);\n// JSON string returned by the native Rust compiler.\nconsole.log(catalogJson);',
    href: "bindings/node",
    note: "Build and install the native source package in bindings/node first. The package includes generated TypeScript declarations.",
  },
};
type Language = keyof typeof nativeExamples;
const languages: Language[] = [
  "CLI",
  "Rust",
  "Python (PyO3)",
  "TypeScript (NAPI-RS)",
];

const setup =
  "cargo install --path crates/reify-cli && reify serve --host 127.0.0.1 --port 8080";
const mount = 'reify https://news.ycombinator.com "search stories"';
const snippets = {
  "Claude Code":
    "reify install --agent claude --dry-run\nreify install --agent claude",
  Cursor:
    "reify install --agent cursor --dry-run\nreify install --agent cursor",
  Windsurf:
    "reify install --agent windsurf --dry-run\nreify install --agent windsurf",
  OpenCode:
    "reify install --agent opencode --dry-run\nreify install --agent opencode",
};
const clients: Array<keyof typeof snippets> = [
  "Claude Code",
  "Cursor",
  "Windsurf",
  "OpenCode",
];

const metrics = [
  reifyMetrics.schemaTokens,
  reifyMetrics.taskCompletion,
  reifyMetrics.warmDispatch,
];

export function Quickstart() {
  const [client, setClient] = useState<keyof typeof snippets>("Claude Code");
  const [language, setLanguage] = useState<Language>("CLI");
  const id = useId();
  const nativePanelId = `${id}-native`;
  const integrationPanelId = `${id}-integration`;

  return (
    <>
      <section className="system-hero page-width">
        <span className="section-kicker">Research system / Rust</span>
        <h1 className="reify-title" data-motion-title>
          REIFY
        </h1>
        <div className="system-intro">
          <h2 data-motion-title>
            From the live web
            <br />
            to typed tools.
          </h2>
          <div>
            <p>
              Reify is an on-demand compiler for task-scoped MCP tools. It
              checks 25 pre-warmed wire profiles first, then compiles REST,
              GraphQL, gRPC-Web, WebSocket, or static-document tools from the
              live site when there is no match.
            </p>
            <div className="link-pair">
              <Link className="button" href={publicationPath(reify)}>
                Read the paper <span aria-hidden="true">↗</span>
              </Link>
              {reify.source && (
                <a className="text-link" href={reify.source}>
                  Browse source <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="metric-strip">
          {metrics.map(({ value, label, context }) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
              <span>{context}</span>
            </div>
          ))}
        </div>
        <p className="note">Author-reported results from the Reify paper.</p>
        <Wire compact />
      </section>
      <section className="system-section page-width" id="protocols">
        <div className="section-heading">
          <h2 data-motion-title>A protocol for every surface.</h2>
        </div>
        <ProtocolExplorer />
      </section>
      <section className="system-section page-width" id="discovery">
        <div className="section-heading">
          <h2 data-motion-title>Three tiers of discovery.</h2>
        </div>
        <DiscoveryExplorer />
      </section>
      <CompilationPipeline />
      <section className="system-section page-width" id="bench">
        <div className="section-heading">
          <h2 data-motion-title>Measure the actual boundary.</h2>
        </div>
        <LatencyBench />
      </section>
      <section className="system-section page-width" id="architecture">
        <div className="section-heading">
          <h2 data-motion-title>The system around the tool.</h2>
        </div>
        <SystemCapabilities />
      </section>
      <section className="system-section page-width" id="quickstart">
        <div className="section-heading">
          <h2 data-motion-title>Get started locally.</h2>
        </div>
        <div className="system-setup">
          <div>
            <h3>Start the gateway</h3>
            <p>
              From the root of the Reify checkout, install the CLI from source
              and start the gateway at <code>http://127.0.0.1:8080/mcp</code>.
            </p>
            <div className="code-block">
              <Copy value={setup} />
              <pre>{setup}</pre>
            </div>
          </div>
          <div>
            <h3>Mount tools for one task</h3>
            <p>
              Use this command in place of the gateway to start a task-specific
              mount. It runs in the foreground and serves <code>/mcp</code>{" "}
              until you stop it.
            </p>
            <div className="code-block">
              <Copy value={mount} />
              <pre>{mount}</pre>
            </div>
          </div>
        </div>
        <div className="integration native-integration">
          <h3>Choose your entry point</h3>
          <p>
            The CLI and native bindings use the same Rust core. Python and Node
            packages are available as source builds.
          </p>
          <IntegrationTabs
            options={languages}
            value={language}
            onChange={setLanguage}
            panelId={nativePanelId}
            label="Code language"
          />
          <div
            className="code-block"
            role="tabpanel"
            id={nativePanelId}
            aria-labelledby={`${nativePanelId}-tab-${languages.indexOf(language)}`}
            tabIndex={0}
          >
            <Copy key={language} value={nativeExamples[language].code} />
            <pre>{nativeExamples[language].code}</pre>
          </div>
          <p className="note">{nativeExamples[language].note}</p>
          <a
            className="text-link"
            href={`${reify.source}/tree/main/${nativeExamples[language].href}`}
          >
            Build and API guide ↗
          </a>
        </div>
        <div className="integration">
          <h3>Connect an agent</h3>
          <p>
            Preview the configuration with <code>--dry-run</code>. Run the
            second command to save it.
          </p>
          <IntegrationTabs
            options={clients}
            value={client}
            onChange={setClient}
            panelId={integrationPanelId}
          />
          <div
            className="code-block"
            role="tabpanel"
            id={integrationPanelId}
            aria-labelledby={`${integrationPanelId}-tab-${clients.indexOf(client)}`}
            tabIndex={0}
          >
            <Copy key={client} value={snippets[client]} />
            <pre>{snippets[client]}</pre>
          </div>
          {reify.source && (
            <a
              className="text-link"
              href={`${reify.source}/tree/main/crates/reify-cli`}
            >
              Full CLI guide <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </section>
    </>
  );
}
