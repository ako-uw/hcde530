import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, ScanSearch } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { analyzeDesign } from "@/lib/critique.functions";
import type { CritiqueReport } from "@/lib/critique.types";
import { InputPanel, type AnalysisInput } from "@/components/critlens/InputPanel";
import { ReportView } from "@/components/critlens/ReportView";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "CritLens — Nielsen heuristic evaluation for designers" },
      {
        name: "description",
        content:
          "Structured UX audits scored against Nielsen's 10 usability heuristics. Built for designers and UX managers.",
      },
    ],
  }),
});

function Index() {
  const analyzeFn = useServerFn(analyzeDesign);
  const [report, setReport] = useState<CritiqueReport | null>(null);

  const mutation = useMutation({
    mutationFn: (input: AnalysisInput) => analyzeFn({ data: input }),
    onSuccess: (data) => setReport(data),
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster />
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 md:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-md bg-foreground text-background">
              <ScanSearch className="size-4" />
            </div>
            <div className="text-[15px] font-medium">CritLens</div>
            <span className="text-label">v1.0</span>
          </div>
          <nav className="hidden items-center gap-5 text-sm text-muted-foreground md:flex">
            <a href="#heuristics" className="hover:text-foreground transition-colors">Heuristics</a>
            <a
              href="https://www.nngroup.com/articles/ten-usability-heuristics/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Nielsen reference
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-5 py-8 md:px-8 md:py-10">
        {!report && (
          <section className="space-y-2">
            <h1 className="text-display text-3xl md:text-4xl">
              Nielsen heuristic evaluation, scored and structured.
            </h1>
            <p className="max-w-2xl text-[15px] text-muted-foreground">
              Submit a URL or a screenshot. CritLens audits the interface against the 10 NNG
              heuristics, tags each finding with evidence, and excludes anything it couldn't
              observe from the score.
            </p>
          </section>
        )}

        <InputPanel
          loading={mutation.isPending}
          onAnalyze={(input) => {
            setReport(null);
            mutation.mutate(input);
          }}
        />

        {mutation.isPending && (
          <div className="flex items-center gap-3 rounded-lg border border-border surface px-4 py-3 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Running heuristic evaluation… this typically takes 20–40 seconds.
          </div>
        )}

        {mutation.isError && (
          <div className="rounded-lg border border-[color:var(--sev-4)]/40 bg-[color:var(--sev-4-bg)] px-4 py-3 text-sm text-foreground">
            {(mutation.error as Error).message || "Analysis failed."}
          </div>
        )}

        {report && <ReportView report={report} />}

        {!report && !mutation.isPending && <Methodology />}
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-5 md:px-8 text-xs text-muted-foreground">
          <span>© CritLens — Structured UX audits.</span>
          <span>Method: Nielsen's 10 Usability Heuristics</span>
        </div>
      </footer>
    </div>
  );
}

function Methodology() {
  const rows = [
    {
      t: "Page-load verification",
      d: "If the URL returns an error, redirect loop, queue, or CDN challenge, the evaluation is blocked rather than scored against infrastructure behavior.",
    },
    {
      t: "Evidence tagging",
      d: "Every finding and heuristic carries an evidence tag — Observed, Partial, or Out of scope. Out-of-scope heuristics are excluded from the average.",
    },
    {
      t: "Score consistency",
      d: "A heuristic with active findings cannot score above 7.5. High scores require Observed evidence and no violations.",
    },
    {
      t: "Infrastructure separation",
      d: "Server errors, CDN behavior, URL parameters, and queueing systems are never mapped to NNG heuristics.",
    },
  ];
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between border-b border-border pb-2">
        <h2 className="text-lg font-medium">Methodology</h2>
        <span className="text-label">Integrity rules</span>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {rows.map((r) => (
          <div key={r.t} className="rounded-lg border border-border bg-card p-5">
            <div className="text-sm font-medium text-foreground">{r.t}</div>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{r.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
