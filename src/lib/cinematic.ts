export const CINE_FRAME_COUNT = 169;

export const cineFramePath = (n: number) =>
  `/frames2/frame_${String(n).padStart(4, "0")}.jpg`;

export type Beat = {
  id: string;
  show: number;
  hide: number;
  label: string;
  quote: string;
  speaker: string;
  film: string;
};

export const BEATS: Beat[] = [
  {
    id: "b1",
    show: 0.1,
    hide: 0.3,
    label: "01 — Ignition",
    quote: "Prachii ignites—one chapter at a time.",
    speaker: "Prachii",
    film: "EXAM ARC — START",
  },
  {
    id: "b2",
    show: 0.35,
    hide: 0.55,
    label: "02 — Sync",
    quote: "She studies, practices, and upgrades—confidence grows daily.",
    speaker: "Prachii",
    film: "EXAM ARC — LOCK IN",
  },
  {
    id: "b3",
    show: 0.6,
    hide: 0.8,
    label: "03 — Aftermath",
    quote: "Final revision. Full belief. Prachii finishes strong.",
    speaker: "Prachii",
    film: "EXAM ARC — WIN",
  },
];

export const CINE_INTRO_FADE_END = 0.08;
