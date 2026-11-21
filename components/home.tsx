import Link from "next/link";
import { LabMark } from "./lab-mark";
import { publications, publicationPath, reify } from "@/lib/research";

import { Wire } from "./wire";

export function Home() {
  return (
    <>
      <section className="lab-hero page-width">
        <div className="lab-location">
          <span>Independent research, Kathmandu</span>
        </div>
        <h1 className="lab-title">SHALIGRAM LABS</h1>
        <div className="lab-hero-grid">
          <div>
            <h2>
              Foundations
              <br />
              for autonomy.
            </h2>
            <p>
              We study how intelligent agents interact with the world, and build
              the infrastructure that makes those interactions reliable.
            </p>
            <Link className="button" href="/research">
              Explore our research <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="strata-art" aria-hidden="true">
            <LabMark />
          </div>
        </div>
        <div className="hero-foot">
          <a href="#selected-research">
            Discover the work <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      <section id="selected-research" className="selected-research page-width">
        <div className="section-heading">
          <div>
            <span className="section-kicker">Latest research</span>
            <h2>Making the web callable.</h2>
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
                The right tools.
                <br />
                At the moment of need.
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
                <Link href={reify.system}>Explore the system</Link>
              )}
            </div>
          </div>
        </article>
      </section>

      <section className="lab-thesis page-width">
        <div>
          <span className="section-kicker">Our approach</span>
          <h2>
            Let models reason.
            <br />
            Let systems execute.
          </h2>
        </div>
        <div>
          <p>
            Better reasoning needs a reliable connection to the world. We work
            on small interfaces, deterministic execution, and systems that can
            recover when their environment changes.
          </p>
          <p>
            We publish the methods, measurements, and failures alongside the
            code.
          </p>
          <Link className="text-link" href="/manifesto">
            The thinking behind the lab <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </>
  );
}
