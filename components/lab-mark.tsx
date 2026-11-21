export function LabMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`lab-mark ${className}`}
      viewBox="0 0 420 420"
      aria-hidden="true"
    >
      <use href="/shaligram-mark.svg#shaligram-symbol" />
    </svg>
  );
}
