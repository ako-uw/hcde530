// Nielsen's 10 Usability Heuristics — definitions adapted from
// https://www.nngroup.com/articles/ten-usability-heuristics/

export const HEURISTIC_DEFINITIONS: {
  id: number;
  name: string;
  summary: string;
  details: string;
}[] = [
  {
    id: 1,
    name: "Visibility of system status",
    summary:
      "The design should always keep users informed about what is going on, through appropriate feedback within a reasonable amount of time.",
    details:
      "When users know the current system status, they learn the outcome of their prior interactions and can determine next steps. Predictable interactions create trust both in the product and the brand.",
  },
  {
    id: 2,
    name: "Match between system and the real world",
    summary:
      "The design should speak the users' language. Use words, phrases, and concepts familiar to the user, rather than internal jargon.",
    details:
      "Follow real-world conventions, making information appear in a natural and logical order. The way the design speaks should be based on the audience for that design, not the team building it.",
  },
  {
    id: 3,
    name: "User control and freedom",
    summary:
      "Users often perform actions by mistake. They need a clearly marked emergency exit to leave the unwanted action without having to go through an extended process.",
    details:
      "When it's easy for people to back out of a process or undo an action, it fosters a sense of freedom and confidence. Exits allow users to remain in control of the system and avoid getting stuck.",
  },
  {
    id: 4,
    name: "Consistency and standards",
    summary:
      "Users should not have to wonder whether different words, situations, or actions mean the same thing. Follow platform and industry conventions.",
    details:
      "Jakob's Law: people spend most of their time using digital products other than yours. Meeting user expectations with consistency reduces the cognitive load required to learn an interface.",
  },
  {
    id: 5,
    name: "Error prevention",
    summary:
      "Good error messages are important, but the best designs carefully prevent problems from occurring in the first place.",
    details:
      "Eliminate error-prone conditions, or check for them and present users with a confirmation option before they commit to the action. There are two types of errors: slips (unconscious mistakes) and mistakes (conscious errors from a mismatched mental model).",
  },
  {
    id: 6,
    name: "Recognition rather than recall",
    summary:
      "Minimize the user's memory load by making elements, actions, and options visible. The user should not have to remember information from one part of the interface to another.",
    details:
      "Information required to use the design (e.g. field labels or menu items) should be visible or easily retrievable when needed. Humans have limited short-term memories; interfaces that promote recognition reduce the amount of cognitive effort required.",
  },
  {
    id: 7,
    name: "Flexibility and efficiency of use",
    summary:
      "Shortcuts — hidden from novice users — may speed up the interaction for the expert user so that the design can cater to both inexperienced and experienced users.",
    details:
      "Allow users to tailor frequent actions. Flexible processes can be carried out in different ways, so people can pick whichever method works for them. Accelerators help speed up workflows for power users.",
  },
  {
    id: 8,
    name: "Aesthetic and minimalist design",
    summary:
      "Interfaces should not contain information which is irrelevant or rarely needed. Every extra unit of information competes with the relevant units and diminishes their relative visibility.",
    details:
      "This heuristic doesn't mean you have to use a flat design — it's about making sure you're keeping the content and visual design focused on the essentials. Ensure the visual elements of the interface support the user's primary goals.",
  },
  {
    id: 9,
    name: "Help users recognize, diagnose, and recover from errors",
    summary:
      "Error messages should be expressed in plain language (no error codes), precisely indicate the problem, and constructively suggest a solution.",
    details:
      "These error messages should also be presented with visual treatments that will help users notice and recognize them — typically, traditional error-message colors like red, paired with an icon.",
  },
  {
    id: 10,
    name: "Help and documentation",
    summary:
      "It's best if the system doesn't need any additional explanation. However, it may be necessary to provide documentation to help users understand how to complete their tasks.",
    details:
      "Help and documentation content should be easy to search, focused on the user's task, list concrete steps to be carried out, and not be too large. Even better, prevent the need for documentation by making the interface intuitive.",
  },
];

export const SEVERITY_DEFINITIONS: {
  level: 0 | 1 | 2 | 3 | 4;
  label: string;
  short: string;
  description: string;
}[] = [
  {
    level: 4,
    label: "Catastrophic",
    short: "S4",
    description: "The interface is broken or unusable for this task.",
  },
  {
    level: 3,
    label: "Major",
    short: "S3",
    description:
      "A significant problem that will frustrate users and needs fixing before launch.",
  },
  {
    level: 2,
    label: "Minor",
    short: "S2",
    description: "A real usability problem, but users can work around it.",
  },
  {
    level: 1,
    label: "Cosmetic",
    short: "S1",
    description: "A surface-level polish issue that does not affect task completion.",
  },
  {
    level: 0,
    label: "Cosmetic",
    short: "S0",
    description: "Cosmetic only — fix if time permits.",
  },
];

export const EVIDENCE_DEFINITIONS: Record<
  "Observed" | "Partial" | "Out of scope",
  string
> = {
  Observed: "Directly visible in the evaluated interface.",
  Partial: "Only partially assessable from the available artifact.",
  "Out of scope":
    "Requires live interaction or multi-step flows that were not available in this evaluation pass.",
};
