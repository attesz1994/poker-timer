import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, setDoc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { GAME_ID, DURATION_MS, THEME } from "../constants";

export default function Controller() {
  const [status, setStatus] = useState("stopped");

  useEffect(() => {
    return onSnapshot(doc(db, "games", GAME_ID), (snap) => {
      if (snap.exists()) setStatus(snap.data().status);
    });
  }, []);

  const handleStart = async () => {
    if (status === "running" || status === "paused") return;
    await setDoc(doc(db, "games", GAME_ID), {
      endTime: Date.now() + DURATION_MS,
      remainingTime: DURATION_MS,
      status: "running",
    });
  };

  const handleTogglePause = async () => {
    if (status === "stopped") return;
    const docRef = doc(db, "games", GAME_ID);
    const snap = await getDoc(docRef);
    const data = snap.data();

    if (status === "running") {
      await updateDoc(docRef, {
        status: "paused",
        remainingTime: Math.max(0, data.endTime - Date.now()),
        endTime: null,
      });
    } else {
      await updateDoc(docRef, {
        status: "running",
        endTime: Date.now() + (data.remainingTime || 0),
      });
    }
  };

  const handleReset = async () => {
    if (status === "stopped") return;
    await setDoc(doc(db, "games", GAME_ID), {
      endTime: null,
      remainingTime: DURATION_MS,
      status: "stopped",
    });
  };

  const isStopped = status === "stopped";
  const isPaused = status === "paused";
  const isRunning = status === "running";

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white font-sans overflow-hidden">
      <style>{`
        @keyframes breathing { 
          0%, 100% { transform: scale(1); opacity: 1; } 
          50% { transform: scale(0.97); opacity: 0.7; } 
        }
        .animate-breathing { animation: breathing 3s ease-in-out infinite; }
      `}</style>

      <h1 className="text-zinc-600 tracking-[0.3em] font-bold mb-10 uppercase text-[10px]">
        Poker Controller
      </h1>

      <button
        onClick={handleStart}
        disabled={!isStopped}
        style={{ backgroundColor: THEME[status].hex }}
        className={`w-64 h-64 rounded-full text-black font-black text-4xl mb-12 flex items-center justify-center transition-all duration-500
          ${isRunning ? "animate-breathing text-emerald-400" : ""}
          ${
            isPaused
              ? "text-yellow-900 border-8 border-yellow-600"
              : "active:scale-95 shadow-2xl"
          }
        `}
      >
        {status.toUpperCase()}
      </button>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button
          onClick={handleTogglePause}
          disabled={isStopped}
          style={{
            backgroundColor: isPaused
              ? THEME.stopped.hex
              : isStopped
              ? "#111"
              : THEME.paused.hex,
            color: isStopped ? "#333" : "#000",
            cursor: isStopped ? "not-allowed" : "pointer",
          }}
          className="w-full py-6 rounded-2xl font-bold text-xl transition-all duration-300"
        >
          {isPaused ? "▶ RESUME" : "Ⅱ PAUSE"}
        </button>

        <button
          onClick={handleReset}
          disabled={isStopped}
          style={{
            backgroundColor: isStopped ? "#1a1a1a" : THEME.reset.hex,
            color: isStopped ? "#3f3f46" : "white",
            cursor: isStopped ? "not-allowed" : "pointer",
            boxShadow: isStopped ? "none" : "0 4px 15px rgba(220, 38, 38, 0.4)",
          }}
          className="w-full py-5 font-black rounded-2xl transition-all mt-4 uppercase tracking-tighter text-lg"
        >
          {isStopped ? "SYSTEM RESET" : "RESET TO 15:00"}
        </button>
      </div>
    </div>
  );
}
