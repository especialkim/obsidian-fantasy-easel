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
    key: "glow",
    name: "Light Leak",
    kind: "static",
    palette: "theme",
    day: [
      blob("ellipse 55% 50%", "0% 0%", "hsl({H+30} 100% 70% / 0.9)", 70),
      blob("ellipse 60% 55%", "100% 100%", "hsl({H-40} 100% 72% / 0.85)", 70),
      blob("ellipse 30% 53%", "80% 15%", "hsl({H+90} 100% 80% / 0.7)", 70),
      solid("hsl({H} 40% 95%)")
    ],
    night: [
      blob("ellipse 55% 50%", "0% 0%", "hsl({H+30} 90% 42% / 0.85)", 70),
      blob("ellipse 60% 55%", "100% 100%", "hsl({H-40} 90% 38% / 0.8)", 70),
      blob("ellipse 30% 53%", "80% 15%", "hsl({H+90} 90% 45% / 0.55)", 70),
      solid("hsl({H} 50% 6%)")
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
    night: ["linear-gradient(160deg, hsl({H} 70% 26%) 0%, hsl({H+40} 65% 18%) 40%, hsl({H+90} 60% 12%) 75%, hsl({H+130} 50% 7%) 100%)"]
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
      blob("ellipse 18% 32%", "80% 18%", "rgb(170 190 255 / 0.35)", 70),
      blob("ellipse 80% 35%", "50% 100%", "rgb(120 60 170 / 0.45)", 70),
      "linear-gradient(180deg, #050816 0%, #0d1b4a 45%, #24195a 75%, #3a2160 100%)"
    ]
  },
  {
    key: "ocean",
    name: "Ocean",
    kind: "static",
    palette: "fixed",
    day: [
      blob("ellipse 70% 35%", "50% 0%", "rgb(255 255 255 / 0.55)", 70),
      "linear-gradient(170deg, #b4f3ff 0%, #6fdcef 40%, #3bbcd9 75%, #2ea3c7 100%)"
    ],
    night: [
      blob("ellipse 35% 30%", "28% 72%", "rgb(25 227 214 / 0.35)", 70),
      blob("ellipse 30% 30%", "75% 40%", "rgb(58 123 255 / 0.3)", 70),
      "linear-gradient(170deg, #031426 0%, #062a45 50%, #0a3d5c 100%)"
    ]
  },
  {
    key: "aurora",
    name: "Aurora",
    kind: "static",
    palette: "fixed",
    day: [
      blob("ellipse 60% 45%", "25% 30%", "#a8f7d6"),
      blob("ellipse 55% 50%", "75% 28%", "#d2c2ff"),
      blob("ellipse 70% 40%", "50% 85%", "#b2e8ff"),
      solid("#f2fbff")
    ],
    night: [
      blob("ellipse 60% 40%", "30% 35%", "rgb(25 230 140 / 0.55)", 65),
      blob("ellipse 55% 45%", "70% 30%", "rgb(122 60 255 / 0.5)", 65),
      blob("ellipse 70% 35%", "50% 78%", "rgb(0 194 255 / 0.35)", 65),
      solid("#04060f")
    ]
  },
  {
    key: "citrus",
    name: "Citrus / Ember",
    kind: "static",
    palette: "fixed",
    day: [
      blob("ellipse 60% 55%", "20% 25%", "#fff27a"),
      blob("ellipse 55% 55%", "80% 30%", "#c4f56b"),
      blob("ellipse 65% 55%", "60% 90%", "#ffc061"),
      solid("#fffbe6")
    ],
    night: [
      blob("ellipse 60% 55%", "20% 25%", "rgb(255 106 26 / 0.4)"),
      blob("ellipse 55% 55%", "80% 30%", "rgb(255 176 0 / 0.3)"),
      blob("ellipse 65% 55%", "60% 90%", "rgb(212 20 90 / 0.35)"),
      solid("#120805")
    ]
  },
  {
    key: "rose",
    name: "Ros\xE9 / Wine",
    kind: "static",
    palette: "fixed",
    day: [
      blob("ellipse 60% 55%", "20% 20%", "#ffc3d0"),
      blob("ellipse 55% 55%", "85% 35%", "#ffd6b8"),
      blob("ellipse 65% 55%", "45% 90%", "#e8c1ff"),
      solid("#fff5f7")
    ],
    night: [
      blob("ellipse 60% 55%", "20% 20%", "rgb(176 48 106 / 0.5)"),
      blob("ellipse 55% 55%", "85% 35%", "rgb(109 42 143 / 0.45)"),
      blob("ellipse 65% 55%", "45% 90%", "rgb(255 122 138 / 0.22)"),
      solid("#14060d")
    ]
  },
  {
    key: "forest",
    name: "Forest",
    kind: "static",
    palette: "fixed",
    day: [
      "linear-gradient(115deg, transparent 20%, rgb(255 247 194 / 0.7) 30%, transparent 42%, rgb(255 247 194 / 0.5) 55%, transparent 65%)",
      blob("ellipse 60% 55%", "20% 75%", "#a6dd90"),
      blob("ellipse 55% 55%", "85% 30%", "#7fd3a8"),
      solid("#eef7e8")
    ],
    night: [
      blob("ellipse 6% 11%", "30% 60%", "rgb(216 255 106 / 0.35)", 80),
      blob("ellipse 5% 9%", "70% 35%", "rgb(216 255 106 / 0.3)", 80),
      blob("ellipse 60% 55%", "20% 75%", "rgb(31 107 58 / 0.55)"),
      blob("ellipse 55% 55%", "85% 30%", "rgb(15 77 74 / 0.5)"),
      solid("#040d07")
    ]
  },
  {
    key: "cosmos",
    name: "Cotton / Cosmos",
    kind: "static",
    palette: "fixed",
    day: [
      blob("ellipse 60% 55%", "20% 30%", "#ffb6e6"),
      blob("ellipse 55% 55%", "80% 25%", "#a9c9ff"),
      blob("ellipse 65% 55%", "55% 90%", "#c7b3ff"),
      solid("#f8f4ff")
    ],
    night: [
      blob("ellipse 55% 50%", "25% 30%", "rgb(123 47 247 / 0.5)"),
      blob("ellipse 45% 45%", "78% 30%", "rgb(241 7 163 / 0.32)"),
      blob("ellipse 60% 45%", "55% 85%", "rgb(31 209 249 / 0.28)"),
      solid("#07020f")
    ]
  },
  {
    key: "prism",
    name: "Prism / Neon",
    kind: "static",
    palette: "fixed",
    day: ["conic-gradient(from 0deg at 50% 50%, #ffd1f0, #c9f0ff, #d9ffcf, #fff2c2, #e2d1ff, #ffd1f0)"],
    night: [
      blob("ellipse 45% 80%", "50% 50%", "rgb(4 2 12 / 0.75)", 75),
      "conic-gradient(from 0deg at 50% 50%, #8a1166, #116a8a, #3a138a, #8a5a11, #8a1166)"
    ]
  },
  {
    key: "magma",
    name: "Coral / Magma",
    kind: "static",
    palette: "fixed",
    day: [
      blob("ellipse 60% 55%", "20% 30%", "#ff9a8b"),
      blob("ellipse 55% 55%", "80% 25%", "#ffcf8b"),
      blob("ellipse 65% 55%", "55% 90%", "#ff8fab"),
      solid("#fff1ec")
    ],
    night: [
      blob("ellipse 55% 45%", "25% 80%", "rgb(255 61 0 / 0.45)"),
      blob("ellipse 50% 45%", "75% 70%", "rgb(255 145 0 / 0.3)"),
      blob("ellipse 60% 45%", "50% 20%", "rgb(179 0 27 / 0.4)"),
      solid("#1a0402")
    ]
  },
  {
    key: "arctic",
    name: "Arctic",
    kind: "static",
    palette: "fixed",
    day: [
      blob("ellipse 60% 50%", "25% 25%", "#ffffff"),
      blob("ellipse 60% 55%", "80% 70%", "#bfe3ff"),
      blob("ellipse 50% 45%", "20% 85%", "#cfd8ff"),
      solid("#e8f6ff")
    ],
    night: [
      blob("ellipse 70% 30%", "50% 25%", "rgb(43 255 176 / 0.22)", 70),
      blob("ellipse 60% 55%", "80% 80%", "rgb(20 80 150 / 0.5)"),
      solid("#020b18")
    ]
  },
  {
    key: "dune",
    name: "Dune",
    kind: "static",
    palette: "fixed",
    day: [
      "linear-gradient(175deg, #a7d4ff 0%, #ffe6c2 45%, #ffd19a 70%, #f2a66b 100%)"
    ],
    night: [
      blob("ellipse 14% 25%", "75% 22%", "rgb(255 236 200 / 0.25)", 70),
      "linear-gradient(175deg, #0b0a24 0%, #1e1846 45%, #33234f 70%, #3d2a1e 100%)"
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
      blob("ellipse 80% 70%", "50% 45%", "rgb(60 60 72 / 0.5)", 75),
      "repeating-linear-gradient(115deg, rgb(255 255 255 / 0.025) 0 2px, transparent 2px 6px)",
      solid("#121216")
    ]
  },
  // ---------- motion ----------
  {
    key: "aurora-drift",
    name: "Aurora Drift",
    kind: "motion",
    palette: "fixed",
    motion: { frames: "drift", seconds: 60, alternate: true },
    day: [
      blob("ellipse 60% 45%", "22% 30%", "#a8f7d6", 70),
      blob("ellipse 55% 50%", "78% 35%", "#d2c2ff", 70),
      blob("ellipse 70% 40%", "50% 85%", "#b2e8ff", 70),
      solid("#f2fbff")
    ],
    night: [
      blob("ellipse 60% 40%", "22% 30%", "rgb(25 230 140 / 0.55)", 70),
      blob("ellipse 55% 45%", "78% 35%", "rgb(122 60 255 / 0.5)", 70),
      blob("ellipse 70% 35%", "50% 85%", "rgb(0 194 255 / 0.35)", 70),
      solid("#04060f")
    ]
  },
  {
    key: "tide",
    name: "Tide",
    kind: "motion",
    palette: "theme",
    motion: { frames: "tide", seconds: 45, alternate: true },
    day: ["linear-gradient(115deg, hsl({H} 70% 86%) 0%, hsl({H+30} 80% 76%) 30%, hsl({H-20} 85% 70%) 50%, hsl({H+30} 80% 76%) 70%, hsl({H} 70% 86%) 100%)"],
    night: ["linear-gradient(115deg, hsl({H} 60% 8%) 0%, hsl({H+30} 65% 20%) 30%, hsl({H-20} 70% 32%) 50%, hsl({H+30} 65% 20%) 70%, hsl({H} 60% 8%) 100%)"]
  },
  {
    key: "swell",
    name: "Ocean Swell",
    kind: "motion",
    palette: "fixed",
    motion: { frames: "swell", seconds: 50, alternate: true },
    day: [
      blob("ellipse 80% 30%", "50% 20%", "rgb(255 255 255 / 0.5)", 70),
      "linear-gradient(170deg, #b4f3ff 0%, #6fdcef 45%, #3bbcd9 80%, #2ea3c7 100%)"
    ],
    night: [
      blob("ellipse 40% 25%", "30% 70%", "rgb(25 227 214 / 0.35)", 70),
      blob("ellipse 35% 25%", "72% 45%", "rgb(58 123 255 / 0.3)", 70),
      "linear-gradient(170deg, #031426 0%, #062a45 50%, #0a3d5c 100%)"
    ]
  },
  {
    key: "nebula",
    name: "Nebula",
    kind: "motion",
    palette: "fixed",
    motion: { frames: "nebula", seconds: 80, alternate: true },
    day: [
      blob("ellipse 45% 80%", "35% 40%", "#ffb6e6", 65),
      blob("ellipse 45% 80%", "65% 60%", "#a9c9ff", 65),
      solid("#f6f1ff")
    ],
    night: [
      blob("ellipse 40% 71%", "35% 40%", "rgb(123 47 247 / 0.5)", 65),
      blob("ellipse 40% 71%", "65% 60%", "rgb(31 209 249 / 0.3)", 65),
      blob("ellipse 25% 44%", "55% 30%", "rgb(241 7 163 / 0.25)", 65),
      solid("#07020f")
    ]
  },
  {
    key: "lava",
    name: "Lava Lamp",
    kind: "motion",
    palette: "fixed",
    motion: { frames: "lava", seconds: 70, alternate: true },
    day: [
      blob("ellipse 30% 53%", "30% 35%", "#ff9a8b", 70),
      blob("ellipse 28% 50%", "70% 60%", "#ffcf8b", 70),
      blob("ellipse 22% 39%", "45% 80%", "#ff8fab", 70),
      solid("#fff1ec")
    ],
    night: [
      blob("ellipse 30% 53%", "30% 35%", "rgb(255 61 0 / 0.42)", 70),
      blob("ellipse 28% 50%", "70% 60%", "rgb(255 145 0 / 0.3)", 70),
      blob("ellipse 22% 39%", "45% 80%", "rgb(179 0 27 / 0.4)", 70),
      solid("#1a0402")
    ]
  },
  {
    key: "breathe",
    name: "Breathe",
    kind: "motion",
    palette: "theme",
    motion: { frames: "breathe", seconds: 40, alternate: true },
    day: [
      blob("ellipse 50% 45%", "50% 50%", "hsl({H} 90% 72%)", 70),
      blob("ellipse 70% 60%", "50% 50%", "hsl({H+40} 80% 82%)", 70),
      solid("hsl({H} 50% 94%)")
    ],
    night: [
      blob("ellipse 50% 45%", "50% 50%", "hsl({H} 80% 32%)", 70),
      blob("ellipse 70% 60%", "50% 50%", "hsl({H+40} 70% 18%)", 70),
      solid("hsl({H} 45% 6%)")
    ]
  },
  {
    key: "iris",
    name: "Iris",
    kind: "motion",
    palette: "theme",
    motion: { frames: "iris", seconds: 120 },
    day: ["conic-gradient(from 210deg at 30% 40%, hsl({H} 85% 74%), hsl({H+60} 85% 78%), hsl({H+150} 80% 76%), hsl({H+240} 75% 78%), hsl({H} 85% 74%))"],
    night: ["conic-gradient(from 210deg at 30% 40%, hsl({H} 75% 30%), hsl({H+60} 75% 24%), hsl({H+150} 70% 22%), hsl({H+240} 65% 24%), hsl({H} 75% 30%))"]
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
var themeBg = (key, name) => ({ id: key, name, kind: "theme", cls: `fantasy-theme-background-${key}` });
var BACKGROUNDS = [
  themeBg("none", "None"),
  themeBg("paper", "Paper Texture"),
  themeBg("newspaper", "News Texture"),
  themeBg("beach", "Beach"),
  themeBg("rainy", "Rainy"),
  themeBg("snow", "Snow"),
  themeBg("custom1", "Custom URL 1"),
  themeBg("custom2", "Custom URL 2"),
  themeBg("custom3", "Custom URL 3"),
  // CSS backgrounds: src/backgrounds.ts is the source
  ...CSS_BACKGROUNDS.map((b) => ({ id: `css-${b.key}`, name: b.name, kind: b.kind, palette: b.palette, cls: `fantasy-easel-bg-${b.key}` }))
];
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
  background: "fantasy-theme-background",
  accent: "fantasy-theme-accent",
  cardOff: "fantasy-theme-card-off",
  /** old toggle (on = card layout); read on import if the new one was never saved */
  cardLegacy: "fantasy-theme-card-layout",
  url: ["background-url1", "background-url2", "background-url3"]
};
var THEME_DEFAULTS = {
  color: "fantasy-theme-Black",
  background: "custom3"
};
var colorByCls = (cls) => THEME_COLORS.find((c) => c.cls === cls);
var backgroundById = (id) => BACKGROUNDS.find((b) => b.id === id);

