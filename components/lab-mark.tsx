/** The lab mark uses a carved S and two strata; inherits the surrounding ink color. */
export function LabMark({ className = '' }: { className?: string }) {
  return <svg className={`lab-mark ${className}`} viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <path d="M37 12C32 6 19 6 12 13C5 20 10 26 22 26H28C36 26 38 31 32 36C26 41 15 41 10 35" stroke="currentColor" strokeWidth="6" strokeLinecap="square" />
    <path d="M14 18H36M12 30H33" stroke="currentColor" strokeWidth="2" />
  </svg>;
}
