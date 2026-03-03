import type { Word } from "../data/types";
import { CATEGORIES } from "../data/types";
import s from "./CardList.module.css";

interface Props {
  words: Word[];
  filter: string;
  known: Set<number>;
  learning: Set<number>;
  onBack: () => void;
  onFilterChange: (cat: string) => void;
}

export default function CardList({
  words,
  filter,
  known,
  learning,
  onBack,
  onFilterChange,
}: Props) {
  const filtered = words.filter(
    (w) => filter === "All" || w.cat === filter,
  );

  return (
    <div className={s.shell}>
      <div className={s.container}>
        <div className={s.header}>
          <h2 className={s.title}>📚 All {words.length} Words</h2>
          <button onClick={onBack} className={s.backBtn}>← Back to Cards</button>
        </div>
        <div className={s.filters}>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => onFilterChange(c)}
              className={filter === c ? s.filterBtnActive : s.filterBtn}
              data-cat={c}
            >
              {c}{" "}
              {c === "All"
                ? `(${words.length})`
                : `(${words.filter((w) => w.cat === c).length})`}
            </button>
          ))}
        </div>
        <div className={s.grid}>
          {filtered.map((w: Word) => {
            const status = known.has(w.id)
              ? "✅"
              : learning.has(w.id)
                ? "🔄"
                : "";
            return (
              <div key={w.id} className={s.card}>
                <span className={s.cardEmoji}>{w.emoji}</span>
                <div className={s.cardBody}>
                  <div className={s.cardTop}>
                    <span className={s.cardWord}>{w.word}</span>
                    <span className={s.cardCat} data-cat={w.cat}>{w.cat}</span>
                    {status && <span className={s.cardStatus}>{status}</span>}
                  </div>
                  <div className={s.cardMeta}>{w.pron} — {w.es}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
