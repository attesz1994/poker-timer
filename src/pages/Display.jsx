import { useEffect, useState, useRef } from "react";
import { db } from "../firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { GAME_ID, THEME, BLIND_STRUCTURE, DURATION_MS } from "../constants";

export default function Display() {
  const [timeLeft, setTimeLeft] = useState("15:00");
  const [status, setStatus] = useState("stopped");
  const [level, setLevel] = useState(0);
  const timerRef = useRef(null);

  const formatTime = (ms) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const mins = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (totalSeconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "games", GAME_ID), (snapshot) => {
      const data = snapshot.data();
      if (!data) return;
      setStatus(data.status);
      setLevel(data.currentLevel || 0);

      if (timerRef.current) clearInterval(timerRef.current);

      if (data.status === "running" && data.endTime) {
        timerRef.current = setInterval(async () => {
          const diff = data.endTime - Date.now();
          if (diff <= 0) {
            clearInterval(timerRef.current);
            const nextLevelIndex = (data.currentLevel || 0) + 1;
            if (nextLevelIndex < BLIND_STRUCTURE.length) {
              await updateDoc(doc(db, "games", GAME_ID), {
                currentLevel: nextLevelIndex,
                endTime: Date.now() + DURATION_MS,
                remainingTime: DURATION_MS,
              });
            } else {
              setTimeLeft("00:00");
              await updateDoc(doc(db, "games", GAME_ID), { status: "stopped" });
            }
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
  const blinds = BLIND_STRUCTURE[level];

  return (
    <div className="h-screen w-screen bg-black flex flex-col items-center justify-between overflow-hidden font-sans relative px-12">
      {/* Visible Fullscreen Toggle Button */}
      <button
        onClick={toggleFullScreen}
        className="absolute top-8 right-8 z-50 p-4 rounded-2xl bg-zinc-900/50 border border-white/10 text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all shadow-2xl"
        title="Toggle Fullscreen"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 3h6v6M9 21H3v-6M21 15v6h-6M3 9V3h6" />
        </svg>
      </button>

      {/* Header */}
      <div className="pt-12 text-zinc-700 text-xl font-bold uppercase tracking-[1em]">
        Tournament Clock
      </div>

      {/* Main Clock Area */}
      <div className="flex-grow flex flex-col items-center justify-center w-full">
        <h1
          /* Use inline style to ensure the change is applied */
          style={{ fontSize: "20vh" }}
          className={`font-mono font-black leading-none tracking-tighter transition-colors duration-700 ${theme.text}`}
        >
          {timeLeft}
        </h1>

        <div
          className={`mt-4 px-10 py-2 border-2 rounded-full transition-all duration-500 bg-black ${theme.border} ${theme.text}`}
        >
          <span className="font-bold uppercase tracking-[0.4em] text-xl">
            {theme.label}
          </span>
        </div>
      </div>

      {/* Bottom Info Bar - Balanced using vh for vertical consistency */}
      <div className="w-full flex justify-between items-end pb-16 pt-8 border-t border-white/5">
        <div className="flex flex-col">
          <p className="text-zinc-600 uppercase tracking-widest text-lg font-bold mb-2">
            Level
          </p>
          <h2 className="text-white text-[15vh] font-black leading-none">
            {blinds.level}
          </h2>
        </div>

        <div className="flex flex-col items-end">
          <p className="text-zinc-600 uppercase tracking-widest text-lg font-bold mb-2">
            Current Blinds
          </p>
          <h2 className="text-white text-[15vh] font-black leading-none tracking-tighter">
            {blinds.small}
            <span className="text-zinc-800 mx-4">/</span>
            {blinds.big}
          </h2>
        </div>
      </div>
    </div>
  );
}
