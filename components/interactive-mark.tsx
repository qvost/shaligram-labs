"use client";

import AsciiLogo from "./ui/ascii-logo";

export function InteractiveMark() {
  return (
    <figure className="ascii-brand">
      <img className="ascii-brand-fallback" src="/shaligram-mark.svg" alt="" />
      <AsciiLogo
        src="/assets/ascii-logo/shaligram-mark.svg"
        background="var(--surface)"
        gridColor="#efede5"
        charColor="#202320"
        chars=":+*#%@0369"
        threshold={0.12}
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
        <span className="ascii-brand-hint" aria-hidden="true">Move across the mark</span>
      </figcaption>
    </figure>
  );
}
