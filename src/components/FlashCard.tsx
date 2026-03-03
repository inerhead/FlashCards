import type { Word } from "../data/types";
import AudioButton from "./AudioButton";
import t from "../i18n";
import s from "./FlashCard.module.css";

interface Props {
  card: Word;
  flipped: boolean;
  onFlip: () => void;
  knownDate?: number;
}

export default function FlashCard({ card, flipped, onFlip, knownDate }: Props) {
  const hasVerbForms = !!(card.past || card.pp);

  return (
    <div onClick={onFlip} className={s.perspective} data-cat={card.cat}>
      <div className={`${s.flipper} ${flipped ? s.flipped : ""}`}>
        {/* Front */}
        <div className={s.front}>
          <span className={s.catBadge}>{card.cat}</span>
          <span className={s.emoji}>{card.emoji}</span>
          <h2 className={s.word}>{card.word}</h2>
          <div className={s.pronRow}>
            <p className={s.pron}>{card.pron}</p>
            <AudioButton text={card.word} size={22} />
          </div>
          <button className={s.flipBtn} onClick={(e) => { e.stopPropagation(); onFlip(); }}>
            🔄 {t.tapToSeeDetails}
          </button>
        </div>

        {/* Back */}
        <div className={s.back}>
          <div className={s.backHeader}>
            <div className={s.backHeaderLeft}>
              <span className={s.backEmoji}>{card.emoji}</span>
              <div>
                <div className={s.backWordRow}>
                  <h3 className={s.backWord}>{card.word}</h3>
                  <AudioButton text={card.word} size={20} />
                </div>
                <span className={s.backPron}>{card.pron}</span>
              </div>
            </div>
            <span className={s.catBadgeSm}>{card.cat}</span>
          </div>

          <div className={s.translationBox}>
            <div className={s.sectionLabel}>{t.translationLabel}</div>
            <div className={s.translationText}>{card.es}</div>
          </div>

          {hasVerbForms && (
            <div className={s.conjugationBox}>
              <div className={s.conjugationLabel}>{t.conjugationLabel}</div>
              {card.past && (
                <div className={s.conjugationRow}>
                  <span className={s.conjugationText}>
                    <strong className={s.pastLabel}>Past:</strong> {card.past}
                  </span>
                  <span className={s.conjugationPron}>{card.pastPron}</span>
                  <AudioButton text={card.past} size={18} color="#F59E0B" />
                </div>
              )}
              {card.pp && (
                <div className={s.conjugationRow}>
                  <span className={s.conjugationText}>
                    <strong className={s.ppLabel}>P. Participle:</strong> {card.pp}
                  </span>
                  <span className={s.conjugationPron}>{card.ppPron}</span>
                  <AudioButton text={card.pp} size={18} color="#10B981" />
                </div>
              )}
            </div>
          )}

          <div className={s.examplesWrap}>
            <div className={s.examplesLabel}>{t.examplesLabel}</div>
            {card.ex.map((e, i) => (
              <div key={i} className={s.exampleRow}>
                <span className={s.exampleNum}>{i + 1}.</span>
                <div className={s.exampleContent}>
                  <p className={s.exampleText}>{e}</p>
                  <AudioButton text={e} size={14} rate={0.9} color="#64748B" />
                </div>
              </div>
            ))}
          </div>

          {knownDate && (
            <div className={s.knownDate}>
              <span className={s.knownDateText}>
                ✅ {t.knownSince} {new Date(knownDate).toLocaleDateString("en", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>
          )}

          <button className={s.flipBtnBack} onClick={(e) => { e.stopPropagation(); onFlip(); }}>
            🔄 {t.tapToGoBack}
          </button>
        </div>
      </div>
    </div>
  );
}
