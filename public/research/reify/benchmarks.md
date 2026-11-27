# Reproducible public benchmark

`reify bench` runs a controlled local experiment against actual Chromium. It
compares production MCP discovery and dispatch with scripted browser form
submission, and emits JSON evidence or Markdown tables. It requires Chromium;
there is no simulated browser or estimated latency fallback.

```sh
cargo build --release -p reify-cli --offline
./target/release/reify bench --output-dir /tmp/reify-bench-run
cat /tmp/reify-bench-run/report.md
```

The workspace release profile enables Fat LTO, optimization level 3, one codegen
unit, abort-on-panic, and symbol stripping. Offline builds require the locked
dependencies in Cargo's cache; use `cargo fetch --locked` while online to prepare
a new checkout. The benchmark itself uses only local fixtures.

The output directory must be new and its parent must exist. Both `report.json`
and `report.md` describe the **same run**. Without `--output-dir`, the command
writes only the selected format to stdout. Redirect JSON with:

```sh
./target/release/reify bench --format json > /tmp/reify-bench.json
./target/release/reify --chromium /path/to/chromium bench --format markdown
```

Chromium discovery honors `--chromium`, `REIFY_CHROMIUM_PATH`, the Playwright
cache, and PATH. Compilation and the baseline use the same resolved executable.
No internet access, API key, browser account, or model inference is required at
runtime. Unset `REIFY_BRIDGE_TOKEN`; companion credentials are rejected before
any fixture or browser starts. HTTP clients disable proxies and redirects.
Chromium uses the existing managed headless launcher and an isolated temporary
profile, including its current `--no-sandbox` launch policy. Run only in an
appropriate local environment for that existing launcher.

## Experiment

The embedded `catalog-v1` fixture serves one HTML search form and one JSON GET
endpoint from ephemeral IPv4 loopback ports. The endpoint returns the query,
category, and twelve deterministic records. Two page-initiated API calls show
the compiler inputs with and without the optional category. The interactive
`search` goal forces Chromium discovery and can induce a further real form
request. Captured traffic goes through the existing probe, synthesis,
compilation admission, validation, preparation and store implementations.
Embedded profiles are disabled; every trial has a new server and empty store.

Each trial runs both sides, alternating which side runs first. Each side gets
its own fixture and fresh Chromium profile. Physical browser cleanup finishes
before the next side, and before Reify warm calls. One verified untimed warmup
precedes each side's timed calls. All requests are sequential.

| Measurement | Reify | Browser baseline |
| --- | --- | --- |
| Cold readiness | Real HTTP bootstrap `tools/call(reify, fresh=true)` through completed JSON response, including live capture, synthesis and mount | Chromium launch, CDP attachment, navigation, both initial fetches and verified DOM result |
| Warm dispatch | HTTP `tools/call` with existing mount/client, schema validation, production cache/resilience/transport, full content read and equality check | CDP fills the actual form and calls `requestSubmit`, awaits its fetch/render, extracts all rows from DOM and checks equality |
| Discovery context tokens | Compact actual `tools/list.result.tools` JSON, including the bootstrap tool | Rendered `document.body.outerHTML` with script/style/noscript nodes removed |
| Input schema accuracy | Actual input schema returned by `tools/list` | Explicit baseline mapping live required text/search controls and select options to JSON Schema |

These cold operations do different work. Empty application stores and fresh
browser profiles do not imply cold OS caches, DNS, or a fresh Reify executable.
No cold speed ratio is inferred. The contexts also convey different
information; their token counts are not complete agent bills. This workload
has no screenshots, vision/model calls, action planning, WAN traffic, TLS, QUIC,
external DNS, authentication, mutations, or concurrent users. It cannot establish
a global product ranking or predict performance on arbitrary websites.

Fixture setup, server binding, listing, context extraction/tokenization, schema
scoring, report serialization and physical teardown are outside latency timing.
Both warm sides include request construction, full parsing and exact result
comparison; hashes and independent counter checks follow the timing boundary.
Benchmark-owned cancellation guards wrap both local routers, and fixture counters
add instrumentation costs. The raw samples retain those measured boundaries.
The probe's observation windows remain part of cold mount cost. CDP commands
retain their existing five-second limit; `--timeout` bounds each higher-level
operation. Server compilation and upstream policies retain their own limits.

## Proof of work and failures

Every timed call uses a unique query shared by both sides. The fixture returns
`Cache-Control: no-store`. A successful sample requires the complete expected
response, including every record and echoed query, and exactly one successful
upstream call. Missing work, cached/stale results, extra requests, malformed
RPC responses, HTTP/tool errors, timeouts, and cleanup failures fail the command
with exit code 1 and no successful stdout report. Interrupts return 130.

