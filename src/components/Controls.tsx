import t from "../i18n";
import s from "./Controls.module.css";

interface Props {
  onPrev: () => void;
  onNext: () => void;
  onMarkLearning: () => void;
  onMarkKnown: () => void;
  onMarkPending: () => void;
  isMarked: boolean;
}

export default function Controls({
  onPrev,
  onNext,
  onMarkLearning,
  onMarkKnown,
  onMarkPending,
  isMarked,
}: Props) {
  return (
    <div className={s.wrap}>
      <div className={s.row}>
        <button onClick={onPrev} className={s.navBtn}>←</button>
        <button onClick={onMarkLearning} className={s.learningBtn}>🔄 <span className={s.btnLabel}>Learning</span></button>
        <button onClick={onMarkKnown} className={s.knownBtn}>✅ <span className={s.btnLabel}>Known</span></button>
        <button onClick={onNext} className={s.navBtn}>→</button>
      </div>
      {isMarked && (
        <button onClick={onMarkPending} className={s.pendingBtn}>
          {t.returnToPending}
        </button>
      )}
    </div>
  );
}
