import { Router, type Request, type Response } from "express";
import type { ILeaderboardRepository } from "../repositories/interfaces.js";
import { authMiddleware } from "../middleware/auth.js";

export function leaderboardRouter(leaderboardRepo: ILeaderboardRepository): Router {
  const router = Router();

  router.get("/:levelId", authMiddleware, async (req: Request, res: Response): Promise<void> => {
    const levelId = req.params.levelId as string;
    const top = await leaderboardRepo.getTop(levelId, 15);
    const username = req.user!.username;

    const inTop = top.some((e) => e.username === username);
    let myRank: number | null = null;
    let myScore = 0;

    if (!inTop) {
      myRank = await leaderboardRepo.getRank(levelId, username);
      myScore = await leaderboardRepo.getScore(levelId, username);
    }

    const totalUsers = await leaderboardRepo.getTotal(levelId);
    res.json({ top, myRank, myScore, totalUsers });
  });

  return router;
}
