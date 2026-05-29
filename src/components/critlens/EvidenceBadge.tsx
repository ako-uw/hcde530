import type { Evidence } from "@/lib/critique.types";

const STYLES: Record<Evidence, string> = {
  Observed: "text-[color:var(--ev-observed)] bg-[color:var(--ev-observed-bg)]",
  Partial: "text-[color:var(--ev-partial)] bg-[color:var(--ev-partial-bg)]",
  "Out of scope": "text-[color:var(--ev-oos)] bg-[color:var(--ev-oos-bg)]",
};

export function EvidenceBadge({ evidence }: { evidence: Evidence }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${STYLES[evidence]}`}
    >
      {evidence}
    </span>
  );
}
