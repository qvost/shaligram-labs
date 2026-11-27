import Link from "next/link";
import { publicationPath, reify } from "@/lib/research";
import { InteractiveMark } from "./interactive-mark";
import { Wire } from "./wire";

export function Home() {
  return (
    <>
      <section className="lab-hero page-width">
        <div className="lab-location">
          <span>Independent research, Kathmandu</span>
        </div>
        <h1 className="lab-title" data-motion-title>
          SHALIGRAM LABS
        </h1>
        <div className="lab-hero-grid">
          <div>
            <h2 data-motion-title>
              Research for
              <br />
              web agents.
            </h2>
            <p>
              We investigate how agents use the web, then build the
              infrastructure that makes those interactions reliable.
            </p>
            <Link className="button" href="/research">
              Explore our research <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <InteractiveMark />
        </div>
        <div className="hero-foot">
          <a href="#selected-research">
            Selected work <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      <section id="selected-research" className="selected-research page-width">
        <div className="section-heading">
          <div>
            <span className="section-kicker">Selected work</span>
            <h2 data-motion-title>Research in practice.</h2>
          </div>
          <Link className="text-link" href="/research">
            Research library <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <article className="featured-paper lab-project">
          <div className="featured-visual">
            <div className="featured-visual-heading">
              <span>Live web</span>
              <span>Web → tool</span>
            </div>
            <Wire />
            <div className="featured-visual-footer">
              <span>Observe</span>
              <span>Compile</span>
            </div>
          </div>
          <div className="featured-content">
            <div className="publication-meta">
              <span>Open source system</span>
              <span>{reify.year}</span>
            </div>
            <h3>
              <Link href="/systems/reify">{reify.name}</Link>
            </h3>
            <p>
              Our first system turns live websites into focused tools for
              agents, giving each task an interface it can use.
            </p>
            <div className="link-pair">
              <Link className="text-link" href="/systems/reify">
                Explore Reify <span aria-hidden="true">↗</span>
              </Link>
              <Link className="text-link" href={publicationPath(reify)}>
                Read the paper <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </article>
      </section>

      <section className="lab-thesis page-width">
        <div>
          <span className="section-kicker">Our approach</span>
          <h2 data-motion-title>
            Built to be
            <br />
            understood.
          </h2>
        </div>
        <div>
          <p>
            We develop working systems and publish the evidence behind them:
            code, methods, measurements, and the approaches that failed.
          </p>
          <p>Our work is open to inspection, use, and further research.</p>
          <Link className="text-link" href="/manifesto">
            Read our manifesto <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </>
  );
}
