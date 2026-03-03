import { useState, useCallback, useEffect } from "react";

function loadSet(key: string): Set<number> {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return new Set(JSON.parse(raw) as number[]);
  } catch {
    /* corrupted data — start fresh */
  }
  return new Set();
}

export function usePersistedSet(
  key: string,
): [Set<number>, (updater: (prev: Set<number>) => Set<number>) => void] {
  const [set, setSet] = useState<Set<number>>(() => loadSet(key));

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify([...set]));
  }, [key, set]);

  const update = useCallback(
    (updater: (prev: Set<number>) => Set<number>) => {
      setSet((prev) => {
        const next = updater(prev);
        return next;
      });
    },
    [],
  );

  return [set, update];
}
