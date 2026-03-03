import { Router, type Request, type Response } from "express";
import type { ILevelRepository } from "../repositories/interfaces.js";
import { authMiddleware } from "../middleware/auth.js";

export function levelsRouter(levelRepo: ILevelRepository): Router {
  const router = Router();

  router.get("/", async (_req: Request, res: Response): Promise<void> => {
    const levels = await levelRepo.getAll();
    res.json(levels);
  });

  router.get("/:id/words", authMiddleware, async (req: Request, res: Response): Promise<void> => {
    const words = await levelRepo.getWords(req.params.id as string);
    if (words.length === 0) {
      res.status(404).json({ error: "Nivel no encontrado" });
      return;
    }
    res.json(words);
  });

  return router;
}
