import { db } from "../firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

export default function Controller() {
  const startTimer = async () => {
    const durationMs = 15 * 60 * 1000;
    const endTime = Date.now() + durationMs;

    await setDoc(doc(db, "games", "poker-night"), {
      endTime: endTime,
      remainingTime: durationMs,
      status: "running",
    });
  };

  const togglePause = async () => {
    const docRef = doc(db, "games", "poker-night");
    const snap = await getDoc(docRef);
    const data = snap.data();

    if (data.status === "running") {
      // PAUSING: Calculate how much time is left right now and save it
      const remaining = data.endTime - Date.now();
      await updateDoc(docRef, {
        status: "paused",
        remainingTime: remaining,
      });
    } else {
      // RESUMING: Create a NEW endTime based on the saved remainingTime
      const newEndTime = Date.now() + data.remainingTime;
      await updateDoc(docRef, {
        status: "running",
        endTime: newEndTime,
      });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 text-white font-sans">
      <h1 className="text-2xl font-bold mb-8 text-zinc-400">POKER CONTROL</h1>

      <button
        onClick={startTimer}
        className="w-64 h-64 bg-orange-500 rounded-full text-black font-black text-4xl mb-8"
      >
        START
      </button>

      <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
        <button
          onClick={togglePause}
          className="bg-zinc-800 py-6 rounded-2xl font-bold text-xl active:bg-zinc-700"
        >
          PAUSE / RESUME
        </button>
        <button
          onClick={startTimer}
          className="bg-zinc-800 py-6 rounded-2xl font-bold text-xl active:bg-zinc-700"
        >
          RESET
        </button>
      </div>
    </div>
  );
}
