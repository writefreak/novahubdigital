export function NovaMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
      <circle cx="20" cy="20" r="8" fill="var(--accent)" />
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * Math.PI) / 4;
        const x1 = 20 + Math.cos(angle) * 13;
        const y1 = 20 + Math.sin(angle) * 13;
        const x2 = 20 + Math.cos(angle) * 19;
        const y2 = 20 + Math.sin(angle) * 19;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="var(--accent)"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity={i % 2 === 0 ? 1 : 0.4}
          />
        );
      })}
    </svg>
  );
}
