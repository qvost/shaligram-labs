"use client";

import AsciiLogo from "./ui/ascii-logo";

export function InteractiveMark() {
  return (
    <figure className="ascii-brand">
      <img className="ascii-brand-fallback" src="/brand/mark.svg" alt="" />
      <AsciiLogo
        src="/brand/mark.svg"
        background="var(--surface)"
        gridColor="#e5e3dc"
        charColor="#141414"
        chars=":+*#%@0369"
        threshold={0.12}
        sampleMode="alpha"
        cellSize={4}
        cellGap={1}
        mobileCellSize={3}
        mobileCellGap={1}
        pushRadius={7}
        pushForce={8}
        spring={0.045}
        damping={0.62}
      />
      <figcaption>
        <span>Shaligram</span>
        <span className="ascii-brand-hint" aria-hidden="true">
          Move across the mark
        </span>
      </figcaption>
    </figure>
  );
}
