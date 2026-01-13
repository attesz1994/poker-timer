import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

export default function Controller() {
  const startTimer = async () => {
    const durationInMinutes = 15;
    const endTime = Date.now() + durationInMinutes * 60 * 1000;

    try {
      // This saves the data to a document called "poker-night"
      await setDoc(doc(db, "games", "poker-night"), {
        endTime: endTime,
        status: "running",
      });
      alert("Timer Started!");
    } catch (e) {
      console.error("Error starting timer: ", e);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 text-white font-sans">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black tracking-tighter">
          POKER<span className="text-orange-500">CONTROL</span>
        </h1>
        <p className="text-zinc-500 uppercase tracking-widest text-xs mt-2">
          Mobile Remote
        </p>
      </div>

      <button
        onClick={startTimer}
        className="w-64 h-64 bg-orange-500 rounded-full text-black font-black text-4xl shadow-[0_0_50px_rgba(249,115,22,0.3)] active:scale-95 transition-all border-8 border-orange-600/50 flex items-center justify-center"
      >
        START
      </button>

      <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-xs">
        <button className="bg-zinc-800 py-4 rounded-2xl font-bold text-zinc-400">
          PAUSE
        </button>
        <button className="bg-zinc-800 py-4 rounded-2xl font-bold text-zinc-400">
          RESET
        </button>
      </div>
    </div>
  );
}
