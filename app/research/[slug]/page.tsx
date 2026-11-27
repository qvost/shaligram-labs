import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { publications, type ResearchSection } from "@/lib/research";
import { Benchmarks } from "@/components/benchmarks";
import { Copy } from "@/components/copy";
import { PaperNavigation } from "@/components/paper-navigation";
import { BookingTrace, TradeoffCurve } from "@/components/research-figures";
import { LatencyBench } from "@/components/latency-bench";

export function generateStaticParams() {
  return publications.map((paper) => ({ slug: paper.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const paper = publications.find((item) => item.slug === slug);
  return paper
    ? { title: `${paper.name} · Research`, description: paper.summary }
    : {};
}

function SectionContent({ section }: { section: ResearchSection }) {
  switch (section.kind) {
    case "tradeoff":
      return <TradeoffCurve />;
    case "trace":
      return <BookingTrace />;
    case "latency":
      return <LatencyBench />;
    case "text":
      return section.paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ));
    case "benchmarks":
      return (
        <>
          <p>{section.description}</p>
          <Benchmarks rows={section.rows} />
        </>
      );
    case "table":
      return (
        <div
          className="table-scroll"
          tabIndex={0}
          role="region"
          aria-label={section.title}
        >
          <table>
            <thead>
              <tr>
                {section.columns.map((column) => (
                  <th key={column} scope="col">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.rows.map((row) => (
                <tr key={row[0]}>
                  {row.map((value, i) =>
                    i === 0 ? (
                      <th key={i} scope="row">
                        {value}
                      </th>
                    ) : (
                      <td key={i}>{value}</td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default: {
      const exhaustive: never = section;
      return exhaustive;
    }
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const paper = publications.find((item) => item.slug === slug);
  if (!paper) notFound();
  return (
    <>
      <section className="publication-hero page-width">
        <Link className="back-link" href="/research">
          ← All research
        </Link>
        <div className="publication-meta">
          <span>{paper.category}</span>
          <span>Research paper / {paper.year}</span>
        </div>
        <h1 data-motion-title>{paper.title}</h1>
        <div className="paper-meta">
          <div>
            <strong>{paper.author}</strong>
            <span>Shaligram Labs, Kathmandu</span>
          </div>
          <div className="paper-resources">
            <a className="button" href={paper.pdf} download>
              Download Research Paper (PDF) <span aria-hidden="true">↓</span>
            </a>
            {paper.resources
              .filter((resource) => resource.href.endsWith(".tex"))
              .map((resource) => (
                <a
                  className="text-link"
                  href={resource.href}
                  key={resource.href}
                  download
                >
                  {resource.label} <span aria-hidden="true">↓</span>
                </a>
              ))}
            {paper.source && (
              <a className="text-link" href={paper.source}>
                Source code <span aria-hidden="true">↗</span>
              </a>
            )}
            {paper.system && (
              <Link className="text-link" href={paper.system}>
                Use {paper.name} <span aria-hidden="true">↗</span>
              </Link>
            )}
          </div>
        </div>
        {paper.metrics.length > 0 && (
          <div className="paper-metrics">
            {paper.metrics.map((metric) => (
              <div key={metric.label}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
            <p>
              Author-reported results. See evaluation and measurement notes.
            </p>
          </div>
        )}
      </section>
      <div className="paper-layout page-width">
        <PaperNavigation
          items={[
            { id: "abstract", title: "Abstract" },
            ...paper.sections.map(({ id, title }) => ({ id, title })),
            { id: "citation", title: "Citation and resources" },
          ]}
        />
        <article className="paper-body">
          <section id="abstract">
            <span className="section-kicker">Abstract</span>
            <h2 data-motion-title>{paper.abstractTitle}</h2>
            {paper.abstract.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
          {paper.sections.map((section) => (
            <section id={section.id} key={section.id}>
              <h2 data-motion-title>{section.title}</h2>
              <SectionContent section={section} />
            </section>
          ))}
          <section id="citation">
            <h2 data-motion-title>Cite the paper.</h2>
            <div className="code-block">
              <Copy value={paper.citation} />
              <pre>{paper.citation}</pre>
            </div>
            <div className="resource-links">
              <a href={paper.pdf} download>
                Download the paper (PDF)
              </a>
              {paper.source && (
                <a href={paper.source}>Browse the implementation</a>
              )}
              {paper.resources.map((resource) => (
                <a key={resource.href} href={resource.href}>
                  {resource.label}
                </a>
              ))}
            </div>
          </section>
        </article>
      </div>
    </>
  );
}
