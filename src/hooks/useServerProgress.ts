import { useState, useEffect, useCallback, useRef } from "react";
import { apiGetProgress, apiSaveProgress, type ProgressPayload } from "../services/api";

type SetUpdater<T> = (updater: (prev: T) => T) => void;

interface ServerProgress {
  known: Set<number>;
  knownDates: Map<number, number>;
  learning: Set<number>;
  setKnown: SetUpdater<Set<number>>;
  setKnownDates: SetUpdater<Map<number, number>>;
  setLearning: SetUpdater<Set<number>>;
  loading: boolean;
}

function toPayload(
  known: Set<number>,
  knownDates: Map<number, number>,
  learning: Set<number>,
): ProgressPayload {
  return {
    known: [...known],
    knownDates: [...knownDates.entries()],
    learning: [...learning],
  };
}

const DEBOUNCE_MS = 800;

export function useServerProgress(
  userId: string | null,
  levelId: string | null,
): ServerProgress {
  const [known, setKnownRaw] = useState<Set<number>>(new Set());
  const [knownDates, setKnownDatesRaw] = useState<Map<number, number>>(new Map());
  const [learning, setLearningRaw] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  const pendingSave = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userIdRef = useRef(userId);
  const levelRef = useRef(levelId);
  userIdRef.current = userId;
  levelRef.current = levelId;

  useEffect(() => {
    if (!userId || !levelId) {
      setKnownRaw(new Set());
      setKnownDatesRaw(new Map());
      setLearningRaw(new Set());
      setLoading(false);
      return;
    }

    setLoading(true);
    apiGetProgress(userId, levelId)
      .then((p) => {
        setKnownRaw(new Set(p.known));
        setKnownDatesRaw(new Map(p.knownDates));
        setLearningRaw(new Set(p.learning));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId, levelId]);

  const scheduleSave = useCallback(() => {
    pendingSave.current = true;
  }, []);

  useEffect(() => {
    if (!pendingSave.current || !userIdRef.current || !levelRef.current) return;
    pendingSave.current = false;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (!userIdRef.current || !levelRef.current) return;
      apiSaveProgress(
        userIdRef.current,
        levelRef.current,
        toPayload(known, knownDates, learning),
      ).catch(() => {});
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [known, knownDates, learning]);

  const setKnown: SetUpdater<Set<number>> = useCallback(
    (updater) => {
      setKnownRaw((prev) => {
        const next = updater(prev);
        scheduleSave();
        return next;
      });
    },
    [scheduleSave],
  );

  const setKnownDates: SetUpdater<Map<number, number>> = useCallback(
    (updater) => {
      setKnownDatesRaw((prev) => {
        const next = updater(prev);
        scheduleSave();
        return next;
      });
    },
    [scheduleSave],
  );

  const setLearning: SetUpdater<Set<number>> = useCallback(
    (updater) => {
      setLearningRaw((prev) => {
        const next = updater(prev);
        scheduleSave();
        return next;
      });
    },
    [scheduleSave],
  );

  return {
    known,
    knownDates,
    learning,
    setKnown,
    setKnownDates,
    setLearning,
    loading,
  };
}
