/**
 * `<ProgressRing value total size? label>`: the scheme's progress as a ring of `total` segments, one per
 * instalment, like the ticks in the passbook. Paid segments are maroon, the rest a fine outline. The count sits in
 * the middle in the display serif.
 */
export function ProgressRing({ value, total, size = 104, label, className = "" }: { value: number; total: number; size?: number; label: string; className?: string }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const gap = 2.4; // length of the gap between segments, in viewBox units
  const seg = c / total - gap;
  return (
    <div role="img" aria-label={label} className={`relative shrink-0 ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" width={size} height={size} className="-rotate-90" aria-hidden>
        {Array.from({ length: total }, (_, i) => (
          <circle
            key={i}
            cx="50" cy="50" r={r} fill="none"
            stroke="currentColor"
            strokeWidth={i < value ? 7 : 1.2}
            className={i < value ? "text-maroon" : "text-maroon/35"}
            strokeDasharray={`${seg} ${c - seg}`}
            strokeDashoffset={-(i * (seg + gap)) - gap / 2}
          />
        ))}
      </svg>
      <span className="absolute inset-0 grid place-items-center">
        <span className="num font-display text-[1.9rem] font-semibold leading-none text-maroon">
          {value}<span className="text-[1.1rem] text-maroon/55">/{total}</span>
        </span>
      </span>
    </div>
  );
}
