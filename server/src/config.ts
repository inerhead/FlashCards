import crypto from "node:crypto";

export const config = {
  port: parseInt(process.env.PORT || "4000", 10),
  jwtSecret: process.env.JWT_SECRET || crypto.randomBytes(32).toString("hex"),
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
};
