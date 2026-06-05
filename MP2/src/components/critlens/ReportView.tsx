import type { CritiqueReport, Issue, OkReport } from "@/lib/critique.types";
import { HEURISTICS } from "@/lib/heuristics";
import { StatsOverview } from "./StatsOverview";
import { HeuristicBreakdown } from "./HeuristicBreakdown";
import { IssueCard } from "./IssueCard";
import { BlockedNotice } from "./BlockedNotice";
import { Legend } from "./Legend";
import { Button } from "@/components/ui/button";
import { Download, Copy } from "lucide-react";
import { toast } from "sonner";

function toMarkdown(r: OkReport): string {
  const lines: string[] = [];
  const unscored = r.heuristicScores.filter((h) => h.score === null);
  const sev = { 1: 0, 2: 0, 3: 0, 4: 0 } as Record<number, number>;
  for (const i of r.issues) if (sev[i.severity] !== undefined) sev[i.severity]++;
  lines.push(`# CritLens UX Report`);
  lines.push("");
  lines.push(`**Heuristics observed:** ${r.scoredCount} / 10`);
  lines.push(`**Issues found:** ${r.issues.length}`);
  lines.push(`**Severity:** S4 ${sev[4]} · S3 ${sev[3]} · S2 ${sev[2]} · S1 ${sev[1]}`);
  lines.push(`**Out of scope:** ${unscored.length}`);
  lines.push("");
  lines.push(`## Summary`);
  lines.push(r.summary);
  lines.push("");
  lines.push(`## Scoring breakdown`);
  r.heuristicScores.forEach((h) => {
    const findings = h.deductions.length;
    const status =
      h.score === null
        ? `Out of scope — ${h.note ?? "insufficient evidence"}`
        : findings === 0
          ? "No violations observed."
          : `${findings} finding${findings === 1 ? "" : "s"} · Evidence: ${h.evidence}`;
    lines.push(`- **H${h.id} ${h.name}** — ${status}`);
  });
  lines.push("");
  if (unscored.length > 0) {
    lines.push(`## Unscored heuristics`);
    unscored.forEach((h) => {
      lines.push(`- **H${h.id} ${h.name}** — ${h.note ?? "Insufficient observable evidence."}`);
    });
    lines.push("");
  }
  lines.push(`## Top priorities`);
  r.topPriorities.forEach((i, idx) => {
    lines.push(
      `${idx + 1}. **${i.title}** (H${i.heuristic}, S${i.severity}, Evidence: ${i.evidence}) — ${i.recommendation}`,
    );
  });
  lines.push("");
  lines.push(`## All findings`);
  r.issues.forEach((i) => {
    lines.push(`### H${i.heuristic} — ${i.title} (S${i.severity}, Evidence: ${i.evidence})`);
    lines.push(`- Location: ${i.location}`);
    lines.push(`- ${i.description}`);
    lines.push(`- Recommendation: ${i.recommendation}`);
    lines.push("");
  });
  lines.push(`## Methodology`);
  lines.push(
    "Evaluation follows Nielsen's 10 Usability Heuristics with strict integrity rules: (1) page-load verification — blocked rather than scored on infrastructure errors, queues, or CDN challenges; (2) every finding and heuristic carries an evidence tag (Observed / Partial / Out of scope); (3) scores are capped by the most severe finding (S4 → 5.0, S3 → 6.5, S2 → 7.5, S1 → 8.5); (4) infrastructure issues are never mapped to NNG heuristics; (5) Out-of-scope heuristics are excluded from the overall average.",
  );
  return lines.join("\n");
}

function download(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function ReportView({
  report,
  onImageSelected,
  onNewEvaluation,
}: {
  report: CritiqueReport;
  onImageSelected?: (dataUrl: string, mimeType: string) => void;
  onNewEvaluation?: () => void;
}) {
  if (report.blocked) {
    return (
      <BlockedNotice
        reason={report.reason}
        kind={report.kind}
        source={report.source}
        onImageSelected={onImageSelected}
      />
    );
  }

  const grouped = HEURISTICS.map((h) => ({
    h,
    issues: report.issues.filter((i: Issue) => i.heuristic === h.id),
  })).filter((g) => g.issues.length > 0);

  return (
    <div className="space-y-14">
      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-3">
          <div>
            <div className="text-label">Report</div>
            <h2 className="font-display mt-1 text-[28px] leading-tight">At a glance</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-none font-mono text-[10px] uppercase tracking-[0.12em]"
              onClick={() => {
                navigator.clipboard.writeText(toMarkdown(report));
                toast.success("Markdown copied");
              }}
            >
              <Copy className="size-3.5" /> Markdown
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-none font-mono text-[10px] uppercase tracking-[0.12em]"
              onClick={() =>
                download("critlens-report.json", JSON.stringify(report, null, 2), "application/json")
              }
            >
              <Download className="size-3.5" /> JSON
            </Button>
          </div>
        </div>
        <StatsOverview report={report} />
        <div className="border border-border bg-card p-6 md:p-8">
          <div className="text-label mb-3">Summary</div>
          <p className="font-display max-w-3xl text-[20px] leading-[1.45] text-foreground/90 md:text-[22px]">
            {report.summary}
          </p>
        </div>
        <Legend />
      </section>

      {report.topPriorities.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-end justify-between border-b border-border pb-3">
            <h3 className="font-display text-[22px] leading-none">Top priorities</h3>
            <span className="text-label">Fix first</span>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {report.topPriorities.map((i, idx) => (
              <IssueCard key={idx} issue={i} index={idx} />
            ))}
          </div>
        </section>
      )}

      <section id="heuristics" className="space-y-3">
        <div className="flex items-end justify-between border-b border-border pb-3">
          <h3 className="font-display text-[22px] leading-none">Heuristic breakdown</h3>
          <span className="text-label">10 heuristics</span>
        </div>
        <HeuristicBreakdown scores={report.heuristicScores} issues={report.issues} />
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between border-b border-border pb-3">
          <h3 className="font-display text-[22px] leading-none">All findings</h3>
          <span className="text-label">{report.issues.length} total</span>
        </div>
        {grouped.map(({ h, issues }) => (
          <div key={h.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-label">H{h.id}</span>
              <span className="text-sm font-medium">{h.name}</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {issues.map((i, idx) => (
                <IssueCard key={idx} issue={i} index={idx} />
              ))}
            </div>
          </div>
        ))}
      </section>

      {onNewEvaluation && (
        <section className="flex flex-col items-start gap-3 border-t border-border pt-8">
          <div className="text-label">Done reading?</div>
          <button
            onClick={onNewEvaluation}
            className="inline-flex h-11 cursor-pointer items-center rounded-none border border-foreground bg-foreground px-5 font-mono text-[11px] uppercase tracking-[0.14em] text-background transition-colors hover:bg-background hover:text-foreground"
          >
            Start a new evaluation
          </button>
        </section>
      )}
    </div>
  );
}
