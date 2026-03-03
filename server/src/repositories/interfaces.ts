export interface User {
  id: string;
  username: string;
  passwordHash: string;
}

export interface UserProgress {
  known: number[];
  knownDates: [number, number][];
  learning: number[];
}

export interface LevelMeta {
  id: string;
  name: string;
  description: string;
  wordCount: number;
}

export interface IUserRepository {
  create(username: string, passwordHash: string): Promise<User>;
  findByUsername(username: string): Promise<User | null>;
}

export interface IProgressRepository {
  get(userId: string, levelId: string): Promise<UserProgress>;
  save(userId: string, levelId: string, progress: UserProgress): Promise<void>;
}

export interface LeaderboardEntry {
  username: string;
  knownCount: number;
}

export interface ILeaderboardRepository {
  update(levelId: string, username: string, knownCount: number): Promise<void>;
  getTop(levelId: string, limit: number): Promise<LeaderboardEntry[]>;
  getRank(levelId: string, username: string): Promise<number | null>;
  getScore(levelId: string, username: string): Promise<number>;
  getTotal(levelId: string): Promise<number>;
}

export interface ILevelRepository {
  getAll(): Promise<LevelMeta[]>;
  getWords(levelId: string): Promise<unknown[]>;
}
