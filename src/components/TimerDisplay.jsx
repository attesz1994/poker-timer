import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TimerDisplay({ timeLeft, isBreak, theme, progress }) {
  const secondsLeft =
    parseInt(timeLeft.split(":")[0]) * 60 + parseInt(timeLeft.split(":")[1]);
  const isFinalSeconds = secondsLeft <= 3 && secondsLeft > 0;

  // Hardcoded values to ensure NO yellow leaks through
  const greenColor = "#10b981";
  const blueColor = "#3b82f6";
  const redColor = "#ef4444";

  const activeColor = isBreak
    ? blueColor
    : isFinalSeconds
    ? redColor
    : greenColor;

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-visible py-4">
      <svg
        className="absolute h-[56vh] w-[56vh] -rotate-90"
        viewBox="0 0 100 100"
      >
        <defs>
          {/* 1. Use a unique ID to break browser cache */}
          <linearGradient
            id="forceGreenGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor={activeColor} stopOpacity="0.2" />
            <stop offset="100%" stopColor={activeColor} stopOpacity="1" />
          </linearGradient>

          {/* 2. Enhanced Inner Shadow */}
          <filter id="forceInnerShadow">
            <feOffset dx="0" dy="0" />
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite
              operator="out"
              in="SourceGraphic"
              in2="blur"
              result="inverse"
            />
            <feFlood floodColor="black" floodOpacity="0.8" result="color" />
            <feComposite
              operator="in"
              in="color"
              in2="inverse"
              result="shadow"
            />
            <feComposite operator="over" in="shadow" in2="SourceGraphic" />
          </filter>
        </defs>

        {/* Track Background */}
        <circle
          cx="50"
          cy="50"
          r="48"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="5"
          fill="rgba(0,0,0,0.4)"
          filter="url(#forceInnerShadow)"
        />

        {/* 3. The "Aura" Glow (Forced to activeColor) */}
        <motion.circle
          cx="50"
          cy="50"
          r="48"
          stroke={activeColor}
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          style={{
            opacity: 0.2,
            filter: `blur(15px)`, // Soft atmospheric green glow
          }}
          animate={{ pathLength: progress / 100 }}
          transition={{ duration: 1, ease: "linear" }}
        />

        {/* 4. The Main Progress Bar (Forced to activeColor) */}
        <motion.circle
          cx="50"
          cy="50"
          r="48"
          stroke="url(#forceGreenGradient)"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          animate={{ pathLength: progress / 100 }}
          transition={{ duration: 1, ease: "linear" }}
          style={{
            // This is where the sharp green glow comes from
            filter: `drop-shadow(0 0 10px ${activeColor}) drop-shadow(0 0 5px ${activeColor})`,
          }}
        />
      </svg>

      {/* Time Text Section */}
      <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none -translate-y-2">
        <AnimatePresence mode="wait">
          <motion.h1
            key={timeLeft}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1, scale: isFinalSeconds ? [1, 1.05, 1] : 1 }}
            transition={{ duration: 0.1 }}
            className={`
              text-[28vh] font-mono font-black leading-[0.5] tracking-[-0.06em]
              ${
                isFinalSeconds
                  ? "text-red-500"
                  : isBreak
                  ? "text-blue-500"
                  : "text-emerald-500"
              }
            `}
          >
            {timeLeft}
          </motion.h1>
        </AnimatePresence>

        <div
          className={`
          mt-4 px-10 py-1.5 border-[1px] rounded-full text-xl font-bold tracking-[0.6em] uppercase 
          backdrop-blur-md bg-black/40 
          ${
            isBreak
              ? "border-blue-500/30 text-blue-500"
              : "border-emerald-500/30 text-emerald-500"
          }
        `}
        >
          {isFinalSeconds ? "END LEVEL" : isBreak ? "BREAK" : "LIVE GAME"}
        </div>
      </div>
    </div>
  );
}
