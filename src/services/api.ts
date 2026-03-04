import { supabase } from "../lib/supabase";

// --- Levels ---

export interface LevelMeta {
  id: string;
  name: string;
  description: string;
  wordCount: number;
}

export interface WordData {
  id: number;
  word: string;
  pron: string;
  emoji: string;
  cat: string;
  es: string;
  ex: string[];
  past?: string;
  pastPron?: string;
  pp?: string;
  ppPron?: string;
}

interface LevelRow {
  id: string;
  name: string;
  description: string;
  word_count: number;
}

interface WordRow {
  word_index: number;
  word: string;
  pron: string;
  emoji: string;
  cat: string;
  es: string;
  examples: string[];
  past: string | null;
  past_pron: string | null;
  pp: string | null;
  pp_pron: string | null;
}

export async function apiGetLevels(): Promise<LevelMeta[]> {
  const { data, error } = await supabase
    .from("levels")
    .select("id, name, description, word_count")
    .order("id");

  if (error) throw new Error(error.message);

  return (data as LevelRow[]).map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description,
    wordCount: r.word_count,
  }));
}

export async function apiGetWords(levelId: string): Promise<WordData[]> {
  const { data, error } = await supabase
    .from("words")
    .select("word_index, word, pron, emoji, cat, es, examples, past, past_pron, pp, pp_pron")
    .eq("level_id", levelId)
    .order("word_index");

  if (error) throw new Error(error.message);

  return (data as WordRow[]).map((r) => ({
    id: r.word_index,
    word: r.word,
    pron: r.pron,
    emoji: r.emoji,
    cat: r.cat,
    es: r.es,
    ex: r.examples,
    ...(r.past ? { past: r.past } : {}),
    ...(r.past_pron ? { pastPron: r.past_pron } : {}),
    ...(r.pp ? { pp: r.pp } : {}),
    ...(r.pp_pron ? { ppPron: r.pp_pron } : {}),
  }));
}

// --- Progress (per level) ---

export interface ProgressPayload {
  known: number[];
  knownDates: [number, number][];
  learning: number[];
}

interface ProgressRow {
  known: number[];
  known_dates: [number, number][];
  learning: number[];
}

export async function apiGetProgress(userId: string, levelId: string): Promise<ProgressPayload> {
  const { data, error } = await supabase
    .from("user_progress")
    .select("known, known_dates, learning")
    .eq("user_id", userId)
    .eq("level_id", levelId)
    .maybeSingle();

  if (error) throw new Error(error.message);

  if (!data) {
    return { known: [], knownDates: [], learning: [] };
  }

  const row = data as ProgressRow;
  return {
    known: row.known,
    knownDates: row.known_dates,
    learning: row.learning,
  };
}

export async function apiSaveProgress(
  userId: string,
  levelId: string,
  progress: ProgressPayload,
): Promise<void> {
  const { error } = await supabase
    .from("user_progress")
    .upsert(
      {
        user_id: userId,
        level_id: levelId,
        known: progress.known,
        known_dates: progress.knownDates,
        learning: progress.learning,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,level_id" },
    );

  if (error) throw new Error(error.message);
}

// --- Leaderboard (per level) ---

export interface LeaderboardEntry {
  displayName: string;
  knownCount: number;
}

export interface LeaderboardResponse {
  top: LeaderboardEntry[];
  myRank: number | null;
  myScore: number;
  totalUsers: number;
}

interface LeaderboardRow {
  level_id: string;
  user_id: string;
  display_name: string;
  known_count: number;
  rank: number;
}

export async function apiGetLeaderboard(
  userId: string,
  levelId: string,
): Promise<LeaderboardResponse> {
  const { data, error } = await supabase
    .from("leaderboard_ranked")
    .select("user_id, display_name, known_count, rank")
    .eq("level_id", levelId)
    .order("rank")
    .limit(15);

  if (error) throw new Error(error.message);

  const rows = data as LeaderboardRow[];

  const top: LeaderboardEntry[] = rows.map((r) => ({
    displayName: r.display_name,
    knownCount: r.known_count,
  }));

  const myRow = rows.find((r) => r.user_id === userId);
  let myRank: number | null = myRow?.rank ?? null;
  let myScore = myRow?.known_count ?? 0;

  if (!myRow) {
    const { data: fullData } = await supabase
      .from("leaderboard_ranked")
      .select("rank, known_count")
      .eq("level_id", levelId)
      .eq("user_id", userId)
      .maybeSingle();

    if (fullData) {
      const full = fullData as { rank: number; known_count: number };
      myRank = full.rank;
      myScore = full.known_count;
    }
  }

  const { count } = await supabase
    .from("leaderboard")
    .select("id", { count: "exact", head: true })
    .eq("level_id", levelId);

  return {
    top,
    myRank,
    myScore,
    totalUsers: count ?? 0,
  };
}
