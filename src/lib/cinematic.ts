export const CINE_FRAME_COUNT = 200;

export const cineFramePath = (n: number) =>
  `/frames2/ezgif-frame-${String(n).padStart(3, "0")}.jpg`;

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
    label: "Chapter I — Grace",
    quote: "Brave enough to dream, strong enough to achieve.",
    speaker: "Prachii",
    film: "Infinite Radiance",
  },
  {
    id: "b2",
    show: 0.35,
    hide: 0.55,
    label: "Chapter II — Resilience",
    quote: "Every step you take is a masterpiece of resilience.",
    speaker: "Prachii",
    film: "Unstoppable Will",
  },
  {
    id: "b3",
    show: 0.6,
    hide: 0.8,
    label: "Chapter III — Serenity",
    quote: "Radiance isn't just a look; it's the light you carry within.",
    speaker: "Prachii",
    film: "Beyond Comparison",
  },
];

export const CINE_INTRO_FADE_END = 0.08;
