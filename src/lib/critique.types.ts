import { z } from "zod";

export const EvidenceSchema = z.enum(["Observed", "Partial", "Out of scope"]);
export type Evidence = z.infer<typeof EvidenceSchema>;

export const IssueSchema = z.object({
  heuristic: z.number().int().min(1).max(10),
  title: z.string().min(1),
  description: z.string().min(1),
  location: z.string().min(1),
  severity: z.number().int().min(0).max(4),
  recommendation: z.string().min(1),
  evidence: EvidenceSchema,
});

export const HeuristicEvaluationSchema = z.object({
  id: z.number().int().min(1).max(10),
  evidence: EvidenceSchema,
  note: z.string().optional(),
});

export const BlockedSchema = z.object({
  blocked: z.literal(true),
  reason: z.string().min(1),
});

export const ClaudeResponseSchema = z.union([
  BlockedSchema,
  z.object({
    blocked: z.literal(false).optional(),
    summary: z.string().min(1),
    issues: z.array(IssueSchema),
    heuristicEvaluations: z.array(HeuristicEvaluationSchema).optional(),
  }),
]);

export type Issue = z.infer<typeof IssueSchema>;

export type HeuristicScore = {
  id: number;
  name: string;
  score: number | null; // null = Out of scope, excluded from average
  evidence: Evidence;
  deductions: { severity: number; title: string }[];
};

export type CritiqueReport =
  | {
      blocked: true;
      reason: string;
      source: { kind: "url"; url: string } | { kind: "image" };
    }
  | {
      blocked: false;
      summary: string;
      issues: Issue[];
      heuristicScores: HeuristicScore[];
      overallScore: number;
      scoredCount: number;
      topPriorities: Issue[];
      source: { kind: "url"; url: string } | { kind: "image" };
    };