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
  { level: 1, small: 25, big: 50 },
  { level: 2, small: 50, big: 100 },
  { level: 3, small: 75, big: 150 },
  { level: 4, small: 100, big: 200 },
  { level: 5, small: 150, big: 300 },
  { level: 6, small: 200, big: 400 },
  { level: 7, small: 300, big: 600 },
  { level: 8, small: 400, big: 800 },
];
