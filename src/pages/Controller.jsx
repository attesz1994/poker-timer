import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, setDoc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";

export default function Controller() {
  const GAME_ID = "poker-night";
  const DURATION = 15 * 60 * 1000;
  const [status, setStatus] = useState("stopped");

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "games", GAME_ID), (snap) => {
      if (snap.exists()) {
        setStatus(snap.data().status);
      }
    });
    return () => unsub();
  }, []);

  const startTimer = async () => {
    if (status === "running") return;
    const endTime = Date.now() + DURATION;
    await setDoc(doc(db, "games", GAME_ID), {
      endTime: endTime,
      remainingTime: DURATION,
      status: "running",
    });
  };

  const togglePause = async () => {
    if (status === "stopped") return;
    const docRef = doc(db, "games", GAME_ID);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return;
    const data = snap.data();

    if (data.status === "running") {
      const remaining = data.endTime - Date.now();
      await updateDoc(docRef, {
        status: "paused",
        remainingTime: Math.max(0, remaining),
        endTime: null,
      });
    } else if (data.status === "paused") {
      const newEndTime = Date.now() + (data.remainingTime || 0);
      await updateDoc(docRef, {
        status: "running",
        endTime: newEndTime,
      });
    }
  };

  const resetToStart = async () => {
    await setDoc(doc(db, "games", GAME_ID), {
      endTime: null,
      remainingTime: DURATION,
      status: "stopped",
    });
  };

  const getButtonColor = () => {
    if (status === "running") return "#065f46";
    if (status === "paused") return "#eab308";
    return "#f97316";
  };

  const getPauseButtonStyles = () => {
    if (status === "stopped")
      return { bg: "#000000", text: "#3f3f46", border: "#27272a" };
    if (status === "running")
      return { bg: "#eab308", text: "#000000", border: "#ca8a04" };
    if (status === "paused")
      return { bg: "#f97316", text: "#000000", border: "#fb923c" };
  };

  const styles = getPauseButtonStyles();

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white font-sans overflow-hidden">
      <style>
        {`
          @keyframes subtlePulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(0.97); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
          }
          .animate-subtle { animation: subtlePulse 3s ease-in-out infinite; }
        `}
      </style>

      <h1 className="text-zinc-600 tracking-[0.3em] font-bold mb-10 uppercase text-[10px]">
        Control Interface
      </h1>

      <button
        onClick={startTimer}
        disabled={status === "running" || status === "paused"}
        style={{
          backgroundColor: getButtonColor(),
          cursor:
            status === "running" || status === "paused" ? "default" : "pointer",
          transition: "all 0.5s ease",
        }}
        className={`w-64 h-64 rounded-full text-black font-black text-4xl mb-12 flex items-center justify-center
          ${status === "running" ? "animate-subtle text-emerald-400" : ""}
          ${
            status === "paused"
              ? "text-yellow-900 border-8 border-yellow-600"
              : ""
          }
          ${status === "stopped" ? "active:scale-95 shadow-2xl" : ""}
        `}
      >
        {status === "running"
          ? "LIVE"
          : status === "paused"
          ? "PAUSED"
          : "START"}
      </button>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button
          onClick={togglePause}
          disabled={status === "stopped"}
          style={{
            backgroundColor: styles.bg,
            color: styles.text,
            borderColor: styles.border,
            cursor: status === "stopped" ? "not-allowed" : "pointer",
          }}
          className="w-full py-6 rounded-2xl font-bold text-xl border transition-all duration-300"
        >
          {status === "paused" ? "▶ RESUME" : "Ⅱ PAUSE"}
        </button>

        {/* THE BIG RED RESET BUTTON */}
        <button
          onClick={resetToStart}
          style={{
            backgroundColor: "#dc2626", // Forced Red-600
            color: "white",
            boxShadow: "0 4px 15px rgba(220, 38, 38, 0.3)",
          }}
          className="w-full py-5 active:scale-95 text-white font-black rounded-2xl transition-all mt-4 uppercase tracking-tighter text-lg border-none"
        >
          Reset to 15:00
        </button>
      </div>
    </div>
  );
}
