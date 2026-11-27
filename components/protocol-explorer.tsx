"use client";

import { useId, useState } from "react";
import { IntegrationTabs } from "./research-controls";
import { Wire } from "./wire";

const protocols = {
  "REST / JSON": {
    input: "HTML state / XHR / Fetch",
    heading: "The payload is already the interface.",
    description:
      "Read SSR hydration state without launching a browser, or capture live requests through CDP. Deterministic Draft 2020-12 schema induction turns observed JSON into task-scoped tools.",
    steps: [
      "Sniff hydration or network traffic",
      "Cluster paths; infer typed parameters",
      "Mount a minimal MCP tool set",
    ],
    code: 'search_stories({ query: "agent infrastructure" })\n→ { hits: [{ id: 420, title: "…" }] }',
    fact: "14.8 ms",
    caption: "Paper SSR compilation time",
    detail:
      "98.4% fewer schema tokens in the 20-app paper evaluation: 24,100 → 380.",
  },
  GraphQL: {
    input: "Introspection / operations / subscriptions",
    heading: "One graph. Focused operations.",
    description:
      "Discover typed queries and mutations through introspection and captured operations. Keep subscriptions live with Server-Sent Events or graphql-transport-ws.",
    steps: [
      "Discover the graph and operations",
      "Bind variables to a typed schema",
      "Return results or subscription events",
    ],
    code: "query Stories($query: String!) {\n  stories(query: $query) { id title }\n}\n→ typed tool / SSE / graphql-transport-ws",
    fact: "SSE / WS",
    caption: "GraphQL subscription transports",
    detail:
      "Queries, mutations, and subscriptions share the task-scoped MCP interface.",
  },
  "gRPC-Web": {
    input: "Binary / base64 text frames",
    heading: "A typed boundary for binary traffic.",
    description:
      "Bounded gRPC-Web codecs decode binary and text frames, including +proto and +json payloads. Stream messages become structured values at the tool boundary.",
    steps: [
      "Capture service and method traffic",
      "Decode bounded gRPC-Web frames",
      "Expose messages through MCP",
    ],
    code: "application/grpc-web+proto\napplication/grpc-web-text+proto\napplication/grpc-web+json\n→ decoded messages + trailers",
    fact: "+proto / +json",
    caption: "Binary and text codecs",
    detail:
      "Framing is bounded; descriptor-free protobuf values preserve their wire structure.",
  },
  WebSockets: {
    input: "Real-time channel traffic",
    heading: "Keep the stream in the interface.",
    description:
      "Observed WebSocket channels become real-time stream tools. Agents consume structured events through MCP instead of repeatedly polling a rendered page.",
    steps: [
      "Observe the WebSocket channel",
      "Compile the channel request plan",
      "Deliver a bounded event stream",
    ],
    code: "WebSocket channel\n→ structured stream tool\n→ event / event / event",
    fact: "Stream tools",
    caption: "Real-time event delivery",
    detail:
      "Stream lifetime and message bounds keep live channels within the execution budget.",
  },
  Documents: {
    input: "Static HTML / no API traffic",
    heading: "A quiet page still has something to say.",
    description:
      "When no relevant API frames are available, Reify synthesizes semantic document tools. It prunes HTML to Markdown, extracts links, and decodes Cloudflare-obfuscated email addresses.",
    steps: [
      "Classify the static document",
      "Extract text, links, and contacts",
      "Publish tools, Resources, and Prompts",
    ],
    code: "read_document / list_links / get_contact_points\nresources/read → reify://…\nprompts/list → task prompts",
    fact: "3 fallback tools",
    caption: "A successful mount never yields tools: []",
    detail:
      "Document fallback creates a useful interface; it does not invent an upstream API.",
  },
};

type Protocol = keyof typeof protocols;
const options: Protocol[] = [
  "REST / JSON",
  "GraphQL",
  "gRPC-Web",
  "WebSockets",
  "Documents",
];

export function ProtocolExplorer() {
  const [selected, setSelected] = useState<Protocol>("REST / JSON");
  const id = useId();
  const panelId = `${id}-protocol`;
  const current = protocols[selected];

  return (
    <div className="protocol-inspector">
      <div className="inspector-heading">
        <span>Universal protocol explorer</span>
        <span>Architecture examples</span>
      </div>
      <IntegrationTabs
        options={options}
        value={selected}
        onChange={setSelected}
        panelId={panelId}
        label="Protocol to inspect"
      />
      <div
        role="tabpanel"
        id={panelId}
        aria-labelledby={`${panelId}-tab-${options.indexOf(selected)}`}
        tabIndex={0}
      >
        <div className="protocol-body">
          <div className="protocol-copy" key={selected}>
            <span className="mono muted">{current.input}</span>
            <h3>{current.heading}</h3>
            <p>{current.description}</p>
            <ol className="protocol-steps">
              {current.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
          <div className="protocol-output">
            <Wire compact />
            <pre>{current.code}</pre>
          </div>
        </div>
        <div className="protocol-foot" aria-live="polite" aria-atomic="true">
          <div>
            <strong>{current.fact}</strong>
            <span>{current.caption}</span>
          </div>
          <p>{current.detail}</p>
        </div>
      </div>
    </div>
  );
}
