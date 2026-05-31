import type { HeuristicScore } from "@/lib/critique.types";
import { EvidenceBadge } from "./EvidenceBadge";

export function HeuristicBreakdown({ scores }: { scores: HeuristicScore[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
      <ul className="divide-y divide-border">
        {scores.map((h) => {
          const oos = h.score === null;
          const findings = h.deductions.length;
          const status = oos
            ? h.note ?? "Insufficient observable evidence."
            : findings === 0
              ? "No violations observed."
              : `${findings} finding${findings === 1 ? "" : "s"}`;
          return (
            <li
              key={h.id}
              className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 px-5 py-4 transition-colors hover:bg-[color:var(--surface)]"
            >
              <span className="text-label text-foreground/70">H{h.id}</span>
              <div className="min-w-0">
                <div className="text-sm font-medium text-foreground">{h.name}</div>
                <div
                  className={`mt-0.5 text-xs ${oos ? "italic text-muted-foreground" : findings === 0 ? "text-[color:var(--ev-observed)]" : "text-foreground/70"}`}
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
