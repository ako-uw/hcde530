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

  function runAnalyze(input: AnalysisInput) {
    setReport(null);
    mutation.mutate(input);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster />
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5 md:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-foreground text-background shadow-card">
              <ScanSearch className="size-4" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[15px] font-semibold tracking-tight">CritLens</span>
              <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Audit</span>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#heuristics" className="hover:text-foreground transition-colors">Heuristics</a>
            <a href="#methodology" className="hover:text-foreground transition-colors">Methodology</a>
            <a
              href="https://www.nngroup.com/articles/ten-usability-heuristics/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground transition-colors"
            >
              NNG reference ↗
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-5 py-8 md:px-8 md:py-10" style={{ rowGap: 32 }}>
        {!report && (
          <section className="space-y-4 pt-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground shadow-card">
              <span className="size-1.5 rounded-full bg-[color:var(--ev-observed)]" />
              Evidence-based UX audits
            </span>
            <h1 className="text-display text-[30px] md:text-[40px] leading-[1.1] max-w-3xl">
              Structured heuristic evaluation,<br className="hidden md:inline" />
              <span className="text-muted-foreground">honest about what it can see.</span>
            </h1>
            <p className="max-w-2xl text-[15px] leading-[1.75] text-muted-foreground">
              Submit a URL or screenshot. CritLens audits the interface against Nielsen's 10
              usability heuristics, tags every finding with evidence, and leaves anything it
              couldn't observe out of scope — no inflated grades.
            </p>
          </section>
        )}

        <InputPanel loading={mutation.isPending} onAnalyze={runAnalyze} />

        {mutation.isPending && (
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card shadow-card px-5 py-4 text-sm text-foreground/80">
            <Loader2 className="size-4 animate-spin text-foreground/70" />
            <span>
              Running heuristic evaluation…{" "}
              <span className="text-muted-foreground">typically 20–40 seconds.</span>
            </span>
          </div>
        )}

        {mutation.isError && (
          <div className="rounded-xl border border-[color:var(--sev-4)]/40 bg-[color:var(--sev-4-bg)] shadow-card px-5 py-4 text-sm text-foreground">
            {(mutation.error as Error).message || "Analysis failed."}
          </div>
        )}

        {report && (
          <ReportView
            report={report}
            onImageSelected={(dataUrl, mimeType) =>
              runAnalyze({ kind: "image", dataUrl, mimeType })
            }
          />
        )}

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
      d: "Every finding and heuristic carries an evidence tag — Observed, Partial, or Out of scope. Out-of-scope heuristics are counted separately, not folded into a grade.",
    },
    {
      t: "No inflated grades",
      d: "CritLens reports raw counts — heuristics observed, issues found, severity breakdown — instead of an averaged score that hides what wasn't seen.",
    },
    {
      t: "Infrastructure separation",
      d: "Server errors, CDN behavior, URL parameters, and queueing systems are never mapped to NNG heuristics.",
    },
  ];
  return (
    <section id="methodology" className="space-y-4">
      <div className="flex items-end justify-between border-b border-border pb-2">
        <h2 className="text-lg font-medium">Methodology</h2>
        <span className="text-label">Integrity rules</span>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {rows.map((r, idx) => (
          <div
            key={r.t}
            className="group rounded-xl border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-[var(--shadow-card-hover)]"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-6 items-center justify-center rounded-md bg-[color:var(--surface)] text-[11px] font-semibold tabular-nums text-muted-foreground">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <div className="text-sm font-semibold text-foreground">{r.t}</div>
            </div>
            <p className="mt-2.5 text-sm text-muted-foreground leading-[1.7]">{r.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
