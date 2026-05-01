export const THIRD_FRAME_COUNT = 200;

export const thirdFramePath = (n: number) =>
  `/frames3/ezgif-frame-${String(n).padStart(3, "0")}.jpg`;

export type ThirdBeat = {
  id: string;
  show: number;
  hide: number;
  label: string;
  quote: string;
  speaker: string;
  film: string;
};

export const THIRD_BEATS: ThirdBeat[] = [
  {
    id: "t1",
    show: 0.1,
    hide: 0.3,
    label: "Phase I — Radiance",
    quote: "A true princess builds her own kingdom of love.",
    speaker: "Prachii",
    film: "Ethereal Bloom",
  },
  {
    id: "t2",
    show: 0.35,
    hide: 0.55,
    label: "Phase II — Sovereignty",
    quote: "Confidence is the crown you wear every single day.",
    speaker: "Prachii",
    film: "Majestic Reach",
  },
  {
    id: "t3",
    show: 0.6,
    hide: 0.8,
    label: "Phase III — Victory",
    quote: "You are worthy of everything beautiful this world has to offer.",
    speaker: "Prachii",
    film: "Everlasting Grace",
  },
];

export const THIRD_INTRO_FADE_END = 0.08;
