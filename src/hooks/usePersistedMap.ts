import { useState, useCallback, useEffect } from "react";

function loadMap(key: string): Map<number, number> {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return new Map(JSON.parse(raw) as [number, number][]);
  } catch {
    /* corrupted data — start fresh */
  }
  return new Map();
}

export function usePersistedMap(
  key: string,
): [Map<number, number>, (updater: (prev: Map<number, number>) => Map<number, number>) => void] {
  const [map, setMap] = useState<Map<number, number>>(() => loadMap(key));

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify([...map.entries()]));
  }, [key, map]);

  const update = useCallback(
    (updater: (prev: Map<number, number>) => Map<number, number>) => {
      setMap((prev) => updater(prev));
    },
    [],
  );

  return [map, update];
}
