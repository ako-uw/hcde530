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

  return (
    <div className="flex flex-col items-start gap-6 rounded-2xl border bg-card p-6 md:flex-row md:items-center md:p-8">
      <div className="relative size-44 shrink-0">
        <svg viewBox="0 0 160 160" className="size-full -rotate-90">
          <circle cx="80" cy="80" r={r} fill="none" stroke="var(--muted)" strokeWidth="12" />
          <circle
            cx="80"
            cy="80"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${c}`}
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-semibold tabular-nums" style={{ color }}>
            {score.toFixed(1)}
          </span>
          <span className="text-xs text-muted-foreground">/ 10</span>
        </div>
      </div>
      <div className="flex-1 space-y-2">
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Heuristic evaluation
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">Overall UX score</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">{summary}</p>
      </div>
    </div>
  );
}