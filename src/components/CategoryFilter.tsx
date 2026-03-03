import { useState } from "react";
import { CATEGORIES } from "../data/types";
import s from "./CategoryFilter.module.css";

interface Props {
  current: string;
  onChange: (cat: string) => void;
}

export default function CategoryFilter({ current, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const handlePick = (cat: string) => {
    onChange(cat);
    setOpen(false);
  };

  return (
    <>
      <button className={s.mobileToggle} onClick={() => setOpen((o) => !o)}>
        <span className={s.toggleLabel}>🏷️ {current}</span>
        <span className={s.toggleArrow}>{open ? "▾" : "▸"}</span>
      </button>
      <div className={`${s.wrap} ${open ? s.wrapOpen : ""}`}>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => handlePick(c)}
            className={current === c ? s.pillActive : s.pill}
            data-cat={c}
          >
            {c}
          </button>
        ))}
      </div>
    </>
  );
}
