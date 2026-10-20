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

export interface CssBackground {
  key: string;
  name: string;
  kind: BgKind;
  palette: BgPalette;
  day: string[];
  night: string[];
  /** motion only: keyframes name (KEYFRAMES) + duration in seconds */
  motion?: { frames: keyof typeof KEYFRAMES; seconds: number; alternate?: boolean };
}

const solid = (c: string) => `linear-gradient(${c}, ${c})`;
const blob = (shape: string, at: string, c: string, fade = 60) => `radial-gradient(${shape} at ${at}, ${c}, transparent ${fade}%)`;

/** Motion keyframes (transform / filter only: the layer is never repainted). */
export const KEYFRAMES = {
  drift: "0% { transform: translate3d(-4%, -2%, 0) rotate(0deg); } 50% { transform: translate3d(3%, 2%, 0) rotate(2deg); } 100% { transform: translate3d(-2%, 4%, 0) rotate(-1deg); }",
  tide: "0% { transform: translate3d(-8%, 0, 0); } 100% { transform: translate3d(8%, 0, 0); }",
  swell: "0% { transform: translate3d(0, -6%, 0) scale(1.02); } 100% { transform: translate3d(0, 6%, 0) scale(1.06); }",
  nebula: "0% { transform: scale(1) rotate(0deg); } 100% { transform: scale(1.1) rotate(5deg); }",
  lava: "0% { transform: translate3d(-5%, 3%, 0) scale(1.04); } 50% { transform: translate3d(4%, -4%, 0) scale(1.12); } 100% { transform: translate3d(-2%, -2%, 0) scale(1.06); }",
  breathe: "0% { transform: scale(1); } 100% { transform: scale(1.12); }",
  iris: "0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(360deg); }",
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
  // ---------- motion ----------
  {
    key: "aurora-drift", name: "Aurora Drift", kind: "motion", palette: "fixed", motion: { frames: "drift", seconds: 60, alternate: true },
    day: [
      blob("ellipse 60% 45%", "22% 30%", "#a8f7d6", 70),
      blob("ellipse 55% 50%", "78% 35%", "#d2c2ff", 70),
      blob("ellipse 70% 40%", "50% 85%", "#b2e8ff", 70),
      solid("#f2fbff"),
    ],
    night: [
      blob("ellipse 60% 40%", "22% 30%", "rgb(25 230 140 / 0.55)", 70),
      blob("ellipse 55% 45%", "78% 35%", "rgb(122 60 255 / 0.5)", 70),
      blob("ellipse 70% 35%", "50% 85%", "rgb(0 194 255 / 0.35)", 70),
      solid("#04060f"),
    ],
  },
  {
    key: "tide", name: "Tide", kind: "motion", palette: "theme", motion: { frames: "tide", seconds: 45, alternate: true },
    day: ["linear-gradient(115deg, hsl({H} 70% 86%) 0%, hsl({H+30} 80% 76%) 30%, hsl({H-20} 85% 70%) 50%, hsl({H+30} 80% 76%) 70%, hsl({H} 70% 86%) 100%)"],
    night: ["linear-gradient(115deg, hsl({H} 60% 8%) 0%, hsl({H+30} 65% 20%) 30%, hsl({H-20} 70% 32%) 50%, hsl({H+30} 65% 20%) 70%, hsl({H} 60% 8%) 100%)"],
  },
  {
    key: "swell", name: "Ocean Swell", kind: "motion", palette: "fixed", motion: { frames: "swell", seconds: 50, alternate: true },
    day: [
      blob("ellipse 80% 30%", "50% 20%", "rgb(255 255 255 / 0.5)", 70),
      "linear-gradient(170deg, #b4f3ff 0%, #6fdcef 45%, #3bbcd9 80%, #2ea3c7 100%)",
    ],
    night: [
      blob("ellipse 40% 25%", "30% 70%", "rgb(25 227 214 / 0.35)", 70),
      blob("ellipse 35% 25%", "72% 45%", "rgb(58 123 255 / 0.3)", 70),
      "linear-gradient(170deg, #031426 0%, #062a45 50%, #0a3d5c 100%)",
    ],
  },
  {
    key: "nebula", name: "Nebula", kind: "motion", palette: "fixed", motion: { frames: "nebula", seconds: 80, alternate: true },
    day: [
      blob("ellipse 45% 80%", "35% 40%", "#ffb6e6", 65),
      blob("ellipse 45% 80%", "65% 60%", "#a9c9ff", 65),
      solid("#f6f1ff"),
    ],
    night: [
      blob("ellipse 40% 71%", "35% 40%", "rgb(123 47 247 / 0.5)", 65),
      blob("ellipse 40% 71%", "65% 60%", "rgb(31 209 249 / 0.3)", 65),
      blob("ellipse 25% 44%", "55% 30%", "rgb(241 7 163 / 0.25)", 65),
      solid("#07020f"),
    ],
  },
  {
    key: "lava", name: "Lava Lamp", kind: "motion", palette: "fixed", motion: { frames: "lava", seconds: 70, alternate: true },
    day: [
      blob("ellipse 30% 53%", "30% 35%", "#ff9a8b", 70),
      blob("ellipse 28% 50%", "70% 60%", "#ffcf8b", 70),
      blob("ellipse 22% 39%", "45% 80%", "#ff8fab", 70),
      solid("#fff1ec"),
    ],
    night: [
      blob("ellipse 30% 53%", "30% 35%", "rgb(255 61 0 / 0.42)", 70),
      blob("ellipse 28% 50%", "70% 60%", "rgb(255 145 0 / 0.3)", 70),
      blob("ellipse 22% 39%", "45% 80%", "rgb(179 0 27 / 0.4)", 70),
      solid("#1a0402"),
    ],
  },
  {
    key: "breathe", name: "Breathe", kind: "motion", palette: "theme", motion: { frames: "breathe", seconds: 40, alternate: true },
    day: [
      blob("ellipse 50% 45%", "50% 50%", "hsl({H} 90% 72%)", 70),
      blob("ellipse 70% 60%", "50% 50%", "hsl({H+40} 80% 82%)", 70),
      solid("hsl({H} 50% 94%)"),
    ],
    night: [
      blob("ellipse 50% 45%", "50% 50%", "hsl({H} 80% 32%)", 70),
      blob("ellipse 70% 60%", "50% 50%", "hsl({H+40} 70% 18%)", 70),
      solid("hsl({H} 45% 6%)"),
    ],
  },
  {
    key: "iris", name: "Iris", kind: "motion", palette: "theme", motion: { frames: "iris", seconds: 120 },
    day: ["conic-gradient(from 210deg at 30% 40%, hsl({H} 85% 74%), hsl({H+60} 85% 78%), hsl({H+150} 80% 76%), hsl({H+240} 75% 78%), hsl({H} 85% 74%))"],
    night: ["conic-gradient(from 210deg at 30% 40%, hsl({H} 75% 30%), hsl({H+60} 75% 24%), hsl({H+150} 70% 22%), hsl({H+240} 65% 24%), hsl({H} 75% 30%))"],
  },
];

/** `{H}` / `{H+40}` → CSS using the theme hue. */
export const resolveHue = (s: string, hue: string = "var(--fantasy-hue, 230)") =>
  s.replace(/\{H([+-]\d+)?\}/g, (_m, off?: string) => (off ? `calc(${hue} ${off[0]} ${off.slice(1)})` : hue));
