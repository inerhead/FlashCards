import { useState, useEffect, useRef } from "react";
import { apiGetLeaderboard, type LeaderboardEntry } from "../services/api";
import t from "../i18n";
import s from "./Leaderboard.module.css";

const POLL_INTERVAL = 10_000;
const MEDALS = ["🥇", "🥈", "🥉"];

interface Props {
  userId: string;
  levelId: string;
  currentDisplayName: string;
  knownCount: number;
}

export default function Leaderboard({ userId, levelId, currentDisplayName, knownCount }: Props) {
  const [top, setTop] = useState<LeaderboardEntry[]>([]);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [myScore, setMyScore] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [open, setOpen] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let cancelled = false;

    const doFetch = () => {
      apiGetLeaderboard(userId, levelId)
        .then((data) => {
          if (cancelled) return;
          setTop(data.top);
          setMyRank(data.myRank);
          setMyScore(data.myScore);
          setTotalUsers(data.totalUsers);
        })
        .catch(() => {});
    };

    doFetch();
    intervalRef.current = setInterval(doFetch, POLL_INTERVAL);

    return () => {
      cancelled = true;
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [userId, levelId]);

  useEffect(() => {
    apiGetLeaderboard(userId, levelId)
      .then((data) => {
        setTop(data.top);
        setMyRank(data.myRank);
        setMyScore(data.myScore);
        setTotalUsers(data.totalUsers);
      })
      .catch(() => {});
  }, [userId, levelId, knownCount]);

  const inTop = top.some((e) => e.displayName === currentDisplayName);

  return (
    <>
      <button className={s.mobileToggle} onClick={() => setOpen((o) => !o)}>
        🏆 {open ? "▾" : "▸"} Top ({totalUsers})
      </button>
      <div className={`${s.panel} ${open ? s.panelOpen : ""}`}>
        <h3 className={s.heading}>{t.leaderboardTitle}</h3>
        <ul className={s.list}>
          {top.map((entry, i) => {
            const isMe = entry.displayName === currentDisplayName;
            return (
              <li key={entry.displayName} className={isMe ? s.rowMe : s.row}>
                {i < 3 ? (
                  <span className={s.medal}>{MEDALS[i]}</span>
                ) : (
                  <span className={s.rank}>{i + 1}</span>
                )}
                <span className={isMe ? s.nameMe : s.name}>{entry.displayName}</span>
                <span className={s.score}>{entry.knownCount}</span>
              </li>
            );
          })}

          {!inTop && myRank && (
            <>
              <li className={s.separator}>···</li>
              <li className={s.rowMe}>
                <span className={s.rank}>{myRank}</span>
                <span className={s.nameMe}>{currentDisplayName}</span>
                <span className={s.score}>{myScore}</span>
              </li>
            </>
          )}
        </ul>
        <div className={s.totalRow}>👥 {totalUsers} {t.totalStudents}</div>
      </div>
    </>
  );
}
