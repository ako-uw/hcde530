import React, { createContext, useCallback, useContext, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { analyzeDesign } from "@/lib/critique.functions";
import type { CritiqueReport } from "@/lib/critique.types";
import type { AnalysisInput } from "@/components/critlens/InputPanel";

type Ctx = {
  report: CritiqueReport | null;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  runAnalyze: (input: AnalysisInput) => void;
  reset: () => void;
};

const CritiqueCtx = createContext<Ctx | null>(null);

export function CritiqueProvider({ children }: { children: React.ReactNode }) {
  const analyzeFn = useServerFn(analyzeDesign);
  const [report, setReport] = useState<CritiqueReport | null>(null);

  const mutation = useMutation({
    mutationFn: (input: AnalysisInput) => analyzeFn({ data: input }),
    onSuccess: (data) => setReport(data),
  });

  const runAnalyze = useCallback(
    (input: AnalysisInput) => {
      setReport(null);
      mutation.mutate(input);
    },
    [mutation],
  );

  const reset = useCallback(() => {
    setReport(null);
    mutation.reset();
  }, [mutation]);

  return (
    <CritiqueCtx.Provider
      value={{
        report,
        isPending: mutation.isPending,
        isError: mutation.isError,
        error: (mutation.error as Error | null) ?? null,
        runAnalyze,
        reset,
      }}
    >
      {children}
    </CritiqueCtx.Provider>
  );
}

export function useCritique() {
  const ctx = useContext(CritiqueCtx);
  if (!ctx) throw new Error("useCritique must be inside CritiqueProvider");
  return ctx;
}
