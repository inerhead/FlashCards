-- ============================================================
-- FlashCards – Supabase Schema (idempotente, seguro re-ejecutar)
-- Ejecutar en el SQL Editor de Supabase (en orden)
-- ============================================================

-- ========================
-- 0. LIMPIEZA (DROP en orden inverso de dependencias)
-- ========================
DROP TRIGGER IF EXISTS trg_progress_leaderboard ON user_progress;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP VIEW IF EXISTS leaderboard_ranked;
DROP TABLE IF EXISTS leaderboard;
DROP TABLE IF EXISTS user_progress;
DROP TABLE IF EXISTS words;
DROP TABLE IF EXISTS levels;
DROP TABLE IF EXISTS profiles;
DROP FUNCTION IF EXISTS update_leaderboard();
DROP FUNCTION IF EXISTS handle_new_user();
DROP TYPE IF EXISTS word_category;

-- ========================
-- 1. EXTENSIONES
-- ========================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================
-- 2. TIPOS ENUMERADOS
-- ========================
CREATE TYPE word_category AS ENUM (
  'Phrasal Verb',
  'Adjective',
  'Verb',
  'Noun',
  'Adverb',
  'Noun/Verb',
  'Common Phrase'
);

-- ========================
-- 3. TABLA: profiles
-- ========================
CREATE TABLE profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();

-- ========================
-- 4. TABLA: levels
-- ========================
CREATE TABLE levels (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  word_count  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ========================
-- 5. TABLA: words
-- ========================
CREATE TABLE words (
  id          SERIAL PRIMARY KEY,
  level_id    TEXT NOT NULL REFERENCES levels(id) ON DELETE CASCADE,
  word_index  INTEGER NOT NULL,
  word        TEXT NOT NULL,
  pron        TEXT NOT NULL DEFAULT '',
  emoji       TEXT NOT NULL DEFAULT '',
  cat         word_category NOT NULL,
  es          TEXT NOT NULL DEFAULT '',
  examples    TEXT[] NOT NULL DEFAULT '{}',
  past        TEXT,
  past_pron   TEXT,
  pp          TEXT,
  pp_pron     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (level_id, word_index)
);

CREATE INDEX idx_words_level ON words (level_id);
CREATE INDEX idx_words_cat   ON words (cat);

-- ========================
-- 6. TABLA: user_progress
-- ========================
CREATE TABLE user_progress (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  level_id     TEXT NOT NULL REFERENCES levels(id) ON DELETE CASCADE,
  known        INTEGER[] NOT NULL DEFAULT '{}',
  known_dates  JSONB NOT NULL DEFAULT '[]',
  learning     INTEGER[] NOT NULL DEFAULT '{}',
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (user_id, level_id)
);

CREATE INDEX idx_progress_user  ON user_progress (user_id);
CREATE INDEX idx_progress_level ON user_progress (level_id);

-- ========================
-- 7. TABLA: leaderboard
-- ========================
CREATE TABLE leaderboard (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  level_id    TEXT NOT NULL REFERENCES levels(id) ON DELETE CASCADE,
  known_count INTEGER NOT NULL DEFAULT 0,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (user_id, level_id)
);

CREATE INDEX idx_leaderboard_level_score ON leaderboard (level_id, known_count DESC);

-- ========================
-- 8. VISTA: leaderboard_ranked
-- ========================
CREATE OR REPLACE VIEW leaderboard_ranked AS
SELECT
  l.level_id,
  l.user_id,
  p.display_name,
  l.known_count,
  RANK() OVER (PARTITION BY l.level_id ORDER BY l.known_count DESC) AS rank
FROM leaderboard l
JOIN profiles p ON p.id = l.user_id;

-- ========================
-- 9. FUNCIONES AUXILIARES
-- ========================

CREATE OR REPLACE FUNCTION update_leaderboard()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO leaderboard (user_id, level_id, known_count, updated_at)
  VALUES (NEW.user_id, NEW.level_id, array_length(NEW.known, 1), now())
  ON CONFLICT (user_id, level_id)
  DO UPDATE SET
    known_count = COALESCE(array_length(NEW.known, 1), 0),
    updated_at  = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_progress_leaderboard
AFTER INSERT OR UPDATE ON user_progress
FOR EACH ROW
EXECUTE FUNCTION update_leaderboard();

-- ========================
-- 10. ROW LEVEL SECURITY (RLS)
-- ========================
ALTER TABLE profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE levels          ENABLE ROW LEVEL SECURITY;
ALTER TABLE words           ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress   ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard     ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_read" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "levels_read" ON levels
  FOR SELECT USING (true);

CREATE POLICY "words_read" ON words
  FOR SELECT USING (true);

CREATE POLICY "progress_select_own" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "progress_insert_own" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "progress_update_own" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "leaderboard_read" ON leaderboard
  FOR SELECT USING (true);

-- ============================================================
-- 11. SEED: niveles iniciales
-- ============================================================
INSERT INTO levels (id, name, description, word_count) VALUES
  ('a1', 'A1 - Elementary',          'Vocabulario básico para principiantes',  80),
  ('b2', 'B2 - Upper Intermediate',  'Phrasal verbs y vocabulario avanzado', 130)
ON CONFLICT (id) DO UPDATE SET
  name        = EXCLUDED.name,
  description = EXCLUDED.description,
  word_count  = EXCLUDED.word_count;
