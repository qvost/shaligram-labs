export function Wire({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`wire ${compact ? "compact" : ""}`} data-motion-wire>
      <div className="wire-label">
        <span>Web traffic</span>
        <span>Task-scoped tools</span>
      </div>
      <svg
        viewBox="0 0 1000 300"
        role="img"
        aria-label="Many web requests converge into a small set of typed tools"
      >
        {Array.from({ length: 17 }, (_, index) => (
          <path
            key={index}
            className="wire-line"
            pathLength={1}
            d={`M 0 ${20 + index * 16} C 270 ${20 + index * 16}, 310 150, 500 150 S 750 ${100 + (index % 4) * 34}, 1000 ${100 + (index % 4) * 34}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={index % 4 === 0 ? 1.2 : 0.5}
            opacity={index % 4 === 0 ? 0.7 : 0.25}
          />
        ))}
        <circle
          cx="500"
          cy="150"
          r="44"
          fill="var(--wire-surface, var(--bg))"
          stroke="currentColor"
        />
        <use
          href="/shaligram-mark.svg#shaligram-symbol"
          transform="translate(468 118) scale(.15238)"
        />
      </svg>
    </div>
  );
}
