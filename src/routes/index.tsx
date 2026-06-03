import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { InputPanel } from "@/components/critlens/InputPanel";
import { ReportView } from "@/components/critlens/ReportView";
import { useCritique } from "@/lib/critique-context";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "CritLens — Heuristic evaluation for designers" },
      {
        name: "description",
        content:
          "Run a heuristic evaluation against Nielsen's ten usability principles. Counts, severities, and evidence tags — no inflated grades.",
      },
    ],
  }),
});

function Index() {
  const { report, isPending, isError, error, runAnalyze, reset } = useCritique();

  return (
    <div>
      <Toaster />
      <div className="mx-auto max-w-6xl space-y-12 px-6 py-10 md:px-10 md:py-16">
        {!report && (
          <section className="grid gap-8 border-b-2 border-[color:var(--border-strong)] pb-12 md:grid-cols-[1.4fr_1fr] md:gap-12 md:pb-16">
            <div>
              <div className="inline-flex items-center gap-2 border border-[color:var(--border-strong)] bg-[color:var(--card)] px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.22em]">
                <span className="size-1.5 rounded-full bg-[color:var(--primary)]" />
                Heuristic evaluation · v1
              </div>
              <h1 className="font-display mt-6 text-[52px] font-bold leading-[0.95] tracking-[-0.03em] md:text-[88px]">
                Read the<br />
                <span className="text-[color:var(--primary)]">interface</span>,<br />
                not the pitch deck.
              </h1>
              <p className="mt-7 max-w-lg text-[17px] leading-[1.6] text-foreground/75">
                CritLens runs a structured heuristic evaluation against Nielsen's
                ten usability principles. Every finding carries an evidence tag.
                Nothing gets inflated, nothing gets faked.
              </p>
            </div>
            <aside className="hidden border-l-2 border-[color:var(--border-strong)] pl-8 md:block">
              <div className="text-label">What you get</div>
              <ul className="mt-4 space-y-3">
                {[
                  ["01", "10 heuristics, individually tagged"],
                  ["02", "Severity S1–S4 with caps"],
                  ["03", "Findings with concrete fixes"],
                  ["04", "Blocked, not faked, on errors"],
                ].map(([n, t]) => (
                  <li key={n} className="flex gap-3 border-b border-border pb-2">
                    <span className="font-mono text-[11px] font-semibold tracking-[0.1em] text-[color:var(--primary)]">
                      {n}
                    </span>
                    <span className="text-[14px] leading-snug">{t}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </section>
        )}

        <InputPanel loading={isPending} onAnalyze={runAnalyze} />

        {isPending && (
          <div className="flex items-center gap-3 border-2 border-[color:var(--border-strong)] bg-[color:var(--card)] px-5 py-4 text-sm text-foreground/85 shadow-[3px_3px_0_0_var(--border-strong)]">
            <Loader2 className="size-4 animate-spin text-[color:var(--primary)]" />
            <span>
              Reading the interface…{" "}
              <span className="text-muted-foreground">usually 20–40 seconds.</span>
            </span>
          </div>
        )}

        {isError && (
          <div className="cl-slide-in border-l-[6px] border-[color:var(--severity-s4)] border-y border-r border-[color:var(--border-strong)] bg-[color:var(--sev-4-bg)] px-5 py-4 text-sm text-foreground">
            {error?.message || "Evaluation failed."}
          </div>
        )}

        {report && (
          <ReportView
            report={report}
            onImageSelected={(dataUrl, mimeType) =>
              runAnalyze({ kind: "image", dataUrl, mimeType })
            }
            onNewEvaluation={reset}
          />
        )}
      </div>
    </div>
  );
}
