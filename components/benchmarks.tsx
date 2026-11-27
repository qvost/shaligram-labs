"use client";

import { useState } from "react";
import type { Benchmark } from "@/lib/research";
import { BudgetScrubber } from "./research-controls";

export function Benchmarks({ rows }: { rows: Benchmark[] }) {
  const [budget, setBudget] = useState(25000);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"success" | "tokens" | "name">("success");
  const filtered = rows
    .filter((row) =>
      row.name.toLowerCase().includes(query.toLowerCase().trim()),
    )
    .sort((a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name)
        : sort === "tokens"
          ? a.tokens - b.tokens
          : b.success - a.success,
    );
  return (
    <>
      <div className="evidence-chart">
        <div className="chart-heading">
          <h3>Task success within a schema budget</h3>
          <span>Paper results</span>
        </div>
        <div className="success-bars">
          {rows.map((row) => (
            <div
              className="success-row"
              key={row.name}
              data-muted={row.tokens > budget}
            >
              <span>{row.name}</span>
              <div className="success-track">
                <span
                  className={row.family}
                  style={{ width: `${row.success}%` }}
                />
              </div>
              <strong>{row.success.toFixed(1)}%</strong>
            </div>
          ))}
        </div>
        <BudgetScrubber value={budget} onChange={setBudget} />
        <p className="note" aria-live="polite">
          {rows.filter((row) => row.tokens <= budget).length} of {rows.length}{" "}
          methods fit this initial schema budget. Faded bars exceed it. Visual
          agents still consume tokens during execution.
        </p>
      </div>
      <div className="benchmark-controls">
        <label>
          <span className="sr-only">Search benchmark methods</span>
          <input
            type="search"
            placeholder="Search methods…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <label>
          <span className="sr-only">Sort benchmarks</span>
          <select
            value={sort}
            onChange={(event) => {
              const value = event.target.value;
              if (value === "success" || value === "tokens" || value === "name")
                setSort(value);
            }}
          >
            <option value="success">Success ↓</option>
            <option value="tokens">Tokens ↑</option>
            <option value="name">Method A–Z</option>
          </select>
        </label>
      </div>
      <div
        className="table-scroll"
        tabIndex={0}
        role="region"
        aria-label="Complete benchmark comparison"
      >
        <table>
          <caption>
            Reported results across 20 production web applications
          </caption>
          <thead>
            <tr>
              <th scope="col">Method</th>
              <th scope="col">Schema tokens</th>
              <th scope="col">Cold mount</th>
              <th scope="col">Warm call (µs)</th>
              <th scope="col">Task success</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr
                key={row.name}
                className={row.family === "reify" ? "highlight" : ""}
              >
                <th scope="row">{row.name}</th>
                <td>{row.tokens.toLocaleString("en-US")}</td>
                <td>{row.cold}</td>
                <td>{row.warm}</td>
                <td>{row.success.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="note" role="status">
        {filtered.length} of {rows.length} benchmark methods
        {query && ` matching “${query}”`}.
      </p>
      <p className="note">
        Cold mount and warm call measure different operations. Warm calls
        exclude upstream network I/O. See measurement notes for the separate
        repository audit.
      </p>
    </>
  );
}
