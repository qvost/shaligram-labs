"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { reifyMetrics } from "@/lib/research";

type Tier = "profile" | "hydration" | "network";

const order: Tier[] = ["profile", "hydration", "network"];

const tiers = {
  profile: {
    title: "Pre-warmed fast path",
    label: "Profile match",
    description: (
      <>
        Mount one of 25 curated profiles with 39 read operations in{" "}
        {reifyMetrics.profileMount.value}. Matching and mounting make no network
        requests. Tool calls still use the upstream API.
      </>
    ),
    result: "Reify mounts the matching profile.",
    detail: "The profile already defines the request plan and its schema. Reify can skip live discovery for this task.",
    checks: ["Match found", "Not needed", "Not needed"],
    value: reifyMetrics.profileMount.value,
    measurement: "Paper profile mount time",
  },
  hydration: {
    title: "Zero-browser dynamic compiler",
    label: "Hydration state",
    description: (
      <>
        On a cache miss, Reify reads live HTML for <code>__NEXT_DATA__</code>,{" "}
        <code>__remixContext</code>, or <code>__NUXT_DATA__</code>. It infers
        Draft 2020-12 JSON Schemas. The paper reports 14.8 ms for this path.
      </>
    ),
    result: "Reify compiles the page's embedded data.",
    detail: "No profile matches, but the HTML contains usable hydration state. Reify infers a typed interface without starting a browser.",
    checks: ["No match", "State found", "Not needed"],
    value: "14.8 ms",
    measurement: "Paper SSR path time",
  },
  network: {
    title: "CDP socket interception",
    label: "Network capture",
    description: (
      <>
        If hydration state and static HTML cannot resolve the task, Reify
        captures traffic through Chrome DevTools Protocol. The project reports
        filtering out 99% of visual and tracking noise at the socket.
      </>
    ),
    result: "Reify compiles captured network requests.",
    detail: "The HTTP path cannot resolve the task. A browser probe captures structured requests and responses for schema inference.",
    checks: ["No match", "No usable state", "Traffic captured"],
    value: "99%",
    measurement: "Project-reported noise filtering",
  },
} satisfies Record<Tier, {
  title: string;
  label: string;
  description: ReactNode;
  result: string;
  detail: string;
  checks: string[];
  value: string;
  measurement: string;
}>;

export function DiscoveryExplorer() {
  const [selected, setSelected] = useState<Tier>("profile");
  const list = useRef<HTMLOListElement>(null);
  const id = useId();
  const active = order.indexOf(selected);
  const current = tiers[selected];

  return (
    <div className="discovery-explorer">
      <p className="discovery-instruction" id={id + "-instruction"}>
        Choose an example to trace Reify's resolution order.
      </p>
      <ol
        className="system-paths discovery-options"
        ref={list}
        aria-describedby={id + "-instruction"}
      >
        {order.map((tier, index) => (
          <li key={tier} data-selected={selected === tier}>
            <h3>
              <button
                type="button"
                aria-pressed={selected === tier}
                aria-controls={id + "-result"}
                onClick={() => setSelected(tier)}
                onKeyDown={(event) => {
                  const next = event.key === "ArrowRight"
                    ? (index + 1) % order.length
                    : event.key === "ArrowLeft"
                      ? (index + order.length - 1) % order.length
                      : event.key === "Home"
                        ? 0
                        : event.key === "End"
                          ? order.length - 1
                          : undefined;
                  if (next === undefined) return;
                  event.preventDefault();
                  setSelected(order[next]);
                  list.current?.querySelectorAll("button")[next]?.focus();
                }}
              >
                <span className="discovery-tier">
                  Tier {index + 1}
                  <span aria-hidden="true">{selected === tier ? "Selected" : "Trace path"}</span>
                </span>
                <span className="discovery-title">{tiers[tier].title}</span>
              </button>
            </h3>
            <p>{tiers[tier].description}</p>
          </li>
        ))}
      </ol>
      <div className="discovery-trace">
        <div className="discovery-track" aria-hidden="true">
          <span className="discovery-trace-base" />
          <span
            className="discovery-trace-ink"
            style={{ transform: `scaleX(${active / (order.length - 1)})` }}
          />
          {order.map((tier, index) => (
            <span
              key={tier}
              className="discovery-node"
              data-visited={index <= active}
              style={{ left: `${index / (order.length - 1) * 100}%` }}
            />
          ))}
        </div>
        <ol className="discovery-checks" aria-label="Example resolution">
          {order.map((tier, index) => (
            <li key={tier} data-resolved={index === active}>
              <span>{tiers[tier].label}</span>
              <strong>{current.checks[index]}</strong>
            </li>
          ))}
        </ol>
      </div>
      <div className="discovery-result" id={id + "-result"} aria-live="polite" aria-atomic="true">
        <div key={selected} className="discovery-result-copy">
          <h3>{current.result}</h3>
          <p>{current.detail}</p>
          <p className="discovery-mobile-description">{current.description}</p>
        </div>
        <div className="discovery-measurement">
          <strong>{current.value}</strong>
          <span>{current.measurement}</span>
        </div>
      </div>
      <p className="note">
        These examples illustrate the architecture. Run the CLI below to compile
        a website. Timings exclude upstream tool calls.
      </p>
    </div>
  );
}
