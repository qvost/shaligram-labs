"use client";

import Link from "next/link";
import { useState } from "react";
import { Copy } from "./copy";
import { Wire } from "./wire";
import { IntegrationTabs } from "./research-controls";

const setup =
  "cargo install --path crates/reify-cli\nreify serve --host 127.0.0.1 --port 8080";
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

const discovery = [
  [
    "Embedded profiles",
    "Select from 25 curated service profiles and 39 read operations without launching a browser or making a discovery request.",
  ],
  [
    "HTML and hydration",
    "Extract structured server-rendered state or derive semantic tools for reading a static document, listing its links, or finding contact information.",
  ],
  [
    "Chromium capture",
    "When the HTTP path cannot resolve a target, capture structured traffic through Chrome DevTools Protocol and infer typed request plans.",
  ],
];

export function Quickstart() {
  const [client, setClient] = useState<keyof typeof snippets>("Claude Code");

  return (
    <>
      <section className="system-hero page-width">
        <span className="section-kicker">Research system / Rust</span>
        <h1 className="reify-title">REIFY</h1>
        <div className="system-intro">
          <h2>
            From the live web
            <br />
            to typed tools.
          </h2>
          <div>
            <p>
              Reify compiles task-scoped MCP tools from structured web traffic,
              embedded profiles, and HTML documents.
            </p>
            <div className="link-pair">
              <Link className="button" href="/research/reify">
                Read the paper <span aria-hidden="true">↗</span>
              </Link>
              <a className="text-link" href="https://github.com/qvost/reify">
                Browse source <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
        <Wire compact />
      </section>
      <section className="system-section page-width">
        <div className="section-heading">
          <h2>How discovery works.</h2>
        </div>
        <ol className="system-paths">
          {discovery.map(([title, description]) => (
            <li key={title}>
              <h3>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="system-section page-width" id="quickstart">
        <div className="section-heading">
          <h2>Get started locally.</h2>
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
            Use <code>--dry-run</code> to preview the configuration entry. Run
            the second command to add it to your client configuration.
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
          <a
            className="text-link"
            href="https://github.com/qvost/reify/tree/main/crates/reify-cli"
          >
            Full CLI guide <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
    </>
  );
}