// src/apply.ts
var MANAGED = /* @__PURE__ */ new Set([...THEME_COLORS.map((c) => c.cls), ...BACKGROUNDS.map((b) => b.cls), ACCENT_CLASS, CARD_OFF_CLASS, LEGACY_CARD_CLASS, MARKER_CLASS, STILL_CLASS, MOTION_CLASS, FORCE_MOTION_CLASS]);
var THEME_GROUP = [...THEME_COLORS.map((c) => c.cls), ...BACKGROUNDS.filter((b) => b.kind === "theme").map((b) => b.cls), ACCENT_CLASS, CARD_OFF_CLASS, LEGACY_CARD_CLASS];
var URL_VARS = ["--background-url1", "--background-url2", "--background-url3"];
function wantedClasses(s) {
  const bg = backgroundById(s.look.background);
  const out = /* @__PURE__ */ new Set([MARKER_CLASS, s.look.color]);
  if (bg) out.add(bg.cls);
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
    URL_VARS.forEach((v, i) => {
      const value = s.look.urls[i];
      const now = this.body.style.getPropertyValue(v);
      if (value && now !== value) {
        this.body.style.setProperty(v, value);
        changed++;
      } else if (!value && now) {
        this.body.style.removeProperty(v);
        changed++;
      }
    });
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
   * Hand the look back. Only Easel's own things are removed; if Style Settings is on, it
   * re-applies its own values (with its own rules) on `parse-style-settings`.
   */
  detach(styleSettings) {
    this.observer?.disconnect();
    this.observer = null;
    const cl = this.body.classList;
    const usingCssBg = BACKGROUNDS.some((b) => b.kind !== "theme" && cl.contains(b.cls));
    for (const b of BACKGROUNDS) if (b.kind !== "theme") cl.remove(b.cls);
    cl.remove(MARKER_CLASS, STILL_CLASS, MOTION_CLASS, FORCE_MOTION_CLASS);
    URL_VARS.forEach((v) => this.body.style.removeProperty(v));
    if (styleSettings.enabled) {
      const bg = styleSettings.look && backgroundById(styleSettings.look.background);
      if (usingCssBg && bg) cl.add(bg.cls);
      styleSettings.trigger();
    } else {
      for (const c of THEME_GROUP) cl.remove(c);
    }
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
  constructor(app, store) {
    super(app);
    this.store = store;
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
      const section = root.createDiv({ cls: "fantasy-easel-gallery-group" });
      section.createDiv({ cls: "fantasy-easel-gallery-title", text: g.title });
      section.createDiv({ cls: "fantasy-easel-gallery-desc setting-item-description", text: g.desc });
      for (const b of CSS_BACKGROUNDS.filter(g.pick)) {
        const row = section.createDiv({ cls: "fantasy-easel-gallery-row", attr: { "data-id": `css-${b.key}` } });
        const label = row.createDiv({ cls: "fantasy-easel-gallery-name" });
        label.createSpan({ text: b.name });
        const check = label.createSpan({ cls: "fantasy-easel-gallery-check" });
        (0, import_obsidian2.setIcon)(check, "check");
        for (const side of ["day", "night"]) {
          const tile = row.createDiv({ cls: `fantasy-easel-tile fantasy-easel-${side}`, attr: { "aria-label": `${b.name} (${side})`, role: "button", tabindex: "0" } });
          const layer = tile.createDiv({ cls: "fantasy-easel-tile-layer" });
          layer.style.setProperty("background-image", `var(--fantasy-easel-grad-${b.key})`);
          if (b.motion) layer.style.setProperty("animation", `fantasy-easel-${b.motion.frames} ${b.motion.seconds}s ${b.motion.alternate ? "ease-in-out" : "linear"} infinite${b.motion.alternate ? " alternate" : ""}`);
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
var KIND_LABEL = { theme: "Theme images", static: "CSS \xB7 static", motion: "CSS \xB7 motion" };
function colorMenu(store) {
  const menu = new import_obsidian3.Menu();
  for (const c of THEME_COLORS) {
    menu.addItem(
      (item) => item.setTitle(c.name).setChecked(store.settings.look.color === c.cls).onClick(() => store.setLook({ color: c.cls }))
    );
  }
  return menu;
}
function backgroundMenu(store) {
  const menu = new import_obsidian3.Menu();
  for (const kind of ["theme", "static", "motion"]) {
    if (kind !== "theme") menu.addSeparator();
    menu.addItem((item) => item.setTitle(KIND_LABEL[kind]).setIsLabel(true));
    for (const b of BACKGROUNDS.filter((b2) => b2.kind === kind)) {
      menu.addItem(
        (item) => item.setTitle(b.name).setChecked(store.settings.look.background === b.id).onClick(() => store.setLook({ background: b.id }))
      );
    }
  }
  return menu;
}
function stepBackground(store, dir) {
  const i = BACKGROUNDS.findIndex((b) => b.id === store.settings.look.background);
  const next = BACKGROUNDS[(i + dir + BACKGROUNDS.length) % BACKGROUNDS.length];
  store.setLook({ background: next.id });
}

// src/settings.ts
var MOTIONS = ["auto", "on", "off"];
var DEFAULT_LOOK = {
  color: THEME_DEFAULTS.color,
  background: THEME_DEFAULTS.background,
  accent: false,
  card: true,
  urls: ["", "", ""]
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
  const bgCls = get(SS_KEYS.background);
  const bgId = typeof bgCls === "string" ? bgCls.replace("fantasy-theme-background-", "") : "";
  const urls = SS_KEYS.url.map((k) => typeof get(k) === "string" ? get(k) : "");
  return {
    found,
    look: {
      color,
      background: backgroundById(bgId) ? bgId : DEFAULT_LOOK.background,
      accent: get(SS_KEYS.accent) === true,
      // new toggle = "card off"; else the old "card on" toggle; else the theme default (on)
      card: typeof get(SS_KEYS.cardOff) === "boolean" ? get(SS_KEYS.cardOff) !== true : typeof get(SS_KEYS.cardLegacy) === "boolean" ? get(SS_KEYS.cardLegacy) === true : true,
      urls
    }
  };
}
function normalize(data) {
  const look = data?.look ?? {};
  const urls = Array.isArray(look.urls) ? look.urls : [];
  return {
    look: {
      color: typeof look.color === "string" && colorByCls(look.color) ? look.color : DEFAULT_LOOK.color,
      background: typeof look.background === "string" && backgroundById(look.background) ? look.background : DEFAULT_LOOK.background,
      accent: look.accent === true,
      card: look.card !== false,
      urls: [0, 1, 2].map((i) => typeof urls[i] === "string" ? urls[i] : "")
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
    const bg = backgroundById(look.background);
    new import_obsidian4.Setting(containerEl).setName("Background").setDesc(bg ? `${bg.name} (${bg.kind === "theme" ? "theme image" : `CSS \xB7 ${bg.kind}`})` : look.background).addButton((b) => b.setButtonText("Gallery").onClick(() => new GalleryModal(this.app, store).open())).addButton((b) => b.setButtonText("Change").onClick((ev) => backgroundMenu(store).showAtMouseEvent(ev)));
    new import_obsidian4.Setting(containerEl).setName("Theme accent").setDesc("Use the theme color as the accent.").addToggle((t) => t.setValue(look.accent).onChange((v) => store.setLook({ accent: v })));
    new import_obsidian4.Setting(containerEl).setName("Card layout").addToggle((t) => t.setValue(look.card).onChange((v) => store.setLook({ card: v })));
    look.urls.forEach((url, i) => {
      new import_obsidian4.Setting(containerEl).setName(`Custom background URL ${i + 1}`).setDesc('CSS value, same as Style Settings: url("https://\u2026"). Empty = theme default.').addText((t) => {
        t.inputEl.type = "text";
        t.setValue(url).setPlaceholder('url("\u2026")');
        t.inputEl.addEventListener("change", () => {
          const urls = [...store.settings.look.urls];
          urls[i] = t.getValue().trim();
          store.setLook({ urls });
        });
      });
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
  constructor(app, plugin, store) {
    this.app = app;
    this.plugin = plugin;
    this.store = store;
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
    const bg = add("fantasy-easel-sb-bg", "Background", (ev) => menuAt(ev, () => backgroundMenu(this.store)));
    this.bgKind = bg.createSpan({ cls: "fantasy-easel-sb-kind" });
    this.bgName = bg.createSpan({ cls: "fantasy-easel-sb-text fantasy-easel-sb-bgname" });
    (0, import_obsidian5.setIcon)(add("fantasy-easel-sb-next", "Next background", () => stepBackground(this.store, 1)), "chevron-right");
    (0, import_obsidian5.setIcon)(add("fantasy-easel-sb-gallery", "Background gallery (day / night)", () => new GalleryModal(this.app, this.store).open()), "layout-grid");
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
    const bg = backgroundById(look.background);
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
    this.menus = { color: () => colorMenu(this.store), background: () => backgroundMenu(this.store) };
    /** Style Settings' saved Fantasy look, for the hand-back on unload. */
    this.ssLook = null;
  }
  async onload() {
    const saved = await this.loadData();
    const ss = await readStyleSettingsLook(this.app);
    this.ssLook = ss.found ? ss.look : null;
    const settings = saved ? normalize(saved) : { ...DEFAULT_SETTINGS, look: ss.look };
    this.store = new Store(settings, (s) => this.saveData(s));
    if (!saved) await this.saveData(settings);
    this.applier = new Applier(document.body, () => this.store.settings);
    this.applier.attach();
    this.statusBar = new StatusBar(this.app, this, this.store);
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
    this.addCommand({ id: "background-gallery", name: "Background gallery", callback: () => new GalleryModal(this.app, this.store).open() });
    this.addCommand({ id: "import-style-settings", name: "Import from Style Settings", callback: () => void this.importFromStyleSettings() });
    this.app.workspace.onLayoutReady(() => this.applier.reconcile());
  }
  onunload() {
    this.store.flush();
    this.statusBar.hide();
    const plugins = this.app.plugins;
    this.applier.detach({
      enabled: !!plugins.plugins[STYLE_SETTINGS_ID],
      look: this.ssLook,
      trigger: () => this.app.workspace.trigger("parse-style-settings")
    });
  }
  async importFromStyleSettings() {
    const ss = await readStyleSettingsLook(this.app);
    this.ssLook = ss.found ? ss.look : null;
    this.store.setLook(ss.look);
    new import_obsidian6.Notice(ss.found ? "Fantasy Easel: imported from Style Settings." : "Fantasy Easel: no Style Settings values, used theme defaults.");
  }
};
