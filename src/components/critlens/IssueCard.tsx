import { HEURISTICS } from "@/lib/heuristics";
import type { Issue } from "@/lib/critique.types";
import { SeverityBadge } from "./SeverityBadge";

export function IssueCard({ issue }: { issue: Issue }) {
  const h = HEURISTICS.find((x) => x.id === issue.heuristic);
  return (
    <div className="rounded-xl border bg-card p-5 transition-colors hover:border-foreground/20">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="space-y-1">
          <div className="text-xs font-medium text-muted-foreground">
            H{issue.heuristic} · {h?.name}
          </div>
          <h4 className="text-base font-semibold leading-tight">{issue.title}</h4>
        </div>
        <SeverityBadge severity={issue.severity} />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/80">{issue.description}</p>
      <div className="mt-3 text-xs text-muted-foreground">
        <span className="font-medium text-foreground/70">Where:</span> {issue.location}
      </div>
      <div className="mt-3 rounded-lg bg-muted/60 p-3 text-sm">
        <span className="font-medium">Recommendation: </span>
        <span className="text-foreground/80">{issue.recommendation}</span>
      </div>
    </div>
  );
}