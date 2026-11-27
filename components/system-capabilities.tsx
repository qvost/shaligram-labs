import { reifyMetrics } from "@/lib/research";

const capabilities = [
  {
    title: "One tool. A complete sequence.",
    label: "Workflow macros",
    text: "Bounded ExecutionSpec chains pass extracted fields from one step to the next through one atomic MCP tool interface. Sequential execution retains a single deadline and reports partial progress.",
  },
  {
    title: "Connections that stay useful.",
    label: "reify-transport",
    text: "Pooled HTTP/3, replay-safe QUIC 0-RTT for eligible anonymous reads, dual-stack Happy Eyeballs, and UDP-blackhole fallback. HTTP-aware concurrent SWR caching and adaptive circuit breaking keep the gateway resilient.",
  },
  {
    title: "Credentials stay with their tenant.",
    label: "Isolation & observability",
    text: "A 64-partition Multi-Tenant Auth Vault scopes credentials through --tenant-tokens and X-Reify-Tenant. Opt-in OpenTelemetry (OTLP) and Prometheus /metrics expose operations when enabled.",
  },
  {
    title: "Use the same core everywhere.",
    label: "Profiles & distribution",
    text: "25 pre-warmed wire profiles mount in 9.0 µs. Pull signed community profiles with reify pull and configured registry trust. Native Python (PyO3 abi3) and TypeScript (NAPI-RS) source bindings embed the compiler and transport in-process.",
  },
];

export function SystemCapabilities() {
  return (
    <div className="system-capabilities">
      {capabilities.map((item) => (
        <article key={item.label}>
          <span className="mono muted">{item.label}</span>
          <div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        </article>
      ))}
      <div className="capabilities-foot">
        <p>
          <code>reify install</code> connects Cursor, Claude Code, Windsurf, and
          OpenCode in one command. <code>reify watch</code> runs canary checks
          for drift and self-healing.
        </p>
        <span className="mono">
          {reifyMetrics.verification.tests} passing tests /{" "}
          {reifyMetrics.verification.clippyWarnings} Clippy warnings
          <br />
          <span className="muted">
            Release verification / {reifyMetrics.verification.date}
          </span>
        </span>
      </div>
    </div>
  );
}
