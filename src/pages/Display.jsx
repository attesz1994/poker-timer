import { useEffect, useState, useRef } from "react";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

export default function Display() {
  const [timeLeft, setTimeLeft] = useState("15:00");
  const [status, setStatus] = useState("stopped");
  const timerRef = useRef(null);

  const formatTime = (ms) => {
    if (ms <= 0) return "00:00";
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "games", "poker-night"), (snapshot) => {
      const data = snapshot.data();
      if (!data) return;
      setStatus(data.status);
      if (timerRef.current) clearInterval(timerRef.current);

      if (data.status === "running" && data.endTime) {
        timerRef.current = setInterval(() => {
          const now = Date.now();
          const diff = data.endTime - now;
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

  const getClockColor = () => {
    if (status === "running") return "text-emerald-500";
    if (status === "paused") return "text-yellow-500"; // Yellow for Paused
    return "text-orange-500"; // Orange for Ready
  };

  const getBadgeStyles = () => {
    if (status === "running")
      return "border-emerald-500/50 bg-emerald-500/10 text-emerald-500";
    if (status === "paused")
      return "border-yellow-500/50 bg-yellow-500/10 text-yellow-500"; // Yellow Badge
    return "border-orange-500/50 bg-orange-500/10 text-orange-500";
  };

  const getStatusLabel = () => {
    if (status === "running") return "Game Live";
    if (status === "paused") return "Timer Paused";
    return "Ready to Start";
  };

  return (
    <div className="h-screen bg-black flex flex-col items-center justify-center overflow-hidden">
      <div className="text-zinc-600 text-2xl font-bold uppercase tracking-[0.5em] mb-4">
        Tournament Clock
      </div>
      <h1
        className={`text-[30vw] font-mono font-black leading-none transition-colors duration-700 ${getClockColor()}`}
      >
        {timeLeft}
      </h1>
      <div
        className={`mt-8 px-10 py-3 border-2 rounded-full transition-all duration-500 ${getBadgeStyles()}`}
      >
        <span className="font-bold uppercase tracking-[0.3em] text-xl">
          {getStatusLabel()}
        </span>
      </div>
    </div>
  );
}
