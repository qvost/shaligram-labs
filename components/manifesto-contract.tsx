"use client";

import { useId, useState } from "react";

type Validation =
  | { kind: "valid"; args: { query: string; limit: number } }
  | { kind: "invalid"; queryError: string | null; limitError: string | null };

function validate(query: string, limit: string): Validation {
  const text = query.trim();
  const count = Number(limit);
  const queryError = text ? null : "Enter a search query.";
  const limitError = Number.isSafeInteger(count) && count >= 1 && count <= 30
    ? null
    : "Use a whole number from 1 to 30.";
  if (queryError || limitError) return { kind: "invalid", queryError, limitError };
  return { kind: "valid", args: { query: text, limit: count } };
}

export function ManifestoContract() {
  const id = useId();
  const [query, setQuery] = useState("web agents");
  const [limit, setLimit] = useState("5");
  const result = validate(query, limit);
  const valid = result.kind === "valid";
  const queryError = result.kind === "invalid" ? result.queryError : null;
  const limitError = result.kind === "invalid" ? result.limitError : null;
  const preview = result.kind === "valid"
    ? JSON.stringify({ tool: "search_stories", arguments: result.args }, null, 2)
    : ["Call blocked.", "", queryError, limitError].filter((line) => line !== null).join("\n");

  return (
    <div className="manifesto-contract" data-valid={valid}>
      <div className="contract-heading">
        <h3>Try a small contract.</h3>
        <span className="mono">Interactive example</span>
      </div>
      <p id={id + "-help"}>
        Change an argument, or try a broken call. This example requires a query
        and a limit from 1 to 30.
      </p>
      <div className="contract-presets" aria-label="Example calls">
        <button type="button" onClick={() => { setQuery("web agents"); setLimit("5"); }}>
          Valid call
        </button>
        <button type="button" onClick={() => { setQuery(""); setLimit("5"); }}>
          Missing query
        </button>
        <button type="button" onClick={() => { setQuery("web agents"); setLimit("100"); }}>
          Invalid limit
        </button>
      </div>
      <div className="contract-flow" aria-hidden="true">
        <span className="contract-flow-line"><span /></span>
        <span>Arguments</span>
        <span>Validation</span>
        <span data-blocked={!valid}>Call preview</span>
      </div>
      <div className="contract-workbench">
        <fieldset aria-describedby={id + "-help"}>
          <legend className="sr-only">Tool arguments</legend>
          <label htmlFor={id + "-query"}>query <span>string</span></label>
          <input
            id={id + "-query"}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-invalid={Boolean(queryError)}
            aria-describedby={id + "-query-error"}
            autoComplete="off"
            spellCheck={false}
          />
          <span className="contract-field-note" id={id + "-query-error"}>{queryError ?? "A non-empty search phrase."}</span>
          <label htmlFor={id + "-limit"}>limit <span>integer · 1 to 30</span></label>
          <input
            id={id + "-limit"}
            value={limit}
            onChange={(event) => setLimit(event.target.value)}
            inputMode="numeric"
            aria-invalid={Boolean(limitError)}
            aria-describedby={id + "-limit-error"}
            autoComplete="off"
          />
          <span className="contract-field-note" id={id + "-limit-error"}>{limitError ?? "The number of results requested."}</span>
        </fieldset>
        <div className="contract-output">
          <p className="contract-status" role="status" aria-atomic="true">
            <span aria-hidden="true">{valid ? "✓" : "×"}</span>
            {valid ? "Valid arguments" : "Rejected before dispatch"}
          </p>
          <pre tabIndex={0} aria-label="Call preview">{preview}</pre>
        </div>
      </div>
      <p className="note">Illustrative contract. Validation runs in your browser; no network request is sent.</p>
    </div>
  );
}
