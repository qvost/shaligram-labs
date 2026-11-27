"use client";

import { useId, useState } from "react";
import { Copy } from "./copy";
import { IntegrationTabs } from "./research-controls";

const observations = {
  "Warm p50": {
    reify: 0.804,
    browser: 3.331,
    max: 4,
    scale: "4 ms",
    note: "100 timed calls per side across five alternating trials. Both paths read the complete result from the local fixture.",
  },
  "Warm p95": {
    reify: 0.959,
    browser: 3.877,
    max: 4,
    scale: "4 ms",
    note: "Nearest-rank p95 of the same warm samples. Each successful call performs exactly one upstream request; Cache-Control: no-store.",
  },
  "Cold readiness": {
    reify: 1602.764,
    browser: 93.64,
    max: 1700,
    scale: "1,700 ms",
    note: "Different work: Reify includes Chromium discovery, synthesis, and mount. Browser readiness includes launch and navigation. Five cold samples per side; no cold speed ratio is inferred.",
  },
};
type Observation = keyof typeof observations;
const options: Observation[] = ["Warm p50", "Warm p95", "Cold readiness"];
const command =
  "cargo build --release -p reify-cli --locked\n./target/release/reify bench --iterations 5 --warm-calls 20 --pace-ms 100 \\\n  --format json --output-dir /tmp/reify-bench-run";

export function LatencyBench() {
  const [selected, setSelected] = useState<Observation>("Warm p50");
  const id = useId();
  const panelId = `${id}-bench`;
  const current = observations[selected];

  return (
    <div className="latency-bench">
      <div className="inspector-heading">
        <code>reify bench</code>
        <span>Verified release run / 27 Nov 2026</span>
      </div>
      <IntegrationTabs
        options={options}
        value={selected}
        onChange={setSelected}
        panelId={panelId}
        label="Latency measurement"
      />
      <div
        className="bench-panel"
        role="tabpanel"
        id={panelId}
        aria-labelledby={`${panelId}-tab-${options.indexOf(selected)}`}
        tabIndex={0}
      >
        <div className="bench-scale" aria-hidden="true">
          <span>0 ms</span>
          <span>{current.scale}</span>
        </div>
        <div className="bench-rows" aria-live="polite" aria-atomic="true">
          {[
            {
              name: "Reify / loopback HTTP MCP",
              value: current.reify,
              kind: "reify",
            },
            {
              name: "Scripted Chromium / DOM",
              value: current.browser,
              kind: "browser",
            },
          ].map((row) => (
            <div className="bench-row" key={row.kind}>
              <div className="bench-row-label">
                <span>{row.name}</span>
                <strong>
                  {row.value.toFixed(3)} <span>ms</span>
                </strong>
              </div>
              <div className="bench-track" aria-hidden="true">
                <span
                  className={row.kind}
                  style={{ width: `${(row.value / current.max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="bench-context">{current.note}</p>
      </div>
      <div className="bench-run-facts">
        <span>
          <strong>200</strong> timed calls
        </span>
        <span>
          <strong>0</strong> errors
        </span>
        <span>
          <strong>Fat LTO</strong> release binary
        </span>
        <span>
          <strong>710</strong> workspace tests passing
        </span>
        <span>
          <strong>0</strong> Clippy warnings
        </span>
      </div>
      <div className="bench-micro">
        <div>
          <strong>4.15 µs</strong>
          <span>In-process router dispatch</span>
          <small>
            Paper microbenchmark; &gt;240,000 req/s per core. Excludes network
            I/O.
          </small>
        </div>
        <div>
          <strong>9.0 µs</strong>
          <span>Pre-warmed profile mount</span>
          <small>
            25 services. Excludes process startup and upstream tool calls.
          </small>
        </div>
        <div>
          <strong>58.2×</strong>
          <span>Paper-reported optimization</span>
          <small>
            Separate audit: 342.3 → 5.9 µs across five runs. A different
            aggregate from the 4.15 µs sample.
          </small>
        </div>
      </div>
      <details className="bench-reproduce">
        <summary>Reproduce the local evaluation</summary>
        <div className="code-block">
          <Copy value={command} />
          <pre>{command}</pre>
        </div>
        <p className="note">
          Run from a Reify checkout with Rust and Chromium installed. Use a new
          output directory. JSON and Markdown reports describe the same run.
        </p>
        <div
          className="table-scroll"
          role="region"
          aria-label="Benchmark context and input classification"
          tabIndex={0}
        >
          <table>
            <caption>
              Single-form fixture / 20 unique held-out input cases
            </caption>
            <thead>
              <tr>
                <th scope="col">Measurement</th>
                <th scope="col">Reify</th>
                <th scope="col">Chromium</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Discovery context (cl100k_base tokens)</th>
                <td>866</td>
                <td>536</td>
              </tr>
              <tr>
                <th scope="row">Input classification</th>
                <td>18/20 (90%)</td>
                <td>20/20 (100%)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="note">
          Reify misses the nonempty-query and category-enum constraints. This
          fixture has no model inference, screenshots, WAN, TLS, or QUIC; it
          does not measure agent task completion or transport speedups. Host:
          Linux x86-64, Intel Core i7-13620H, 16 logical CPUs, HeadlessChrome
          156.0.8078.4. The 710-test and warning-denied Clippy gates preceded
          the reported release run.
        </p>
      </details>
      <div className="bench-sources">
        <a href="/research/reify/benchmarks.md">
          Benchmark method and evidence ↗
        </a>
        <a href="/research/reify/performance.md">
          In-process performance audit ↗
        </a>
      </div>
    </div>
  );
}
