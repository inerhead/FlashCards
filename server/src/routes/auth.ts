import { Router, type Request, type Response } from "express";
import type { IUserRepository } from "../repositories/interfaces.js";
import { hashPassword, verifyPassword, signToken } from "../services/auth.js";
import { authMiddleware } from "../middleware/auth.js";

export function authRouter(userRepo: IUserRepository): Router {
  const router = Router();

  router.post(
    "/register",
    async (req: Request, res: Response): Promise<void> => {
      const { username, password } = req.body as {
        username?: string;
        password?: string;
      };

      if (
        !username ||
        !password ||
        username.length < 3 ||
        password.length < 4
      ) {
        res.status(400).json({
          error:
            "Usuario (min 3 caracteres) y contraseña (min 4 caracteres) requeridos",
        });
        return;
      }

      const existing = await userRepo.findByUsername(username);
      if (existing) {
        res.status(409).json({ error: "El usuario ya existe" });
        return;
      }

      const passwordHash = await hashPassword(password);
      const user = await userRepo.create(username, passwordHash);
      const token = signToken({ userId: user.id, username: user.username });

      res.status(201).json({ token, username: user.username });
    },
  );

  router.post(
    "/login",
    async (req: Request, res: Response): Promise<void> => {
      const { username, password } = req.body as {
        username?: string;
        password?: string;
      };

      if (!username || !password) {
        res
          .status(400)
          .json({ error: "Usuario y contraseña requeridos" });
        return;
      }

      const user = await userRepo.findByUsername(username);
      if (!user) {
        res.status(401).json({ error: "Credenciales inválidas" });
        return;
      }

      const valid = await verifyPassword(password, user.passwordHash);
      if (!valid) {
        res.status(401).json({ error: "Credenciales inválidas" });
        return;
      }

      const token = signToken({ userId: user.id, username: user.username });
      res.json({ token, username: user.username });
    },
  );

  router.get(
    "/me",
    authMiddleware,
    (req: Request, res: Response): void => {
      res.json({
        userId: req.user!.userId,
        username: req.user!.username,
      });
    },
  );

  return router;
}
