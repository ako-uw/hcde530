function scoreColor(s: number) {
  if (s >= 8) return "var(--score-good)";
  if (s >= 6) return "var(--score-mid)";
  return "var(--score-bad)";
}

export function ScoreHero({ score, summary }: { score: number; summary: string }) {
  const pct = Math.max(0, Math.min(100, (score / 10) * 100));
  const color = scoreColor(score);
  const r = 70;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;

  const grade =
    score >= 9 ? "Exceptional" :
    score >= 8 ? "Strong" :
    score >= 6.5 ? "Solid" :
    score >= 5 ? "Needs work" : "Critical";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/60 p-6 md:p-10">
      <div className="absolute -top-20 -right-20 size-72 rounded-full blur-3xl" style={{ backgroundColor: color, opacity: 0.15 }} />
      <div className="relative flex flex-col items-start gap-8 md:flex-row md:items-center">
      <div className="relative size-52 shrink-0">
        <svg viewBox="0 0 160 160" className="size-full -rotate-90">
          <circle cx="80" cy="80" r={r} fill="none" stroke="var(--muted)" strokeWidth="10" />
          <circle
            cx="80"
            cy="80"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${c}`}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-7xl tabular-nums leading-none" style={{ color }}>
            {score.toFixed(1)}
          </span>
          <span className="font-mono-label mt-1 text-muted-foreground">/ 10</span>
        </div>
      </div>
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-3">
          <span className="font-mono-label text-primary">◐ Verdict</span>
          <span
            className="rounded-full border px-2.5 py-0.5 text-xs font-medium"
            style={{ color, borderColor: color, backgroundColor: `color-mix(in oklab, ${color} 15%, transparent)` }}
          >
            {grade}
          </span>
        </div>
        <h2 className="font-display text-4xl md:text-5xl leading-tight">Overall UX score</h2>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">{summary}</p>
      </div>
      </div>
    </div>
  );
}