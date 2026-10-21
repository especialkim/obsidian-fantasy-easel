"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => FantasyEaselPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian6 = require("obsidian");

// src/apply.ts
var import_obsidian = require("obsidian");

// src/backgrounds.ts
var solid = (c) => `linear-gradient(${c}, ${c})`;
var blob = (shape, at, c, fade = 60) => `radial-gradient(${shape} at ${at}, ${c}, transparent ${fade}%)`;
var motionCss = (layer) => layer.parts.map((p) => `fantasy-easel-${p.frames} ${p.seconds}s ${p.loop ? "linear" : "ease-in-out"} infinite${p.loop ? "" : " alternate"}`).join(", ");
var CSS_BACKGROUNDS = [
  // ---------- theme color ----------
  {
    key: "bloom",
    name: "Bloom",
    kind: "static",
    palette: "theme",
    day: [
      blob("ellipse 70% 60%", "15% 20%", "hsl({H} 90% 72%)"),
      blob("ellipse 60% 60%", "85% 25%", "hsl({H+50} 90% 74%)"),
      blob("ellipse 70% 60%", "70% 90%", "hsl({H-50} 85% 72%)"),
      blob("ellipse 60% 50%", "20% 85%", "hsl({H+120} 80% 78%)"),
      solid("hsl({H} 60% 92%)")
    ],
    night: [
      blob("ellipse 70% 60%", "15% 20%", "hsl({H} 80% 34%)"),
      blob("ellipse 60% 60%", "85% 25%", "hsl({H+50} 80% 30%)"),
      blob("ellipse 70% 60%", "70% 90%", "hsl({H-50} 75% 28%)"),
      blob("ellipse 60% 50%", "20% 85%", "hsl({H+120} 70% 26%)"),
      solid("hsl({H} 45% 7%)")
    ]
  },
  {
    key: "silk",
    name: "Silk",
    kind: "static",
    palette: "theme",
    day: [
      "linear-gradient(180deg, hsl(0 0% 100% / 0.35), transparent 60%)",
      "conic-gradient(from 210deg at 30% 40%, hsl({H} 85% 72%), hsl({H+40} 85% 76%), hsl({H+100} 80% 74%), hsl({H+180} 70% 78%), hsl({H} 85% 72%))"
    ],
    night: [
      "linear-gradient(180deg, hsl({H} 50% 5% / 0.55), transparent 70%)",
      "conic-gradient(from 210deg at 30% 40%, hsl({H} 75% 30%), hsl({H+40} 75% 26%), hsl({H+100} 70% 24%), hsl({H+180} 60% 22%), hsl({H} 75% 30%))"
    ]
  },
  {
    key: "veil",
    name: "Veil",
    kind: "static",
    palette: "theme",
    day: [
      "linear-gradient(100deg, transparent 8%, hsl({H+60} 90% 70% / 0.6) 24%, transparent 38%, hsl({H} 90% 68% / 0.55) 55%, transparent 70%, hsl({H-60} 85% 72% / 0.55) 85%, transparent 96%)",
      "linear-gradient(180deg, hsl({H+20} 70% 90%), hsl({H} 60% 84%))"
    ],
    night: [
      "linear-gradient(100deg, transparent 8%, hsl({H+60} 85% 38% / 0.65) 24%, transparent 38%, hsl({H} 85% 36% / 0.6) 55%, transparent 70%, hsl({H-60} 80% 34% / 0.6) 85%, transparent 96%)",
      "linear-gradient(180deg, hsl({H+20} 50% 6%), hsl({H} 45% 11%))"
    ]
  },
  {
    key: "dusk",
    name: "Dusk",
    kind: "static",
    palette: "theme",
    day: ["linear-gradient(160deg, hsl({H} 85% 78%) 0%, hsl({H+40} 85% 76%) 40%, hsl({H+90} 80% 80%) 75%, hsl({H+130} 70% 86%) 100%)"],
    night: ["linear-gradient(160deg, hsl({H} 75% 34%) 0%, hsl({H+40} 72% 28%) 40%, hsl({H+90} 70% 26%) 75%, hsl({H+130} 65% 22%) 100%)"]
  },
  // ---------- fixed palettes ----------
  {
    key: "horizon",
    name: "Sky",
    kind: "static",
    palette: "fixed",
    day: [
      blob("ellipse 35% 30%", "75% 82%", "#fff3c4", 70),
      "linear-gradient(180deg, #7fb3ff 0%, #b9a7ff 40%, #ffb3c7 70%, #ffd29a 100%)"
    ],
    night: [
      blob("ellipse 16% 28%", "80% 18%", "rgb(190 205 255 / 0.45)", 70),
      blob("ellipse 80% 40%", "50% 100%", "rgb(200 80 160 / 0.5)", 70),
      "linear-gradient(180deg, #1b2a72 0%, #2c2a8c 40%, #55308e 70%, #7a3478 100%)"
    ]
  },
  {
    key: "aurora",
    name: "Aurora",
    kind: "static",
    palette: "fixed",
    day: [
      blob("ellipse 55% 50%", "15% 20%", "#5fe8b0", 70),
      blob("ellipse 55% 55%", "85% 25%", "#a38aff", 70),
      blob("ellipse 60% 50%", "50% 95%", "#66c8ff", 70),
      blob("ellipse 40% 45%", "10% 90%", "#86ee96", 70),
      solid("#b5dde6")
    ],
    night: [
      blob("ellipse 60% 40%", "30% 35%", "rgb(25 230 140 / 0.55)", 65),
      blob("ellipse 55% 45%", "70% 30%", "rgb(122 60 255 / 0.5)", 65),
      blob("ellipse 70% 35%", "50% 78%", "rgb(0 194 255 / 0.35)", 65),
      solid("#04060f")
    ]
  },
  {
    key: "prism",
    name: "Prism / Neon",
    kind: "static",
    palette: "fixed",
    day: ["conic-gradient(from 0deg at 50% 50%, #ff7fcf, #6fd0ff, #8ff07a, #ffd65c, #b48cff, #ff7fcf)"],
    night: [
      blob("ellipse 45% 80%", "50% 50%", "rgb(4 2 12 / 0.75)", 75),
      "conic-gradient(from 0deg at 50% 50%, #8a1166, #116a8a, #3a138a, #8a5a11, #8a1166)"
    ]
  },
  {
    key: "grain",
    name: "Paper / Ink",
    kind: "static",
    palette: "fixed",
    day: [
      blob("ellipse 80% 70%", "50% 45%", "rgb(255 255 255 / 0.6)", 75),
      "repeating-linear-gradient(115deg, rgb(120 90 50 / 0.035) 0 2px, transparent 2px 6px)",
      solid("#f3ead9")
    ],
    night: [
      blob("ellipse 45% 55%", "20% 30%", "rgb(95 110 200 / 0.6)", 70),
      blob("ellipse 40% 50%", "80% 70%", "rgb(150 90 170 / 0.5)", 70),
      "repeating-linear-gradient(115deg, rgb(255 255 255 / 0.03) 0 2px, transparent 2px 6px)",
      "linear-gradient(160deg, #46507a 0%, #3c4466 50%, #4a3c66 100%)"
    ]
  },
  // ---------- new (2026-10-21): edge-to-edge, contrast target 5.0~6.0 ----------
  {
    key: "stained",
    name: "Stained Glass",
    kind: "static",
    palette: "theme",
    day: [
      blob("ellipse 70% 70%", "38% 46%", "hsl({H} 60% 96% / 0.35)", 70),
      "repeating-conic-gradient(from 15deg at 38% 46%, hsl({H} 85% 70%) 0deg 22deg, hsl({H+70} 85% 76%) 22deg 47deg, hsl({H+160} 80% 72%) 47deg 75deg, hsl({H+240} 85% 76%) 75deg 100deg)"
    ],
    night: [
      blob("ellipse 70% 70%", "38% 46%", "hsl({H} 60% 8% / 0.35)", 70),
      "repeating-conic-gradient(from 15deg at 38% 46%, hsl({H} 80% 30%) 0deg 22deg, hsl({H+70} 80% 25%) 22deg 47deg, hsl({H+160} 75% 27%) 47deg 75deg, hsl({H+240} 80% 25%) 75deg 100deg)"
    ]
  },
  {
    key: "ripple",
    name: "Ripple",
    kind: "static",
    palette: "theme",
    day: [
      "repeating-radial-gradient(circle at 18% 80%, hsl({H+120} 85% 74% / 0.55) 0 4%, transparent 4% 9%)",
      "repeating-radial-gradient(circle at 75% 25%, hsl({H} 85% 70%) 0 6%, hsl({H+50} 85% 78%) 6% 12%)"
    ],
    night: [
      "repeating-radial-gradient(circle at 18% 80%, hsl({H+120} 80% 30% / 0.55) 0 4%, transparent 4% 9%)",
      "repeating-radial-gradient(circle at 75% 25%, hsl({H} 80% 30%) 0 6%, hsl({H+50} 75% 22%) 6% 12%)"
    ]
  },
  {
    key: "holo",
    name: "Holo",
    kind: "static",
    palette: "fixed",
    day: [
      blob("ellipse 45% 55%", "0% 0%", "#ff6fc0", 75),
      blob("ellipse 45% 55%", "50% 0%", "#6fd8ff", 75),
      blob("ellipse 45% 55%", "100% 0%", "#a0f06a", 75),
      blob("ellipse 45% 55%", "0% 100%", "#a080ff", 75),
      blob("ellipse 45% 55%", "50% 100%", "#ffb46a", 75),
      blob("ellipse 45% 55%", "100% 100%", "#6fe8c8", 75),
      solid("#c8bdf0")
    ],
    night: [
      blob("ellipse 45% 55%", "0% 0%", "#a0306e", 75),
      blob("ellipse 45% 55%", "50% 0%", "#1d6f92", 75),
      blob("ellipse 45% 55%", "100% 0%", "#4a7a1f", 75),
      blob("ellipse 45% 55%", "0% 100%", "#4b2a9a", 75),
      blob("ellipse 45% 55%", "50% 100%", "#9a5a1d", 75),
      blob("ellipse 45% 55%", "100% 100%", "#1d7f6a", 75),
      solid("#241a40")
    ]
  },
  {
    key: "sunburst",
    name: "Sunburst",
    kind: "static",
    palette: "fixed",
    day: [
      blob("ellipse 60% 45%", "50% 100%", "rgb(255 241 201 / 0.6)", 70),
      "repeating-conic-gradient(from 0deg at 50% 115%, #ff9a4a 0deg 7deg, #ff7060 7deg 14deg, #ffad85 14deg 21deg)"
    ],
    night: [
      blob("ellipse 60% 45%", "50% 100%", "rgb(255 140 90 / 0.4)", 70),
      "repeating-conic-gradient(from 0deg at 50% 115%, #5e2a80 0deg 7deg, #4a2272 7deg 14deg, #74307a 14deg 21deg)"
    ]
  },
  {
    key: "marble",
    name: "Marble",
    kind: "static",
    palette: "theme",
    day: [
      "linear-gradient(35deg, transparent 18%, hsl({H+40} 75% 66% / 0.7) 24%, transparent 30%, transparent 58%, hsl({H-30} 70% 70% / 0.6) 64%, transparent 70%)",
      "linear-gradient(-20deg, transparent 30%, hsl({H+150} 70% 72% / 0.55) 38%, transparent 46%, transparent 76%, hsl({H} 80% 68% / 0.6) 82%, transparent 88%)",
      "linear-gradient(160deg, hsl({H} 55% 84%), hsl({H+30} 50% 80%))"
    ],
    night: [
      "linear-gradient(35deg, transparent 18%, hsl({H+40} 70% 36% / 0.75) 24%, transparent 30%, transparent 58%, hsl({H-30} 65% 34% / 0.7) 64%, transparent 70%)",
      "linear-gradient(-20deg, transparent 30%, hsl({H+150} 65% 32% / 0.6) 38%, transparent 46%, transparent 76%, hsl({H} 75% 36% / 0.65) 82%, transparent 88%)",
      "linear-gradient(160deg, hsl({H} 45% 17%), hsl({H+30} 40% 14%))"
    ]
  },
  // ---------- motion (media art: two layers move apart and blend; 16~30s cycles) ----------
  {
    key: "tide",
    name: "Tide",
    kind: "motion",
    palette: "theme",
    motion: { parts: [{ frames: "tideX", seconds: 17 }, { frames: "pulseB", seconds: 23 }, { frames: "hue", seconds: 29 }] },
    day: ["linear-gradient(115deg, hsl({H} 75% 80%) 0%, hsl({H+30} 85% 70%) 25%, hsl({H-20} 90% 66%) 50%, hsl({H+30} 85% 70%) 75%, hsl({H} 75% 80%) 100%)"],
    night: ["linear-gradient(115deg, hsl({H} 65% 14%) 0%, hsl({H+30} 70% 26%) 25%, hsl({H-20} 75% 36%) 50%, hsl({H+30} 70% 26%) 75%, hsl({H} 65% 14%) 100%)"]
  },
  {
    key: "swell",
    name: "Ocean Swell",
    kind: "motion",
    palette: "fixed",
    motion: { parts: [{ frames: "swellY", seconds: 15 }, { frames: "wanderC", seconds: 31 }, { frames: "pulse", seconds: 19 }] },
    day: ["linear-gradient(170deg, #9debff 0%, #5ad2ec 35%, #2fb6dc 65%, #3f9fe0 100%)"],
    night: ["linear-gradient(170deg, #0f4766 0%, #11678a 35%, #0f84a0 65%, #2463ad 100%)"]
  },
  {
    key: "iris",
    name: "Iris",
    kind: "motion",
    palette: "theme",
    motion: { parts: [{ frames: "hueFull", seconds: 37, loop: true }, { frames: "wanderA", seconds: 41 }, { frames: "sway", seconds: 29 }] },
    day: ["conic-gradient(from 210deg at 30% 40%, hsl({H} 85% 72%), hsl({H+60} 85% 74%), hsl({H+150} 80% 72%), hsl({H+240} 75% 74%), hsl({H} 85% 72%))"],
    night: ["conic-gradient(from 210deg at 30% 40%, hsl({H} 75% 32%), hsl({H+60} 75% 28%), hsl({H+150} 70% 26%), hsl({H+240} 65% 28%), hsl({H} 75% 32%))"]
  },
  {
    key: "liquid",
    name: "Liquid",
    kind: "motion",
    palette: "theme",
    motion: {
      parts: [{ frames: "wanderA", seconds: 23 }, { frames: "sway", seconds: 31 }, { frames: "pulseB", seconds: 19 }],
      over: {
        parts: [{ frames: "wanderB", seconds: 29 }, { frames: "swayB", seconds: 37 }, { frames: "pulse", seconds: 17 }, { frames: "hue", seconds: 41 }],
        blend: { day: "multiply", night: "screen" },
        day: [
          blob("ellipse 45% 55%", "70% 30%", "hsl({H+30} 95% 72%)", 70),
          blob("ellipse 40% 50%", "25% 75%", "hsl({H-70} 95% 74%)", 70),
          blob("ellipse 35% 45%", "55% 55%", "hsl({H+200} 90% 78%)", 70),
          solid("hsl({H} 40% 100% / 0)")
        ],
        night: [
          blob("ellipse 45% 55%", "70% 30%", "hsl({H+30} 80% 24%)", 70),
          blob("ellipse 40% 50%", "25% 75%", "hsl({H-70} 80% 22%)", 70),
          blob("ellipse 35% 45%", "55% 55%", "hsl({H+200} 75% 21%)", 70),
          solid("hsl({H} 40% 0% / 0)")
        ]
      }
    },
    day: [
      blob("ellipse 55% 60%", "25% 25%", "hsl({H} 90% 68%)", 70),
      blob("ellipse 50% 55%", "80% 70%", "hsl({H+60} 90% 70%)", 70),
      blob("ellipse 45% 50%", "70% 15%", "hsl({H+140} 85% 74%)", 70),
      solid("hsl({H+20} 70% 82%)")
    ],
    night: [
      blob("ellipse 55% 60%", "25% 25%", "hsl({H} 85% 27%)", 70),
      blob("ellipse 50% 55%", "80% 70%", "hsl({H+60} 85% 24%)", 70),
      blob("ellipse 45% 50%", "70% 15%", "hsl({H+140} 80% 22%)", 70),
      solid("hsl({H+20} 55% 11%)")
    ]
  },
  {
    key: "aurora-flow",
    name: "Aurora Flow",
    kind: "motion",
    palette: "fixed",
    motion: {
      parts: [{ frames: "tideX", seconds: 19 }, { frames: "swayB", seconds: 29 }, { frames: "pulseB", seconds: 23 }],
      over: {
        parts: [{ frames: "wanderB", seconds: 26 }, { frames: "hue", seconds: 31 }, { frames: "pulse", seconds: 17 }],
        blend: { day: "multiply", night: "screen" },
        day: ["linear-gradient(80deg, transparent 5%, #a6f5d2 18%, transparent 32%, #c7b2ff 48%, transparent 62%, #9fe0ff 78%, transparent 92%)"],
        night: ["linear-gradient(80deg, transparent 5%, rgb(20 210 130 / 0.75) 18%, transparent 32%, rgb(120 70 255 / 0.7) 48%, transparent 62%, rgb(0 170 255 / 0.65) 78%, transparent 92%)"]
      }
    },
    day: [
      "linear-gradient(100deg, #b8f7dd 0%, #9ae6ff 30%, #d4c2ff 60%, #a9f0d0 100%)"
    ],
    night: [
      "linear-gradient(100deg, #0b3a2c 0%, #0d2a55 30%, #2a1a5e 60%, #0d3d36 100%)"
    ]
  },
  {
    key: "plasma",
    name: "Plasma",
    kind: "motion",
    palette: "theme",
    motion: {
      parts: [{ frames: "wanderC", seconds: 29 }, { frames: "sway", seconds: 23 }, { frames: "pulse", seconds: 19 }],
      over: {
        parts: [{ frames: "wanderA", seconds: 22 }, { frames: "hueFull", seconds: 47, loop: true }, { frames: "swayB", seconds: 31 }, { frames: "pulseB", seconds: 17 }],
        blend: { day: "multiply", night: "screen" },
        day: ["conic-gradient(from 90deg at 60% 45%, hsl({H+120} 90% 78%), hsl({H+200} 90% 80%), hsl({H+300} 90% 78%), hsl({H+120} 90% 78%))"],
        night: ["conic-gradient(from 90deg at 60% 45%, hsl({H+120} 80% 24%), hsl({H+200} 80% 22%), hsl({H+300} 80% 24%), hsl({H+120} 80% 24%))"]
      }
    },
    day: ["conic-gradient(from 0deg at 35% 55%, hsl({H} 90% 70%), hsl({H+90} 90% 72%), hsl({H+180} 85% 70%), hsl({H+270} 90% 72%), hsl({H} 90% 70%))"],
    night: ["conic-gradient(from 0deg at 35% 55%, hsl({H} 80% 28%), hsl({H+90} 80% 26%), hsl({H+180} 75% 24%), hsl({H+270} 80% 26%), hsl({H} 80% 28%))"]
  },
  {
    key: "lava",
    name: "Lava",
    kind: "motion",
    palette: "fixed",
    motion: {
      parts: [{ frames: "swellY", seconds: 18 }, { frames: "pulseB", seconds: 13 }, { frames: "sway", seconds: 27 }],
      over: {
        parts: [{ frames: "wanderB", seconds: 23 }, { frames: "pulse", seconds: 16 }, { frames: "hue", seconds: 33 }],
        blend: { day: "multiply", night: "screen" },
        day: [
          blob("ellipse 30% 45%", "30% 60%", "#ffb38a", 70),
          blob("ellipse 28% 40%", "72% 35%", "#ff8fb0", 70),
          solid("rgb(255 255 255 / 0)")
        ],
        night: [
          blob("ellipse 30% 45%", "30% 60%", "rgb(255 90 20 / 0.7)", 70),
          blob("ellipse 28% 40%", "72% 35%", "rgb(230 20 90 / 0.6)", 70),
          solid("rgb(0 0 0 / 0)")
        ]
      }
    },
    day: ["linear-gradient(160deg, #ffc58a 0%, #ff9b8a 40%, #ff86a8 75%, #ffb36b 100%)"],
    night: ["linear-gradient(160deg, #3a0d06 0%, #5a1208 40%, #4a0820 75%, #5a2a06 100%)"]
  }
];

