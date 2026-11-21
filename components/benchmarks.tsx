"use client";

import { useState } from "react";
import type { Benchmark } from "@/lib/research";
import { BudgetScrubber } from "./research-controls";

export function Benchmarks({ rows }: { rows: Benchmark[] }) {
  const [budget, setBudget] = useState(25000);
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
            {rows.map((row) => (
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
      <p className="note">
        Cold mount and warm call measure different operations. Warm calls
        exclude upstream network I/O. See measurement notes for the separate
        repository audit.
      </p>
    </>
  );
}
