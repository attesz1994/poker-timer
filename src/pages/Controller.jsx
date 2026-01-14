import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, setDoc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { GAME_ID, DURATION_MS, THEME, BLIND_STRUCTURE } from "../constants";

export default function Controller() {
  const [status, setStatus] = useState("stopped");
  const [currentLevel, setCurrentLevel] = useState(0);

  useEffect(() => {
    return onSnapshot(doc(db, "games", GAME_ID), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setStatus(data.status);
        setCurrentLevel(data.currentLevel || 0);
      }
    });
  }, []);

  const changeLevel = async (direction) => {
    const newLevel = currentLevel + direction;
    if (newLevel >= 0 && newLevel < BLIND_STRUCTURE.length) {
      await updateDoc(doc(db, "games", GAME_ID), { currentLevel: newLevel });
    }
  };

  const handleStart = async () => {
    if (status !== "stopped") return;
    await setDoc(doc(db, "games", GAME_ID), {
      endTime: Date.now() + DURATION_MS,
      remainingTime: DURATION_MS,
      status: "running",
      currentLevel: currentLevel,
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
      currentLevel: 0,
    });
  };

  const isStopped = status === "stopped";
  const blinds = BLIND_STRUCTURE[currentLevel];

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white font-sans overflow-hidden">
      <h1 className="text-zinc-600 tracking-[0.3em] font-bold mb-6 uppercase text-[10px]">
        Poker Controller
      </h1>

      <button
        onClick={handleStart}
        disabled={!isStopped}
        style={{ backgroundColor: THEME[status].hex }}
        className={`w-64 h-64 rounded-full text-black font-black text-4xl mb-8 flex items-center justify-center transition-all duration-500
          ${status === "running" ? "animate-pulse" : ""}
          ${
            status === "paused"
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
            backgroundColor:
              status === "paused"
                ? THEME.stopped.hex
                : isStopped
                ? "#111"
                : THEME.paused.hex,
            color: isStopped ? "#333" : "#000",
          }}
          className="w-full py-6 rounded-2xl font-bold text-xl transition-all duration-300"
        >
          {status === "paused" ? "▶ RESUME" : "Ⅱ PAUSE"}
        </button>

        <button
          onClick={handleReset}
          disabled={isStopped}
          style={{
            backgroundColor: isStopped ? "#1a1a1a" : THEME.reset.hex,
            color: isStopped ? "#3f3f46" : "white",
          }}
          className="w-full py-5 font-black rounded-2xl transition-all mt-4 uppercase tracking-tighter text-lg"
        >
          {isStopped ? "SYSTEM RESET" : "RESET CLOCK"}
        </button>
      </div>

      {/* Level Display - Added mt-8 for spacing below the Reset button */}
      <div className="mt-8 text-center bg-zinc-900/50 p-6 rounded-3xl border border-white/5 w-full max-w-xs shadow-inner">
        <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] mb-2 font-bold">
          Current Blinds
        </p>
        <h2 className="text-4xl font-black mb-6 tracking-tight text-white">
          {blinds.small} / {blinds.big}
        </h2>

        <div className="flex justify-between mt-4 gap-3">
          {/* MINUS BUTTON */}
          <button
            onClick={() => changeLevel(-1)}
            disabled={currentLevel === 0}
            style={{
              backgroundColor: currentLevel === 0 ? "#111" : "#27272a",
              color: currentLevel === 0 ? "#3f3f46" : "#fff",
              cursor: currentLevel === 0 ? "not-allowed" : "pointer",
            }}
            className="flex-1 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 border border-white/5"
          >
            - Level
          </button>

          {/* PLUS BUTTON */}
          <button
            onClick={() => changeLevel(1)}
            disabled={currentLevel === BLIND_STRUCTURE.length - 1}
            style={{
              backgroundColor:
                currentLevel === BLIND_STRUCTURE.length - 1
                  ? "#111"
                  : "#27272a",
              color:
                currentLevel === BLIND_STRUCTURE.length - 1
                  ? "#3f3f46"
                  : "#fff",
              cursor:
                currentLevel === BLIND_STRUCTURE.length - 1
                  ? "not-allowed"
                  : "pointer",
            }}
            className="flex-1 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 border border-white/5"
          >
            + Level
          </button>
        </div>
      </div>
    </div>
  );
}