// src/catalog.ts
var THEME_COLORS = [
  { cls: "fantasy-theme-MochaBrown", name: "Mocha Brown" },
  { cls: "fantasy-theme-OceanTeal", name: "Ocean Teal" },
  { cls: "fantasy-theme-MysticPurple", name: "Mystic Purple" },
  { cls: "fantasy-theme-SkyBlue", name: "Sky Blue" },
  { cls: "fantasy-theme-EmeraldGreen", name: "Emerald Green" },
  { cls: "fantasy-theme-ForestGreen", name: "Forest Green" },
  { cls: "fantasy-theme-TangerineOrange", name: "Tangerine Orange" },
  { cls: "fantasy-theme-BurntSienna", name: "Burnt Sienna" },
  { cls: "fantasy-theme-ChiliPepper", name: "Chili Pepper" },
  { cls: "fantasy-theme-OrchidMagenta", name: "Orchid Magenta" },
  { cls: "fantasy-theme-Black", name: "Dark" }
];
var CSS_BG = CSS_BACKGROUNDS.map((b) => ({ id: `css-${b.key}`, name: b.name, kind: b.kind, palette: b.palette, cls: `fantasy-easel-bg-${b.key}` }));
function toCssUrl(src) {
  const s = src.trim();
  if (!s) return "";
  if (/^url\(/i.test(s)) return s;
  return `url("${s.replace(/["\\]/g, "\\$&")}")`;
}
var imageBackgrounds = (images) => images.map((img, i) => ({ id: `img-${img.id}`, name: `Picture ${i + 1}`, kind: "image", url: toCssUrl(img.src) })).filter((b) => b.url);
var allBackgrounds = (images) => [...CSS_BG, ...imageBackgrounds(images)];
var newImageId = () => Math.random().toString(36).slice(2, 8);
var ACCENT_CLASS = "fantasy-theme-accent";
var CARD_OFF_CLASS = "fantasy-theme-card-off";
var LEGACY_CARD_CLASS = "fantasy-theme-card-layout";
var MARKER_CLASS = "fantasy-easel";
var STILL_CLASS = "fantasy-easel-still";
var FORCE_MOTION_CLASS = "fantasy-easel-force-motion";
var MOTION_CLASS = "fantasy-easel-motion";
var SS_SECTION = "Fantasy-theme-settings";
var SS_KEYS = {
  color: "fantasy-theme",
  /** removed from the theme (2026-10-21); read once to bring old custom pictures over */
  background: "fantasy-theme-background",
  accent: "fantasy-theme-accent",
  cardOff: "fantasy-theme-card-off",
  /** old toggle (on = card layout); read on import if the new one was never saved */
  cardLegacy: "fantasy-theme-card-layout",
  url: ["background-url1", "background-url2", "background-url3"]
};
var THEME_DEFAULTS = {
  color: "fantasy-theme-Black"
};
var DEFAULT_BACKGROUND = "css-plasma";
var colorByCls = (cls) => THEME_COLORS.find((c) => c.cls === cls);
var backgroundById = (id, images = []) => allBackgrounds(images).find((b) => b.id === id);

// src/apply.ts
var MANAGED = /* @__PURE__ */ new Set([...THEME_COLORS.map((c) => c.cls), ...CSS_BG.map((b) => b.cls), ACCENT_CLASS, CARD_OFF_CLASS, LEGACY_CARD_CLASS, MARKER_CLASS, STILL_CLASS, MOTION_CLASS, FORCE_MOTION_CLASS]);
var THEME_GROUP = [...THEME_COLORS.map((c) => c.cls), ACCENT_CLASS, CARD_OFF_CLASS, LEGACY_CARD_CLASS];
var URL_VAR = "--background-url";
var OLD_VARS = ["--background-url1", "--background-url2", "--background-url3"];
function wantedClasses(s) {
  const bg = backgroundById(s.look.background, s.look.images);
  const out = /* @__PURE__ */ new Set([MARKER_CLASS, s.look.color]);
  if (bg?.cls) out.add(bg.cls);
  if (bg?.kind === "motion") out.add(MOTION_CLASS);
  if (s.look.accent) out.add(ACCENT_CLASS);
  if (!s.look.card) out.add(CARD_OFF_CLASS);
  if (s.motion === "off") out.add(STILL_CLASS);
  if (s.motion === "on") out.add(FORCE_MOTION_CLASS);
  return out;
}
var Applier = class {
  constructor(body, get) {
    this.body = body;
    this.get = get;
    this.observer = null;
    this.hits = [];
    /** reconcile runs (for tests: settled = no new runs) */
    this.runs = 0;
  }
  attach() {
    this.observer = new MutationObserver(() => this.onMutation());
    this.observer.observe(this.body, { attributes: true, attributeFilter: ["class"], subtree: false });
    this.reconcile();
  }
  /** Bring body in line with the wanted state. Returns how many changes were made. */
  reconcile() {
    const s = this.get();
    const want = wantedClasses(s);
    const cl = this.body.classList;
    let changed = 0;
    for (const c of MANAGED) {
      const has = cl.contains(c);
      if (want.has(c) && !has) {
        cl.add(c);
        changed++;
      } else if (!want.has(c) && has) {
        cl.remove(c);
        changed++;
      }
    }
    const value = backgroundById(s.look.background, s.look.images)?.url ?? "";
    const now = this.body.style.getPropertyValue(URL_VAR);
    if (value && now !== value) {
      this.body.style.setProperty(URL_VAR, value);
      changed++;
    } else if (!value && now) {
      this.body.style.removeProperty(URL_VAR);
      changed++;
    }
    for (const v of OLD_VARS) if (this.body.style.getPropertyValue(v)) {
      this.body.style.removeProperty(v);
      changed++;
    }
    this.observer?.takeRecords();
    if (changed) this.runs++;
    return changed;
  }
  onMutation() {
    const now = Date.now();
    this.hits = this.hits.filter((t) => now - t < 1e3);
    this.hits.push(now);
    if (this.hits.length > 10) {
      this.observer?.disconnect();
      this.observer = null;
      console.warn("[fantasy-easel] body classes keep changing (10+ times in 1s). Stopped keeping the Fantasy look.");
      new import_obsidian.Notice("Fantasy Easel: another plugin keeps changing the theme classes. Stopped syncing. Reload Fantasy Easel to retry.");
      return;
    }
    this.reconcile();
  }
  /**
   * Hand the look back. Only Easel's own things are removed (the theme shows Plasma, still);
   * if Style Settings is on, it re-applies its own values on `parse-style-settings`.
   */
  detach(styleSettings) {
    this.observer?.disconnect();
    this.observer = null;
    const cl = this.body.classList;
    for (const b of CSS_BG) cl.remove(b.cls);
    cl.remove(MARKER_CLASS, STILL_CLASS, MOTION_CLASS, FORCE_MOTION_CLASS);
    for (const v of [URL_VAR, ...OLD_VARS]) this.body.style.removeProperty(v);
    if (styleSettings.enabled) styleSettings.trigger();
    else for (const c of THEME_GROUP) cl.remove(c);
  }
};

// src/gallery.ts
var import_obsidian2 = require("obsidian");
var GROUPS = [
  { title: "Theme color", desc: "Follows the theme color.", pick: (b) => b.kind === "static" && b.palette === "theme" },
  { title: "Fixed palette", desc: "Same colors with any theme color.", pick: (b) => b.kind === "static" && b.palette === "fixed" },
  { title: "Motion", desc: "Moves slowly. Pauses when the window is not focused.", pick: (b) => b.kind === "motion" }
];
var GalleryModal = class extends import_obsidian2.Modal {
  constructor(app, store, managePictures) {
    super(app);
    this.store = store;
    this.managePictures = managePictures;
    this.unsubscribe = null;
  }
  onOpen() {
    this.modalEl.addClass("fantasy-easel-gallery-modal");
    this.setTitle("Backgrounds");
    this.unsubscribe = this.store.subscribe(() => this.markCurrent());
    const root = this.contentEl.createDiv({ cls: "fantasy-easel-gallery" });
    const { motion } = this.store.settings;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const moving = motion === "on" || motion === "auto" && !reduced;
    root.toggleClass("is-still", !moving);
    const head = root.createDiv({ cls: "fantasy-easel-gallery-head" });
    head.createSpan({ text: "Day" });
    head.createSpan({ text: "Night" });
    for (const g of GROUPS) {
      const section2 = root.createDiv({ cls: "fantasy-easel-gallery-group" });
      section2.createDiv({ cls: "fantasy-easel-gallery-title", text: g.title });
      section2.createDiv({ cls: "fantasy-easel-gallery-desc setting-item-description", text: g.desc });
      for (const b of CSS_BACKGROUNDS.filter(g.pick)) {
        const row = section2.createDiv({ cls: "fantasy-easel-gallery-row", attr: { "data-id": `css-${b.key}` } });
        const label = row.createDiv({ cls: "fantasy-easel-gallery-name" });
        label.createSpan({ text: b.name });
        const check = label.createSpan({ cls: "fantasy-easel-gallery-check" });
        (0, import_obsidian2.setIcon)(check, "check");
        for (const side of ["day", "night"]) {
          const tile = row.createDiv({ cls: `fantasy-easel-tile fantasy-easel-${side}`, attr: { "aria-label": `${b.name} (${side})`, role: "button", tabindex: "0" } });
          const layer = tile.createDiv({ cls: "fantasy-easel-tile-layer" });
          layer.style.setProperty("background-image", `var(--fantasy-easel-grad-${b.key})`);
          if (b.motion) layer.style.setProperty("animation", motionCss(b.motion));
          if (b.motion?.over) {
            const over = tile.createDiv({ cls: "fantasy-easel-tile-layer" });
            over.style.setProperty("background-image", `var(--fantasy-easel-grad-${b.key}-b)`);
            over.style.setProperty("mix-blend-mode", `var(--fantasy-easel-blend-${b.key})`);
            over.style.setProperty("animation", motionCss(b.motion.over));
          }
          const card = tile.createDiv({ cls: "fantasy-easel-tile-card" });
          card.createDiv({ cls: "fantasy-easel-tile-h", text: "Heading" });
          card.createDiv({ cls: "fantasy-easel-tile-p", text: "Body text on the glass card." });
          tile.addEventListener("click", () => this.store.setLook({ background: `css-${b.key}` }));
          tile.addEventListener("keydown", (ev) => {
            if (ev.key === "Enter" || ev.key === " ") {
              ev.preventDefault();
              this.store.setLook({ background: `css-${b.key}` });
            }
          });
        }
      }
    }
    const mine = imageBackgrounds(this.store.settings.look.images);
    const section = root.createDiv({ cls: "fantasy-easel-gallery-group" });
    section.createDiv({ cls: "fantasy-easel-gallery-title", text: "Your pictures" });
    const desc = section.createDiv({ cls: "fantasy-easel-gallery-desc setting-item-description", text: "Added in settings with +. Same picture in day and night." });
    if (this.managePictures) {
      const add = desc.createEl("button", { cls: "fantasy-easel-gallery-add", text: "Add picture" });
      add.addEventListener("click", () => {
        this.close();
        this.managePictures?.();
      });
    }
    for (const b of mine) {
      const row = section.createDiv({ cls: "fantasy-easel-gallery-row", attr: { "data-id": b.id } });
      const label = row.createDiv({ cls: "fantasy-easel-gallery-name" });
      label.createSpan({ text: b.name });
      const check = label.createSpan({ cls: "fantasy-easel-gallery-check" });
      (0, import_obsidian2.setIcon)(check, "check");
      for (const side of ["day", "night"]) {
        const tile = row.createDiv({ cls: `fantasy-easel-tile fantasy-easel-${side}`, attr: { "aria-label": `${b.name} (${side})`, role: "button", tabindex: "0" } });
        const layer = tile.createDiv({ cls: "fantasy-easel-tile-layer" });
        layer.style.setProperty("background-image", b.url);
        const card = tile.createDiv({ cls: "fantasy-easel-tile-card" });
        card.createDiv({ cls: "fantasy-easel-tile-h", text: "Heading" });
        card.createDiv({ cls: "fantasy-easel-tile-p", text: "Body text on the glass card." });
        tile.addEventListener("click", () => this.store.setLook({ background: b.id }));
        tile.addEventListener("keydown", (ev) => {
          if (ev.key === "Enter" || ev.key === " ") {
            ev.preventDefault();
            this.store.setLook({ background: b.id });
          }
        });
      }
    }
    this.markCurrent();
    root.querySelector(".fantasy-easel-gallery-row.is-current")?.scrollIntoView({ block: "center" });
  }
  markCurrent() {
    const id = this.store.settings.look.background;
    this.contentEl.querySelectorAll(".fantasy-easel-gallery-row").forEach((r) => r.toggleClass("is-current", r.dataset.id === id));
  }
  onClose() {
    this.unsubscribe?.();
    this.unsubscribe = null;
    this.contentEl.empty();
  }
};

// src/menus.ts
var import_obsidian3 = require("obsidian");
var KIND_LABEL = { static: "CSS \xB7 static", motion: "CSS \xB7 motion", image: "Your pictures" };
function colorMenu(store) {
  const menu = new import_obsidian3.Menu();
  for (const c of THEME_COLORS) {
    menu.addItem(
      (item) => item.setTitle(c.name).setChecked(store.settings.look.color === c.cls).onClick(() => store.setLook({ color: c.cls }))
    );
  }
  return menu;
}
function backgroundMenu(store, managePictures) {
  const menu = new import_obsidian3.Menu();
  const all = allBackgrounds(store.settings.look.images);
  for (const kind of ["static", "motion", "image"]) {
    const list = all.filter((b) => b.kind === kind);
    if (kind === "image" && !list.length && !managePictures) continue;
    if (kind !== "static") menu.addSeparator();
    menu.addItem((item) => item.setTitle(KIND_LABEL[kind]).setIsLabel(true));
    for (const b of list) {
      menu.addItem(
        (item) => item.setTitle(b.name).setChecked(store.settings.look.background === b.id).onClick(() => store.setLook({ background: b.id }))
      );
    }
    if (kind === "image" && managePictures) menu.addItem((item) => item.setTitle("Add picture\u2026").setIcon("plus").onClick(managePictures));
  }
  return menu;
}
function stepBackground(store, dir) {
  const all = allBackgrounds(store.settings.look.images);
  const i = all.findIndex((b) => b.id === store.settings.look.background);
  const next = all[(i + dir + all.length) % all.length];
  store.setLook({ background: next.id });
}

// src/settings.ts
var MOTIONS = ["auto", "on", "off"];
var DEFAULT_LOOK = {
  color: THEME_DEFAULTS.color,
  background: DEFAULT_BACKGROUND,
  accent: false,
  card: true,
  images: []
};
var DEFAULT_SETTINGS = { look: DEFAULT_LOOK, motion: "auto", statusBar: true };
var SS_DATA = (app) => `${app.vault.configDir}/plugins/obsidian-style-settings/data.json`;
async function readStyleSettingsLook(app) {
  let raw = {};
  let found = false;
  try {
    const path = SS_DATA(app);
    if (await app.vault.adapter.exists(path)) {
      raw = JSON.parse(await app.vault.adapter.read(path));
      found = Object.keys(raw).some((k) => k.startsWith(`${SS_SECTION}@@`));
    }
  } catch (e) {
    console.warn("[fantasy-easel] could not read Style Settings data", e);
  }
  const get = (key) => raw[`${SS_SECTION}@@${key}`];
  const color = typeof get(SS_KEYS.color) === "string" && colorByCls(get(SS_KEYS.color)) ? get(SS_KEYS.color) : DEFAULT_LOOK.color;
  const old = fromOldUrls(SS_KEYS.url.map((k) => get(k)), get(SS_KEYS.background));
  return {
    found,
    look: {
      color,
      background: old.background ?? DEFAULT_LOOK.background,
      accent: get(SS_KEYS.accent) === true,
      // new toggle = "card off"; else the old "card on" toggle; else the theme default (on)
      card: typeof get(SS_KEYS.cardOff) === "boolean" ? get(SS_KEYS.cardOff) !== true : typeof get(SS_KEYS.cardLegacy) === "boolean" ? get(SS_KEYS.cardLegacy) === true : true,
      images: old.images
    }
  };
}
function fromOldUrls(urls, chosen) {
  const images = [];
  let background;
  const pick = typeof chosen === "string" ? chosen.replace("fantasy-theme-background-", "") : "";
  urls.forEach((u, i) => {
    if (typeof u !== "string" || !u.trim()) return;
    const img = { id: newImageId(), src: u.trim() };
    images.push(img);
    if (pick === `custom${i + 1}`) background = `img-${img.id}`;
  });
  return { images, background };
}
function normalize(data) {
  const look = data?.look ?? {};
  let images = Array.isArray(look.images) ? look.images.filter((x) => !!x && typeof x.id === "string" && typeof x.src === "string").map((x) => ({ id: x.id, src: x.src })) : [];
  let background = typeof look.background === "string" ? look.background : "";
  if (!Array.isArray(look.images) && Array.isArray(look.urls)) {
    const old = fromOldUrls(look.urls, background);
    images = old.images;
    if (old.background) background = old.background;
  }
  return {
    look: {
      color: typeof look.color === "string" && colorByCls(look.color) ? look.color : DEFAULT_LOOK.color,
      background: backgroundById(background, images) ? background : DEFAULT_LOOK.background,
      accent: look.accent === true,
      card: look.card !== false,
      images
    },
    motion: MOTIONS.includes(data?.motion) ? data.motion : "auto",
    statusBar: data?.statusBar !== false
  };
}

// src/settings-tab.ts
var import_obsidian4 = require("obsidian");
var FantasyEaselSettingTab = class extends import_obsidian4.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
    this.unsubscribe = null;
    this.queued = false;
    /** after +: focus the new picture field once */
    this.focusLast = false;
  }
  display() {
    if (!this.unsubscribe) this.unsubscribe = this.plugin.store.subscribe(() => this.queueRender());
    this.render();
  }
  /** One redraw after the current event (several changes in one click redraw once). */
  queueRender() {
    if (this.queued) return;
    this.queued = true;
    queueMicrotask(() => {
      this.queued = false;
      if (this.unsubscribe) this.render();
    });
  }
  render() {
    const { containerEl } = this;
    const store = this.plugin.store;
    const { look, motion, statusBar } = store.settings;
    containerEl.empty();
    containerEl.addClass("fantasy-easel-settings");
    containerEl.createEl("p", {
      cls: "setting-item-description",
      text: `While Fantasy Easel is on, it owns the Fantasy look. Changes made in Style Settings' Fantasy section are put back right away. Use "Import from Style Settings" below to take those values.`
    });
    new import_obsidian4.Setting(containerEl).setName("Theme color").setDesc(colorByCls(look.color)?.name ?? look.color).addButton((b) => b.setButtonText("Change").onClick((ev) => colorMenu(store).showAtMouseEvent(ev)));
    const bg = backgroundById(look.background, look.images);
    new import_obsidian4.Setting(containerEl).setName("Background").setDesc(bg ? `${bg.name} (${bg.kind === "image" ? "your picture" : `CSS \xB7 ${bg.kind}`})` : look.background).addButton((b) => b.setButtonText("Gallery").onClick(() => new GalleryModal(this.app, store).open())).addButton((b) => b.setButtonText("Change").onClick((ev) => backgroundMenu(store).showAtMouseEvent(ev)));
    new import_obsidian4.Setting(containerEl).setName("Theme accent").setDesc("Use the theme color as the accent.").addToggle((t) => t.setValue(look.accent).onChange((v) => store.setLook({ accent: v })));
    new import_obsidian4.Setting(containerEl).setName("Card layout").addToggle((t) => t.setValue(look.card).onChange((v) => store.setLook({ card: v })));
    new import_obsidian4.Setting(containerEl).setName("Your pictures").setDesc('A picture URL (https://\u2026) or a CSS value like url("\u2026"). Add as many as you like with +.').setHeading().addExtraButton((b) => b.setIcon("plus").setTooltip("Add picture").onClick(() => {
      store.setLook({ images: [...store.settings.look.images, { id: newImageId(), src: "" }] });
      this.focusLast = true;
    }));
    look.images.forEach((img, i) => {
      const id = `img-${img.id}`;
      const usable = !!toCssUrl(img.src);
      const row = new import_obsidian4.Setting(containerEl).setClass("fantasy-easel-picture").setName(`Picture ${i + 1}`);
      row.addText((t) => {
        t.setValue(img.src).setPlaceholder("https://\u2026");
        t.inputEl.addEventListener("change", () => {
          const src = t.getValue().trim();
          const images = store.settings.look.images.map((x) => x.id === img.id ? { ...x, src } : x);
          const patch = !src && store.settings.look.background === id ? { images, background: DEFAULT_BACKGROUND } : { images };
          store.setLook(patch);
        });
        if (this.focusLast && i === look.images.length - 1) {
          this.focusLast = false;
          window.setTimeout(() => t.inputEl.focus(), 0);
        }
      });
      row.addButton((b) => {
        b.setButtonText(look.background === id ? "In use" : "Use").setDisabled(!usable || look.background === id).onClick(() => store.setLook({ background: id }));
        if (look.background === id) b.setCta();
      });
      row.addExtraButton((b) => b.setIcon("trash-2").setTooltip("Remove").onClick(() => {
        const images = store.settings.look.images.filter((x) => x.id !== img.id);
        store.setLook(store.settings.look.background === id ? { images, background: DEFAULT_BACKGROUND } : { images });
      }));
    });
    new import_obsidian4.Setting(containerEl).setName("Motion backgrounds").setDesc(`Auto follows the OS "reduce motion" setting${window.matchMedia("(prefers-reduced-motion: reduce)").matches ? " (on here, so motion is paused)" : ""}. On moves anyway. All pause while the window is not focused.`).addButton((b) => b.setButtonText(motion === "auto" ? "Auto" : motion === "on" ? "On" : "Off").onClick((ev) => {
      const menu = new import_obsidian4.Menu();
      for (const m of MOTIONS) menu.addItem((i) => i.setTitle(m === "auto" ? "Auto" : m === "on" ? "On" : "Off").setChecked(m === motion).onClick(() => store.set({ motion: m })));
      menu.showAtMouseEvent(ev);
    }));
    new import_obsidian4.Setting(containerEl).setName("Status bar buttons").setDesc("Quick controls for trying looks.").addToggle((t) => t.setValue(statusBar).onChange((v) => store.set({ statusBar: v })));
    new import_obsidian4.Setting(containerEl).setName("Import from Style Settings").setDesc("Take the Fantasy values saved in Style Settings.").addButton((b) => b.setButtonText("Import").onClick(() => void this.plugin.importFromStyleSettings()));
  }
  hide() {
    this.unsubscribe?.();
    this.unsubscribe = null;
  }
};

