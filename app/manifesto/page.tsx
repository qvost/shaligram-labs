import Link from "next/link";
import { LabMark } from "@/components/lab-mark";
import { ManifestoContract } from "@/components/manifesto-contract";
import { publicationPath, reify } from "@/lib/research";

export const metadata = { title: "Manifesto" };

export default function Page() {
  return (
    <>
      <section className="manifesto-hero section">
        <h1 className="display" data-motion-title>
          Agents need
          <br />
          reliable tools.
        </h1>
        <p className="lead">
          We build the interfaces that let agents use websites.
        </p>
        <nav className="manifesto-principles" aria-label="Manifesto principles">
          <a href="#working-interfaces">
            Try an interface <span aria-hidden="true">↓</span>
          </a>
          <a href="#measured-results">
            Inspect the evidence <span aria-hidden="true">↓</span>
          </a>
          <a href="#our-name">
            Our name <span aria-hidden="true">↓</span>
          </a>
        </nav>
        <div className="stone" aria-hidden="true">
          <LabMark />
        </div>
      </section>
      <article className="manifesto-body">
        <section id="working-interfaces">
          <h2 data-motion-title>A model still needs a working interface.</h2>
          <p>
            More parameters do not fix a broken selector. A larger context
            window does not make an irrelevant tool useful. An agent needs to
            know what it can call and what each call expects.
          </p>
          <p>
            We build small, typed interfaces that agents can inspect and use.
            Reify compiles those interfaces from website data and network
            traffic.
          </p>
          <ManifestoContract />
        </section>
        <section id="measured-results">
          <h2 data-motion-title>Measure completed tasks.</h2>
          <p>
            A working tool must encode the URL, validate its inputs, and
            dispatch the request. These operations should follow explicit rules.
          </p>
          <p>
            We measure task completion alongside schema size and execution cost.
            We publish failed approaches so others can see which methods we
            abandoned and why.
          </p>
          <details className="manifesto-evidence">
            <summary>
              Inspect Reify&apos;s reported results{" "}
              <span aria-hidden="true">+</span>
            </summary>
            <div className="manifesto-evidence-content">
              <div className="metric-strip">
                {reify.metrics.map(({ value, label }) => (
                  <div key={label}>
                    <strong>{value}</strong>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
              <p className="note">
                Author-reported paper results. Profile mount time excludes
                process startup and network I/O; task completion is measured
                separately.
              </p>
              <Link
                className="text-link"
                href={publicationPath(reify) + "#evaluation"}
              >
                Read the evaluation <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </details>
        </section>
        <section id="our-name">
          <h2 data-motion-title>Shaligram.</h2>
          <p>
            Our name comes from the stones of Nepal’s Kali Gandaki. We are an
            independent research venture in Kathmandu.
          </p>
          <p>
            Reify is our first system. It discovers data in websites, infers
            schemas, and exposes tools for an agent’s current task. The paper
            and source code document its methods and limits.
          </p>
          <Link className="button" href="/research">
            Read the research
          </Link>
        </section>
      </article>
    </>
  );
}
