# Performance audit

The audit covers all six crates. Repeated work moves to compilation or cache
installation while protocol validation, credential scope, resource bounds, and
process cleanup remain enforced.

## Changes

| Area | Optimization |
| --- | --- |
| Core | Borrow canonical hosts for BLAKE3 input; normalize ASCII goals in one buffer; compare MIME types without lowercase copies; consume tool arguments and results. Normalize already parsed URLs without reparsing. Unicode normalization and key preimages remain compatible. |
| CDP | Serialize commands from borrowed fields without an intermediate JSON tree. Deserialize directly into typed envelopes. The probe borrows method/session strings and raw parameters when skipping unused events; general CDP clients retain the full event stream. Prune canceled commands when the bounded pending table fills instead of scanning on every command. |
| Capture | Reject static resource types before URL parsing. Move request IDs, methods, header keys/values, cookie arrays, and raw GraphQL text out of events. Parse plain response JSON directly from existing strings. |
| Process lifecycle | Run discovery and process spawning off the async executor; reuse the stderr buffer; concurrently enable independent CDP domains before navigation. Retain isolated profiles/process groups and TERM/KILL/reap behavior. |
| Synthesis | Accumulate object-field observations in one pass; move schema nodes into parent objects; tokenize deduplicated borrowed JSON field names; cache ranking tie keys; avoid concatenating entire payloads into frame-sort keys; tokenize via a character iterator. |
| Cache | Share immutable snapshots. Prepare validators, ordered query mappings, header mirrors, credential headers, and compact tool-definition JSON before acquiring the write lock. Drop retired validator/schema graphs after unlocking. Use direct mount-token lookup and avoid gate-table scans for existing gates. |
| MCP responses | Serialize borrowed list/bootstrap envelopes and cached `RawValue` definitions. Eliminate repeated schema validation and schema-tree construction/copies. Consume invocation arguments and response text where ownership permits. |
| Upstream HTTP | Retain the pooled Reqwest client. Use prepared validation/headers and borrow JSON bodies through serialization. Reserve bounded Content-Length capacity; transfer valid UTF-8 response buffers into strings. Preserve redirect, retry, and credential policies. |
| Bridge | Prepare configured credentials at insertion and share exact-host header snapshots. Copy only stored headers not overridden by a request. Release retired session bundles after unlocking. Retain pooling and bounded reads. |
| CLI | Stream borrowed probe diagnostics through a 64 KiB stdout buffer. Avoid a second capture JSON tree and whole pretty-printed string; move gateway results out of envelopes. Preserve broken-pipe handling and diagnostic auth exclusions. |

`ServerStore::prepared` ties derived data to the exact `Arc<CachedApp>` generation.
Healing installs complete replacements; running calls finish against their
original snapshots. Invalidations/newer writes still prevent stale healers from
resurrecting old state. Prepared renderers never retain invocation arguments.

Preparation retains validators/plans and one compact JSON copy per definition in
exchange for eliminating repeated compilation and transient trees. Old generations
live only while readers hold snapshots. The store uses short Tokio locks, not a
lock-free algorithm. Public owned lookup and one-shot rendering APIs remain;
server hot paths use prepared shared data.

No browser pooling, speculative mutation retries, shortened observation windows,
unbounded buffers, or unmeasured HTTP pool tuning was added. Expiry pruning still
scans cache entries during insertion, and the mount registry retains tokens for
the server lifetime. Large-cardinality write contention and capacity policy need
a separate workload measurement.

## Release measurement

[`hot_paths.rs`](crates/reify-server/examples/hot_paths.rs) issues requests through
the actual in-process Axum router. It includes request construction, parsing,
routing, mount lookup, response construction/serialization, and collecting the
complete response body. The fixture uses a real synthesized POST tool with 64
nested body fields plus the root meta-tool, at concurrency one. Compilation,
insertion, and the first request are excluded. There are no sockets, browser
startup, upstream I/O, or retries in this fixture.

Linux x86-64, Rust/Cargo 1.99.1, optimized release builds, five alternating runs
per side, 5,000 timed requests per run:

| Run | Before, ns/request | After, ns/request |
| --- | ---: | ---: |
| 1 | 250771 | 4153 |
| 2 | 296588 | 6090 |
| 3 | 363096 | 6077 |
| 4 | 342278 | 5374 |
| 5 | 361259 | 5899 |
| Median of run averages | 342278 | 5899 |

The scoped warm route is faster: **342.3 µs → 5.9 µs**, about 58×. Ranges are
250.8–363.1 µs before and 4.2–6.1 µs after. These are run averages, not latency
percentiles. The host exposed 16 CPUs with load averages near 2.2 before comparison;
alternating runs reduce shared-host noise. Every request returned success. The
first/last responses were parsed and checked for both tools and all 64 body fields.
Definition JSON was byte-identical across builds (11,528 bytes). All 50,000 timed
requests completed with zero errors.

A separate diagnostic scope measured baseline definition validation,
materialization, and serialization at 111.8 µs/request, approximately 45% of that
diagnostic run's 250.9 µs route time before the handler's additional tree copies.
The optimized route eliminates that work and those copies; it primarily parses
the small request and writes cached bytes. No CPU sampling profiler was available;
the component timing is supporting evidence, not an allocation-count measurement.

The result establishes a sub-millisecond CPU path for this fixture, not production
network latency, concurrent throughput, or a live-site capture speedup. Browser
startup, page behavior, and upstream round trips still require live measurement.

Reproduce the current side:

```sh
cargo run --release -p reify-server --example hot_paths -- 5000
REIFY_PROFILE=1 cargo run --release -p reify-server --example hot_paths -- 1000
```

`REIFY_DEFINITION_OUT=/path/to/tools.json` saves canonical definitions outside the
timed region for cross-build comparison. Session baseline sources and executables
were retained at `/tmp/reify-performance-baseline` and
`/tmp/reify-hot-paths-{before,after}`; `/tmp` is not permanent project storage.

## Correctness

Nine new regression tests cover owned wire projections/metadata, Unicode goal
normalization, prepared rendering and borrowing, filtered CDP parsing (escaped
strings and explicit null replies), captured payload ownership, cache replacement,
validation before dispatch, and exact-host bridge snapshots. Existing expiry,
generation-race, concurrent-miss, healing-failure, and reaping tests remain.
See [VALIDATION.md](VALIDATION.md) for final commands and the six TCP tests blocked
by this environment. The benchmark does not replace those integration tests.
