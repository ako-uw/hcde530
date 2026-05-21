import { z } from "zod";

export const IssueSchema = z.object({
  heuristic: z.number().int().min(1).max(10),
  title: z.string().min(1),
  description: z.string().min(1),
  location: z.string().min(1),
  severity: z.number().int().min(0).max(4),
  recommendation: z.string().min(1),
});

export const ClaudeResponseSchema = z.object({
  summary: z.string().min(1),
  issues: z.array(IssueSchema),
  topPriorities: z.array(z.string()).max(3).optional(),
});

export type Issue = z.infer<typeof IssueSchema>;

export type HeuristicScore = {
  id: number;
  name: string;
  score: number;
  deductions: { severity: number; title: string }[];
};

export type CritiqueReport = {
  summary: string;
  issues: Issue[];
  heuristicScores: HeuristicScore[];
  overallScore: number;
  topPriorities: Issue[];
  source: { kind: "url"; url: string } | { kind: "image" };
};