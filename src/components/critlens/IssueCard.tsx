import { HEURISTICS } from "@/lib/heuristics";
import type { Issue } from "@/lib/critique.types";
import { SeverityBadge, severityVar } from "./SeverityBadge";
import { EvidenceBadge } from "./EvidenceBadge";

export function IssueCard({ issue }: { issue: Issue }) {
  const h = HEURISTICS.find((x) => x.id === issue.heuristic);
  return (
    <div
      className="rounded-lg border border-border bg-card shadow-card p-5"
      style={{ borderLeft: `4px solid ${severityVar(issue.severity)}`, padding: "20px" }}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="space-y-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-label">
              H{issue.heuristic} · {h?.name}
            </span>
            <EvidenceBadge evidence={issue.evidence} />
          </div>
          <h4 className="text-[15px] font-semibold leading-snug text-foreground">
            {issue.title}
          </h4>
        </div>
        <SeverityBadge severity={issue.severity} />
      </div>
      <p className="mt-2 text-[14px] leading-[1.7] text-foreground/90">{issue.description}</p>
      <div className="mt-2 text-[12px]" style={{ color: "var(--muted-foreground)" }}>
        <span className="text-label mr-1">Location</span>
        {issue.location}
      </div>
      <div
        className="mt-3 rounded-md surface p-3 text-[14px] leading-[1.7]"
        style={{ borderLeft: "3px solid var(--border)" }}
      >
        <span className="text-label mr-1">Recommendation</span>
        <span className="text-foreground/90">{issue.recommendation}</span>
      </div>
    </div>
  );
}
