// CSS backgrounds: the single source. scripts/build.js turns this into the generated part of
// styles.css, catalog.ts lists it, selftest checks text contrast through the theme glass.
//
// Each background has a day picture (light mode) and a night picture (dark mode).
// Layers are CSS <image> values, first = top. The last layer must be opaque (it is the base).
// `{H}`, `{H+40}`, `{H-60}`: the theme color hue (theme.css `--fantasy-hue`), so "theme"
// backgrounds follow the chosen theme color. Fixed palettes use plain colors.
// Pictures sit behind the card glass (blur 8~12px), so big soft shapes and strong color
// read best; fine detail disappears.

export type BgKind = "static" | "motion";
export type BgPalette = "theme" | "fixed";

export interface MotionPart {
  /** keyframes name (KEYFRAMES) */
  frames: keyof typeof KEYFRAMES;
  seconds: number;
  /** one-way linear loop (full hue turns); otherwise back and forth (ease-in-out alternate) */
  loop?: boolean;
}

/** Several movements at once (move / turn / stretch / hue), each with its own period. Periods that
 *  do not divide each other make the combined path effectively never repeat: it reads as random. */
export interface MotionLayer {
  parts: MotionPart[];
}

export interface CssBackground {
  key: string;
  name: string;
  kind: BgKind;
  palette: BgPalette;
  /** picture (static) or the lower moving layer (motion) */
  day: string[];
  night: string[];
  /** motion only: how the lower layer moves */
  motion?: MotionLayer & {
    /** optional upper layer: its own pictures, movement and blend mode per mode */
    over?: MotionLayer & { day: string[]; night: string[]; blend: { day: string; night: string } };
  };
}

const solid = (c: string) => `linear-gradient(${c}, ${c})`;
const blob = (shape: string, at: string, c: string, fade = 60) => `radial-gradient(${shape} at ${at}, ${c}, transparent ${fade}%)`;

/** Motion keyframes: individual transform properties (translate / rotate / scale) and filter, so
 *  several can run on one layer together. All are compositor-only (the layer is never repainted).
 *  Layers are 150% of the window (inset -25%); moves stay within ~13% of the layer. */
export const KEYFRAMES = {
  wanderA: "0% { translate: -12% -6%; } 21% { translate: 7% -11%; } 43% { translate: 12% 5%; } 62% { translate: -2% 12%; } 81% { translate: -11% 3%; } 100% { translate: -6% -9%; }",
  wanderB: "0% { translate: 10% 8%; } 18% { translate: -6% 11%; } 39% { translate: -12% -4%; } 58% { translate: 3% -12%; } 79% { translate: 12% -2%; } 100% { translate: 5% 10%; }",
  wanderC: "0% { translate: 0% -10%; } 26% { translate: 11% 2%; } 47% { translate: -4% 11%; } 71% { translate: -12% -3%; } 100% { translate: 6% -7%; }",
  tideX: "0% { translate: -13% 2%; } 100% { translate: 13% -3%; }",
  swellY: "0% { translate: 2% -11%; } 100% { translate: -3% 11%; }",
  sway: "0% { rotate: -7deg; } 100% { rotate: 6deg; }",
  swayB: "0% { rotate: 5deg; } 35% { rotate: -4deg; } 100% { rotate: -8deg; }",
  pulse: "0% { scale: 1.05; } 100% { scale: 1.22; }",
  pulseB: "0% { scale: 1.2 1.06; } 100% { scale: 1.06 1.22; }",
  hue: "0% { filter: hue-rotate(-25deg); } 100% { filter: hue-rotate(35deg); }",
  hueFull: "0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(360deg); }",
};

/** CSS `animation` value for a layer (used by the build and the gallery). */
export const motionCss = (layer: MotionLayer) =>
  layer.parts.map((p) => `fantasy-easel-${p.frames} ${p.seconds}s ${p.loop ? "linear" : "ease-in-out"} infinite${p.loop ? "" : " alternate"}`).join(", ");

