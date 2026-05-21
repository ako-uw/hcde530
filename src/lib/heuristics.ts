export type HeuristicId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export const HEURISTICS: { id: HeuristicId; name: string; short: string }[] = [
  { id: 1, name: "Visibility of system status", short: "System status" },
  { id: 2, name: "Match between system and the real world", short: "Real-world match" },
  { id: 3, name: "User control and freedom", short: "User control" },
  { id: 4, name: "Consistency and standards", short: "Consistency" },
  { id: 5, name: "Error prevention", short: "Error prevention" },
  { id: 6, name: "Recognition rather than recall", short: "Recognition" },
  { id: 7, name: "Flexibility and efficiency of use", short: "Flexibility" },
  { id: 8, name: "Aesthetic and minimalist design", short: "Aesthetic" },
  { id: 9, name: "Help users recognize, diagnose, and recover from errors", short: "Error recovery" },
  { id: 10, name: "Help and documentation", short: "Help & docs" },
];

// Severity 0 cosmetic → 4 catastrophe. Deductions per issue.
export const SEVERITY_DEDUCTION: Record<number, number> = {
  0: 0.5,
  1: 1,
  2: 2,
  3: 3.5,
  4: 5,
};

export const SEVERITY_LABEL: Record<number, string> = {
  0: "Cosmetic",
  1: "Minor",
  2: "Moderate",
  3: "Major",
  4: "Critical",
};