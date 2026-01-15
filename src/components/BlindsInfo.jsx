import React from "react";

export default function BlindsInfo({ level, structure, isBreak }) {
  const blinds = structure[level];
  const prevBlinds = level > 0 ? structure[level - 1] : null;
  const nextBlinds = level < structure.length - 1 ? structure[level + 1] : null;

  // Helper to format the blind strings
  const renderBlindSet = (b) => {
    if (!b) return "—";
    if (b.type === "break") return "BREAK";
    return `${b.small}/${b.big}`;
  };

  return (
    // Inside BlindsInfo.jsx, ensure the container uses h-full and items-center
    <div className="h-full w-full grid grid-cols-3 items-center px-12">
      {/* Left: Previous */}
      <div className="opacity-30 self-center">
        <p className="text-[1.2vh] uppercase tracking-widest font-bold mb-1">
          Previous
        </p>
        <p className="text-[3vh] font-black">{renderBlindSet(prevBlinds)}</p>
      </div>

      {/* Center: Current (Huge) */}
      <div className="flex flex-col items-center justify-center">
        {!isBreak && (
          <>
            <p className="text-zinc-600 text-[1.2vh] uppercase tracking-[0.5em] font-bold mb-2">
              Current Blinds
            </p>
            <p className="text-[10vh] font-black leading-none tracking-tighter italic">
              {blinds.small} / {blinds.big}
            </p>
          </>
        )}
      </div>

      {/* Right: Next */}
      <div className="opacity-30 text-right self-center">
        <p className="text-[1.2vh] uppercase tracking-widest font-bold mb-1">
          Up Next
        </p>
        <p className="text-[3vh] font-black">{renderBlindSet(nextBlinds)}</p>
      </div>
    </div>
  );
}
