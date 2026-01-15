import { useEffect, useState, useRef } from "react";
import { db } from "../firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { GAME_ID, THEME, BLIND_STRUCTURE, DURATION_MS } from "../constants";
import TimerDisplay from "../components/TimerDisplay";
import BlindsInfo from "../components/BlindsInfo";

export default function Display() {
  const [timeLeft, setTimeLeft] = useState("15:00");
  const [status, setStatus] = useState("stopped");
  const [level, setLevel] = useState(0);
  const [progress, setProgress] = useState(100);
  const timerRef = useRef(null);

  // Helper to format milliseconds into MM:SS
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
              // Move to next level automatically
              await updateDoc(doc(db, "games", GAME_ID), {
                currentLevel: nextLevelIndex,
                endTime: Date.now() + DURATION_MS,
                remainingTime: DURATION_MS,
              });
            } else {
              // Tournament Finished
              setTimeLeft("00:00");
              setProgress(0);
              await updateDoc(doc(db, "games", GAME_ID), { status: "stopped" });
            }
          } else {
            // Update Timer and Progress Circle
            setTimeLeft(formatTime(diff));
            setProgress((diff / DURATION_MS) * 100);
          }
        }, 100);
      } else {
        // Handle Paused/Stopped state
        setTimeLeft(formatTime(data.remainingTime));
        setProgress((data.remainingTime / DURATION_MS) * 100);
      }
    });

    return () => {
      unsub();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const theme = THEME[status];
  const currentLevelData = BLIND_STRUCTURE[level];
  const isBreak = currentLevelData.type === "break";

  return (
    <div className="h-screen w-screen bg-black text-white font-sans flex flex-col overflow-hidden">
      {/* 1. TOP: Header (Strict 10%) */}
      <div className="h-[10vh] flex items-end justify-center pb-4">
        <div className="text-zinc-700 text-lg font-bold uppercase tracking-[1em] opacity-50">
          {isBreak ? "Tournament Break" : `Level ${currentLevelData.level}`}
        </div>
      </div>

      {/* 2. MIDDLE: Timer (Strict 60%) */}
      <div className="h-[60vh] flex items-center justify-center overflow-hidden px-4">
        <TimerDisplay
          timeLeft={timeLeft}
          isBreak={isBreak}
          theme={theme}
          progress={progress}
        />
      </div>

      {/* 3. BOTTOM: Blinds (Strict 30%) */}
      <div className="h-[30vh] border-t border-white/5 bg-zinc-950/20">
        <BlindsInfo
          level={level}
          structure={BLIND_STRUCTURE}
          isBreak={isBreak}
        />
      </div>

      {/* Fullscreen stays absolute */}
      <button
        onClick={toggleFullScreen}
        className="absolute top-6 right-6 p-3 rounded-xl bg-zinc-900/50 border border-white/10 text-zinc-500 hover:text-white transition-all"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
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
    </div>
  );
}
