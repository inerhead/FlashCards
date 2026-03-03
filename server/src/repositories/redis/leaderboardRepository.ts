import type { ILeaderboardRepository, LeaderboardEntry } from "../interfaces.js";
import { getRedis } from "./client.js";

export class RedisLeaderboardRepository implements ILeaderboardRepository {
  private key(levelId: string) {
    return `leaderboard:${levelId}`;
  }

  async update(levelId: string, username: string, knownCount: number): Promise<void> {
    const redis = getRedis();
    await redis.zadd(this.key(levelId), knownCount, username);
  }

  async getTop(levelId: string, limit: number): Promise<LeaderboardEntry[]> {
    const redis = getRedis();
    const results = await redis.zrevrange(this.key(levelId), 0, limit - 1, "WITHSCORES");

    const entries: LeaderboardEntry[] = [];
    for (let i = 0; i < results.length; i += 2) {
      entries.push({
        username: results[i],
        knownCount: parseInt(results[i + 1], 10),
      });
    }
    return entries;
  }

  async getRank(levelId: string, username: string): Promise<number | null> {
    const redis = getRedis();
    const rank = await redis.zrevrank(this.key(levelId), username);
    return rank !== null ? rank + 1 : null;
  }

  async getScore(levelId: string, username: string): Promise<number> {
    const redis = getRedis();
    const score = await redis.zscore(this.key(levelId), username);
    return score ? parseInt(score, 10) : 0;
  }

  async getTotal(levelId: string): Promise<number> {
    const redis = getRedis();
    return redis.zcard(this.key(levelId));
  }
}
