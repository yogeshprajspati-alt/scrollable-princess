export const FRAME_COUNT = 169;

export const framePath = (n: number) =>
  `/frames/frame_${String(n).padStart(4, "0")}.jpg`;

export type Dialogue = {
  id: string;
  show: number;
  hide: number;
  quote: string;
  speaker: string;
  film: string;
};

export const DIALOGUES: Dialogue[] = [
  {
    id: "d1",
    show: 0.1,
    hide: 0.3,
    quote: "Prachii runs before doubt catches up.",
    speaker: "Prachii",
    film: "EXAM MODE — START",
  },
  {
    id: "d2",
    show: 0.35,
    hide: 0.55,
    quote: "Practice is power. Prachii is relentless.",
    speaker: "Prachii",
    film: "EXAM MODE — LOCK IN",
  },
  {
    id: "d3",
    show: 0.6,
    hide: 0.8,
    quote: "Confidence isn’t luck. It’s daily consistency.",
    speaker: "Prachii",
    film: "EXAM MODE — FINISH STRONG",
  },
];

export const HERO_TEXT_FADE_END = 0.08;
