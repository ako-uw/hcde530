import type { CritiqueReport } from "@/lib/critique.types";
import { HEURISTICS } from "@/lib/heuristics";
import { ScoreHero } from "./ScoreHero";
import { HeuristicBreakdown } from "./HeuristicBreakdown";
import { IssueCard } from "./IssueCard";
import { Button } from "@/components/ui/button";
import { Download, Copy } from "lucide-react";
import { toast } from "sonner";

function toMarkdown(r: CritiqueReport): string {
  const lines: string[] = [];
  lines.push(`# CritLens UX Report`);
  lines.push("");
  lines.push(`**Overall score:** ${r.overallScore.toFixed(1)} / 10`);
  lines.push("");
  lines.push(`## Summary`);
  lines.push(r.summary);
  lines.push("");
  lines.push(`## Scoring breakdown`);
  r.heuristicScores.forEach((h) => {
    lines.push(`- **H${h.id} ${h.name}** — ${h.score.toFixed(1)} / 10`);
  });
  lines.push("");
  lines.push(`## Top priorities`);
  r.topPriorities.forEach((i, idx) => {
    lines.push(`${idx + 1}. **${i.title}** (H${i.heuristic}, severity ${i.severity}) — ${i.recommendation}`);
  });
  lines.push("");
  lines.push(`## All issues`);
  r.issues.forEach((i) => {
    lines.push(`### H${i.heuristic} — ${i.title} (severity ${i.severity})`);
    lines.push(`- Where: ${i.location}`);
    lines.push(`- ${i.description}`);
    lines.push(`- Recommendation: ${i.recommendation}`);
    lines.push("");
  });
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

export function ReportView({ report }: { report: CritiqueReport }) {
  const grouped = HEURISTICS.map((h) => ({
    h,
    issues: report.issues.filter((i) => i.heuristic === h.id),
  })).filter((g) => g.issues.length > 0);

  return (
    <div className="space-y-8">
      <ScoreHero score={report.overallScore} summary={report.summary} />

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

      {report.topPriorities.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-lg font-semibold tracking-tight">Top priorities</h3>
          <div className="grid gap-3 md:grid-cols-3">
            {report.topPriorities.map((i, idx) => (
              <div key={idx} className="rounded-xl border bg-card p-4">
                <div className="text-xs font-medium text-muted-foreground">
                  Priority {idx + 1} · H{i.heuristic}
                </div>
                <div className="mt-1 text-sm font-semibold">{i.title}</div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {i.recommendation}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      <HeuristicBreakdown scores={report.heuristicScores} />

      <section className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">
          All issues ({report.issues.length})
        </h3>
        {grouped.map(({ h, issues }) => (
          <div key={h.id} className="space-y-3">
            <div className="text-sm font-medium text-muted-foreground">
              H{h.id} · {h.name}
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