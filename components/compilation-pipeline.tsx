"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stages = [
  {
    title: "Observe the wire",
    text: "Resolve a pre-warmed profile, sniff embedded hydration state, or capture live protocol traffic through CDP.",
    code: "profile → hydration → network\nREST / GraphQL / gRPC-Web / WS",
  },
  {
    title: "Find the structure",
    text: "Cluster dynamic paths into parameters. Infer Draft 2020-12 schemas from the payloads that actually cross the wire.",
    code: "/stories/420 → /stories/{id}\n{ id: integer, title: string }",
  },
  {
    title: "Compose the task",
    text: "Keep a focused tool set, or bind extracted fields across a bounded sequential ExecutionSpec workflow into one MCP tool.",
    code: "search → $.items[0].id → read\none tool / sequential execution",
  },
  {
    title: "Mount and maintain",
    text: "Serve stateless MCP with pooled transport, SWR caching, tenant isolation, and canary self-healing. Static pages receive document tools.",
    code: "POST /mcp → typed result\nreify watch → detect drift → heal",
  },
];

export function CompilationPipeline() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const section = root.current;
    const rail = track.current;
    if (!section || !rail) return;
    const media = gsap.matchMedia();
    media.add(
      "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
      () => {
        const context = gsap.context(() => {
          gsap.to(rail, {
            x: () => -Math.max(0, rail.scrollWidth - section.clientWidth),
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 90px",
              end: () => `+=${rail.scrollWidth}`,
              scrub: 1,
              pin: true,
              invalidateOnRefresh: true,
            },
          });
        }, section);
        return () => context.revert();
      },
    );
    return () => media.revert();
  }, []);

  return (
    <section
      className="compilation-pipeline system-section"
      ref={root}
      aria-labelledby="pipeline-title"
    >
      <div className="page-width section-heading">
        <h2 id="pipeline-title" data-motion-title>
          From signal to system.
        </h2>
        <span className="mono muted">The compilation pipeline</span>
      </div>
      <ol className="pipeline-track" ref={track}>
        {stages.map((stage, index) => (
          <li key={stage.title} className="pipeline-card">
            <div className="pipeline-index">
              <span>0{index + 1}</span>
              <span aria-hidden="true">↗</span>
            </div>
            <h3>{stage.title}</h3>
            <pre>{stage.code}</pre>
            <p>{stage.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
