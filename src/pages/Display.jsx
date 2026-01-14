import { useEffect, useState, useRef } from "react";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { GAME_ID, THEME } from "../constants";

export default function Display() {
  const [timeLeft, setTimeLeft] = useState("15:00");
  const [status, setStatus] = useState("stopped");
  const timerRef = useRef(null);

  const formatTime = (ms) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const mins = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (totalSeconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "games", GAME_ID), (snapshot) => {
      const data = snapshot.data();
      if (!data) return;

      setStatus(data.status);
      if (timerRef.current) clearInterval(timerRef.current);

      if (data.status === "running" && data.endTime) {
        timerRef.current = setInterval(() => {
          const diff = data.endTime - Date.now();
          if (diff <= 0) {
            setTimeLeft("00:00");
            clearInterval(timerRef.current);
          } else {
            setTimeLeft(formatTime(diff));
          }
        }, 100);
      } else {
        setTimeLeft(formatTime(data.remainingTime));
      }
    });

    return () => {
      unsub();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const theme = THEME[status];

  return (
    <div className="h-screen bg-black flex flex-col items-center justify-center overflow-hidden">
      <div className="text-zinc-600 text-2xl font-bold uppercase tracking-[0.5em] mb-4">
        Tournament Clock
      </div>

      <h1
        className={`text-[30vw] font-mono font-black leading-none transition-colors duration-700 ${theme.text}`}
      >
        {timeLeft}
      </h1>

      <div
        className={`mt-8 px-10 py-3 border-2 rounded-full transition-all duration-500 ${theme.border} ${theme.bg} ${theme.text}`}
      >
        <span className="font-bold uppercase tracking-[0.3em] text-xl">
          {theme.label}
        </span>
      </div>
    </div>
  );
}
