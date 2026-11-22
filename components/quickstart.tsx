"use client";

import Link from "next/link";
import { useState } from "react";
import { publicationPath, reify, reifyMetrics } from "@/lib/research";
import { Copy } from "./copy";
import { Wire } from "./wire";
import { IntegrationTabs } from "./research-controls";
import { DiscoveryExplorer } from "./discovery-explorer";

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

  return (
    <>
      <section className="system-hero page-width">
        <span className="section-kicker">Research system / Rust</span>
        <h1 className="reify-title" data-motion-title>REIFY</h1>
        <div className="system-intro">
          <h2 data-motion-title>
            From the live web
            <br />
            to typed tools.
          </h2>
          <div>
            <p>
              Reify is an on-demand compiler for task-scoped MCP tools. It
              checks a pre-warmed cache first, then compiles tools from the live
              site when there is no match.
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
      <section className="system-section page-width" id="discovery">
        <div className="section-heading">
          <h2 data-motion-title>Three tiers of discovery.</h2>
        </div>
        <DiscoveryExplorer />
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
            panelId="integration-panel"
          />
          <div
            className="code-block"
            role="tabpanel"
            id="integration-panel"
            aria-labelledby={`integration-tab-${clients.indexOf(client)}`}
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
