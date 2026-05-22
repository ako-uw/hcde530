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
    <div className="space-y-10">
      <ScoreHero score={report.overallScore} summary={report.summary} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="font-mono-label text-muted-foreground">/ {report.issues.length} issues found</div>
        <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
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
          className="rounded-full"
          onClick={() =>
            download("critlens-report.json", JSON.stringify(report, null, 2), "application/json")
          }
        >
          <Download className="size-3.5" /> Export JSON
        </Button>
        </div>
      </div>

      {report.topPriorities.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-end justify-between border-b border-border/60 pb-3">
            <h3 className="font-display text-3xl">Top priorities</h3>
            <span className="font-mono-label text-muted-foreground">/ fix first</span>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {report.topPriorities.map((i, idx) => (
              <div key={idx} className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-5 transition-colors hover:border-primary/50">
                <div className="flex items-center justify-between">
                  <span className="font-mono-label text-primary">P{idx + 1} · H{i.heuristic}</span>
                  <span className="font-mono-label text-muted-foreground">SEV {i.severity}</span>
                </div>
                <div className="mt-3 font-display text-xl leading-tight">{i.title}</div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {i.recommendation}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section id="heuristics" className="space-y-4">
        <div className="flex items-end justify-between border-b border-border/60 pb-3">
          <h3 className="font-display text-3xl">Scoring breakdown</h3>
          <span className="font-mono-label text-muted-foreground">/ 10 heuristics</span>
        </div>
        <HeuristicBreakdown scores={report.heuristicScores} />
      </section>

      <section className="space-y-6">
        <div className="flex items-end justify-between border-b border-border/60 pb-3">
          <h3 className="font-display text-3xl">All issues</h3>
          <span className="font-mono-label text-muted-foreground">/ {report.issues.length} total</span>
        </div>
        {grouped.map(({ h, issues }) => (
          <div key={h.id} className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="font-mono-label text-primary">H{h.id}</span>
              <span className="font-display text-xl">{h.name}</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
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