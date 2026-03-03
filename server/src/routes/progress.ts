import { Router, type Request, type Response } from "express";
import type { IProgressRepository, ILeaderboardRepository } from "../repositories/interfaces.js";
import { authMiddleware } from "../middleware/auth.js";

export function progressRouter(
  progressRepo: IProgressRepository,
  leaderboardRepo: ILeaderboardRepository,
): Router {
  const router = Router();

  router.use(authMiddleware);

  router.get("/:levelId", async (req: Request, res: Response): Promise<void> => {
    const levelId = req.params.levelId as string;
    const progress = await progressRepo.get(req.user!.userId, levelId);
    await leaderboardRepo.update(levelId, req.user!.username, progress.known.length);
    res.json(progress);
  });

  router.put("/:levelId", async (req: Request, res: Response): Promise<void> => {
    const { known, knownDates, learning } = req.body as {
      known?: number[];
      knownDates?: [number, number][];
      learning?: number[];
    };

    if (!Array.isArray(known) || !Array.isArray(knownDates) || !Array.isArray(learning)) {
      res.status(400).json({ error: "Invalid progress format" });
      return;
    }

    const levelId = req.params.levelId as string;
    await progressRepo.save(req.user!.userId, levelId, { known, knownDates, learning });
    await leaderboardRepo.update(levelId, req.user!.username, known.length);

    res.json({ ok: true });
  });

  return router;
}