The fixture records discovery requests, warmup requests, timed successful
requests, and errors separately. JSON retains each sample's result hash and
byte count. Matching query/result hashes across sides can be checked directly.
A failed run is not silently converted into a zero-latency sample or omitted
from a successful denominator. Output files are written after measurement and
checks complete. A filesystem write failure can leave an incomplete new output
directory and returns an error; existing directories are never overwritten.

## Tokens and schema scoring

Tokens use the embedded `cl100k_base` vocabulary through pinned `tiktoken-rs
0.12.1`, ordinary encoding. Special-token spellings in HTML/JSON are treated as
ordinary text. JSON contains the exact input text, UTF-8 bytes, token count and
BLAKE3 digest for each context, making counts independently reproducible. Ports
and actual tool metadata are retained, so small context-size differences across
runs are expected. This encoding is a named reproducible metric, not a claim
about every model's tokenizer or chat framing overhead.

Twenty labelled cases are held out from discovery. Ten valid cases include
Unicode, punctuation and absent optional category. Ten invalid cases include
missing/empty queries, wrong JSON types, unknown category and extra fields.
Both schemas use the same JSON Schema validator and the same cases. Accuracy is
`(true accepts + true rejects) / 20`, with all four confusion counts and every
individual classification retained. Positive means valid input.

Required text maps to `minLength: 1`; select options map to a string enum. This
DOM baseline is a deterministic form-constraint extractor, not a general browser
agent synthesizing an API contract. Unsupported control kinds fail the baseline.
Reify's observed query schema need not infer nonempty strings or the complete
category enum. Missing constraints must appear as false accepts, rather than
being hidden by testing only the traffic used for inference. Repeating the same
corpus across trials does not add independent schema coverage. These scores
measure input classification, not response schema induction or execution success.

## Repetitions and interpretation

Defaults are five independent cold trials per side and twenty warm calls per
trial. Both sides pause 100 ms **outside** timing before each timed call. This
keeps offered load below the production origin policy's ten calls per second;
the rate limit itself is not disabled. Set `--pace-ms 0` to include burst/queue
behavior deliberately, and retain that setting with any numbers you publish.

```sh
./target/release/reify bench --iterations 5 --warm-calls 20 --pace-ms 100 \
  --format json --output-dir /tmp/reify-bench-release
```

Iterations are bounded to 1–100, warm calls to 1–1000, and their product to 10,000
per side. Pacing is bounded to 0–10,000 ms. The global `--timeout` is 1–300 seconds
per operation. Long trials still obey the production mount TTL and can fail if
the mount expires; the harness never refreshes a supposedly warm sample silently.

Summaries report count, mean, min/max, p50 and p95. Percentiles are nearest rank,
`ceil(percentile × count) - 1` in sorted zero-based samples. Five cold samples
cannot establish robust tails; cold p95 is the maximum. Warm samples from the
same trial share a connection and mount, and are not independent cold runs.
JSON preserves trial order, per-trial samples, package version, OS/architecture,
logical CPU count, debug assertions, Chromium version, available Linux load
averages, and fixture/harness/lockfile hashes. Keep the command, host details and
binary hash with a published result:

```sh
rustc --version
cargo --version
sha256sum ./target/release/reify
```

Use release builds and an otherwise quiet machine. Unset `RUST_LOG` to use the
default warning filter; verbose logging can change measured costs. Record at least five trials
and inspect their ranges before claiming a difference. Profile a separate run
before attributing any difference to a subsystem; the benchmark itself does not
prove a latency bottleneck or a causal performance gain.

## Sprint #2 verified release run

On November 27, 2026 at 16:15:49 UTC, a Linux x86-64 host with 16 logical CPUs
(Intel Core i7-13620H), kernel 7.3.4-arch1-1, and the powersave governor ran the
command above against HeadlessChrome/156.0.8078.4. Rust and Cargo were 1.99.1.
`cargo build --release -p reify-cli --offline` succeeded, and the actual binary
compiler invocation confirmed `opt-level=3`, `lto=fat`, `codegen-units=1`,
`panic=abort`, and `strip=symbols`. The resulting executable was 22,376,032 bytes.
Engine sources were at `8bc7a26`; this verification iteration changes tests and
documentation. Builds and test gates finished before measurement.

The measured command was:

```sh
env -u REIFY_BRIDGE_TOKEN -u RUST_LOG -u OTEL_EXPORTER_OTLP_ENDPOINT \
  ./target/release/reify bench --iterations 5 --warm-calls 20 --pace-ms 100 \
  --format json --output-dir /tmp/reify-sprint2-iteration5-bench
```

Five alternating trials used twenty timed calls per side per trial, 100 ms
pacing, and the CLI's default 30-second per-operation timeout. Telemetry was
disabled. The JSON and Markdown reports describe the same run.

