import { HEURISTICS } from "@/lib/heuristics";
import type { Issue } from "@/lib/critique.types";
import { SeverityBadge } from "./SeverityBadge";

export function IssueCard({ issue }: { issue: Issue }) {
  const h = HEURISTICS.find((x) => x.id === issue.heuristic);
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-5 transition-all hover:border-primary/50 hover:bg-card/80">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="space-y-1">
          <div className="font-mono-label text-primary">
            H{issue.heuristic} · {h?.name}
          </div>
          <h4 className="font-display text-xl leading-tight">{issue.title}</h4>
        </div>
        <SeverityBadge severity={issue.severity} />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/80">{issue.description}</p>
      <div className="mt-4 flex gap-2 text-xs text-muted-foreground">
        <span className="font-mono-label shrink-0 text-foreground/70">Where</span>
        <span>{issue.location}</span>
      </div>
      <div className="mt-3 rounded-xl border border-primary/20 bg-primary/5 p-3 text-sm">
        <span className="font-mono-label text-primary">Fix · </span>
        <span className="text-foreground/90">{issue.recommendation}</span>
      </div>
    </div>
  );
}