import { useState, useEffect, useCallback, useMemo } from "react";
import type { Word } from "./data/types";
import { useAuth } from "./contexts/AuthContext";
import { useServerProgress } from "./hooks/useServerProgress";
import { apiGetWords, type LevelMeta } from "./services/api";
import t from "./i18n";
import AuthPage from "./components/AuthPage";
import LevelSelect from "./components/LevelSelect";
import FlashCard from "./components/FlashCard";
import CardList from "./components/CardList";
import CategoryFilter from "./components/CategoryFilter";
import ProgressBar from "./components/ProgressBar";
import Controls from "./components/Controls";
import ReviewBanner from "./components/ReviewBanner";
import Leaderboard from "./components/Leaderboard";
import s from "./App.module.css";

function FlashCardsApp({ level, onBack }: { level: LevelMeta; onBack: () => void }) {
  const { user, token, logout } = useAuth();

  const {
    known,
    knownDates,
    learning,
    setKnown,
    setKnownDates,
    setLearning,
    loading: progressLoading,
  } = useServerProgress(token, level.id);

  const [words, setWords] = useState<Word[]>([]);
  const [wordsLoading, setWordsLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showList, setShowList] = useState(false);
  const [shuffled, setShuffled] = useState(false);
  const [displayWords, setDisplayWords] = useState<Word[]>([]);
  const [reviewMode, setReviewMode] = useState(false);
  const [quizKnownMode, setQuizKnownMode] = useState(false);
  const [quizCount, setQuizCount] = useState(0);

  useEffect(() => {
    if (!token) return;
    setWordsLoading(true);
    apiGetWords(token, level.id)
      .then((data) => {
        const w = data as Word[];
        setWords(w);
        setDisplayWords(w);
      })
      .catch(() => {})
      .finally(() => setWordsLoading(false));
  }, [token, level.id]);

  const oldestKnownIds = useMemo(() => {
    if (!quizKnownMode || quizCount <= 0) return new Set<number>();
    const entries = [...knownDates.entries()]
      .filter(([id]) => known.has(id))
      .sort((a, b) => a[1] - b[1]);
    const ids = entries.slice(0, quizCount).map(([id]) => id);
    return new Set(ids);
  }, [quizKnownMode, quizCount, knownDates, known]);

  const filtered = displayWords.filter((w) => {
    const catMatch = filter === "All" || w.cat === filter;
    if (quizKnownMode) return catMatch && oldestKnownIds.has(w.id);
    if (reviewMode) return catMatch && learning.has(w.id);
    return catMatch && !known.has(w.id);
  });
  const card = filtered[currentIdx] || filtered[0];

  useEffect(() => {
    setCurrentIdx(0);
    setFlipped(false);
  }, [filter, shuffled, reviewMode, quizKnownMode, quizCount]);

  const shuffle = useCallback(() => {
    const arr = [...words];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setDisplayWords(arr);
    setShuffled((s) => !s);
  }, [words]);

  const next = () => {
    setFlipped(false);
    setCurrentIdx((i) => (i + 1) % filtered.length);
  };
  const prev = () => {
    setFlipped(false);
    setCurrentIdx((i) => (i - 1 + filtered.length) % filtered.length);
  };

  const markKnown = () => {
    const id = card.id;
    setKnown((s) => { const n = new Set(s); n.add(id); return n; });
    setKnownDates((m) => { const n = new Map(m); if (!n.has(id)) n.set(id, Date.now()); return n; });
    setLearning((s) => { const n = new Set(s); n.delete(id); return n; });
    next();
  };

  const markLearning = () => {
    const id = card.id;
    setLearning((s) => { const n = new Set(s); n.add(id); return n; });
    setKnown((s) => { const n = new Set(s); n.delete(id); return n; });
    setKnownDates((m) => { const n = new Map(m); n.delete(id); return n; });
    next();
  };

  const markPending = () => {
    const id = card.id;
    setKnown((s) => { const n = new Set(s); n.delete(id); return n; });
    setLearning((s) => { const n = new Set(s); n.delete(id); return n; });
    setKnownDates((m) => { const n = new Map(m); n.delete(id); return n; });
  };

  const resetAll = () => {
    setKnown(() => new Set());
    setLearning(() => new Set());
    setKnownDates(() => new Map());
    setQuizKnownMode(false);
  };

  const cardIsMarked = card ? (known.has(card.id) || learning.has(card.id)) : false;

  if (progressLoading || wordsLoading) {
    return (
      <div className={s.shell}>
        <div className={s.emptyState}>
          <span className={s.emptyEmoji}>⏳</span>
          <h3 className={s.emptyTitle}>{t.loadingLevel(level.name)}</h3>
        </div>
      </div>
    );
  }

  if (showList) {
    return (
      <CardList
        words={words}
        filter={filter}
        known={known}
        learning={learning}
        onBack={() => setShowList(false)}
        onFilterChange={setFilter}
      />
    );
  }

  return (
    <div className={s.shell}>
      {token && user && (
        <div className={s.leaderboardWrap}>
          <Leaderboard
            token={token}
            levelId={level.id}
            currentUser={user.username}
            knownCount={known.size}
          />
        </div>
      )}

      <div className={s.headerWrap}>
        <div className={s.topRow}>
          <div>
            <h1 className={s.title}>{level.name}</h1>
            <p className={s.subtitle}>
              {user?.username} · {words.length} {t.headerWords}
            </p>
          </div>
          <div className={s.navActions}>
            <button onClick={onBack} title={t.btnLevelsTitle} className={s.headerBtn}>
              📚 <span className={s.navLabel}>Levels</span>
            </button>
            <button onClick={() => setShowList(true)} title={t.btnViewAllTitle} className={s.headerBtn}>
              📋 <span className={s.navLabel}>View All</span>
            </button>
            <button onClick={logout} title={t.btnLogoutTitle} className={s.logoutBtn}>
              🚪 <span className={s.navLabel}>Log out</span>
            </button>
          </div>
        </div>

        <div className={s.studyRow}>
          <button
            onClick={() => { setReviewMode((r) => !r); setQuizKnownMode(false); }}
            title={t.btnReviewTitle}
            className={reviewMode ? s.studyBtnReview : s.studyBtn}
          >
            🔄 <span className={s.studyLabel}>{reviewMode ? "Reviewing" : "Review"}</span>
          </button>
          {known.size > 0 && (
            <button
              onClick={() => { setQuizKnownMode((q) => !q); setReviewMode(false); if (!quizKnownMode) setQuizCount(Math.min(10, known.size)); }}
              title={t.btnQuizTitle}
              className={quizKnownMode ? s.studyBtnQuiz : s.studyBtn}
            >
              📝 <span className={s.studyLabel}>Quiz ({known.size})</span>
            </button>
          )}
          <button onClick={shuffle} title={t.btnShuffleTitle} className={s.studyBtnIcon}>🔀</button>
        </div>
      </div>

      <div className={s.progressWrap}>
        <ProgressBar
          total={words.length}
          known={known.size}
          learning={learning.size}
          onResetAll={resetAll}
        />
      </div>

      <div className={s.filterWrap}>
        <CategoryFilter current={filter} onChange={setFilter} />
      </div>

      <div className={s.cardArea}>
        {reviewMode && <ReviewBanner count={filtered.length} />}

        {quizKnownMode && (
          <div className={s.quizBanner}>
            <div className={s.quizBannerInner}>
              <span className={s.quizBannerTitle}>{t.quizBannerTitle}</span>
              <div className={s.quizControls}>
                <label className={s.quizLabel}>{t.quizQuantityLabel}</label>
                <input
                  type="range"
                  min={1}
                  max={known.size}
                  value={quizCount}
                  onChange={(e) => setQuizCount(Number(e.target.value))}
                  onClick={(e) => e.stopPropagation()}
                  className={s.quizRange}
                />
                <span className={s.quizCountBadge}>{quizCount}</span>
                <span className={s.quizTotal}>/ {known.size}</span>
              </div>
            </div>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className={s.emptyState}>
            <span className={s.emptyEmoji}>{reviewMode || quizKnownMode ? "🎉" : "📭"}</span>
            <h3 className={s.emptyTitle}>
              {reviewMode
                ? t.emptyReviewTitle
                : quizKnownMode
                  ? t.emptyQuizTitle
                  : t.emptyDefaultTitle}
            </h3>
            <p className={s.emptyText}>
              {reviewMode
                ? t.emptyReviewText
                : quizKnownMode
                  ? t.emptyQuizText
                  : t.emptyDefaultText}
            </p>
            {(reviewMode || quizKnownMode) && (
              <button onClick={() => { setReviewMode(false); setQuizKnownMode(false); }} className={s.backBtn}>
                {t.backToAll}
              </button>
            )}
          </div>
        ) : (
          <>
            <div className={s.counter}>{currentIdx + 1} / {filtered.length}</div>

            {card && (
              <FlashCard
                card={card}
                flipped={flipped}
                onFlip={() => setFlipped((f) => !f)}
                knownDate={knownDates.get(card.id)}
              />
            )}

            <Controls
              onPrev={prev}
              onNext={next}
              onMarkLearning={markLearning}
              onMarkKnown={markKnown}
              onMarkPending={markPending}
              isMarked={cardIsMarked}
            />

          </>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const { user, loading } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState<LevelMeta | null>(null);

  if (loading) {
    return (
      <div className={s.shell}>
        <div className={s.emptyState}>
          <span className={s.emptyEmoji}>⏳</span>
          <h3 className={s.emptyTitle}>{t.loading}</h3>
        </div>
      </div>
    );
  }

  if (!user) return <AuthPage />;

  if (!selectedLevel) {
    return <LevelSelect onSelect={setSelectedLevel} />;
  }

  return (
    <FlashCardsApp
      level={selectedLevel}
      onBack={() => setSelectedLevel(null)}
    />
  );
}
