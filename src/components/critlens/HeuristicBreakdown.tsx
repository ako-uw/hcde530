import type { HeuristicScore } from "@/lib/critique.types";
import { SEVERITY_LABEL } from "@/lib/heuristics";

function barColor(s: number) {
  if (s >= 8) return "var(--score-good)";
  if (s >= 6) return "var(--score-mid)";
  return "var(--score-bad)";
}

export function HeuristicBreakdown({ scores }: { scores: HeuristicScore[] }) {
  return (
    <div className="rounded-2xl border bg-card">
      <div className="border-b px-5 py-4">
        <h3 className="text-base font-semibold">Scoring breakdown</h3>
        <p className="text-xs text-muted-foreground">
          Each heuristic starts at 10 points. Points are deducted per issue by severity.
        </p>
      </div>
      <ul className="divide-y">
        {scores.map((h) => {
          const pct = (h.score / 10) * 100;
          return (
            <li key={h.id} className="px-5 py-4">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">
                    <span className="text-muted-foreground">H{h.id}</span> · {h.name}
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
                  <div className="h-1.5 w-32 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: barColor(h.score) }}
                    />
                  </div>
                  <span
                    className="w-10 text-right text-sm font-semibold tabular-nums"
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