// src/statusbar.ts
var import_obsidian5 = require("obsidian");
var TIP = { delay: 100, placement: "top" };
var StatusBar = class {
  constructor(app, plugin, store, managePictures) {
    this.app = app;
    this.plugin = plugin;
    this.store = store;
    this.managePictures = managePictures;
    this.items = [];
    this.unsubscribe = null;
  }
  show() {
    if (this.items.length) return;
    const add = (cls, label, onClick) => {
      const el = this.plugin.addStatusBarItem();
      el.addClass("mod-clickable", "fantasy-easel-sb", cls);
      el.setAttr("aria-label", label);
      (0, import_obsidian5.setTooltip)(el, label, TIP);
      this.plugin.registerDomEvent(el, "click", onClick);
      this.items.push(el);
      return el;
    };
    const menuAt = (ev, make) => make().showAtMouseEvent(ev);
    const color = add("fantasy-easel-sb-color", "Theme color", (ev) => menuAt(ev, () => colorMenu(this.store)));
    this.swatch = color.createSpan({ cls: "fantasy-easel-swatch" });
    this.colorName = color.createSpan({ cls: "fantasy-easel-sb-text" });
    (0, import_obsidian5.setIcon)(add("fantasy-easel-sb-prev", "Previous background", () => stepBackground(this.store, -1)), "chevron-left");
    const bg = add("fantasy-easel-sb-bg", "Background", (ev) => menuAt(ev, () => backgroundMenu(this.store, this.managePictures)));
    this.bgKind = bg.createSpan({ cls: "fantasy-easel-sb-kind" });
    this.bgName = bg.createSpan({ cls: "fantasy-easel-sb-text fantasy-easel-sb-bgname" });
    (0, import_obsidian5.setIcon)(add("fantasy-easel-sb-next", "Next background", () => stepBackground(this.store, 1)), "chevron-right");
    (0, import_obsidian5.setIcon)(add("fantasy-easel-sb-gallery", "Background gallery (day / night)", () => new GalleryModal(this.app, this.store, this.managePictures).open()), "layout-grid");
    this.accent = add("fantasy-easel-sb-toggle", "Theme accent on / off", () => this.store.setLook({ accent: !this.store.settings.look.accent }));
    (0, import_obsidian5.setIcon)(this.accent, "droplet");
    this.card = add("fantasy-easel-sb-toggle", "Card layout on / off", () => this.store.setLook({ card: !this.store.settings.look.card }));
    (0, import_obsidian5.setIcon)(this.card, "layout-dashboard");
    this.still = add("fantasy-easel-sb-toggle", "Motion", () => {
      const order = MOTIONS;
      this.store.set({ motion: order[(order.indexOf(this.store.settings.motion) + 1) % order.length] });
    });
    (0, import_obsidian5.setIcon)(
      add("fantasy-easel-sb-mode", "Dark / light", () => this.app.commands.executeCommandById("theme:toggle-light-dark")),
      "sun-moon"
    );
    this.unsubscribe = this.store.subscribe(() => this.render());
    this.render();
  }
  hide() {
    this.unsubscribe?.();
    this.unsubscribe = null;
    this.items.forEach((el) => el.remove());
    this.items = [];
  }
  render() {
    const { look, motion } = this.store.settings;
    const color = colorByCls(look.color);
    this.swatch.className = `fantasy-easel-swatch ${look.color}`;
    this.colorName.setText(color?.name ?? look.color);
    const bg = backgroundById(look.background, look.images);
    this.bgName.setText(bg?.name ?? look.background);
    (0, import_obsidian5.setIcon)(this.bgKind, bg?.kind === "motion" ? "wind" : bg?.kind === "static" ? "palette" : "image");
    this.accent.toggleClass("is-on", look.accent);
    this.card.toggleClass("is-on", look.card);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    (0, import_obsidian5.setIcon)(this.still, motion === "off" ? "pause" : motion === "on" ? "play" : "circle-play");
    const tip = motion === "auto" ? `Motion: auto (follows OS reduced motion${reduced ? " \u2014 now paused" : ""}). Click: on` : motion === "on" ? "Motion: on (moves even with OS reduced motion). Click: off" : "Motion: off. Click: auto";
    this.still.setAttr("aria-label", tip);
    (0, import_obsidian5.setTooltip)(this.still, tip, TIP);
    this.still.toggleClass("is-on", motion === "on");
    this.still.toggleClass("is-idle", bg?.kind !== "motion");
  }
};

