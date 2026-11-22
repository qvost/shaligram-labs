import Link from "next/link";
import { InteractiveMark } from "./interactive-mark";
import { publications, publicationPath, reify } from "@/lib/research";

import { Wire } from "./wire";

export function Home() {
  return (
    <>
      <section className="lab-hero page-width">
        <div className="lab-location">
          <span>Independent research, Kathmandu</span>
        </div>
        <h1 className="lab-title" data-motion-title>SHALIGRAM LABS</h1>
        <div className="lab-hero-grid">
          <div>
            <h2 data-motion-title>
              Tools for
              <br />
              web agents.
            </h2>
            <p>
              We study how agents use websites. Our first system, Reify,
              compiles the tools an agent needs for a specific task.
            </p>
            <Link className="button" href="/research">
              Explore our research <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <InteractiveMark />
        </div>
        <div className="hero-foot">
          <a href="#selected-research">
            Read about Reify <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      <section id="selected-research" className="selected-research page-width">
        <div className="section-heading">
          <div>
            <span className="section-kicker">Latest research</span>
            <h2 data-motion-title>The Reify paper.</h2>
          </div>
          <Link className="text-link" href="/research">
            All publications ({publications.length}){" "}
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <article className="featured-paper">
          <div className="featured-visual">
            <div className="featured-visual-heading">
              <span>{reify.name}</span>
              <span>Web → tool</span>
            </div>
            <Wire />
            <div className="featured-visual-footer">
              <span>Rust</span>
              <span>Typed, task-scoped MCP</span>
            </div>
          </div>
          <div className="featured-content">
            <div className="publication-meta">
              <span>{reify.category}</span>
              <span>{reify.year}</span>
            </div>
            <h3>
              <Link href={publicationPath(reify)}>
                Compile tools
                <br />
                from live websites.
              </Link>
            </h3>
            <p>{reify.summary}</p>
            <div className="metric-strip">
              {reify.metrics.map((metric) => (
                <div key={metric.label}>
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </div>
              ))}
            </div>
            <p className="note">
              Author-reported results from the Reify paper.
            </p>
            <div className="link-pair">
              <Link className="text-link" href={publicationPath(reify)}>
                Read the research <span aria-hidden="true">↗</span>
              </Link>
              {reify.system && (
                <Link href={reify.system + "#discovery"}>Explore discovery</Link>
              )}
            </div>
          </div>
        </article>
      </section>

      <section className="lab-thesis page-width">
        <div>
          <span className="section-kicker">Our approach</span>
          <h2 data-motion-title>
            How we work.
          </h2>
        </div>
        <div>
          <p>
            We build small, typed interfaces for agent tasks. When an
            upstream API changes, Reify can compile a new interface.
          </p>
          <p>
            We publish the methods, measurements, and failures alongside the
            code.
          </p>
          <Link className="text-link" href="/manifesto">
            Read our manifesto <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </>
  );
}
