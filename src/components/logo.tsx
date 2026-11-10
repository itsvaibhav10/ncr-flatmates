// Interchange mark: two lines (two people) meeting at one station.
export function Mark({ className = "h-6 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 24" className={className} aria-hidden="true">
      <path d="M2 12h36" stroke="#f2b705" strokeWidth="6" strokeLinecap="round" />
      <path d="M20 2v20" stroke="#c4167c" strokeWidth="6" strokeLinecap="round" />
      <circle cx="20" cy="12" r="6.5" fill="white" stroke="#15171c" strokeWidth="3.5" />
    </svg>
  );
}

// The two "i" dots are station dots in the two line colours.
function I({ dot }: { dot: string }) {
  return (
    <span className="relative inline-block">
      ı<span aria-hidden="true" className={`absolute left-1/2 top-[0.11em] size-[0.24em] -translate-x-1/2 rounded-full ${dot}`} />
    </span>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-2">
      <Mark />
      <span className="font-display text-xl font-black lowercase tracking-tight text-ink" aria-label="Clikkit">
        <span aria-hidden="true">cl<I dot="bg-line-yellow" />kk<I dot="bg-line-magenta" />t</span>
      </span>
    </span>
  );
}
