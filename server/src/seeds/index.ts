import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

export interface LevelSeed {
  id: string;
  name: string;
  description: string;
  words: unknown[];
}

const a1: LevelSeed = require("./a1.json");
const b2: LevelSeed = require("./b2.json");

export const LEVELS: LevelSeed[] = [a1, b2];
