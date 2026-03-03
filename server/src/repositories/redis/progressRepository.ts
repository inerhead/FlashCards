import type { IProgressRepository, UserProgress } from "../interfaces.js";
import { getRedis } from "./client.js";

const EMPTY_PROGRESS: UserProgress = {
  known: [],
  knownDates: [],
  learning: [],
};

export class RedisProgressRepository implements IProgressRepository {
  private key(userId: string, levelId: string) {
    return `progress:${userId}:${levelId}`;
  }

  async get(userId: string, levelId: string): Promise<UserProgress> {
    const redis = getRedis();
    const raw = await redis.get(this.key(userId, levelId));
    if (!raw) return { ...EMPTY_PROGRESS };

    try {
      return JSON.parse(raw) as UserProgress;
    } catch {
      return { ...EMPTY_PROGRESS };
    }
  }

  async save(userId: string, levelId: string, progress: UserProgress): Promise<void> {
    const redis = getRedis();
    await redis.set(this.key(userId, levelId), JSON.stringify(progress));
  }
}
