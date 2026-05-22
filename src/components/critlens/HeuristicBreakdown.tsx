import type { HeuristicScore } from "@/lib/critique.types";
import { SEVERITY_LABEL } from "@/lib/heuristics";

function barColor(s: number) {
  if (s >= 8) return "var(--score-good)";
  if (s >= 6) return "var(--score-mid)";
  return "var(--score-bad)";
}

export function HeuristicBreakdown({ scores }: { scores: HeuristicScore[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/60">
      <div className="border-b border-border/60 px-5 py-3 font-mono-label text-muted-foreground">
        Each heuristic starts at 10. Points deducted per issue severity.
      </div>
      <ul className="divide-y divide-border/60">
        {scores.map((h) => {
          const pct = (h.score / 10) * 100;
          return (
            <li key={h.id} className="px-5 py-4 transition-colors hover:bg-background/30">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">
                    <span className="font-mono-label text-primary mr-2">H{h.id}</span>{h.name}
                  </div>
                  {h.deductions.length > 0 && (
                    <div className="mt-1 text-xs text-muted-foreground">
                      {h.deductions.length} issue{h.deductions.length === 1 ? "" : "s"}:{" "}
                      {h.deductions
                        .map((d) => `${SEVERITY_LABEL[d.severity]}`)
                        .join(", ")}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-32 overflow-hidden rounded-full bg-muted md:w-48">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: barColor(h.score) }}
                    />
                  </div>
                  <span
                    className="font-display w-12 text-right text-2xl tabular-nums"
                    style={{ color: barColor(h.score) }}
                  >
                    {h.score.toFixed(1)}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}