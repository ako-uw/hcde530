import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  ClaudeResponseSchema,
  type CritiqueReport,
  type HeuristicScore,
  type Issue,
} from "./critique.types";
import { HEURISTICS, SEVERITY_DEDUCTION } from "./heuristics";

const InputSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("url"), url: z.string().url() }),
  z.object({
    kind: z.literal("image"),
    dataUrl: z.string().min(1),
    mimeType: z.string().regex(/^image\/(png|jpeg|jpg|webp|gif)$/),
  }),
]);

const SYSTEM_PROMPT = `You are a senior UX expert conducting a formal heuristic evaluation using Nielsen's 10 Usability Heuristics.

Nielsen's 10 Heuristics:
1. Visibility of system status
2. Match between system and the real world
3. User control and freedom
4. Consistency and standards
5. Error prevention
6. Recognition rather than recall
7. Flexibility and efficiency of use
8. Aesthetic and minimalist design
9. Help users recognize, diagnose, and recover from errors
10. Help and documentation

For each issue you find:
- Identify the heuristic number (1-10) it violates.
- Describe WHERE on the page the issue appears in plain language (e.g. "the primary CTA in the hero", "the navigation bar on the top right", "the pricing card labeled Pro").
- Rate severity 0-4: 0=cosmetic, 1=minor, 2=moderate, 3=major, 4=catastrophic.
- Give a concrete, actionable recommendation.

Return STRICT JSON ONLY (no markdown fences, no prose) matching this schema:
{
  "summary": "2-3 sentence overall summary of the design's UX quality",
  "issues": [
    {
      "heuristic": 1,
      "title": "Short issue title",
      "description": "What is wrong and why it hurts UX",
      "location": "Plain-language description of where on the page",
      "severity": 0,
      "recommendation": "Concrete fix"
    }
  ]
}

Find 6-15 distinct issues across the heuristics. Be honest and specific. If a heuristic is well-satisfied, you can skip it.`;

async function fetchUrlText(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; CritLensBot/1.0)" },
    });
    if (!res.ok) return `(Failed to fetch URL: HTTP ${res.status})`;
    const html = await res.text();
    // Strip scripts/styles and tags to text
    const cleaned = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return cleaned.slice(0, 12000);
  } catch (e) {
    return `(Error fetching URL: ${(e as Error).message})`;
  }
}

function extractJson(text: string): unknown {
  const trimmed = text.trim();
  // Try direct parse first
  try {
    return JSON.parse(trimmed);
  } catch {
    // Try to pull from code fence
    const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fence) {
      return JSON.parse(fence[1].trim());
    }
    // Try first { ... last }
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start !== -1 && end > start) {
      return JSON.parse(trimmed.slice(start, end + 1));
    }
    throw new Error("Model did not return JSON");
  }
}

function computeReport(
  parsed: z.infer<typeof ClaudeResponseSchema>,
  source: CritiqueReport["source"],
): CritiqueReport {
  const issues: Issue[] = parsed.issues;

  const heuristicScores: HeuristicScore[] = HEURISTICS.map((h) => {
    const its = issues.filter((i) => i.heuristic === h.id);
    const deductions = its.map((i) => ({ severity: i.severity, title: i.title }));
    const totalDed = its.reduce(
      (sum, i) => sum + (SEVERITY_DEDUCTION[i.severity] ?? 0),
      0,
    );
    const score = Math.max(0, Math.min(10, 10 - totalDed));
    return {
      id: h.id,
      name: h.name,
      score: Math.round(score * 10) / 10,
      deductions,
    };
  });

  const overall =
    heuristicScores.reduce((s, h) => s + h.score, 0) / heuristicScores.length;

  const topPriorities = [...issues]
    .sort((a, b) => b.severity - a.severity)
    .slice(0, 3);

  return {
    summary: parsed.summary,
    issues,
    heuristicScores,
    overallScore: Math.round(overall * 10) / 10,
    topPriorities,
    source,
  };
}

type UserContentPart =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } };

async function callAI(content: UserContentPart[]): Promise<string> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    if (res.status === 429) {
      throw new Error("Rate limit exceeded. Please wait a moment and try again.");
    }
    if (res.status === 402) {
      throw new Error("AI credits exhausted. Please add credits in Settings > Workspace > Usage.");
    }
    throw new Error(`AI gateway ${res.status}: ${errText.slice(0, 500)}`);
  }

  const json = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = json.choices?.[0]?.message?.content;
  if (!text) throw new Error("Empty response from AI gateway");
  return text;
}

export const analyzeDesign = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<CritiqueReport> => {
    let content: UserContentPart[];
    let source: CritiqueReport["source"];

    if (data.kind === "url") {
      const text = await fetchUrlText(data.url);
      content = [
        {
          type: "text",
          text: `Evaluate the UX of this web page. URL: ${data.url}\n\nExtracted text content from the page:\n${text}\n\nReturn your heuristic evaluation as strict JSON.`,
        },
      ];
      source = { kind: "url", url: data.url };
    } else {
      content = [
        {
          type: "image_url",
          image_url: { url: data.dataUrl },
        },
        {
          type: "text",
          text: "Evaluate the UX of this design screenshot. Return your heuristic evaluation as strict JSON.",
        },
      ];
      source = { kind: "image" };
    }

    const raw = await callAI(content);
    const parsed = ClaudeResponseSchema.parse(extractJson(raw));
    return computeReport(parsed, source);
  });