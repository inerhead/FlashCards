import { getRedis } from "../repositories/redis/client.js";
import { LEVELS } from "./index.js";

export async function runSeeds(): Promise<void> {
  const redis = getRedis();

  console.log(`Syncing ${LEVELS.length} level(s)...`);

  const levelsMeta = LEVELS.map((l) => ({
    id: l.id,
    name: l.name,
    description: l.description,
    wordCount: l.words.length,
  }));

  await redis.set("levels", JSON.stringify(levelsMeta));

  for (const level of LEVELS) {
    await redis.set(`words:${level.id}`, JSON.stringify(level.words));
    console.log(`  -> ${level.id}: ${level.words.length} words`);
  }

  console.log("Level & word data synced. User data preserved.");
}
