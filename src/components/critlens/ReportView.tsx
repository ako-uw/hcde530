import type { CritiqueReport, Issue, OkReport } from "@/lib/critique.types";
import { HEURISTICS } from "@/lib/heuristics";
import { ScoreHero } from "./ScoreHero";
import { HeuristicBreakdown } from "./HeuristicBreakdown";
import { IssueCard } from "./IssueCard";
import { BlockedNotice } from "./BlockedNotice";
import { Button } from "@/components/ui/button";
import { Download, Copy } from "lucide-react";
import { toast } from "sonner";

function toMarkdown(r: OkReport): string {
  const lines: string[] = [];
  const unscored = r.heuristicScores.filter((h) => h.score === null);
  lines.push(`# CritLens UX Report`);
  lines.push("");
  lines.push(
    `**Overall score:** ${r.overallScore.toFixed(1)} / 10 (based on ${r.scoredCount} of 10 heuristics scored).`,
  );
  if (unscored.length > 0) {
    lines.push(
      `_${unscored.length} heuristic${unscored.length === 1 ? "" : "s"} not scored — insufficient observable evidence._`,
    );
  }
  lines.push("");
  lines.push(`## Summary`);
  lines.push(r.summary);
  lines.push("");
  lines.push(`## Scoring breakdown`);
  r.heuristicScores.forEach((h) => {
    const s =
      h.score === null
        ? `— (Out of scope — ${h.note ?? "insufficient evidence"})`
        : `${h.score.toFixed(1)} / 10 — Evidence: ${h.evidence}`;
    lines.push(`- **H${h.id} ${h.name}** — ${s}`);
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
}: {
  report: CritiqueReport;
  onImageSelected?: (dataUrl: string, mimeType: string) => void;
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
    <div className="space-y-8">
      <ScoreHero
        score={report.overallScore}
        scoredCount={report.scoredCount}
        summary={report.summary}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-label">
          {report.issues.length} findings · {report.scoredCount}/10 heuristics scored
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(toMarkdown(report));
              toast.success("Markdown copied");
            }}
          >
            <Copy className="size-3.5" /> Copy as Markdown
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              download("critlens-report.json", JSON.stringify(report, null, 2), "application/json")
            }
          >
            <Download className="size-3.5" /> Export JSON
          </Button>
        </div>
      </div>

      {report.topPriorities.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-end justify-between border-b border-border pb-2">
            <h3 className="text-lg font-medium">Top priorities</h3>
            <span className="text-label">Fix first</span>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {report.topPriorities.map((i, idx) => (
              <IssueCard key={idx} issue={i} />
            ))}
          </div>
        </section>
      )}

      <section id="heuristics" className="space-y-3">
        <div className="flex items-end justify-between border-b border-border pb-2">
          <h3 className="text-lg font-medium">Scoring breakdown</h3>
          <span className="text-label">10 heuristics</span>
        </div>
        <HeuristicBreakdown scores={report.heuristicScores} />
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between border-b border-border pb-2">
          <h3 className="text-lg font-medium">All findings</h3>
          <span className="text-label">{report.issues.length} total</span>
        </div>
        {grouped.map(({ h, issues }) => (
          <div key={h.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-label">H{h.id}</span>
              <span className="text-sm font-medium">{h.name}</span>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {issues.map((i, idx) => (
                <IssueCard key={idx} issue={i} />
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
