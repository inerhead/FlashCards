import { v4 as uuidv4 } from "uuid";
import type { IUserRepository, User } from "../interfaces.js";
import { getRedis } from "./client.js";

export class RedisUserRepository implements IUserRepository {
  private key(username: string) {
    return `user:${username.toLowerCase()}`;
  }

  async create(username: string, passwordHash: string): Promise<User> {
    const redis = getRedis();
    const id = uuidv4();
    const user: User = { id, username, passwordHash };

    await redis.hset(this.key(username), {
      id,
      username,
      passwordHash,
    });

    return user;
  }

  async findByUsername(username: string): Promise<User | null> {
    const redis = getRedis();
    const data = await redis.hgetall(this.key(username));

    if (!data || !data.id) return null;

    return {
      id: data.id,
      username: data.username,
      passwordHash: data.passwordHash,
    };
  }
}