export const CSS_BACKGROUNDS: CssBackground[] = [
  // ---------- theme color ----------
  {
    key: "bloom", name: "Bloom", kind: "static", palette: "theme",
    day: [
      blob("ellipse 70% 60%", "15% 20%", "hsl({H} 90% 72%)"),
      blob("ellipse 60% 60%", "85% 25%", "hsl({H+50} 90% 74%)"),
      blob("ellipse 70% 60%", "70% 90%", "hsl({H-50} 85% 72%)"),
      blob("ellipse 60% 50%", "20% 85%", "hsl({H+120} 80% 78%)"),
      solid("hsl({H} 60% 92%)"),
    ],
    night: [
      blob("ellipse 70% 60%", "15% 20%", "hsl({H} 80% 56%)"),
      blob("ellipse 60% 60%", "85% 25%", "hsl({H+50} 80% 56%)"),
      blob("ellipse 70% 60%", "70% 90%", "hsl({H-50} 75% 56%)"),
      blob("ellipse 60% 50%", "20% 85%", "hsl({H+120} 70% 56%)"),
      solid("hsl({H} 45% 43.2%)"),
    ],
  },
  {
    key: "silk", name: "Silk", kind: "static", palette: "theme",
    day: [
      "linear-gradient(180deg, hsl(0 0% 100% / 0.35), transparent 60%)",
      "conic-gradient(from 210deg at 30% 40%, hsl({H} 85% 72%), hsl({H+40} 85% 76%), hsl({H+100} 80% 74%), hsl({H+180} 70% 78%), hsl({H} 85% 72%))",
    ],
    night: [
      "linear-gradient(180deg, hsl({H} 50% 41.8% / 0.55), transparent 70%)",
      "conic-gradient(from 210deg at 30% 40%, hsl({H} 75% 56%), hsl({H+40} 75% 56%), hsl({H+100} 70% 56%), hsl({H+180} 60% 54.5%), hsl({H} 75% 56%))",
    ],
  },
  {
    key: "veil", name: "Veil", kind: "static", palette: "theme",
    day: [
      "linear-gradient(100deg, transparent 8%, hsl({H+60} 90% 70% / 0.6) 24%, transparent 38%, hsl({H} 90% 68% / 0.55) 55%, transparent 70%, hsl({H-60} 85% 72% / 0.55) 85%, transparent 96%)",
      "linear-gradient(180deg, hsl({H+20} 70% 90%), hsl({H} 60% 84%))",
    ],
    night: [
      "linear-gradient(100deg, transparent 8%, hsl({H+60} 85% 56% / 0.65) 24%, transparent 38%, hsl({H} 85% 56% / 0.6) 55%, transparent 70%, hsl({H-60} 80% 56% / 0.6) 85%, transparent 96%)",
      "linear-gradient(180deg, hsl({H+20} 50% 42.5%), hsl({H} 45% 46.2%))",
    ],
  },
  {
    key: "dusk", name: "Dusk", kind: "static", palette: "theme",
    day: ["linear-gradient(160deg, hsl({H} 85% 78%) 0%, hsl({H+40} 85% 76%) 40%, hsl({H+90} 80% 80%) 75%, hsl({H+130} 70% 86%) 100%)"],
    night: ["linear-gradient(160deg, hsl({H} 75% 56%) 0%, hsl({H+40} 72% 56%) 40%, hsl({H+90} 70% 56%) 75%, hsl({H+130} 65% 54.5%) 100%)"],
  },
  // ---------- fixed palettes ----------
  {
    key: "horizon", name: "Sky", kind: "static", palette: "fixed",
    day: [
      blob("ellipse 35% 30%", "75% 82%", "#fff3c4", 70),
      "linear-gradient(180deg, #7fb3ff 0%, #b9a7ff 40%, #ffb3c7 70%, #ffd29a 100%)",
    ],
    night: [
      blob("ellipse 16% 28%", "80% 18%", "rgb(190 205 255 / 0.45)", 70),
      blob("ellipse 80% 40%", "50% 100%", "rgb(201 84 162 / 0.5)", 70),
      "linear-gradient(180deg, #4a61d4 0%, #5552cb 40%, #8357c6 70%, #bc62b9 100%)",
    ],
  },
  {
    key: "aurora", name: "Aurora", kind: "static", palette: "fixed",
    day: [
      blob("ellipse 55% 50%", "15% 20%", "#5fe8b0", 70),
      blob("ellipse 55% 55%", "85% 25%", "#a38aff", 70),
      blob("ellipse 60% 50%", "50% 95%", "#66c8ff", 70),
      blob("ellipse 40% 45%", "10% 90%", "#86ee96", 70),
      solid("#b5dde6"),
    ],
    night: [
      blob("ellipse 60% 40%", "30% 35%", "rgb(53 233 154 / 0.55)", 65),
      blob("ellipse 55% 45%", "70% 30%", "rgb(122 60 255 / 0.5)", 65),
      blob("ellipse 70% 35%", "50% 78%", "rgb(31 201 255 / 0.35)", 65),
      solid("#2c42a4"),
    ],
  },
  {
    key: "prism", name: "Prism / Neon", kind: "static", palette: "fixed",
    day: ["conic-gradient(from 0deg at 50% 50%, #ff7fcf, #6fd0ff, #8ff07a, #ffd65c, #b48cff, #ff7fcf)"],
    night: [
      blob("ellipse 45% 80%", "50% 50%", "rgb(58 29 175 / 0.75)", 75),
      "conic-gradient(from 0deg at 50% 50%, #e637b2, #37b8e6, #713ae4, #e6a137, #e637b2)",
    ],
  },
  {
    key: "stained", name: "Stained Glass", kind: "static", palette: "theme",
    day: [
      blob("ellipse 70% 70%", "38% 46%", "hsl({H} 60% 96% / 0.35)", 70),
      "repeating-conic-gradient(from 15deg at 38% 46%, hsl({H} 85% 70%) 0deg 22deg, hsl({H+70} 85% 76%) 22deg 47deg, hsl({H+160} 80% 72%) 47deg 75deg, hsl({H+240} 85% 76%) 75deg 100deg)",
    ],
    night: [
      blob("ellipse 70% 70%", "38% 46%", "hsl({H} 60% 8% / 0.35)", 70),
      "repeating-conic-gradient(from 15deg at 38% 46%, hsl({H} 80% 30%) 0deg 22deg, hsl({H+70} 80% 25%) 22deg 47deg, hsl({H+160} 75% 27%) 47deg 75deg, hsl({H+240} 80% 25%) 75deg 100deg)",
    ],
  },
  {
    key: "ripple", name: "Ripple", kind: "static", palette: "theme",
    day: [
      "repeating-radial-gradient(circle at 18% 80%, hsl({H+120} 85% 74% / 0.55) 0 4%, transparent 4% 9%)",
      "repeating-radial-gradient(circle at 75% 25%, hsl({H} 85% 70%) 0 6%, hsl({H+50} 85% 78%) 6% 12%)",
    ],
    night: [
      "repeating-radial-gradient(circle at 18% 80%, hsl({H+120} 80% 56% / 0.55) 0 4%, transparent 4% 9%)",
      "repeating-radial-gradient(circle at 75% 25%, hsl({H} 80% 56%) 0 6%, hsl({H+50} 75% 54.5%) 6% 12%)",
    ],
  },
  {
    key: "holo", name: "Holo", kind: "static", palette: "fixed",
    day: [
      blob("ellipse 45% 55%", "0% 0%", "#ff6fc0", 75),
      blob("ellipse 45% 55%", "50% 0%", "#6fd8ff", 75),
      blob("ellipse 45% 55%", "100% 0%", "#a0f06a", 75),
      blob("ellipse 45% 55%", "0% 100%", "#a080ff", 75),
      blob("ellipse 45% 55%", "50% 100%", "#ffb46a", 75),
      blob("ellipse 45% 55%", "100% 100%", "#6fe8c8", 75),
      solid("#c8bdf0"),
    ],
    night: [
      blob("ellipse 45% 55%", "0% 0%", "#cb5295", 75),
      blob("ellipse 45% 55%", "50% 0%", "#44adda", 75),
      blob("ellipse 45% 55%", "100% 0%", "#8bd24c", 75),
      blob("ellipse 45% 55%", "0% 100%", "#744fcf", 75),
      blob("ellipse 45% 55%", "50% 100%", "#db8d42", 75),
      blob("ellipse 45% 55%", "100% 100%", "#48d5b7", 75),
      solid("#6a4eb7"),
    ],
  },
  {
    key: "sunburst", name: "Sunburst", kind: "static", palette: "fixed",
    day: [
      blob("ellipse 60% 45%", "50% 100%", "rgb(255 241 201 / 0.6)", 70),
      "repeating-conic-gradient(from 0deg at 50% 115%, #ff9a4a 0deg 7deg, #ff7060 7deg 14deg, #ffad85 14deg 21deg)",
    ],
    night: [
      blob("ellipse 60% 45%", "50% 100%", "rgb(255 140 90 / 0.4)", 70),
      "repeating-conic-gradient(from 0deg at 50% 115%, #9b56c8 0deg 7deg, #8f52cb 7deg 14deg, #b85ec0 14deg 21deg)",
    ],
  },
  {
    key: "marble", name: "Marble", kind: "static", palette: "theme",
    day: [
      "linear-gradient(35deg, transparent 18%, hsl({H+40} 75% 66% / 0.7) 24%, transparent 30%, transparent 58%, hsl({H-30} 70% 70% / 0.6) 64%, transparent 70%)",
      "linear-gradient(-20deg, transparent 30%, hsl({H+150} 70% 72% / 0.55) 38%, transparent 46%, transparent 76%, hsl({H} 80% 68% / 0.6) 82%, transparent 88%)",
      "linear-gradient(160deg, hsl({H} 55% 84%), hsl({H+30} 50% 80%))",
    ],
    night: [
      "linear-gradient(35deg, transparent 18%, hsl({H+40} 70% 56% / 0.75) 24%, transparent 30%, transparent 58%, hsl({H-30} 65% 56% / 0.7) 64%, transparent 70%)",
      "linear-gradient(-20deg, transparent 30%, hsl({H+150} 65% 56% / 0.6) 38%, transparent 46%, transparent 76%, hsl({H} 75% 56% / 0.65) 82%, transparent 88%)",
      "linear-gradient(160deg, hsl({H} 45% 50.8%), hsl({H+30} 40% 48.5%))",
    ],
  },
  // ---------- motion (media art: two layers move apart and blend; 16~30s cycles) ----------
  {
    key: "tide", name: "Tide", kind: "motion", palette: "theme", motion: { parts: [{frames:"tideX",seconds:17},{frames:"pulseB",seconds:23},{frames:"hue",seconds:29}] },
    day: ["linear-gradient(115deg, hsl({H} 75% 80%) 0%, hsl({H+30} 85% 70%) 25%, hsl({H-20} 90% 66%) 50%, hsl({H+30} 85% 70%) 75%, hsl({H} 75% 80%) 100%)"],
    night: ["linear-gradient(115deg, hsl({H} 65% 48.5%) 0%, hsl({H+30} 70% 56%) 25%, hsl({H-20} 75% 56%) 50%, hsl({H+30} 70% 56%) 75%, hsl({H} 65% 48.5%) 100%)"],
  },
  {
    key: "swell", name: "Ocean Swell", kind: "motion", palette: "fixed", motion: { parts: [{frames:"swellY",seconds:15},{frames:"wanderC",seconds:31},{frames:"pulse",seconds:19}] },
    day: ["linear-gradient(170deg, #9debff 0%, #5ad2ec 35%, #2fb6dc 65%, #3f9fe0 100%)"],
    night: ["linear-gradient(170deg, #38a5e2 0%, #37b4e6 35%, #32c8ec 65%, #4589d8 100%)"],
  },
  {
    key: "iris", name: "Iris", kind: "motion", palette: "theme", motion: { parts: [{frames:"hueFull",seconds:37,loop:true},{frames:"wanderA",seconds:41},{frames:"sway",seconds:29}] },
    day: ["conic-gradient(from 210deg at 30% 40%, hsl({H} 85% 72%), hsl({H+60} 85% 74%), hsl({H+150} 80% 72%), hsl({H+240} 75% 74%), hsl({H} 85% 72%))"],
    night: ["conic-gradient(from 210deg at 30% 40%, hsl({H} 75% 56%), hsl({H+60} 75% 56%), hsl({H+150} 70% 56%), hsl({H+240} 65% 56%), hsl({H} 75% 56%))"],
  },
  {
    key: "liquid", name: "Liquid", kind: "motion", palette: "theme",
    motion: {
      parts: [{frames:"wanderA",seconds:23},{frames:"sway",seconds:31},{frames:"pulseB",seconds:19}],
      over: {
        parts: [{frames:"wanderB",seconds:29},{frames:"swayB",seconds:37},{frames:"pulse",seconds:17},{frames:"hue",seconds:41}], blend: { day: "multiply", night: "screen" },
        day: [
          blob("ellipse 45% 55%", "70% 30%", "hsl({H+30} 95% 72%)", 70),
          blob("ellipse 40% 50%", "25% 75%", "hsl({H-70} 95% 74%)", 70),
          blob("ellipse 35% 45%", "55% 55%", "hsl({H+200} 90% 78%)", 70),
          solid("hsl({H} 40% 100% / 0)"),
        ],
        night: [
          blob("ellipse 45% 55%", "70% 30%", "hsl({H+30} 80% 24%)", 70),
          blob("ellipse 40% 50%", "25% 75%", "hsl({H-70} 80% 22%)", 70),
          blob("ellipse 35% 45%", "55% 55%", "hsl({H+200} 75% 21%)", 70),
          solid("hsl({H} 40% 0% / 0)"),
        ],
      },
    },
    day: [
      blob("ellipse 55% 60%", "25% 25%", "hsl({H} 90% 68%)", 70),
      blob("ellipse 50% 55%", "80% 70%", "hsl({H+60} 90% 70%)", 70),
      blob("ellipse 45% 50%", "70% 15%", "hsl({H+140} 85% 74%)", 70),
      solid("hsl({H+20} 70% 82%)"),
    ],
    night: [
      blob("ellipse 55% 60%", "25% 25%", "hsl({H} 85% 56%)", 70),
      blob("ellipse 50% 55%", "80% 70%", "hsl({H+60} 85% 56%)", 70),
      blob("ellipse 45% 50%", "70% 15%", "hsl({H+140} 80% 54.5%)", 70),
      solid("hsl({H+20} 55% 46.2%)"),
    ],
  },
  {
    key: "aurora-flow", name: "Aurora Flow", kind: "motion", palette: "fixed",
    motion: {
      parts: [{frames:"tideX",seconds:19},{frames:"swayB",seconds:29},{frames:"pulseB",seconds:23}],
      over: {
        parts: [{frames:"wanderB",seconds:26},{frames:"hue",seconds:31},{frames:"pulse",seconds:17}], blend: { day: "multiply", night: "screen" },
        day: ["linear-gradient(80deg, transparent 5%, #a6f5d2 18%, transparent 32%, #c7b2ff 48%, transparent 62%, #9fe0ff 78%, transparent 92%)"],
        night: ["linear-gradient(80deg, transparent 5%, rgb(20 210 130 / 0.75) 18%, transparent 32%, rgb(120 70 255 / 0.7) 48%, transparent 62%, rgb(0 170 255 / 0.65) 78%, transparent 92%)"],
      },
    },
    day: [
      "linear-gradient(100deg, #b8f7dd 0%, #9ae6ff 30%, #d4c2ff 60%, #a9f0d0 100%)",
    ],
    night: [
      "linear-gradient(100deg, #27ce9d 0%, #2c74df 30%, #6c4ece 60%, #2cceb6 100%)",
    ],
  },
  {
    key: "plasma", name: "Plasma", kind: "motion", palette: "theme",
    motion: {
      parts: [{frames:"wanderC",seconds:29},{frames:"sway",seconds:23},{frames:"pulse",seconds:19}],
      over: {
        parts: [{frames:"wanderA",seconds:22},{frames:"hueFull",seconds:47,loop:true},{frames:"swayB",seconds:31},{frames:"pulseB",seconds:17}], blend: { day: "multiply", night: "screen" },
        day: ["conic-gradient(from 90deg at 60% 45%, hsl({H+120} 90% 78%), hsl({H+200} 90% 80%), hsl({H+300} 90% 78%), hsl({H+120} 90% 78%))"],
        night: ["conic-gradient(from 90deg at 60% 45%, hsl({H+120} 80% 24%), hsl({H+200} 80% 22%), hsl({H+300} 80% 24%), hsl({H+120} 80% 24%))"],
      },
    },
    day: ["conic-gradient(from 0deg at 35% 55%, hsl({H} 90% 70%), hsl({H+90} 90% 72%), hsl({H+180} 85% 70%), hsl({H+270} 90% 72%), hsl({H} 90% 70%))"],
    night: ["conic-gradient(from 0deg at 35% 55%, hsl({H} 80% 28%), hsl({H+90} 80% 26%), hsl({H+180} 75% 24%), hsl({H+270} 80% 26%), hsl({H} 80% 28%))"],
  },
  {
    key: "lava", name: "Lava", kind: "motion", palette: "fixed",
    motion: {
      parts: [{frames:"swellY",seconds:18},{frames:"pulseB",seconds:13},{frames:"sway",seconds:27}],
      over: {
        parts: [{frames:"wanderB",seconds:23},{frames:"pulse",seconds:16},{frames:"hue",seconds:33}], blend: { day: "multiply", night: "screen" },
        day: [
          blob("ellipse 30% 45%", "30% 60%", "#ffb38a", 70),
          blob("ellipse 28% 40%", "72% 35%", "#ff8fb0", 70),
          solid("rgb(255 255 255 / 0)"),
        ],
        night: [
          blob("ellipse 30% 45%", "30% 60%", "rgb(255 90 20 / 0.7)", 70),
          blob("ellipse 28% 40%", "72% 35%", "rgb(230 20 90 / 0.6)", 70),
          solid("rgb(0 0 0 / 0)"),
        ],
      },
    },
    day: ["linear-gradient(160deg, #ffc58a 0%, #ff9b8a 40%, #ff86a8 75%, #ffb36b 100%)"],
    night: ["linear-gradient(160deg, #db3117 0%, #eb3920 40%, #e61964 75%, #f0761a 100%)"],
  },
];

/** `{H}` / `{H+40}` → CSS using the theme hue. */
export const resolveHue = (s: string, hue: string = "var(--fantasy-hue, 230)") =>
  s.replace(/\{H([+-]\d+)?\}/g, (_m, off?: string) => (off ? `calc(${hue} ${off[0]} ${off.slice(1)})` : hue));
