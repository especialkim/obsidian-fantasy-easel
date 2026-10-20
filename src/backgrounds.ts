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

export interface MotionLayer {
  /** keyframes name (KEYFRAMES) */
  frames: keyof typeof KEYFRAMES;
  seconds: number;
  /** back and forth (ease-in-out alternate); otherwise a linear loop */
  alternate?: boolean;
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

/** Motion keyframes (transform / filter only: the layer is never repainted). */
export const KEYFRAMES = {
  tide: "0% { transform: translate3d(-12%, 0, 0); } 100% { transform: translate3d(12%, 0, 0); }",
  swell: "0% { transform: translate3d(0, -10%, 0) scale(1.04); } 100% { transform: translate3d(0, 10%, 0) scale(1.12); }",
  iris: "0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(360deg); }",
  orbitA: "0% { transform: translate3d(-10%, -6%, 0) rotate(0deg) scale(1.08); } 33% { transform: translate3d(8%, -10%, 0) rotate(5deg) scale(1.14); } 66% { transform: translate3d(10%, 8%, 0) rotate(-4deg) scale(1.1); } 100% { transform: translate3d(-10%, -6%, 0) rotate(0deg) scale(1.08); }",
  orbitB: "0% { transform: translate3d(10%, 8%, 0) rotate(0deg) scale(1.12); } 33% { transform: translate3d(-9%, 10%, 0) rotate(-5deg) scale(1.06); } 66% { transform: translate3d(-10%, -9%, 0) rotate(4deg) scale(1.14); } 100% { transform: translate3d(10%, 8%, 0) rotate(0deg) scale(1.12); }",
  curtainA: "0% { transform: translate3d(-12%, 0, 0) skewX(-6deg); } 100% { transform: translate3d(12%, -3%, 0) skewX(6deg); }",
  curtainB: "0% { transform: translate3d(11%, -4%, 0); filter: hue-rotate(0deg); } 100% { transform: translate3d(-11%, 4%, 0); filter: hue-rotate(45deg); }",
  riseA: "0% { transform: translate3d(0, 12%, 0) scale(1.05); } 100% { transform: translate3d(-3%, -12%, 0) scale(1.16); }",
  riseB: "0% { transform: translate3d(4%, -11%, 0) scale(1.16); } 100% { transform: translate3d(-4%, 11%, 0) scale(1.05); }",
  plasmaB: "0% { transform: translate3d(9%, 7%, 0) rotate(0deg) scale(1.1); filter: hue-rotate(0deg); } 50% { transform: translate3d(-9%, -8%, 0) rotate(6deg) scale(1.16); filter: hue-rotate(70deg); } 100% { transform: translate3d(9%, 7%, 0) rotate(0deg) scale(1.1); filter: hue-rotate(0deg); }",
};

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
      blob("ellipse 70% 60%", "15% 20%", "hsl({H} 80% 34%)"),
      blob("ellipse 60% 60%", "85% 25%", "hsl({H+50} 80% 30%)"),
      blob("ellipse 70% 60%", "70% 90%", "hsl({H-50} 75% 28%)"),
      blob("ellipse 60% 50%", "20% 85%", "hsl({H+120} 70% 26%)"),
      solid("hsl({H} 45% 7%)"),
    ],
  },
  {
    key: "silk", name: "Silk", kind: "static", palette: "theme",
    day: [
      "linear-gradient(180deg, hsl(0 0% 100% / 0.35), transparent 60%)",
      "conic-gradient(from 210deg at 30% 40%, hsl({H} 85% 72%), hsl({H+40} 85% 76%), hsl({H+100} 80% 74%), hsl({H+180} 70% 78%), hsl({H} 85% 72%))",
    ],
    night: [
      "linear-gradient(180deg, hsl({H} 50% 5% / 0.55), transparent 70%)",
      "conic-gradient(from 210deg at 30% 40%, hsl({H} 75% 30%), hsl({H+40} 75% 26%), hsl({H+100} 70% 24%), hsl({H+180} 60% 22%), hsl({H} 75% 30%))",
    ],
  },
  {
    key: "glow", name: "Light Leak", kind: "static", palette: "theme",
    day: [
      blob("ellipse 55% 50%", "0% 0%", "hsl({H+30} 100% 70% / 0.9)", 70),
      blob("ellipse 60% 55%", "100% 100%", "hsl({H-40} 100% 72% / 0.85)", 70),
      blob("ellipse 30% 53%", "80% 15%", "hsl({H+90} 100% 80% / 0.7)", 70),
      solid("hsl({H} 40% 95%)"),
    ],
    night: [
      blob("ellipse 55% 50%", "0% 0%", "hsl({H+30} 90% 42% / 0.85)", 70),
      blob("ellipse 60% 55%", "100% 100%", "hsl({H-40} 90% 38% / 0.8)", 70),
      blob("ellipse 30% 53%", "80% 15%", "hsl({H+90} 90% 45% / 0.55)", 70),
      solid("hsl({H} 50% 6%)"),
    ],
  },
  {
    key: "veil", name: "Veil", kind: "static", palette: "theme",
    day: [
      "linear-gradient(100deg, transparent 8%, hsl({H+60} 90% 70% / 0.6) 24%, transparent 38%, hsl({H} 90% 68% / 0.55) 55%, transparent 70%, hsl({H-60} 85% 72% / 0.55) 85%, transparent 96%)",
      "linear-gradient(180deg, hsl({H+20} 70% 90%), hsl({H} 60% 84%))",
    ],
    night: [
      "linear-gradient(100deg, transparent 8%, hsl({H+60} 85% 38% / 0.65) 24%, transparent 38%, hsl({H} 85% 36% / 0.6) 55%, transparent 70%, hsl({H-60} 80% 34% / 0.6) 85%, transparent 96%)",
      "linear-gradient(180deg, hsl({H+20} 50% 6%), hsl({H} 45% 11%))",
    ],
  },
  {
    key: "dusk", name: "Dusk", kind: "static", palette: "theme",
    day: ["linear-gradient(160deg, hsl({H} 85% 78%) 0%, hsl({H+40} 85% 76%) 40%, hsl({H+90} 80% 80%) 75%, hsl({H+130} 70% 86%) 100%)"],
    night: ["linear-gradient(160deg, hsl({H} 70% 26%) 0%, hsl({H+40} 65% 18%) 40%, hsl({H+90} 60% 12%) 75%, hsl({H+130} 50% 7%) 100%)"],
  },
  // ---------- fixed palettes ----------
  {
    key: "horizon", name: "Sky", kind: "static", palette: "fixed",
    day: [
      blob("ellipse 35% 30%", "75% 82%", "#fff3c4", 70),
      "linear-gradient(180deg, #7fb3ff 0%, #b9a7ff 40%, #ffb3c7 70%, #ffd29a 100%)",
    ],
    night: [
      blob("ellipse 18% 32%", "80% 18%", "rgb(170 190 255 / 0.35)", 70),
      blob("ellipse 80% 35%", "50% 100%", "rgb(120 60 170 / 0.45)", 70),
      "linear-gradient(180deg, #050816 0%, #0d1b4a 45%, #24195a 75%, #3a2160 100%)",
    ],
  },
  {
    key: "ocean", name: "Ocean", kind: "static", palette: "fixed",
    day: [
      blob("ellipse 70% 35%", "50% 0%", "rgb(255 255 255 / 0.55)", 70),
      "linear-gradient(170deg, #b4f3ff 0%, #6fdcef 40%, #3bbcd9 75%, #2ea3c7 100%)",
    ],
    night: [
      blob("ellipse 35% 30%", "28% 72%", "rgb(25 227 214 / 0.35)", 70),
      blob("ellipse 30% 30%", "75% 40%", "rgb(58 123 255 / 0.3)", 70),
      "linear-gradient(170deg, #031426 0%, #062a45 50%, #0a3d5c 100%)",
    ],
  },
  {
    key: "aurora", name: "Aurora", kind: "static", palette: "fixed",
    day: [
      blob("ellipse 60% 45%", "25% 30%", "#a8f7d6"),
      blob("ellipse 55% 50%", "75% 28%", "#d2c2ff"),
      blob("ellipse 70% 40%", "50% 85%", "#b2e8ff"),
      solid("#f2fbff"),
    ],
    night: [
      blob("ellipse 60% 40%", "30% 35%", "rgb(25 230 140 / 0.55)", 65),
      blob("ellipse 55% 45%", "70% 30%", "rgb(122 60 255 / 0.5)", 65),
      blob("ellipse 70% 35%", "50% 78%", "rgb(0 194 255 / 0.35)", 65),
      solid("#04060f"),
    ],
  },
  {
    key: "citrus", name: "Citrus / Ember", kind: "static", palette: "fixed",
    day: [
      blob("ellipse 60% 55%", "20% 25%", "#fff27a"),
      blob("ellipse 55% 55%", "80% 30%", "#c4f56b"),
      blob("ellipse 65% 55%", "60% 90%", "#ffc061"),
      solid("#fffbe6"),
    ],
    night: [
      blob("ellipse 60% 55%", "20% 25%", "rgb(255 106 26 / 0.4)"),
      blob("ellipse 55% 55%", "80% 30%", "rgb(255 176 0 / 0.3)"),
      blob("ellipse 65% 55%", "60% 90%", "rgb(212 20 90 / 0.35)"),
      solid("#120805"),
    ],
  },
  {
    key: "rose", name: "Rosé / Wine", kind: "static", palette: "fixed",
    day: [
      blob("ellipse 60% 55%", "20% 20%", "#ffc3d0"),
      blob("ellipse 55% 55%", "85% 35%", "#ffd6b8"),
      blob("ellipse 65% 55%", "45% 90%", "#e8c1ff"),
      solid("#fff5f7"),
    ],
    night: [
      blob("ellipse 60% 55%", "20% 20%", "rgb(176 48 106 / 0.5)"),
      blob("ellipse 55% 55%", "85% 35%", "rgb(109 42 143 / 0.45)"),
      blob("ellipse 65% 55%", "45% 90%", "rgb(255 122 138 / 0.22)"),
      solid("#14060d"),
    ],
  },
  {
    key: "forest", name: "Forest", kind: "static", palette: "fixed",
    day: [
      "linear-gradient(115deg, transparent 20%, rgb(255 247 194 / 0.7) 30%, transparent 42%, rgb(255 247 194 / 0.5) 55%, transparent 65%)",
      blob("ellipse 60% 55%", "20% 75%", "#a6dd90"),
      blob("ellipse 55% 55%", "85% 30%", "#7fd3a8"),
      solid("#eef7e8"),
    ],
    night: [
      blob("ellipse 6% 11%", "30% 60%", "rgb(216 255 106 / 0.35)", 80),
      blob("ellipse 5% 9%", "70% 35%", "rgb(216 255 106 / 0.3)", 80),
      blob("ellipse 60% 55%", "20% 75%", "rgb(31 107 58 / 0.55)"),
      blob("ellipse 55% 55%", "85% 30%", "rgb(15 77 74 / 0.5)"),
      solid("#040d07"),
    ],
  },
  {
    key: "cosmos", name: "Cotton / Cosmos", kind: "static", palette: "fixed",
    day: [
      blob("ellipse 60% 55%", "20% 30%", "#ffb6e6"),
      blob("ellipse 55% 55%", "80% 25%", "#a9c9ff"),
      blob("ellipse 65% 55%", "55% 90%", "#c7b3ff"),
      solid("#f8f4ff"),
    ],
    night: [
      blob("ellipse 55% 50%", "25% 30%", "rgb(123 47 247 / 0.5)"),
      blob("ellipse 45% 45%", "78% 30%", "rgb(241 7 163 / 0.32)"),
      blob("ellipse 60% 45%", "55% 85%", "rgb(31 209 249 / 0.28)"),
      solid("#07020f"),
    ],
  },
  {
    key: "prism", name: "Prism / Neon", kind: "static", palette: "fixed",
    day: ["conic-gradient(from 0deg at 50% 50%, #ffd1f0, #c9f0ff, #d9ffcf, #fff2c2, #e2d1ff, #ffd1f0)"],
    night: [
      blob("ellipse 45% 80%", "50% 50%", "rgb(4 2 12 / 0.75)", 75),
      "conic-gradient(from 0deg at 50% 50%, #8a1166, #116a8a, #3a138a, #8a5a11, #8a1166)",
    ],
  },
  {
    key: "magma", name: "Coral / Magma", kind: "static", palette: "fixed",
    day: [
      blob("ellipse 60% 55%", "20% 30%", "#ff9a8b"),
      blob("ellipse 55% 55%", "80% 25%", "#ffcf8b"),
      blob("ellipse 65% 55%", "55% 90%", "#ff8fab"),
      solid("#fff1ec"),
    ],
    night: [
      blob("ellipse 55% 45%", "25% 80%", "rgb(255 61 0 / 0.45)"),
      blob("ellipse 50% 45%", "75% 70%", "rgb(255 145 0 / 0.3)"),
      blob("ellipse 60% 45%", "50% 20%", "rgb(179 0 27 / 0.4)"),
      solid("#1a0402"),
    ],
  },
  {
    key: "arctic", name: "Arctic", kind: "static", palette: "fixed",
    day: [
      blob("ellipse 60% 50%", "25% 25%", "#ffffff"),
      blob("ellipse 60% 55%", "80% 70%", "#bfe3ff"),
      blob("ellipse 50% 45%", "20% 85%", "#cfd8ff"),
      solid("#e8f6ff"),
    ],
    night: [
      blob("ellipse 70% 30%", "50% 25%", "rgb(43 255 176 / 0.22)", 70),
      blob("ellipse 60% 55%", "80% 80%", "rgb(20 80 150 / 0.5)"),
      solid("#020b18"),
    ],
  },
  {
    key: "dune", name: "Dune", kind: "static", palette: "fixed",
    day: [
      "linear-gradient(175deg, #a7d4ff 0%, #ffe6c2 45%, #ffd19a 70%, #f2a66b 100%)",
    ],
    night: [
      blob("ellipse 14% 25%", "75% 22%", "rgb(255 236 200 / 0.25)", 70),
      "linear-gradient(175deg, #0b0a24 0%, #1e1846 45%, #33234f 70%, #3d2a1e 100%)",
    ],
  },
  {
    key: "grain", name: "Paper / Ink", kind: "static", palette: "fixed",
    day: [
      blob("ellipse 80% 70%", "50% 45%", "rgb(255 255 255 / 0.6)", 75),
      "repeating-linear-gradient(115deg, rgb(120 90 50 / 0.035) 0 2px, transparent 2px 6px)",
      solid("#f3ead9"),
    ],
    night: [
      blob("ellipse 80% 70%", "50% 45%", "rgb(60 60 72 / 0.5)", 75),
      "repeating-linear-gradient(115deg, rgb(255 255 255 / 0.025) 0 2px, transparent 2px 6px)",
      solid("#121216"),
    ],
  },
  // ---------- motion (media art: two layers move apart and blend; 16~30s cycles) ----------
  {
    key: "tide", name: "Tide", kind: "motion", palette: "theme", motion: { frames: "tide", seconds: 18, alternate: true },
    day: ["linear-gradient(115deg, hsl({H} 75% 80%) 0%, hsl({H+30} 85% 70%) 25%, hsl({H-20} 90% 66%) 50%, hsl({H+30} 85% 70%) 75%, hsl({H} 75% 80%) 100%)"],
    night: ["linear-gradient(115deg, hsl({H} 65% 14%) 0%, hsl({H+30} 70% 26%) 25%, hsl({H-20} 75% 36%) 50%, hsl({H+30} 70% 26%) 75%, hsl({H} 65% 14%) 100%)"],
  },
  {
    key: "swell", name: "Ocean Swell", kind: "motion", palette: "fixed", motion: { frames: "swell", seconds: 16, alternate: true },
    day: ["linear-gradient(170deg, #9debff 0%, #5ad2ec 35%, #2fb6dc 65%, #3f9fe0 100%)"],
    night: ["linear-gradient(170deg, #0f4766 0%, #11678a 35%, #0f84a0 65%, #2463ad 100%)"],
  },
  {
    key: "iris", name: "Iris", kind: "motion", palette: "theme", motion: { frames: "iris", seconds: 40 },
    day: ["conic-gradient(from 210deg at 30% 40%, hsl({H} 85% 72%), hsl({H+60} 85% 74%), hsl({H+150} 80% 72%), hsl({H+240} 75% 74%), hsl({H} 85% 72%))"],
    night: ["conic-gradient(from 210deg at 30% 40%, hsl({H} 75% 32%), hsl({H+60} 75% 28%), hsl({H+150} 70% 26%), hsl({H+240} 65% 28%), hsl({H} 75% 32%))"],
  },
  {
    key: "liquid", name: "Liquid", kind: "motion", palette: "theme",
    motion: {
      frames: "orbitA", seconds: 24,
      over: {
        frames: "orbitB", seconds: 30, blend: { day: "multiply", night: "screen" },
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
      blob("ellipse 55% 60%", "25% 25%", "hsl({H} 85% 27%)", 70),
      blob("ellipse 50% 55%", "80% 70%", "hsl({H+60} 85% 24%)", 70),
      blob("ellipse 45% 50%", "70% 15%", "hsl({H+140} 80% 22%)", 70),
      solid("hsl({H+20} 55% 11%)"),
    ],
  },
  {
    key: "aurora-flow", name: "Aurora Flow", kind: "motion", palette: "fixed",
    motion: {
      frames: "curtainA", seconds: 20, alternate: true,
      over: {
        frames: "curtainB", seconds: 26, alternate: true, blend: { day: "multiply", night: "screen" },
        day: ["linear-gradient(80deg, transparent 5%, #a6f5d2 18%, transparent 32%, #c7b2ff 48%, transparent 62%, #9fe0ff 78%, transparent 92%)"],
        night: ["linear-gradient(80deg, transparent 5%, rgb(20 210 130 / 0.75) 18%, transparent 32%, rgb(120 70 255 / 0.7) 48%, transparent 62%, rgb(0 170 255 / 0.65) 78%, transparent 92%)"],
      },
    },
    day: [
      "linear-gradient(100deg, #b8f7dd 0%, #9ae6ff 30%, #d4c2ff 60%, #a9f0d0 100%)",
    ],
    night: [
      "linear-gradient(100deg, #0b3a2c 0%, #0d2a55 30%, #2a1a5e 60%, #0d3d36 100%)",
    ],
  },
  {
    key: "plasma", name: "Plasma", kind: "motion", palette: "theme",
    motion: {
      frames: "orbitA", seconds: 28,
      over: {
        frames: "plasmaB", seconds: 22, blend: { day: "multiply", night: "screen" },
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
      frames: "riseA", seconds: 18, alternate: true,
      over: {
        frames: "riseB", seconds: 23, alternate: true, blend: { day: "multiply", night: "screen" },
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
    night: ["linear-gradient(160deg, #3a0d06 0%, #5a1208 40%, #4a0820 75%, #5a2a06 100%)"],
  },
];

/** `{H}` / `{H+40}` → CSS using the theme hue. */
export const resolveHue = (s: string, hue: string = "var(--fantasy-hue, 230)") =>
  s.replace(/\{H([+-]\d+)?\}/g, (_m, off?: string) => (off ? `calc(${hue} ${off[0]} ${off.slice(1)})` : hue));
