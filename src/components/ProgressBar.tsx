import { useState } from "react";
import t from "../i18n";
import s from "./ProgressBar.module.css";

interface Props {
  total: number;
  known: number;
  learning: number;
  onResetAll?: () => void;
}

export default function ProgressBar({ total, known, learning, onResetAll }: Props) {
  const pending = total - known - learning;
  const progress = Math.round((known / total) * 100);
  const hasMarked = known + learning > 0;
  const [confirming, setConfirming] = useState(false);

  return (
    <div className={s.wrap} style={{ "--progress": `${progress}%` } as React.CSSProperties}>
      <div className={s.stats}>
        <span>✅ {t.knownLabel}: {known}</span>
        <span>🔄 {t.learningLabel}: {learning}</span>
        <span>📝 {t.pendingLabel}: {pending}</span>
      </div>
      <div className={s.track}>
        <div className={s.fill} />
      </div>
      <div className={s.footer}>
        {hasMarked && onResetAll && (
          confirming ? (
            <div className={s.confirmRow}>
              <span className={s.confirmText}>{t.resetConfirm}</span>
              <button onClick={() => { onResetAll(); setConfirming(false); }} className={s.confirmYes}>{t.resetYes}</button>
              <button onClick={() => setConfirming(false)} className={s.confirmNo}>{t.resetNo}</button>
            </div>
          ) : (
            <button onClick={() => setConfirming(true)} className={s.resetLink}>
              {t.resetProgress}
            </button>
          )
        )}
        {!hasMarked && <span />}
        <span className={s.pct}>{progress}% {t.completed}</span>
      </div>
    </div>
  );
}
