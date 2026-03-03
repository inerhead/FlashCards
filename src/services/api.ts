const BASE = "/api";

function authHeaders(token: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  const body = await res.json();
  if (!res.ok) throw new Error(body.error || "Server error");
  return body as T;
}

// --- Auth ---

export interface AuthResponse {
  token: string;
  username: string;
}

export interface MeResponse {
  userId: string;
  username: string;
}

export async function apiRegister(username: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return handleResponse<AuthResponse>(res);
}

export async function apiLogin(username: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return handleResponse<AuthResponse>(res);
}

export async function apiMe(token: string): Promise<MeResponse> {
  const res = await fetch(`${BASE}/auth/me`, { headers: authHeaders(token) });
  return handleResponse<MeResponse>(res);
}

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

export async function apiGetLevels(): Promise<LevelMeta[]> {
  const res = await fetch(`${BASE}/levels`);
  return handleResponse<LevelMeta[]>(res);
}

export async function apiGetWords(token: string, levelId: string): Promise<WordData[]> {
  const res = await fetch(`${BASE}/levels/${levelId}/words`, {
    headers: authHeaders(token),
  });
  return handleResponse<WordData[]>(res);
}

// --- Progress (per level) ---

export interface ProgressPayload {
  known: number[];
  knownDates: [number, number][];
  learning: number[];
}

export async function apiGetProgress(token: string, levelId: string): Promise<ProgressPayload> {
  const res = await fetch(`${BASE}/progress/${levelId}`, {
    headers: authHeaders(token),
  });
  return handleResponse<ProgressPayload>(res);
}

export async function apiSaveProgress(
  token: string,
  levelId: string,
  progress: ProgressPayload,
): Promise<void> {
  const res = await fetch(`${BASE}/progress/${levelId}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(progress),
  });
  await handleResponse(res);
}

// --- Leaderboard (per level) ---

export interface LeaderboardEntry {
  username: string;
  knownCount: number;
}

export interface LeaderboardResponse {
  top: LeaderboardEntry[];
  myRank: number | null;
  myScore: number;
  totalUsers: number;
}

export async function apiGetLeaderboard(
  token: string,
  levelId: string,
): Promise<LeaderboardResponse> {
  const res = await fetch(`${BASE}/leaderboard/${levelId}`, {
    headers: authHeaders(token),
  });
  return handleResponse<LeaderboardResponse>(res);
}
