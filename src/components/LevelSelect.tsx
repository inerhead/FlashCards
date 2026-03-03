import { useState, useEffect } from "react";
import { apiGetLevels, apiGetProgress, type LevelMeta } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import t from "../i18n";
import s from "./LevelSelect.module.css";

interface LevelProgress {
  known: number;
  learning: number;
}

interface Props {
  onSelect: (level: LevelMeta) => void;
}

export default function LevelSelect({ onSelect }: Props) {
  const { user, token, logout } = useAuth();
  const [levels, setLevels] = useState<LevelMeta[]>([]);
  const [progress, setProgress] = useState<Record<string, LevelProgress>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGetLevels()
      .then(setLevels)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!token || levels.length === 0) return;
    levels.forEach((level) => {
      apiGetProgress(token, level.id)
        .then((p) => {
          setProgress((prev) => ({
            ...prev,
            [level.id]: { known: p.known.length, learning: p.learning.length },
          }));
        })
        .catch(() => {});
    });
  }, [token, levels]);

  return (
    <div className={s.backdrop}>
      <div className={s.header}>
        <h1 className={s.title}>English Flash Cards</h1>
        <p className={s.subtitle}>{t.selectLevel}</p>
        <p className={s.author}>Created by Gossio</p>
      </div>

      <div className={s.userRow}>
        <span className={s.userBadge}>👤 {user?.username}</span>
        <button className={s.logoutBtn} onClick={logout}>{t.logout}</button>
      </div>

      {loading ? (
        <p className={s.loading}>{t.loadingLevels}</p>
      ) : (
        <div className={s.grid}>
          {levels.map((level) => {
            const p = progress[level.id];
            const knownN = p?.known ?? 0;
            const learningN = p?.learning ?? 0;
            const pendingN = level.wordCount - knownN - learningN;
            const pct = level.wordCount > 0 ? Math.round((knownN / level.wordCount) * 100) : 0;
            return (
              <div key={level.id} className={s.card} onClick={() => onSelect(level)}>
                <h2 className={s.cardLevel}>{level.name}</h2>
                <p className={s.cardDesc}>{level.description}</p>
                <div className={s.progressRow}>
                  <span className={s.statKnown}>✅ {knownN}</span>
                  <span className={s.statLearning}>🔄 {learningN}</span>
                  <span className={s.statPending}>📝 {pendingN}</span>
                </div>
                <div className={s.progressBar}>
                  <div className={s.progressFill} style={{ width: `${pct}%` }} />
                </div>
                <div className={s.cardFooter}>
                  <span className={s.wordCount}>{level.wordCount} {t.wordsLabel} · {pct}%</span>
                  <span className={s.arrow}>→</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
