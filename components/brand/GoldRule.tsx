/** Thin gold rule with a small lozenge at its centre, the site's section divider. */
export function GoldRule({ className = "", ornament = true }: { className?: string; ornament?: boolean }) {
  if (!ornament) return <div role="presentation" className={`h-px bg-gold/60 ${className}`} />;
  return (
    <div role="presentation" className={`flex items-center gap-3 text-gold ${className}`}>
      <span className="h-px flex-1 bg-current opacity-60" />
      <svg width="34" height="10" viewBox="0 0 34 10" fill="none" aria-hidden="true">
        <circle cx="3" cy="5" r="1" fill="currentColor" />
        <path d="M17 0.8L21.2 5 17 9.2 12.8 5z" stroke="currentColor" strokeWidth="1" />
        <path d="M17 3.3L18.7 5 17 6.7 15.3 5z" fill="currentColor" />
        <circle cx="31" cy="5" r="1" fill="currentColor" />
      </svg>
      <span className="h-px flex-1 bg-current opacity-60" />
    </div>
  );
}
