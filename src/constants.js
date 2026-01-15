export const GAME_ID = "poker-night";
export const DURATION_MS = 1 * 60 * 1000;

export const THEME = {
  running: {
    text: "text-emerald-500",
    border: "border-emerald-500/50",
    bg: "bg-emerald-500/10",
    hex: "#065f46",
    label: "Game Live",
  },
  paused: {
    text: "text-yellow-500",
    border: "border-yellow-500/50",
    bg: "bg-yellow-500/10",
    hex: "#eab308",
    label: "Timer Paused",
  },
  stopped: {
    text: "text-orange-500",
    border: "border-orange-500/50",
    bg: "bg-orange-500/10",
    hex: "#f97316",
    label: "Ready to Start",
  },
  reset: { hex: "#dc2626" },
};

export const BLIND_STRUCTURE = [
  { level: 1, small: 50, big: 100, type: "level" },
  { level: 2, small: 100, big: 200, type: "level" },
  { level: 3, small: 150, big: 300, type: "level" },
  { level: "BREAK", small: 0, big: 0, type: "break" }, // First Break
  { level: 4, small: 200, big: 400, type: "level" },
  { level: 5, small: 300, big: 600, type: "level" },
  { level: 6, small: 400, big: 800, type: "level" },
  { level: "BREAK", small: 0, big: 0, type: "break" }, // Second Break (Color-up)
  { level: 7, small: 500, big: 1000, type: "level" },
  { level: 8, small: 600, big: 1200, type: "level" },
  { level: 9, small: 800, big: 1600, type: "level" },
  { level: "BREAK", small: 0, big: 0, type: "break" }, // Third Break (Final Table)
  { level: 10, small: 1000, big: 2000, type: "level" },
  { level: 11, small: 1500, big: 3000, type: "level" },
  { level: 12, small: 2000, big: 4000, type: "level" },
];
