"use client";

import Link from "next/link";
import { useState } from "react";
import { publications, publicationPath, reify } from "@/lib/research";
import { LatencyBench } from "./latency-bench";

export function Research() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All research");
  const [sort, setSort] = useState("newest");
  const categories = [
    "All research",
    ...new Set(publications.map((paper) => paper.category)),
  ];
  const filtered = publications
    .filter(
      (paper) =>
        (category === "All research" || paper.category === category) &&
        `${paper.name} ${paper.title} ${paper.summary} ${paper.tags.join(" ")} ${paper.author} ${paper.year}`
          .toLowerCase()
          .includes(query.toLowerCase().trim()),
    )
    .sort((a, b) =>
      sort === "title" ? a.title.localeCompare(b.title) : b.year - a.year,
    );

  return (
    <div className="research-index page-width">
      <section className="archive-hero">
        <span className="section-kicker">The research library</span>
        <h1 data-motion-title>
          Research on
          <br />
          web agents.
        </h1>
        <div className="archive-intro">
          <p>
            Read the Reify paper, compare its reported results, and inspect the
            multi-protocol compiler, transport, and native bindings.
          </p>
          <span>
            {publications.length}{" "}
            {publications.length === 1 ? "publication" : "publications"}
            <br />
            Open research from Kathmandu
          </span>
        </div>
        <div className="link-pair research-downloads">
          <a className="button" href={reify.pdf} download>
            Download Research Paper (PDF) <span aria-hidden="true">↓</span>
          </a>
          <a className="text-link" href="/reify_paper.tex" download>
            Download LaTeX Source <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>
      <section className="archive" aria-label="Publications">
        <div className="archive-toolbar">
          <label className="search-field">
            <span aria-hidden="true">⌕</span>
            <span className="sr-only">Search publications</span>
            <input
              type="search"
              placeholder="Search titles, topics, authors…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <label className="sort-field">
            <span className="sr-only">Sort publications</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              <option value="newest">Newest first</option>
              <option value="title">Title A to Z</option>
            </select>
          </label>
        </div>
        <div
          className="archive-filters"
          role="group"
          aria-label="Filter by research area"
        >
          {categories.map((item) => (
            <button
              key={item}
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {item}
              {item === "All research" && <span>{publications.length}</span>}
            </button>
          ))}
        </div>
        <p className="results-count" role="status">
          {filtered.length}{" "}
          {filtered.length === 1 ? "publication" : "publications"}
          {query && ` matching "${query}"`}
        </p>
        <div className="publication-list">
          {filtered.map((paper) => (
            <article className="publication-row" key={paper.slug}>
              <div className="publication-year">
                {paper.year}
                <span>Research paper</span>
              </div>
              <div className="publication-info">
                <div className="publication-meta">
                  <span>{paper.name}</span>
                  <span>{paper.category}</span>
                </div>
                <h2>
                  <Link href={publicationPath(paper)}>{paper.title}</Link>
                </h2>
                <p>{paper.summary}</p>
                <div className="publication-tags">
                  {paper.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <div className="publication-author">{paper.author}</div>
              </div>
              <div className="publication-actions">
                <Link className="button" href={publicationPath(paper)}>
                  Read paper <span aria-hidden="true">↗</span>
                </Link>
                <a href={paper.pdf}>
                  PDF <span aria-hidden="true">↗</span>
                </a>
                {paper.source && (
                  <a href={paper.source}>
                    Code <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
        {!filtered.length && (
          <div className="archive-empty">
            <h2>No publications found.</h2>
            <p>Try another title, topic, or author.</p>
            <button
              className="button"
              onClick={() => {
                setQuery("");
                setCategory("All research");
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
      <section
        className="system-section research-evaluation"
        id="reproducible-bench"
      >
        <div className="section-heading">
          <h2 data-motion-title>
            Reproducible <code>reify bench</code>
            <br />
            evaluation.
          </h2>
        </div>
        <p className="evaluation-intro">
          Inspect the verified local Chromium comparison, then read the full
          paper for the schema-budget scrubber, tradeoff curve, 20-service
          aggregate comparison, booking trace, and negative results.
        </p>
        <LatencyBench />
        <div className="research-notes">
          <div>
            <h3>Beyond REST and JSON.</h3>
            <p>
              GraphQL introspection and SSE/WS subscriptions, binary/text
              gRPC-Web (+proto/+json), real-time WebSocket tools, and sequential
              ExecutionSpec workflow macros extend the same compiler. Static
              pages receive read_document, list_links, get_contact_points, MCP
              Resources, and Prompts.
            </p>
          </div>
          <div>
            <h3>Transport has its own boundary.</h3>
            <p>
              Pooled HTTP/3 and replay-safe QUIC 0-RTT, dual-stack Happy
              Eyeballs, UDP-blackhole fallback, concurrent SWR caching, tenant
              isolation, and opt-in OTLP/Prometheus are implementation
              capabilities. The local HTTP fixture does not benchmark QUIC or
              WAN behavior.
            </p>
          </div>
        </div>
        <Link className="text-link" href={publicationPath(reify)}>
          Open the complete interactive paper ↗
        </Link>
      </section>
      <div className="archive-end">
        <LabNote />
        <a className="text-link" href="mailto:qvostwon@gmail.com">
          Email the lab <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  );
}

function LabNote() {
  return <p>Send us research questions or implementation feedback.</p>;
}
