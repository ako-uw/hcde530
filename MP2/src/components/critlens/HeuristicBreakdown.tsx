import { useState } from "react";
import type { HeuristicScore, Issue } from "@/lib/critique.types";
import { EvidenceBadge } from "./EvidenceBadge";
import { SeverityBadge, severityVar } from "./SeverityBadge";
import { ChevronDown } from "lucide-react";

export function HeuristicBreakdown({
  scores,
  issues,
}: {
  scores: HeuristicScore[];
  issues: Issue[];
}) {
  return (
    <div className="overflow-hidden border-2 border-[color:var(--border-strong)] bg-[color:var(--card)] shadow-[3px_3px_0_0_var(--border-strong)]">
      <ul>
        {scores.map((h, idx) => {
          const its = issues.filter((i) => i.heuristic === h.id);
          return (
            <Row
              key={h.id}
              score={h}
              issues={its}
              divider={idx < scores.length - 1}
            />
          );
        })}
      </ul>
    </div>
  );
}

function Row({
  score,
  issues,
  divider,
}: {
  score: HeuristicScore;
  issues: Issue[];
  divider: boolean;
}) {
  const [open, setOpen] = useState(false);
  const oos = score.score === null;
  const findings = issues.length;
  const canOpen = findings > 0;

  return (
    <li
      className={`${divider ? "border-b border-border" : ""} transition-colors ${open ? "bg-[color:var(--surface)]" : ""}`}
    >
      <button
        type="button"
        onClick={() => canOpen && setOpen((v) => !v)}
        disabled={!canOpen}
        className={`grid w-full grid-cols-[3rem_1fr_auto_auto] items-center gap-4 px-5 py-4 text-left transition-colors ${
          canOpen ? "cursor-pointer hover:bg-[color:var(--surface)]" : "cursor-default"
        }`}
        aria-expanded={open}
      >
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] tabular-nums text-muted-foreground">
          H{String(score.id).padStart(2, "0")}
        </span>
        <div className="min-w-0">
          <div className="font-display text-[18px] font-semibold leading-snug text-foreground">
            {score.name}
          </div>
          <div
            className={`mt-0.5 text-[12.5px] ${
              oos
                ? "italic text-muted-foreground"
                : findings === 0
                  ? "text-[color:var(--ev-observed)]"
                  : "text-foreground/70"
            }`}
          >
            {oos
              ? score.note ?? "Not observable from this artifact."
              : findings === 0
                ? "No violations observed"
                : `${findings} finding${findings === 1 ? "" : "s"} — click to expand`}
          </div>
        </div>
        <EvidenceBadge evidence={score.evidence} />
        <ChevronDown
          className={`size-4 text-muted-foreground transition-transform ${
            canOpen ? "" : "opacity-20"
          } ${open ? "rotate-180" : ""}`}
        />
      </button>

      {canOpen && (
        <div
          className="grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out"
          style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
        >
          <div className="min-h-0">
            <div className="space-y-2 border-t border-border bg-[color:var(--card)] px-5 py-4">
              {issues.map((i, idx) => (
                <div
                  key={idx}
                  className="border-l-[4px] bg-[color:var(--surface)] px-4 py-3"
                  style={{ borderLeftColor: severityVar(i.severity) }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h5 className="font-display text-[15px] font-semibold leading-snug">
                      {i.title}
                    </h5>
                    <SeverityBadge severity={i.severity} />
                  </div>
                  <p className="mt-1.5 text-[13px] leading-[1.6] text-foreground/80">
                    {i.description}
                  </p>
                  <p className="mt-1.5 text-[12.5px] leading-snug text-foreground/70">
                    <span className="text-label mr-1.5" style={{ color: "var(--primary)" }}>
                      Fix
                    </span>
                    {i.recommendation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </li>
  );
}
