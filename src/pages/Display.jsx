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

  // Professional style mapping to bypass Tailwind compilation issues
  const theme = THEME[status];

  // We map the theme keys to actual HEX values for safety
  const colorMap = {
    emerald: "#10b981",
    yellow: "#eab308",
    orange: "#f97316",
  };

  const activeColor = colorMap[theme.color];

  return (
    <div className="h-screen bg-black flex flex-col items-center justify-center overflow-hidden">
      <div className="text-zinc-600 text-2xl font-bold uppercase tracking-[0.5em] mb-4">
        Tournament Clock
      </div>

      {/* Clock - Using inline style for guaranteed color rendering */}
      <h1
        style={{ color: activeColor }}
        className="text-[30vw] font-mono font-black leading-none transition-colors duration-700"
      >
        {timeLeft}
      </h1>

      {/* Status Badge - Using inline styles for border and background glow */}
      <div
        style={{
          borderColor: `${activeColor}80`, // 80 adds 50% transparency
          backgroundColor: `${activeColor}1a`, // 1a adds ~10% transparency
        }}
        className="mt-8 px-10 py-3 border-2 rounded-full transition-all duration-500"
      >
        <span
          style={{ color: activeColor }}
          className="font-bold uppercase tracking-[0.3em] text-xl"
        >
          {theme.label}
        </span>
      </div>
    </div>
  );
}
