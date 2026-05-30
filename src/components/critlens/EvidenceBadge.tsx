import type { Evidence } from "@/lib/critique.types";

const STYLES: Record<Evidence, string> = {
  Observed: "text-[color:var(--ev-observed)] bg-[color:var(--ev-observed-bg)]",
  Partial: "text-[color:var(--ev-partial)] bg-[color:var(--ev-partial-bg)]",
  "Out of scope": "text-[color:var(--ev-oos)] bg-[color:var(--ev-oos-bg)]",
};

export function EvidenceBadge({ evidence }: { evidence: Evidence }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.04em] ${STYLES[evidence]}`}
    >
      {evidence}
    </span>
  );
}