// src/store.ts
var Store = class {
  constructor(settings, save) {
    this.settings = settings;
    this.save = save;
    this.listeners = /* @__PURE__ */ new Set();
    this.saveTimer = null;
  }
  setLook(patch) {
    this.set({ look: { ...this.settings.look, ...patch } });
  }
  set(patch) {
    this.settings = { ...this.settings, ...patch };
    [...this.listeners].forEach((f) => f());
    if (this.saveTimer !== null) window.clearTimeout(this.saveTimer);
    this.saveTimer = window.setTimeout(() => this.flush(), 300);
  }
  /** Write a pending save now (unload). */
  flush() {
    if (this.saveTimer === null) return;
    window.clearTimeout(this.saveTimer);
    this.saveTimer = null;
    void this.save(this.settings);
  }
  subscribe(f) {
    this.listeners.add(f);
    return () => this.listeners.delete(f);
  }
};

// src/main.ts
var STYLE_SETTINGS_ID = "obsidian-style-settings";
var FantasyEaselPlugin = class extends import_obsidian6.Plugin {
  constructor() {
    super(...arguments);
    /** Menu builders, also for CLI checks (a Menu closes at once when the window has no focus). */
    this.menus = { color: () => colorMenu(this.store), background: () => backgroundMenu(this.store, () => this.openSettings()) };
  }
  async onload() {
    const saved = await this.loadData();
    const ss = await readStyleSettingsLook(this.app);
    const settings = saved ? normalize(saved) : { ...DEFAULT_SETTINGS, look: ss.look };
    this.store = new Store(settings, (s) => this.saveData(s));
    if (!saved) await this.saveData(settings);
    document.body.style.setProperty("--fantasy-easel-delay", `-${Math.round(Math.random() * 600)}s`);
    this.register(() => document.body.style.removeProperty("--fantasy-easel-delay"));
    this.applier = new Applier(document.body, () => this.store.settings);
    this.applier.attach();
    this.statusBar = new StatusBar(this.app, this, this.store, () => this.openSettings());
    if (settings.statusBar) this.statusBar.show();
    this.register(
      this.store.subscribe(() => {
        this.applier.reconcile();
        if (this.store.settings.statusBar) this.statusBar.show();
        else this.statusBar.hide();
      })
    );
    this.addSettingTab(new FantasyEaselSettingTab(this.app, this));
    this.addCommand({ id: "next-background", name: "Next background", callback: () => stepBackground(this.store, 1) });
    this.addCommand({ id: "previous-background", name: "Previous background", callback: () => stepBackground(this.store, -1) });
    this.addCommand({ id: "background-gallery", name: "Background gallery", callback: () => new GalleryModal(this.app, this.store, () => this.openSettings()).open() });
    this.addCommand({ id: "import-style-settings", name: "Import from Style Settings", callback: () => void this.importFromStyleSettings() });
    this.app.workspace.onLayoutReady(() => this.applier.reconcile());
  }
  onunload() {
    this.store.flush();
    this.statusBar.hide();
    const plugins = this.app.plugins;
    this.applier.detach({
      enabled: !!plugins.plugins[STYLE_SETTINGS_ID],
      trigger: () => this.app.workspace.trigger("parse-style-settings")
    });
  }
  /** Open this plugin's settings tab (to add pictures). */
  openSettings() {
    const setting = this.app.setting;
    setting.open();
    setting.openTabById(this.manifest.id);
  }
  async importFromStyleSettings() {
    const ss = await readStyleSettingsLook(this.app);
    const have = new Set(this.store.settings.look.images.map((i) => i.src));
    const images = [...this.store.settings.look.images, ...ss.look.images.filter((i) => !have.has(i.src))];
    this.store.setLook({ color: ss.look.color, accent: ss.look.accent, card: ss.look.card, images });
    new import_obsidian6.Notice(ss.found ? "Fantasy Easel: imported from Style Settings." : "Fantasy Easel: no Style Settings values, used theme defaults.");
  }
};
