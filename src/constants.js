export const GAME_ID = "poker-night";
export const DURATION_MS = 15 * 60 * 1000;

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
