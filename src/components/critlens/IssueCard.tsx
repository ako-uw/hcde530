import { HEURISTICS } from "@/lib/heuristics";
import type { Issue } from "@/lib/critique.types";
import { SeverityBadge, severityVar } from "./SeverityBadge";
import { EvidenceBadge } from "./EvidenceBadge";

export function IssueCard({ issue, index = 0 }: { issue: Issue; index?: number }) {
  const h = HEURISTICS.find((x) => x.id === issue.heuristic);
  const sev = severityVar(issue.severity);
  return (
    <div
      className="cl-rise group relative border-2 border-[color:var(--border-strong)] bg-[color:var(--card)] p-5 shadow-[3px_3px_0_0_var(--border-strong)] transition-transform hover:-translate-y-[2px] hover:translate-x-[-1px] hover:shadow-[5px_5px_0_0_var(--border-strong)]"
      style={{
        borderLeftWidth: "6px",
        borderLeftColor: sev,
        animationDelay: `${Math.min(index, 12) * 55}ms`,
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              H{issue.heuristic} · {h?.name}
            </span>
            <EvidenceBadge evidence={issue.evidence} />
          </div>
          <h4 className="font-display text-[20px] font-semibold leading-[1.2] text-foreground">
            {issue.title}
          </h4>
        </div>
        <SeverityBadge severity={issue.severity} />
      </div>
      <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
        <span className="text-foreground/55">Location ▸ </span>
        <span className="text-foreground/80 normal-case tracking-normal">{issue.location}</span>
      </div>
      <p className="mt-3 text-[14px] leading-[1.65] text-foreground/85">{issue.description}</p>
      <div
        className="mt-4 border-l-[3px] bg-[color:var(--surface)] p-3 text-[14px] leading-[1.6]"
        style={{ borderLeftColor: "var(--primary)" }}
      >
        <div className="text-label mb-1" style={{ color: "var(--primary)" }}>
          Recommendation
        </div>
        <span className="text-foreground/90">{issue.recommendation}</span>
      </div>
    </div>
  );
}
