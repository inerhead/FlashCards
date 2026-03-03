import express from "express";
import cors from "cors";
import { config } from "./config.js";
import { runSeeds } from "./seeds/runner.js";
import { RedisUserRepository } from "./repositories/redis/userRepository.js";
import { RedisProgressRepository } from "./repositories/redis/progressRepository.js";
import { RedisLeaderboardRepository } from "./repositories/redis/leaderboardRepository.js";
import { RedisLevelRepository } from "./repositories/redis/levelRepository.js";
import { authRouter } from "./routes/auth.js";
import { progressRouter } from "./routes/progress.js";
import { leaderboardRouter } from "./routes/leaderboard.js";
import { levelsRouter } from "./routes/levels.js";

const app = express();

app.use(cors());
app.use(express.json());

const userRepo = new RedisUserRepository();
const progressRepo = new RedisProgressRepository();
const leaderboardRepo = new RedisLeaderboardRepository();
const levelRepo = new RedisLevelRepository();

app.use("/api/auth", authRouter(userRepo));
app.use("/api/levels", levelsRouter(levelRepo));
app.use("/api/progress", progressRouter(progressRepo, leaderboardRepo));
app.use("/api/leaderboard", leaderboardRouter(leaderboardRepo));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

async function start() {
  await runSeeds();
  app.listen(config.port, () => {
    console.log(`API server running on port ${config.port}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