| Metric | Reify HTTP MCP | Scripted Chromium / DOM constraints |
| --- | ---: | ---: |
| Cold p50 (ms) | 1602.764 | 93.640 |
| Cold min–max (ms) | 1598.173–1607.091 | 88.875–97.948 |
| Warm p50 / p95 (ms), 100 calls per side | 0.804 / 0.959 | 3.331 / 3.877 |
| Warm min–max (ms) | 0.513–1.132 | 2.430–6.200 |
| Per-trial warm p50 range (ms) | 0.761–0.843 | 3.122–3.409 |
| Discovery context tokens, every trial | 866 | 536 |
| Input classification, each 20-case evaluation | 18/20 (90%) | 20/20 (100%) |

These are descriptive observations of the distinct tasks and representations
defined above. Cold mount includes live discovery and compilation; browser cold
readiness does not compile an MCP server. The five repeated schema evaluations
cover twenty unique labelled cases, not one hundred independent cases. Reify
false accepts the empty query and the unsupported category; it has no false
rejects here. The DOM baseline reads those two constraints from the form.
The MCP context includes both the current bootstrap tool and the synthesized
search tool. Its measured 866 tokens exceed the DOM context's 536 tokens in
this run. Context counts describe the retained representations, not complete
agent token usage.

The run completed **200 timed calls, 10 warmups, 25 discovery API calls, and ten
HTML navigations**, with zero errors. All timed results were checked in full and
had exactly one upstream call. Both sides returned matching query/result hashes.
Independent Python `tiktoken` 0.14.0, `blake3` 1.0.11, and `jsonschema` 4.26.0
checks reproduced context counts and hashes, raw lockfile identity, nearest-rank
statistics, each input classification, confusion counts, exact expected result
hashes/byte lengths, and work totals. Fixture/harness digests matched the checked
source. The SHA-256 of the executable and a framed digest of all tracked source
files matched before/after measurement. The JSON report also matched stdout
byte-for-byte. All 710 workspace tests passed (18 existing opt-in tests ignored),
along with warning-denied all-target Clippy, formatting, production panic guards,
and the opt-in real-browser command test, before this release measurement.

One-minute load averages were 2.70 at start and 2.74 at end amid normal desktop
activity. There was no per-stage CPU or allocation profile. This observation
does not establish a causal speedup, a general browser-agent cost reduction, or
a global ranking. The exact command, evidence format and boundaries above are
the reproducible interface; expect host/browser/load variation.

The measured executable SHA-256 was
`e14af496454bc1f7ed4b672285a04b803f078d67434790f0fb1a200f71ba8302`.
The fixture BLAKE3 was
`8893bcc490c84271c09013efb6cb35b1a3473e78eee0b3f9e38f9c00120d6924`.
The harness BLAKE3 was
`d66ef90d18cabfb3d9227f1f8f5946a1afc86705cceaa8373ce015acbdae3d34`;
the raw `Cargo.lock` BLAKE3 was
`d9608f46ad69f41980c65fdee7cb1bc12d20551d5b444ff93236fd05c6c6a69d`.
Local raw evidence is in `/tmp/reify-sprint2-iteration5-bench/`, with independent
audit output in `/tmp/reify-sprint2-iteration5-benchmark-verification.json`.
These are local verification artifacts; rerun the command to generate your own.

## Verification

Normal workspace tests exercise argument bounds, failure behavior, exact work
checks, schema classification, tokenizer inputs, statistics, HTTP response
validation, cancellation, and file preservation without requiring Chromium.
The opt-in public-command test uses real Chromium, both run orders, full output
hash equality, and JSON/Markdown evidence from the same run:

```sh
cargo test --workspace
cargo clippy --workspace --all-targets -- -D warnings
cargo test -p reify-cli --test bench \
  real_chromium_benchmark_checks_both_sides_and_same_run_reports \
  -- --ignored --exact --nocapture
```

Sprint #2's November 27, 2026 verification also exercised the actual native
packages with `scripts/verify-bindings.sh`: 14 shared Rust binding tests, 11
Python tests against the installed abi3 wheel, the same 11 tests after rebuilding
and reinstalling its source archive with Cargo offline, generated declaration
stability, strict TypeScript checking, and 10 tests against a packed and
installed Node addon. The Python and Node builds used the development profile;
the CLI benchmark used the optimized release profile above. CPython 3.14.10 and
Node 24.12.0 passed on Linux x86-64, as did all 10 addon tests on Node 20.20.2.
The worker lifecycle test now registers message and exit listeners together;
an observed same-turn exit previously left the test waiting indefinitely. Both
worker tests have deadlines, and the repaired worker test passed 30 consecutive
isolated runs before the complete packaging verification passed.

Digest conventions are explicit. Context and `cargo_lock_blake3` hashes cover
raw bytes. `fixture_blake3` covers HTML, labelled-case JSON, and fixture Rust
source, in that order; `harness_blake3` covers the benchmark's mod.rs, browser.rs,
and report.rs. Composite digests prefix each file with its UTF-8 byte length as
an eight-byte little-endian integer. These identify the harness and fixture;
they are not substitutes for hashing the complete executable.
