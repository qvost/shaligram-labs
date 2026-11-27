export function LabMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`lab-mark ${className}`}
      viewBox="-20 -20 460 460"
      aria-hidden="true"
    >
      <use href="/brand/mark.svg#shaligram-symbol" />
    </svg>
  );
}
