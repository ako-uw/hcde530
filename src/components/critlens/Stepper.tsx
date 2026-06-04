export function Stepper({ step }: { step: 1 | 2 | 3 }) {
  const steps = [
    { num: 1, label: "INPUT", desc: "Paste a URL or upload a screenshot" },
    { num: 2, label: "ANALYZE", desc: "CritLens evaluates against Nielsen's 10 heuristics" },
    { num: 3, label: "REPORT", desc: "Review findings by severity and priority" },
  ];

  return (
    <div className="flex items-start justify-center gap-2 md:gap-6">
      {steps.map((s, i) => {
        const isActive = step === s.num;
        const isDone = step > s.num;
        const isLast = i === steps.length - 1;

        return (
          <div key={s.num} className="flex items-center">
            <div className="flex flex-col items-center text-center">
              <div
                className={`flex size-8 items-center justify-center border-2 font-mono text-[11px] font-bold transition-colors md:size-9 ${
                  isActive
                    ? "border-[color:var(--primary)] bg-[color:var(--primary)] text-[color:var(--primary-foreground)]"
                    : isDone
                      ? "border-[color:var(--border-strong)] bg-[color:var(--border-strong)] text-[color:var(--ink-fg)]"
                      : "border-[color:var(--border-strong)]/40 bg-[color:var(--card)] text-muted-foreground"
                }`}
              >
                {s.num}
              </div>
              <div className="mt-2 hidden md:block">
                <div
                  className={`font-mono text-[10px] font-semibold uppercase tracking-[0.18em] ${
                    isActive ? "text-foreground" : isDone ? "text-foreground/70" : "text-muted-foreground"
                  }`}
                >
                  {s.label}
                </div>
                <div className="mt-0.5 max-w-[140px] text-[10.5px] leading-snug text-muted-foreground">
                  {s.desc}
                </div>
              </div>
              {/* Mobile label */}
              <div className="mt-2 md:hidden">
                <div
                  className={`font-mono text-[9px] font-semibold uppercase tracking-[0.18em] ${
                    isActive ? "text-foreground" : isDone ? "text-foreground/70" : "text-muted-foreground"
                  }`}
                >
                  {s.label}
                </div>
              </div>
            </div>
            {!isLast && (
              <div className="mx-1 mt-[-24px] w-4 border-t border-[color:var(--border-strong)]/30 md:mx-3 md:w-10" />
            )}
          </div>
        );
      })}
    </div>
  );
}
