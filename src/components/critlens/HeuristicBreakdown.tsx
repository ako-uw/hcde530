import type { HeuristicScore } from "@/lib/critique.types";
import { EvidenceBadge } from "./EvidenceBadge";

function barColor(s: number) {
  if (s >= 8) return "var(--sev-1)";
  if (s >= 6) return "var(--sev-2)";
  if (s >= 4) return "var(--sev-3)";
  return "var(--sev-4)";
}

export function HeuristicBreakdown({ scores }: { scores: HeuristicScore[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="border-b border-border px-5 py-3 text-xs text-muted-foreground">
        Each scored heuristic starts at 10. Points deducted per issue severity. Out-of-scope
        heuristics are excluded from the overall average.
      </div>
      <ul className="divide-y divide-border">
        {scores.map((h) => {
          const score = h.score;
          const oos = score === null;
          const pct = score === null ? 0 : (score / 10) * 100;
          const color = score === null ? "var(--ev-oos)" : barColor(score);
          return (
            <li key={h.id} className="grid grid-cols-[1fr_auto] items-center gap-4 px-5 py-3.5">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-label">H{h.id}</span>
                  <span className="text-sm font-medium text-foreground">{h.name}</span>
                  <EvidenceBadge evidence={h.evidence} />
                </div>
                {h.deductions.length > 0 && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    {h.deductions.length} finding{h.deductions.length === 1 ? "" : "s"}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="h-1 w-32 overflow-hidden rounded-full bg-[color:var(--surface)] md:w-48">
                  {!oos && (
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  )}
                </div>
                <span
                  className="w-12 text-right text-base tabular-nums font-medium"
                  style={{ color: oos ? "var(--muted-foreground)" : "var(--foreground)" }}
                >
                  {score === null ? "—" : score.toFixed(1)}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
