import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

export default function Display() {
  const [timeLeft, setTimeLeft] = useState("15:00");
  const [status, setStatus] = useState("stopped");

  // Helper function to turn milliseconds into 00:00 format
  const formatTime = (ms) => {
    if (ms <= 0) return "00:00";
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "games", "poker-night"), (doc) => {
      const data = doc.data();
      if (!data) return;

      setStatus(data.status);

      if (data.status === "paused") {
        // Just show the frozen time from the database
        setTimeLeft(formatTime(data.remainingTime));
      } else if (data.status === "running") {
        // Start a local interval to tick down
        const interval = setInterval(() => {
          const now = Date.now();
          const difference = data.endTime - now;

          if (difference <= 0) {
            setTimeLeft("00:00");
            clearInterval(interval);
          } else {
            setTimeLeft(formatTime(difference));
          }
        }, 1000);

        return () => clearInterval(interval);
      }
    });

    return () => unsub();
  }, []);

  return (
    <div className="h-screen bg-black flex flex-col items-center justify-center overflow-hidden">
      <div className="text-zinc-500 text-3xl font-bold uppercase tracking-[1em] mb-4">
        Tournament Clock
      </div>

      <h1
        className={`text-[35vw] font-mono font-black leading-none transition-all duration-500 ${
          status === "running"
            ? "text-orange-500 drop-shadow-[0_0_80px_rgba(249,115,22,0.3)]"
            : "text-zinc-800"
        }`}
      >
        {timeLeft}
      </h1>

      <div className="mt-10">
        <p className="text-zinc-600 uppercase font-bold text-xl text-center">
          Status
        </p>
        <p className="text-white text-6xl font-bold font-mono text-center uppercase">
          {status}
        </p>
      </div>
    </div>
  );
}
