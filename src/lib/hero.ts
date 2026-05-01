export const FRAME_COUNT = 200;

export const framePath = (n: number) =>
  `/frames/ezgif-frame-${String(n).padStart(3, "0")}.jpg`;

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
    quote: "A heart of gold, a soul of grace.",
    speaker: "Prachii",
    film: "The Awakening",
  },
  {
    id: "d2",
    show: 0.35,
    hide: 0.55,
    quote: "The world shines a little brighter when you smile.",
    speaker: "Prachii",
    film: "Pure Determination",
  },
  {
    id: "d3",
    show: 0.6,
    hide: 0.8,
    quote: "Strength is found in the quiet moments of kindness.",
    speaker: "Prachii",
    film: "The Final Ascent",
  },
];

export const HERO_TEXT_FADE_END = 0.08;
