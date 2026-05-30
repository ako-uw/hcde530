export function scoreColor(score: number): string {
  if (score < 5) return "var(--score-red)";
  if (score < 7) return "var(--score-amber)";
  if (score < 8.5) return "var(--score-default)";
  return "var(--score-green)";
}

export function ScoreHero({
  score,
  scoredCount,
  summary,
}: {
  score: number;
  scoredCount: number;
  summary: string;
}) {
  const color = scoreColor(score);
  const unscored = 10 - scoredCount;
  return (
    <div
      className="relative overflow-hidden rounded-lg border border-border bg-card shadow-card"
      style={{ borderTop: `4px solid ${color}` }}
    >
      <div className="flex flex-col gap-8 p-6 md:flex-row md:items-start md:justify-between md:p-8">
        <div className="space-y-2">
          <div className="text-label">Overall UX score</div>
          <div className="flex items-baseline gap-2">
            <span
              className="text-display text-[48px] leading-none tabular-nums"
              style={{ color }}
            >
              {score.toFixed(1)}
            </span>
            <span className="text-base text-muted-foreground">/ 10</span>
          </div>
          <div className="text-[13px] text-foreground/80">
            {score.toFixed(1)} / 10 (based on {scoredCount} of 10 heuristics scored).
          </div>
          {unscored > 0 && (
            <div className="text-xs text-muted-foreground">
              {unscored} heuristic{unscored === 1 ? "" : "s"} not scored — insufficient observable
              evidence.
            </div>
          )}
        </div>
        <p className="max-w-2xl text-[15px] leading-[1.7] text-foreground/90">{summary}</p>
      </div>
    </div>
  );
}
