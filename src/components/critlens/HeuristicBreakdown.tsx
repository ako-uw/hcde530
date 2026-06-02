import type { HeuristicScore } from "@/lib/critique.types";
import { EvidenceBadge } from "./EvidenceBadge";

export function HeuristicBreakdown({ scores }: { scores: HeuristicScore[] }) {
  return (
    <div className="overflow-hidden border border-border bg-card">
      <ul className="divide-y divide-border">
        {scores.map((h) => {
          const oos = h.score === null;
          const findings = h.deductions.length;
          const status = oos
            ? h.note ?? "Not observable from this artifact."
            : findings === 0
              ? "No violations observed"
              : `${findings} finding${findings === 1 ? "" : "s"}`;
          return (
            <li
              key={h.id}
              className="grid grid-cols-[3rem_1fr_auto] items-center gap-4 px-5 py-4 transition-colors hover:bg-[color:var(--surface)]"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-foreground/50 tabular-nums">
                H{String(h.id).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <div className="font-display text-[17px] leading-snug text-foreground">
                  {h.name}
                </div>
                <div
                  className={`mt-1 text-[12.5px] ${oos ? "italic text-muted-foreground" : findings === 0 ? "text-[color:var(--ev-observed)]" : "text-foreground/70"}`}
                >
                  {status}
                </div>
              </div>
              <EvidenceBadge evidence={h.evidence} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
