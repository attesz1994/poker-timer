import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

export default function Display() {
  const [timeLeft, setTimeLeft] = useState("15:00");
  const [status, setStatus] = useState("stopped");

  useEffect(() => {
    // 1. Connect to the "poker-night" document in Firebase
    const unsub = onSnapshot(doc(db, "games", "poker-night"), (doc) => {
      const data = doc.data();
      if (!data || !data.endTime) return;

      setStatus(data.status);

      // 2. Start a local heart-beat to update the screen every second
      const interval = setInterval(() => {
        const now = Date.now();
        const difference = data.endTime - now;

        if (difference <= 0) {
          setTimeLeft("00:00");
          clearInterval(interval);
        } else {
          // Convert that big timestamp number into Mins : Secs
          const mins = Math.floor(difference / 60000);
          const secs = Math.floor((difference % 60000) / 1000);
          setTimeLeft(
            `${mins.toString().padStart(2, "0")}:${secs
              .toString()
              .padStart(2, "0")}`
          );
        }
      }, 1000);

      // Cleanup the interval if data changes again
      return () => clearInterval(interval);
    });

    return () => unsub();
  }, []);

  return (
    <div className="h-screen bg-black flex flex-col items-center justify-center overflow-hidden">
      <div className="text-zinc-500 text-3xl font-bold uppercase tracking-[1em] mb-4">
        Tournament Clock
      </div>

      {/* Notice the dynamic class here! */}
      <h1
        className={`text-[35vw] font-mono font-black leading-none transition-all duration-500 ${
          status === "running"
            ? "text-orange-500 drop-shadow-[0_0_80px_rgba(249,115,22,0.3)]"
            : "text-zinc-800" // Dims the numbers when not running
        }`}
      >
        {timeLeft}
      </h1>

      <div className="mt-10 flex gap-20">
        <div className="text-center">
          <p className="text-zinc-600 uppercase font-bold text-xl">Blinds</p>
          <p className="text-white text-6xl font-bold font-mono uppercase">
            {status === "running" ? "100 / 200" : "Paused"}
          </p>
        </div>
      </div>
    </div>
  );
}
