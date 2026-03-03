export interface Word {
  id: number;
  word: string;
  pron: string;
  emoji: string;
  cat: Category;
  es: string;
  ex: string[];
  past?: string;
  pastPron?: string;
  pp?: string;
  ppPron?: string;
}

export type Category =
  | "Phrasal Verb"
  | "Adjective"
  | "Verb"
  | "Noun"
  | "Adverb"
  | "Noun/Verb"
  | "Common Phrase";

export const CATEGORIES: readonly ("All" | Category)[] = [
  "All",
  "Phrasal Verb",
  "Adjective",
  "Verb",
  "Noun",
  "Adverb",
  "Noun/Verb",
  "Common Phrase",
] as const;

export const CAT_COLORS: Record<Category, { bg: string; light: string }> = {
  "Phrasal Verb": { bg: "#4F46E5", light: "#EEF2FF" },
  Adjective: { bg: "#0891B2", light: "#ECFEFF" },
  Verb: { bg: "#059669", light: "#ECFDF5" },
  Noun: { bg: "#D97706", light: "#FFFBEB" },
  Adverb: { bg: "#DC2626", light: "#FEF2F2" },
  "Noun/Verb": { bg: "#7C3AED", light: "#F5F3FF" },
  "Common Phrase": { bg: "#DB2777", light: "#FDF2F8" },
};
