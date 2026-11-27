"use client";

import { useEffect, useState } from "react";
import { reify, type Benchmark } from "@/lib/research";
import { BudgetScrubber } from "./research-controls";

const rows: Benchmark[] = reify.sections.flatMap((section) =>
  section.kind === "benchmarks" ? section.rows : [],
);
const points = rows.filter(
  (row) =>
    !row.name.includes("browser action") && !row.name.includes("profile"),
);

export function TradeoffCurve() {
  const [budget, setBudget] = useState(25000);
  return (
    <div className="tradeoff-figure">
      <p>
        Move the budget to inspect the paper’s tradeoff between initial schema
        size and task completion across 20 services.
      </p>
      <svg
        viewBox="0 0 660 300"
        role="img"
        aria-labelledby="tradeoff-chart-title tradeoff-chart-description"
      >
        <title id="tradeoff-chart-title">
          Task success versus initial schema tokens
        </title>
        <desc id="tradeoff-chart-description">
          Reify: 380 tokens, 92.5% success. Full static MCP: 24,100 tokens, 89%.
          Unpruned wire: 18,450 tokens, 82.5%. Visual browser-use: zero initial
          schema tokens, 61% success. Points beyond the selected budget are
          faded.
        </desc>
        {[100, 85, 70, 55].map((value) => (
          <g key={value}>
            <line
              x1="48"
              y1={30 + (100 - value) * 4.4}
              x2="625"
              y2={30 + (100 - value) * 4.4}
              stroke="var(--line)"
            />
            <text x="12" y={34 + (100 - value) * 4.4}>
              {value}
            </text>
          </g>
        ))}
        <line
          x1={50 + (budget / 25000) * 560}
          y1="24"
          x2={50 + (budget / 25000) * 560}
          y2="245"
          stroke="var(--fg)"
          strokeDasharray="3 5"
        />
        {points.map((row) => {
          const x = 50 + (row.tokens / 25000) * 560;
          const y = 30 + (100 - row.success) * 4.4;
          return (
            <g key={row.name} opacity={row.tokens > budget ? 0.25 : 1}>
              <circle
                cx={x}
                cy={y}
                r={row.family === "reify" ? 6 : 4}
                fill="currentColor"
              />
              <text
                x={x > 470 ? x - 12 : x + 12}
                y={y - 12}
                textAnchor={x > 470 ? "end" : "start"}
              >
                {row.family === "reify"
                  ? "Reify / SSR"
                  : row.name.replace(" (Playwright)", "")}
              </text>
            </g>
          );
        })}
        <text x="48" y="265">
          0
        </text>
        <text x="610" y="265" textAnchor="end">
          25,000
        </text>
        <text x="330" y="293" textAnchor="middle">
          Initial schema tokens / task success (%)
        </text>
      </svg>
      <BudgetScrubber value={budget} onChange={setBudget} />
      <p className="note" aria-live="polite">
        {rows.filter((row) => row.tokens <= budget).length} of {rows.length}{" "}
        methods fit this budget. Visual agents still consume tokens during
        execution; these are initial schema counts.
      </p>
    </div>
  );
}

const steps = [
  "Ready to search",
  "Search flights",
  "Select itinerary",
  "Enter passenger details",
  "Booking confirmation",
];

export function BookingTrace() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      if (step >= steps.length - 2) setPlaying(false);
      setStep((previous) => Math.min(steps.length - 1, previous + 1));
    }, 900);
    return () => window.clearTimeout(timer);
  }, [playing, step]);

  return (
    <div className="booking-trace">
      <p>
        Five steps through the same booking goal. This is an illustrative
        architecture playback, not a recorded run or an evaluation of booking
        latency.
      </p>
      <ol className="booking-steps" aria-label="Booking workflow">
        {steps.map((label, index) => (
          <li
            key={label}
            data-visited={index <= step}
            aria-current={index === step ? "step" : undefined}
          >
            <span>0{index + 1}</span>
            {label}
          </li>
        ))}
      </ol>
      <div className="booking-paths">
        <div>
          <span className="mono muted">Visual agent</span>
          <h3>{steps[step]}</h3>
          <p>Screenshot → reason → locate → interact</p>
          <small>Presentation and interaction state at every step.</small>
        </div>
        <div>
          <span className="mono muted">Reify / workflow macro</span>
          <h3>{steps[step]}</h3>
          <p>
            {step === 0
              ? "Compile a bounded execution plan"
              : step === 1
                ? "search_flights → itinerary_id"
                : step === 2
                  ? "itinerary_id → select_itinerary"
                  : step === 3
                    ? "passenger fields → prepare_booking"
                    : "Structured confirmation → tool result"}
          </p>
          <small>Extracted fields pass into the next sequential request.</small>
        </div>
      </div>
      <div className="trace-playback">
        <button
          className="button"
          onClick={() => {
            if (step === steps.length - 1) setStep(0);
            setPlaying((previous) => !previous);
          }}
        >
          {playing ? "Pause playback" : "Play trace"}
          <span aria-hidden="true">{playing ? "Ⅱ" : "▷"}</span>
        </button>
        <button
          disabled={step === steps.length - 1}
          onClick={() => {
            setPlaying(false);
            setStep((previous) => Math.min(steps.length - 1, previous + 1));
          }}
        >
          Next step →
        </button>
        <button
          onClick={() => {
            setPlaying(false);
            setStep(0);
          }}
        >
          Reset
        </button>
        <span className="mono" role="status">
          Step {step + 1} / {steps.length}: {steps[step]}
        </span>
      </div>
      <p className="note">
        One MCP tool call can contain the sequence. Execution is bounded and
        sequential; a failed later step does not roll back upstream mutations.
      </p>
    </div>
  );
}
