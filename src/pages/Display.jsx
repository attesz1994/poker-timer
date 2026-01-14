import { useEffect, useState, useRef } from "react";
import { db } from "../firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { GAME_ID, THEME, BLIND_STRUCTURE, DURATION_MS } from "../constants";

export default function Display() {
  const [timeLeft, setTimeLeft] = useState("01:00");
  const [status, setStatus] = useState("stopped");
  const [level, setLevel] = useState(0);
  const timerRef = useRef(null);

  // Helper to turn milliseconds into MM:SS format
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
      setLevel(data.currentLevel || 0);

      // Clean up any existing intervals before starting a new one
      if (timerRef.current) clearInterval(timerRef.current);

      if (data.status === "running" && data.endTime) {
        timerRef.current = setInterval(async () => {
          const now = Date.now();
          const diff = data.endTime - now;

          if (diff <= 0) {
            // STOP the current timer locally
            clearInterval(timerRef.current);

            // LOGIC: Check if we can advance to the next level
            const nextLevelIndex = (data.currentLevel || 0) + 1;

            if (nextLevelIndex < BLIND_STRUCTURE.length) {
              // Automatically Update Firebase to the next level and restart clock
              await updateDoc(doc(db, "games", GAME_ID), {
                currentLevel: nextLevelIndex,
                endTime: Date.now() + DURATION_MS,
                remainingTime: DURATION_MS,
              });
            } else {
              // If no more levels remain, stop the game at 00:00
              setTimeLeft("00:00");
              await updateDoc(doc(db, "games", GAME_ID), {
                status: "stopped",
              });
            }
          } else {
            // Normal countdown update
            setTimeLeft(formatTime(diff));
          }
        }, 100);
      } else {
        // When paused or stopped, show the static remaining time
        setTimeLeft(formatTime(data.remainingTime));
      }
    });

    return () => {
      unsub();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const theme = THEME[status];
  const blinds = BLIND_STRUCTURE[level];

  return (
    <div className="h-screen bg-black flex flex-col items-center justify-between p-20 overflow-hidden font-sans">
      {/* Top Header */}
      <div className="text-zinc-700 text-2xl font-bold uppercase tracking-[0.5em] text-center w-full">
        Tournament Clock
      </div>

      {/* Main Clock Section */}
      <div className="flex flex-col items-center">
        <h1
          className={`text-[32vw] font-mono font-black leading-none transition-colors duration-700 ${theme.text}`}
        >
          {timeLeft}
        </h1>

        {/* Status Badge */}
        <div
          className={`mt-4 px-10 py-3 border-2 rounded-full transition-all duration-500 ${theme.border} ${theme.bg} ${theme.text}`}
        >
          <span className="font-bold uppercase tracking-[0.3em] text-2xl">
            {theme.label}
          </span>
        </div>
      </div>

      {/* Bottom Blinds Section */}
      <div className="flex justify-between items-end w-full border-t border-white/10 pt-10">
        <div className="text-left">
          <p className="text-zinc-500 uppercase tracking-widest text-xl mb-2 font-semibold">
            Level
          </p>
          <h2 className="text-white text-9xl font-black">{blinds.level}</h2>
        </div>

        <div className="text-right">
          <p className="text-zinc-500 uppercase tracking-widest text-xl mb-2 font-semibold">
            Blinds
          </p>
          <h2 className="text-white text-9xl font-black">
            {blinds.small} <span className="text-zinc-700">/</span> {blinds.big}
          </h2>
        </div>
      </div>
    </div>
  );
}
