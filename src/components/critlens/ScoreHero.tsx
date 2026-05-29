export function ScoreHero({
  score,
  scoredCount,
  summary,
}: {
  score: number;
  scoredCount: number;
  summary: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 md:p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="text-label">Overall UX score</div>
          <div className="flex items-baseline gap-2">
            <span className="text-display text-[40px] leading-none tabular-nums text-foreground">
              {score.toFixed(1)}
            </span>
            <span className="text-sm text-muted-foreground">/ 10</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Based on {scoredCount} of 10 heuristics
          </div>
        </div>
        <p className="max-w-2xl text-[15px] leading-relaxed text-foreground/90">
          {summary}
        </p>
      </div>
    </div>
  );
}
