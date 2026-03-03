import type { ILevelRepository, LevelMeta } from "../interfaces.js";
import { getRedis } from "./client.js";

export class RedisLevelRepository implements ILevelRepository {
  async getAll(): Promise<LevelMeta[]> {
    const redis = getRedis();
    const raw = await redis.get("levels");
    if (!raw) return [];

    try {
      return JSON.parse(raw) as LevelMeta[];
    } catch {
      return [];
    }
  }

  async getWords(levelId: string): Promise<unknown[]> {
    const redis = getRedis();
    const raw = await redis.get(`words:${levelId}`);
    if (!raw) return [];

    try {
      return JSON.parse(raw) as unknown[];
    } catch {
      return [];
    }
  }
}
