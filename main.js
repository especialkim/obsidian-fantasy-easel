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
var import_obsidian9 = require("obsidian");

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
      blob("ellipse 70% 60%", "15% 20%", "hsl({H} 80% 56%)"),
      blob("ellipse 60% 60%", "85% 25%", "hsl({H+50} 80% 56%)"),
      blob("ellipse 70% 60%", "70% 90%", "hsl({H-50} 75% 56%)"),
      blob("ellipse 60% 50%", "20% 85%", "hsl({H+120} 70% 56%)"),
      solid("hsl({H} 45% 43.2%)")
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
      "linear-gradient(180deg, hsl({H} 50% 41.8% / 0.55), transparent 70%)",
      "conic-gradient(from 210deg at 30% 40%, hsl({H} 75% 56%), hsl({H+40} 75% 56%), hsl({H+100} 70% 56%), hsl({H+180} 60% 54.5%), hsl({H} 75% 56%))"
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
      "linear-gradient(100deg, transparent 8%, hsl({H+60} 85% 56% / 0.65) 24%, transparent 38%, hsl({H} 85% 56% / 0.6) 55%, transparent 70%, hsl({H-60} 80% 56% / 0.6) 85%, transparent 96%)",
      "linear-gradient(180deg, hsl({H+20} 50% 42.5%), hsl({H} 45% 46.2%))"
    ]
  },
  {
    key: "dusk",
    name: "Dusk",
    kind: "static",
    palette: "theme",
    day: ["linear-gradient(160deg, hsl({H} 85% 78%) 0%, hsl({H+40} 85% 76%) 40%, hsl({H+90} 80% 80%) 75%, hsl({H+130} 70% 86%) 100%)"],
    night: ["linear-gradient(160deg, hsl({H} 75% 56%) 0%, hsl({H+40} 72% 56%) 40%, hsl({H+90} 70% 56%) 75%, hsl({H+130} 65% 54.5%) 100%)"]
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
      blob("ellipse 80% 40%", "50% 100%", "rgb(201 84 162 / 0.5)", 70),
      "linear-gradient(180deg, #4a61d4 0%, #5552cb 40%, #8357c6 70%, #bc62b9 100%)"
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
      blob("ellipse 60% 40%", "30% 35%", "rgb(53 233 154 / 0.55)", 65),
      blob("ellipse 55% 45%", "70% 30%", "rgb(122 60 255 / 0.5)", 65),
      blob("ellipse 70% 35%", "50% 78%", "rgb(31 201 255 / 0.35)", 65),
      solid("#2c42a4")
    ]
  },
  {
    key: "prism",
    name: "Prism / Neon",
    kind: "static",
    palette: "fixed",
    day: ["conic-gradient(from 0deg at 50% 50%, #ff7fcf, #6fd0ff, #8ff07a, #ffd65c, #b48cff, #ff7fcf)"],
    night: [
      blob("ellipse 45% 80%", "50% 50%", "rgb(58 29 175 / 0.75)", 75),
      "conic-gradient(from 0deg at 50% 50%, #e637b2, #37b8e6, #713ae4, #e6a137, #e637b2)"
    ]
  },
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
      "repeating-radial-gradient(circle at 18% 80%, hsl({H+120} 80% 56% / 0.55) 0 4%, transparent 4% 9%)",
      "repeating-radial-gradient(circle at 75% 25%, hsl({H} 80% 56%) 0 6%, hsl({H+50} 75% 54.5%) 6% 12%)"
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
      blob("ellipse 45% 55%", "0% 0%", "#cb5295", 75),
      blob("ellipse 45% 55%", "50% 0%", "#44adda", 75),
      blob("ellipse 45% 55%", "100% 0%", "#8bd24c", 75),
      blob("ellipse 45% 55%", "0% 100%", "#744fcf", 75),
      blob("ellipse 45% 55%", "50% 100%", "#db8d42", 75),
      blob("ellipse 45% 55%", "100% 100%", "#48d5b7", 75),
      solid("#6a4eb7")
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
      "repeating-conic-gradient(from 0deg at 50% 115%, #9b56c8 0deg 7deg, #8f52cb 7deg 14deg, #b85ec0 14deg 21deg)"
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
      "linear-gradient(35deg, transparent 18%, hsl({H+40} 70% 56% / 0.75) 24%, transparent 30%, transparent 58%, hsl({H-30} 65% 56% / 0.7) 64%, transparent 70%)",
      "linear-gradient(-20deg, transparent 30%, hsl({H+150} 65% 56% / 0.6) 38%, transparent 46%, transparent 76%, hsl({H} 75% 56% / 0.65) 82%, transparent 88%)",
      "linear-gradient(160deg, hsl({H} 45% 50.8%), hsl({H+30} 40% 48.5%))"
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
    night: ["linear-gradient(115deg, hsl({H} 65% 48.5%) 0%, hsl({H+30} 70% 56%) 25%, hsl({H-20} 75% 56%) 50%, hsl({H+30} 70% 56%) 75%, hsl({H} 65% 48.5%) 100%)"]
  },
  {
    key: "swell",
    name: "Ocean Swell",
    kind: "motion",
    palette: "fixed",
    motion: { parts: [{ frames: "swellY", seconds: 15 }, { frames: "wanderC", seconds: 31 }, { frames: "pulse", seconds: 19 }] },
    day: ["linear-gradient(170deg, #9debff 0%, #5ad2ec 35%, #2fb6dc 65%, #3f9fe0 100%)"],
    night: ["linear-gradient(170deg, #38a5e2 0%, #37b4e6 35%, #32c8ec 65%, #4589d8 100%)"]
  },
  {
    key: "iris",
    name: "Iris",
    kind: "motion",
    palette: "theme",
    motion: { parts: [{ frames: "hueFull", seconds: 37, loop: true }, { frames: "wanderA", seconds: 41 }, { frames: "sway", seconds: 29 }] },
    day: ["conic-gradient(from 210deg at 30% 40%, hsl({H} 85% 72%), hsl({H+60} 85% 74%), hsl({H+150} 80% 72%), hsl({H+240} 75% 74%), hsl({H} 85% 72%))"],
    night: ["conic-gradient(from 210deg at 30% 40%, hsl({H} 75% 56%), hsl({H+60} 75% 56%), hsl({H+150} 70% 56%), hsl({H+240} 65% 56%), hsl({H} 75% 56%))"]
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
      blob("ellipse 55% 60%", "25% 25%", "hsl({H} 85% 56%)", 70),
      blob("ellipse 50% 55%", "80% 70%", "hsl({H+60} 85% 56%)", 70),
      blob("ellipse 45% 50%", "70% 15%", "hsl({H+140} 80% 54.5%)", 70),
      solid("hsl({H+20} 55% 46.2%)")
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
      "linear-gradient(100deg, #27ce9d 0%, #2c74df 30%, #6c4ece 60%, #2cceb6 100%)"
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
    night: ["linear-gradient(160deg, #db3117 0%, #eb3920 40%, #e61964 75%, #f0761a 100%)"]
  }
];

// src/stages.ts
var STAGES = [
  {
    key: "sunlit-canopy",
    name: "Sunlit Canopy",
    family: "ambient",
    speed: 2.2,
    morph: 0.4,
    hue: 36,
    blur: 24,
    night: {
      base: "linear-gradient(145deg, #1b4235 0%, #274a2b 50%, #193c42 100%)",
      layers: [
        "#389e6c",
        "#c29632",
        "#248e84",
        "#6eb244"
      ],
      wave: "repeating-conic-gradient(from 15deg at 45% 45%, rgba(195, 220, 95, 0.36) 0deg 20deg, transparent 20deg 40deg, rgba(60, 190, 138, 0.36) 40deg 60deg, transparent 60deg 72deg)",
      b2: "screen",
      b3: "soft-light"
    },
    day: {
      base: "linear-gradient(145deg, #88cfa8 0%, #b5db8c 50%, #7ec6b8 100%)",
      layers: [
        "#3eb27c",
        "#ebb238",
        "#32a29c",
        "#72be3e"
      ],
      wave: "repeating-conic-gradient(from 15deg at 45% 45%, rgba(245, 200, 65, 0.42) 0deg 20deg, transparent 20deg 40deg, rgba(45, 165, 112, 0.4) 40deg 60deg, transparent 60deg 72deg)",
      b2: "multiply",
      b3: "soft-light"
    }
  },
  {
    key: "tidal-caustics",
    name: "Tidal Caustics",
    family: "ambient",
    speed: 0.8,
    morph: 1.3,
    hue: 36,
    blur: 45,
    night: {
      base: "linear-gradient(155deg, #173d56 0%, #1c3360 50%, #16484e 100%)",
      layers: [
        "#24a4b8",
        "#3874d2",
        "#26ba9e",
        "#588ee6"
      ],
      wave: "repeating-radial-gradient(ellipse 40% 32% at 35% 60%, rgba(75, 220, 235, 0.42) 0 7%, transparent 7% 15%), repeating-radial-gradient(ellipse 34% 42% at 68% 36%, rgba(90, 155, 248, 0.38) 0 8%, transparent 8% 16%)",
      b2: "screen",
      b3: "soft-light"
    },
    day: {
      base: "linear-gradient(155deg, #7dcde0 0%, #86b8ec 50%, #78d8c4 100%)",
      layers: [
        "#2698bc",
        "#447cd6",
        "#22b298",
        "#52a2e2"
      ],
      wave: "repeating-radial-gradient(ellipse 40% 32% at 35% 60%, rgba(28, 140, 180, 0.4) 0 7%, transparent 7% 15%), repeating-radial-gradient(ellipse 34% 42% at 68% 36%, rgba(60, 110, 210, 0.36) 0 8%, transparent 8% 16%)",
      b2: "multiply",
      b3: "soft-light"
    }
  },
  {
    key: "alpine-mist",
    name: "Alpine Mist",
    family: "ambient",
    speed: 0.63,
    morph: 1.3,
    hue: 36,
    blur: 12,
    night: {
      base: "linear-gradient(165deg, #26384e 0%, #332e54 50%, #1e4246 100%)",
      layers: [
        "#4e88a0",
        "#a6688a",
        "#6a6eb8",
        "#ca805e"
      ],
      wave: "repeating-linear-gradient(112deg, transparent 0 9%, rgba(165, 195, 225, 0.32) 9% 18%, transparent 18% 28%, rgba(220, 150, 170, 0.3) 28% 36%)",
      b2: "screen",
      b3: "soft-light"
    },
    day: {
      base: "linear-gradient(165deg, #9abed8 0%, #b8b0e2 50%, #e4b8aa 100%)",
      layers: [
        "#5288b2",
        "#d07492",
        "#7672c2",
        "#da8c62"
      ],
      wave: "repeating-linear-gradient(112deg, transparent 0 9%, rgba(80, 120, 170, 0.34) 9% 18%, transparent 18% 28%, rgba(190, 100, 130, 0.32) 28% 36%)",
      b2: "multiply",
      b3: "soft-light"
    }
  },
  {
    key: "polar-curtain",
    name: "Polar Curtain",
    family: "ambient",
    speed: 0.63,
    morph: 1.3,
    hue: 36,
    blur: 9,
    night: {
      base: "linear-gradient(135deg, #183a3e 0%, #222c58 50%, #3a2052 100%)",
      layers: [
        "#28c290",
        "#8852e6",
        "#24a0d0",
        "#d44898"
      ],
      wave: "repeating-linear-gradient(82deg, transparent 0 6%, rgba(45, 225, 160, 0.46) 10% 17%, transparent 21% 29%, rgba(160, 95, 248, 0.44) 33% 40%, transparent 45% 52%)",
      b2: "screen",
      b3: "screen"
    },
    day: {
      base: "linear-gradient(135deg, #86dec6 0%, #98c2f0 50%, #c6a8f0 100%)",
      layers: [
        "#20ac82",
        "#7e52d2",
        "#2690c6",
        "#ce5098"
      ],
      wave: "repeating-linear-gradient(82deg, transparent 0 6%, rgba(22, 160, 115, 0.42) 10% 17%, transparent 21% 29%, rgba(120, 60, 210, 0.4) 33% 40%, transparent 45% 52%)",
      b2: "multiply",
      b3: "soft-light"
    }
  },
  {
    key: "bioluminescence",
    name: "Bioluminescence",
    family: "ambient",
    speed: 0.9,
    morph: 1.3,
    hue: 36,
    blur: 12,
    night: {
      base: "linear-gradient(150deg, #182b54 0%, #262156 50%, #153a4e 100%)",
      layers: [
        "#1ebdca",
        "#d03c8e",
        "#4c6ee2",
        "#9048de"
      ],
      wave: "radial-gradient(circle at 32% 65%, rgba(40, 225, 220, 0.52) 0%, transparent 42%), radial-gradient(circle at 70% 34%, rgba(235, 70, 165, 0.5) 0%, transparent 42%)",
      b2: "screen",
      b3: "screen"
    },
    day: {
      base: "linear-gradient(150deg, #88bce8 0%, #a2a8f0 50%, #80d4da 100%)",
      layers: [
        "#1aa0b6",
        "#ce4894",
        "#466ad2",
        "#844cd6"
      ],
      wave: "radial-gradient(circle at 32% 65%, rgba(18, 150, 170, 0.46) 0%, transparent 42%), radial-gradient(circle at 70% 34%, rgba(200, 50, 135, 0.44) 0%, transparent 42%)",
      b2: "multiply",
      b3: "soft-light"
    }
  },
  {
    key: "mirage-oasis",
    name: "Mirage Oasis",
    family: "ambient",
    speed: 0.9,
    morph: 1.3,
    hue: 36,
    blur: 6,
    night: {
      base: "linear-gradient(160deg, #4c2820 0%, #4e2238 50%, #382252 100%)",
      layers: [
        "#d46836",
        "#a0429c",
        "#d04268",
        "#dc983c"
      ],
      wave: "repeating-linear-gradient(22deg, transparent 0 8%, rgba(240, 150, 70, 0.38) 8% 16%, transparent 16% 26%, rgba(200, 80, 150, 0.36) 26% 34%)",
      b2: "screen",
      b3: "soft-light"
    },
    day: {
      base: "linear-gradient(160deg, #edb482 0%, #ea9ca8 50%, #c89ee6 100%)",
      layers: [
        "#d26232",
        "#9842a2",
        "#ce446c",
        "#da9432"
      ],
      wave: "repeating-linear-gradient(22deg, transparent 0 8%, rgba(200, 90, 30, 0.36) 8% 16%, transparent 16% 26%, rgba(160, 50, 130, 0.34) 26% 34%)",
      b2: "multiply",
      b3: "soft-light"
    }
  },
  {
    key: "liquid-dichroic",
    name: "Liquid Dichroic",
    family: "ambient",
    speed: 0.9,
    morph: 1.3,
    hue: 36,
    blur: 45,
    night: {
      base: "conic-gradient(from 40deg at 42% 48%, #224468, #4c2664, #642848, #205254, #224468)",
      layers: [
        "#2cb0d0",
        "#cc4698",
        "#824ee2",
        "#d09c3c"
      ],
      wave: "conic-gradient(from 210deg at 58% 52%, rgba(45, 205, 225, 0.48), rgba(215, 75, 165, 0.48), rgba(225, 175, 65, 0.46), rgba(125, 85, 235, 0.48), rgba(45, 205, 225, 0.48))",
      b2: "screen",
      b3: "soft-light"
    },
    day: {
      base: "conic-gradient(from 40deg at 42% 48%, #86c8ec, #c6a2f0, #f09ec2, #82dec8, #86c8ec)",
      layers: [
        "#2496bc",
        "#c64896",
        "#784cd6",
        "#d29630"
      ],
      wave: "conic-gradient(from 210deg at 58% 52%, rgba(35, 165, 205, 0.45), rgba(205, 65, 155, 0.45), rgba(215, 155, 45, 0.42), rgba(115, 75, 215, 0.45), rgba(35, 165, 205, 0.45))",
      b2: "multiply",
      b3: "soft-light"
    }
  },
  {
    key: "ink-in-water",
    name: "Ink in Water",
    family: "ambient",
    speed: 0.9,
    morph: 1.2,
    hue: 45,
    blur: 22,
    night: {
      base: "linear-gradient(145deg, #1f3458 0%, #3a2454 50%, #1c424a 100%)",
      layers: [
        "#3c7ee0",
        "#c6428e",
        "#28ae9a",
        "#8c4ee8"
      ],
      wave: "radial-gradient(ellipse 46% 56% at 34% 38%, rgba(75, 145, 245, 0.5), transparent 64%), radial-gradient(ellipse 56% 44% at 68% 64%, rgba(225, 75, 155, 0.48), transparent 64%)",
      b2: "screen",
      b3: "soft-light"
    },
    day: {
      base: "linear-gradient(145deg, #94bce8 0%, #caa8ec 50%, #8ad8cc 100%)",
      layers: [
        "#326cce",
        "#c2408c",
        "#229c8a",
        "#824ace"
      ],
      wave: "radial-gradient(ellipse 46% 56% at 34% 38%, rgba(55, 115, 225, 0.46), transparent 64%), radial-gradient(ellipse 56% 44% at 68% 64%, rgba(205, 60, 140, 0.44), transparent 64%)",
      b2: "multiply",
      b3: "soft-light"
    }
  },
  {
    key: "solar-flare",
    name: "Solar Flare",
    family: "ambient",
    speed: 0.9,
    morph: 1.2,
    hue: 45,
    blur: 39,
    night: {
      base: "linear-gradient(155deg, #4e2024 0%, #481e3e 50%, #4c3018 100%)",
      layers: [
        "#e05832",
        "#c03274",
        "#e0922c",
        "#9036a0"
      ],
      wave: "repeating-conic-gradient(from 0deg at 42% 56%, rgba(240, 115, 50, 0.42) 0deg 18deg, transparent 18deg 36deg, rgba(215, 55, 125, 0.4) 36deg 54deg, transparent 54deg 72deg)",
      b2: "screen",
      b3: "soft-light"
    },
    day: {
      base: "linear-gradient(155deg, #f2a888 0%, #ee98b8 50%, #f0c27e 100%)",
      layers: [
        "#d8502c",
        "#c23676",
        "#da8c22",
        "#8e3ca2"
      ],
      wave: "repeating-conic-gradient(from 0deg at 42% 56%, rgba(220, 85, 35, 0.4) 0deg 18deg, transparent 18deg 36deg, rgba(195, 45, 115, 0.38) 36deg 54deg, transparent 54deg 72deg)",
      b2: "multiply",
      b3: "soft-light"
    }
  },
  {
    key: "sakura-wind",
    name: "Sakura Wind",
    family: "ambient",
    speed: 0.9,
    morph: 1.2,
    hue: 45,
    blur: 14,
    night: {
      base: "linear-gradient(135deg, #44223a 0%, #30244e 50%, #442a2c 100%)",
      layers: [
        "#cc4e80",
        "#8454cc",
        "#d0724c",
        "#369e94"
      ],
      wave: "repeating-linear-gradient(128deg, transparent 0 10%, rgba(230, 105, 155, 0.4) 10% 19%, transparent 19% 30%, rgba(155, 115, 235, 0.38) 30% 39%)",
      b2: "screen",
      b3: "soft-light"
    },
    day: {
      base: "linear-gradient(135deg, #f0aec8 0%, #cab2f0 50%, #f2bea4 100%)",
      layers: [
        "#cc4c7e",
        "#8052c8",
        "#d2704a",
        "#32a296"
      ],
      wave: "repeating-linear-gradient(128deg, transparent 0 10%, rgba(205, 75, 130, 0.38) 10% 19%, transparent 19% 30%, rgba(130, 85, 210, 0.36) 30% 39%)",
      b2: "multiply",
      b3: "soft-light"
    }
  },
  {
    key: "monsoon-dusk",
    name: "Monsoon Dusk",
    family: "ambient",
    speed: 0.9,
    morph: 1.2,
    hue: 45,
    blur: 12,
    night: {
      base: "linear-gradient(175deg, #1e2c52 0%, #322252 50%, #422040 100%)",
      layers: [
        "#2e90d0",
        "#c03e82",
        "#6e4ed0",
        "#cc8036"
      ],
      wave: "repeating-linear-gradient(96deg, transparent 0 7%, rgba(95, 185, 245, 0.34) 7% 12%, transparent 12% 21%, rgba(225, 95, 165, 0.34) 21% 26%)",
      b2: "screen",
      b3: "soft-light"
    },
    day: {
      base: "linear-gradient(175deg, #90b4e8 0%, #b4a0ea 50%, #e69ec0 100%)",
      layers: [
        "#287cbe",
        "#bc3e7e",
        "#6648ca",
        "#ca7c2e"
      ],
      wave: "repeating-linear-gradient(96deg, transparent 0 7%, rgba(45, 135, 210, 0.34) 7% 12%, transparent 12% 21%, rgba(195, 65, 135, 0.34) 21% 26%)",
      b2: "multiply",
      b3: "soft-light"
    }
  },
  {
    key: "velvet-cosmos",
    name: "Velvet Cosmos",
    family: "ambient",
    speed: 0.9,
    morph: 1.2,
    hue: 45,
    blur: 18,
    night: {
      base: "conic-gradient(from 140deg at 50% 50%, #222c56, #3c2058, #4a2042, #1a3c4e, #222c56)",
      layers: [
        "#8648d4",
        "#269eb0",
        "#c04080",
        "#cc8a3c"
      ],
      wave: "conic-gradient(from 290deg at 48% 52%, transparent 0deg, rgba(155, 95, 240, 0.46) 90deg, transparent 180deg, rgba(50, 195, 210, 0.46) 270deg, transparent 360deg)",
      b2: "screen",
      b3: "screen"
    },
    day: {
      base: "conic-gradient(from 140deg at 50% 50%, #94b4ec, #c29ef0, #ee9ec4, #84d8d4, #94b4ec)",
      layers: [
        "#7c42ca",
        "#208ea2",
        "#bc3e7c",
        "#c88632"
      ],
      wave: "conic-gradient(from 290deg at 48% 52%, transparent 0deg, rgba(125, 65, 215, 0.42) 90deg, transparent 180deg, rgba(35, 165, 185, 0.42) 270deg, transparent 360deg)",
      b2: "multiply",
      b3: "soft-light"
    }
  },
  {
    key: "paper-lanterns",
    name: "Paper Lanterns",
    family: "kinetic",
    speed: 0.6,
    morph: 1.3,
    hue: 38,
    blur: 8,
    blurMult: [
      0.7,
      0.65,
      0.45
    ],
    night: {
      base: "linear-gradient(180deg, #1d2852 0%, #2e224c 52%, #3e2428 100%)",
      layers: [
        "radial-gradient(circle at 26% 32%, #e07838, transparent 48%), radial-gradient(circle at 72% 28%, #e8a23c, transparent 46%), radial-gradient(circle at 52% 68%, #d44c68, transparent 52%)",
        "radial-gradient(circle at 64% 72%, rgba(240, 145, 60, 0.8), transparent 48%), radial-gradient(circle at 34% 64%, rgba(225, 85, 115, 0.76), transparent 48%), radial-gradient(circle at 48% 30%, rgba(90, 135, 235, 0.72), transparent 52%)",
        "repeating-linear-gradient(0deg, transparent 0 7%, rgba(245, 175, 85, 0.36) 7% 13%, transparent 13% 21%, rgba(110, 155, 240, 0.32) 21% 27%)",
        "radial-gradient(circle at 50% 50%, #e48c3c, transparent 56%)"
      ],
      b2: "screen",
      b3: "overlay"
    },
    day: {
      base: "linear-gradient(180deg, #92b4ec 0%, #bfa6ec 52%, #f2b49c 100%)",
      layers: [
        "radial-gradient(circle at 26% 32%, #e67e3e, transparent 48%), radial-gradient(circle at 72% 28%, #eea842, transparent 46%), radial-gradient(circle at 52% 68%, #dc5874, transparent 52%)",
        "radial-gradient(circle at 64% 72%, rgba(215, 115, 38, 0.68), transparent 48%), radial-gradient(circle at 34% 64%, rgba(195, 65, 95, 0.65), transparent 48%), radial-gradient(circle at 48% 30%, rgba(65, 110, 210, 0.62), transparent 52%)",
        "repeating-linear-gradient(0deg, transparent 0 7%, rgba(215, 135, 45, 0.36) 7% 13%, transparent 13% 21%, rgba(75, 115, 205, 0.32) 21% 27%)",
        "radial-gradient(circle at 50% 50%, #ea9242, transparent 56%)"
      ],
      b2: "multiply",
      b3: "soft-light"
    }
  },
  {
    key: "vapor-horizon",
    name: "Vapor Horizon",
    family: "kinetic",
    speed: 0.4,
    morph: 1.3,
    hue: 38,
    blur: 4,
    blurMult: [
      0.6,
      0.55,
      0.35
    ],
    night: {
      base: "linear-gradient(165deg, #242258 0%, #481e48 52%, #4c2824 100%)",
      layers: [
        "linear-gradient(135deg, #24a8c8 0%, #7c44d8 36%, #d44288 68%, #e08238 100%)",
        "radial-gradient(ellipse 58% 44% at 50% 62%, rgba(240, 125, 60, 0.82), transparent 62%), radial-gradient(ellipse 54% 46% at 48% 32%, rgba(45, 195, 225, 0.78), transparent 62%)",
        "repeating-linear-gradient(162deg, transparent 0 8%, rgba(45, 215, 235, 0.4) 8% 14%, transparent 14% 24%, rgba(235, 85, 165, 0.4) 24% 30%)",
        "radial-gradient(circle at 50% 50%, #d84c92, transparent 56%)"
      ],
      b2: "screen",
      b3: "overlay"
    },
    day: {
      base: "linear-gradient(165deg, #92b0f0 0%, #dca0dc 52%, #f4b494 100%)",
      layers: [
        "linear-gradient(135deg, #48bce0 0%, #9868e8 36%, #e664a4 68%, #f09852 100%)",
        "radial-gradient(ellipse 58% 44% at 50% 62%, rgba(215, 95, 38, 0.65), transparent 62%), radial-gradient(ellipse 54% 46% at 48% 32%, rgba(35, 155, 195, 0.65), transparent 62%)",
        "repeating-linear-gradient(162deg, transparent 0 8%, rgba(35, 155, 185, 0.36) 8% 14%, transparent 14% 24%, rgba(195, 60, 135, 0.36) 24% 30%)",
        "radial-gradient(circle at 50% 50%, #e0589c, transparent 56%)"
      ],
      b2: "multiply",
      b3: "soft-light"
    }
  },
  {
    key: "turrell-skyspace",
    name: "Turrell Skyspace",
    family: "kinetic",
    speed: 1.15,
    morph: 1.3,
    hue: 38,
    blur: 4,
    blurMult: [
      0.85,
      0.8,
      0.6
    ],
    night: {
      base: "radial-gradient(ellipse 65% 58% at 50% 50%, #244868 0%, #382458 55%, #4a2436 100%)",
      layers: [
        "radial-gradient(ellipse 46% 42% at 50% 50%, #28a8b8 0%, #5c48c8 48%, transparent 74%)",
        "radial-gradient(ellipse 62% 56% at 48% 52%, rgba(225, 105, 75, 0.78) 0%, rgba(175, 65, 145, 0.72) 45%, transparent 72%)",
        "conic-gradient(from 0deg at 50% 50%, rgba(60, 205, 215, 0.42), rgba(225, 115, 85, 0.42), rgba(145, 85, 235, 0.42), rgba(60, 205, 215, 0.42))",
        "radial-gradient(circle at 50% 50%, #32b4c4, transparent 52%)"
      ],
      b2: "screen",
      b3: "soft-light"
    },
    day: {
      base: "radial-gradient(ellipse 65% 58% at 50% 50%, #86cce8 0%, #baa4ec 55%, #eea4bc 100%)",
      layers: [
        "radial-gradient(ellipse 46% 42% at 50% 50%, #32b2c4 0%, #7260d8 48%, transparent 74%)",
        "radial-gradient(ellipse 62% 56% at 48% 52%, rgba(215, 92, 62, 0.65) 0%, rgba(165, 58, 135, 0.62) 45%, transparent 72%)",
        "conic-gradient(from 0deg at 50% 50%, rgba(40, 165, 180, 0.38), rgba(205, 95, 65, 0.38), rgba(125, 65, 205, 0.38), rgba(40, 165, 180, 0.38))",
        "radial-gradient(circle at 50% 50%, #38b8c8, transparent 52%)"
      ],
      b2: "multiply",
      b3: "soft-light"
    }
  },
  {
    key: "molten-dichro",
    name: "Molten Dichro",
    family: "kinetic",
    speed: 0.9,
    morph: 1.3,
    hue: 38,
    blur: 4,
    blurMult: [
      0.65,
      0.6,
      0.4
    ],
    night: {
      base: "linear-gradient(145deg, #2c2438 0%, #1e383e 50%, #3e2822 100%)",
      layers: [
        "conic-gradient(from 60deg at 40% 50%, #c87442, #289894, #7c52b8, #c89848, #28749c, #c87442)",
        "conic-gradient(from 240deg at 60% 50%, rgba(55, 195, 185, 0.78), rgba(225, 125, 75, 0.78), rgba(165, 105, 225, 0.75), rgba(55, 195, 185, 0.78))",
        "repeating-linear-gradient(135deg, transparent 0 10%, rgba(245, 205, 155, 0.42) 10% 16%, transparent 16% 28%, rgba(115, 225, 215, 0.4) 28% 34%)",
        "radial-gradient(circle at 45% 45%, #d08048, transparent 55%), radial-gradient(circle at 58% 58%, #2ca8a2, transparent 55%)"
      ],
      b2: "screen",
      b3: "overlay"
    },
    day: {
      base: "linear-gradient(145deg, #c2b0de 0%, #88d4d2 50%, #ecb89e 100%)",
      layers: [
        "conic-gradient(from 60deg at 40% 50%, #dc824e, #36aba6, #8c62c8, #dca852, #3886b0, #dc824e)",
        "conic-gradient(from 240deg at 60% 50%, rgba(35, 155, 148, 0.65), rgba(205, 95, 48, 0.65), rgba(135, 75, 195, 0.62), rgba(35, 155, 148, 0.65))",
        "repeating-linear-gradient(135deg, transparent 0 10%, rgba(195, 135, 75, 0.38) 10% 16%, transparent 16% 28%, rgba(45, 155, 148, 0.38) 28% 34%)",
        "radial-gradient(circle at 45% 45%, #dc8852, transparent 55%), radial-gradient(circle at 58% 58%, #34b2ac, transparent 55%)"
      ],
      b2: "multiply",
      b3: "soft-light"
    }
  },
  {
    key: "cathedral-rose",
    name: "Cathedral Rose",
    family: "kinetic",
    speed: 0.25,
    morph: 1.3,
    hue: 38,
    blur: 38,
    blurMult: [
      0.55,
      0.5,
      0.3
    ],
    night: {
      base: "linear-gradient(145deg, #241d48 0%, #3d1d38 50%, #18364a 100%)",
      layers: [
        "repeating-conic-gradient(from 0deg at 36% 44%, #b83268 0deg 22deg, #2e6ec4 22deg 45deg, #249678 45deg 68deg, #c8822b 68deg 90deg)",
        "repeating-conic-gradient(from 15deg at 64% 56%, rgba(135, 72, 215, 0.78) 0deg 25deg, transparent 25deg 50deg, rgba(215, 78, 120, 0.75) 50deg 75deg, transparent 75deg 100deg)",
        "radial-gradient(circle at 50% 50%, rgba(245, 185, 90, 0.45), transparent 55%), repeating-linear-gradient(45deg, rgba(255,255,255,0.12) 0 4%, transparent 4% 12%)",
        "radial-gradient(circle at 35% 35%, #d64a84, transparent 58%), radial-gradient(circle at 68% 65%, #3498b8, transparent 58%)"
      ],
      b2: "screen",
      b3: "overlay"
    },
    day: {
      base: "linear-gradient(145deg, #98b4ec 0%, #e6a4c4 50%, #86d8c8 100%)",
      layers: [
        "repeating-conic-gradient(from 0deg at 36% 44%, #e8689a 0deg 22deg, #5c9ce8 22deg 45deg, #4cc4a4 45deg 68deg, #f0ae54 68deg 90deg)",
        "repeating-conic-gradient(from 15deg at 64% 56%, rgba(145, 92, 225, 0.65) 0deg 25deg, transparent 25deg 50deg, rgba(225, 88, 130, 0.65) 50deg 75deg, transparent 75deg 100deg)",
        "radial-gradient(circle at 50% 50%, rgba(250, 200, 110, 0.5), transparent 55%), repeating-linear-gradient(45deg, rgba(60,40,90,0.12) 0 4%, transparent 4% 12%)",
        "radial-gradient(circle at 35% 35%, #e26498, transparent 58%), radial-gradient(circle at 68% 65%, #46a8c8, transparent 58%)"
      ],
      b2: "multiply",
      b3: "soft-light"
    }
  },
  {
    key: "origami-prism",
    name: "Origami Prism",
    family: "kinetic",
    speed: 0.25,
    morph: 1.3,
    hue: 38,
    blur: 18,
    blurMult: [
      0.4,
      0.4,
      0.25
    ],
    night: {
      base: "linear-gradient(135deg, #1b3456 0%, #342254 50%, #1c444c 100%)",
      layers: [
        "linear-gradient(115deg, transparent 12%, rgba(45, 175, 215, 0.75) 13% 34%, transparent 35% 52%, rgba(165, 75, 225, 0.75) 53% 74%, transparent 75%)",
        "linear-gradient(62deg, transparent 10%, rgba(220, 75, 148, 0.72) 11% 32%, transparent 33% 54%, rgba(45, 195, 165, 0.72) 55% 78%, transparent 79%)",
        "repeating-linear-gradient(-38deg, rgba(120, 210, 250, 0.35) 0 6%, transparent 6% 15%, rgba(235, 125, 190, 0.35) 15% 21%, transparent 21% 30%)",
        "conic-gradient(from 90deg at 50% 50%, #2a98c8, #8c4ce0, #d44c98, #28b298, #2a98c8)"
      ],
      b2: "screen",
      b3: "overlay"
    },
    day: {
      base: "linear-gradient(135deg, #8cc4ec 0%, #bca6f0 50%, #84dec8 100%)",
      layers: [
        "linear-gradient(115deg, transparent 12%, rgba(35, 145, 195, 0.65) 13% 34%, transparent 35% 52%, rgba(145, 65, 205, 0.65) 53% 74%, transparent 75%)",
        "linear-gradient(62deg, transparent 10%, rgba(205, 65, 138, 0.62) 11% 32%, transparent 33% 54%, rgba(35, 165, 140, 0.62) 55% 78%, transparent 79%)",
        "repeating-linear-gradient(-38deg, rgba(50, 130, 190, 0.3) 0 6%, transparent 6% 15%, rgba(190, 75, 145, 0.3) 15% 21%, transparent 21% 30%)",
        "conic-gradient(from 90deg at 50% 50%, #48aae0, #9c6ce8, #e06ca8, #42c4a8, #48aae0)"
      ],
      b2: "multiply",
      b3: "soft-light"
    }
  },
  {
    key: "kaleidoscope-bloom",
    name: "Kaleidoscope Bloom",
    family: "kinetic",
    speed: 0.2,
    morph: 1.3,
    hue: 38,
    blur: 56,
    blurMult: [
      0.5,
      0.45,
      0.35
    ],
    night: {
      base: "radial-gradient(circle at 50% 50%, #3a2252 0%, #1c3652 60%, #243e3c 100%)",
      layers: [
        "repeating-conic-gradient(from 0deg at 50% 50%, #26a89e 0deg 15deg, #8848d2 15deg 30deg, #d45278 30deg 45deg, #c89232 45deg 60deg)",
        "repeating-radial-gradient(circle at 50% 50%, rgba(225, 95, 155, 0.65) 0 8%, transparent 8% 16%, rgba(55, 195, 205, 0.65) 16% 24%, transparent 24% 32%)",
        "repeating-conic-gradient(from 30deg at 50% 50%, rgba(255, 210, 110, 0.42) 0deg 12deg, transparent 12deg 24deg)",
        "radial-gradient(circle at 40% 40%, #28b8ac, transparent 55%), radial-gradient(circle at 60% 60%, #d45288, transparent 55%)"
      ],
      b2: "screen",
      b3: "overlay"
    },
    day: {
      base: "radial-gradient(circle at 50% 50%, #c8a8ec 0%, #8ec4ec 60%, #8adecc 100%)",
      layers: [
        "repeating-conic-gradient(from 0deg at 50% 50%, #38b8ae 0deg 15deg, #9862e0 15deg 30deg, #e2688c 30deg 45deg, #e0a642 45deg 60deg)",
        "repeating-radial-gradient(circle at 50% 50%, rgba(195, 65, 130, 0.55) 0 8%, transparent 8% 16%, rgba(35, 155, 170, 0.55) 16% 24%, transparent 24% 32%)",
        "repeating-conic-gradient(from 30deg at 50% 50%, rgba(215, 145, 40, 0.38) 0deg 12deg, transparent 12deg 24deg)",
        "radial-gradient(circle at 40% 40%, #32b8ac, transparent 55%), radial-gradient(circle at 60% 60%, #dc6294, transparent 55%)"
      ],
      b2: "multiply",
      b3: "soft-light"
    }
  }
];
function buildStage(parent, family) {
  const stage = parent.createDiv({ cls: `fantasy-easel-stage fe-${family}` });
  for (let i = 1; i <= 4; i++) stage.createDiv({ cls: `fe-l${i}` });
  return stage;
}
var StageHost = class {
  constructor() {
    this.el = null;
  }
  sync(family) {
    const host = document.querySelector(".app-container");
    if (!family || !host) return this.remove();
    if (!this.el || !this.el.isConnected) {
      this.el?.remove();
      this.el = buildStage(host, family);
      host.prepend(this.el);
    }
    this.el.className = `fantasy-easel-stage fe-${family}`;
  }
  remove() {
    this.el?.remove();
    this.el = null;
  }
};

// src/catalog.ts
var THEME_COLORS = [
  { cls: "fantasy-theme-Black", name: "Dark" },
  { cls: "fantasy-theme-SkyBlue", name: "Sky Blue" },
  { cls: "fantasy-theme-OceanTeal", name: "Ocean Teal" },
  { cls: "fantasy-theme-EmeraldGreen", name: "Emerald Green" },
  { cls: "fantasy-theme-MysticPurple", name: "Mystic Purple" },
  { cls: "fantasy-theme-OrchidMagenta", name: "Orchid Magenta" }
];
var CSS_BG = [
  ...CSS_BACKGROUNDS.map((b) => ({ id: `css-${b.key}`, name: b.name, kind: b.kind, palette: b.palette, cls: `fantasy-easel-bg-${b.key}` })),
  ...STAGES.map((s) => ({ id: `css-${s.key}`, name: s.name, kind: "motion", palette: "fixed", cls: `fantasy-easel-bg-${s.key}`, stage: s.family }))
];
function toCssUrl(src) {
  const s = src.trim();
  if (!s) return "";
  if (/^url\(/i.test(s)) return s;
  return `url("${s.replace(/["\\]/g, "\\$&")}")`;
}
var imageBackgrounds = (images) => images.map((img, i) => ({ id: `img-${img.id}`, name: img.name?.trim() || `Picture ${i + 1}`, kind: "image", url: toCssUrl(img.src) })).filter((b) => b.url);
var allBackgrounds = (images) => [...CSS_BG, ...imageBackgrounds(images)];
var newImageId = () => Math.random().toString(36).slice(2, 8);
var ACCENT_CLASS = "fantasy-theme-accent";
var CARD_OFF_CLASS = "fantasy-theme-card-off";
var LEGACY_CARD_CLASS = "fantasy-theme-card-layout";
var MARKER_CLASS = "fantasy-easel";
var STILL_CLASS = "fantasy-easel-still";
var FORCE_MOTION_CLASS = "fantasy-easel-force-motion";
var PAUSE_UNFOCUSED_CLASS = "fantasy-easel-pause-unfocused";
var STAGE_CLASS = "fantasy-easel-stage-on";
var MOTION_CLASS = "fantasy-easel-motion";
var THEME_DEFAULTS = {
  color: "fantasy-theme-Black"
};
var DEFAULT_BACKGROUND = "css-plasma";
var colorByCls = (cls) => THEME_COLORS.find((c) => c.cls === cls);
var backgroundById = (id, images = []) => allBackgrounds(images).find((b) => b.id === id);

// src/skins.ts
var SKINS = [
  { id: "excalidraw", name: "Excalidraw", desc: "Drawings show the Fantasy wallpaper behind the canvas; embedded notes sit on tinted glass cards without their properties block." },
  { id: "dataview", name: "Dataview", desc: "Query results (tables, lists, tasks) sit on the glass card with rounded corners and slightly smaller text." },
  { id: "kanban", name: "Kanban", desc: "Board, lanes and cards use the glass colors; lane headers follow the heading colors." }
];
var skinClass = (id) => `fantasy-easel-skin-${id}`;
var skinOn = (skins, s) => skins[s.id] ?? true;

// src/tuning.ts
var TUNING_GROUPS = [
  { id: "glass", name: "Glass" },
  { id: "cards", name: "Cards" },
  { id: "text", name: "Text" },
  { id: "motion", name: "Motion" }
];
var HEADINGS = [1.3, 1.2, 1.15, 1.1, 1.05];
var round = (n) => Math.round(n * 1e3) / 1e3;
var TUNINGS = [
  { key: "opacity", name: "Panel opacity", desc: "How solid the glass panels are.", group: "glass", min: 0.2, max: 0.95, step: 0.01, unit: "", def: { dark: 0.6, light: 0.67 }, vars: (v) => ({ "--background-opacity": `${v}` }) },
  { key: "blur", name: "Glass blur", desc: "Blur of the background behind the panels.", group: "glass", min: 0, max: 24, step: 1, unit: "px", def: { dark: 8, light: 12 }, vars: (v) => ({ "--fantasy-glass-blur": `${v}px` }) },
  { key: "brightness", name: "Background brightness", desc: "Brightness of the background behind the panels.", group: "glass", min: 0.5, max: 1.3, step: 0.01, unit: "", def: { dark: 0.8, light: 1.05 }, vars: (v) => ({ "--fantasy-glass-brightness": `${v}` }) },
  { key: "cardGap", name: "Card gap", desc: "Space between the cards.", group: "cards", min: 0, max: 16, step: 1, unit: "px", def: { dark: 4, light: 4 }, vars: (v) => ({ "--cardview-gap": `${v}px` }), cardOnly: true },
  { key: "cardRadius", name: "Card corners", desc: "Corner radius of the cards.", group: "cards", min: 0, max: 32, step: 1, unit: "px", def: { dark: 20, light: 20 }, vars: (v) => ({ "--cardview-radius": `${v}px` }), cardOnly: true },
  { key: "cardPadding", name: "Card padding", desc: "Space inside the cards (top and bottom; sides get half).", group: "cards", min: 0, max: 24, step: 1, unit: "px", def: { dark: 10, light: 10 }, vars: (v) => ({ "--cardview-padding": `${v}px ${v / 2}px` }), cardOnly: true },
  { key: "lineWidth", name: "Note width", desc: "Readable line length.", group: "text", min: 600, max: 1600, step: 10, unit: "px", def: { dark: 850, light: 850 }, vars: (v) => ({ "--file-line-width": `${v}px` }) },
  { key: "headingScale", name: "Heading size", desc: "How much larger headings are than body text (1 = theme).", group: "text", min: 0, max: 2, step: 0.05, unit: "\xD7", def: { dark: 1, light: 1 }, vars: (v) => Object.fromEntries(HEADINGS.map((h, i) => [`--h${i + 1}-size`, `${round(1 + (h - 1) * v)}em`])) },
  { key: "paragraph", name: "Paragraph spacing", desc: "Space between paragraphs.", group: "text", min: 0, max: 1.5, step: 0.05, unit: "rem", def: { dark: 0.5, light: 0.5 }, vars: (v) => ({ "--p-spacing": `${v}rem` }) },
  { key: "propertiesRadius", name: "Properties corners", desc: "Corner radius of the properties tray.", group: "text", min: 0, max: 24, step: 1, unit: "px", def: { dark: 14, light: 14 }, vars: (v) => ({ "--metadata-border-radius": `${v}px` }) },
  { key: "stageSpeed", name: "Stage speed", desc: "Speed of the stage backgrounds (four moving layers).", group: "motion", min: 0.25, max: 2, step: 0.05, unit: "\xD7", def: { dark: 1, light: 1 }, vars: (v) => ({ "--fantasy-easel-speed": `${v}` }) }
];
var TUNING_VARS = [...new Set(TUNINGS.flatMap((t) => Object.keys(t.vars(t.def.dark))))];
var tuningByKey = (key) => TUNINGS.find((t) => t.key === key);
function tuningVars(values, card) {
  const out = {};
  for (const t of TUNINGS) {
    const v = values[t.key];
    if (typeof v !== "number" || !Number.isFinite(v) || t.cardOnly && !card) continue;
    Object.assign(out, t.vars(Math.min(t.max, Math.max(t.min, v))));
  }
  return out;
}

// src/apply.ts
var MANAGED = /* @__PURE__ */ new Set([...THEME_COLORS.map((c) => c.cls), ...CSS_BG.map((b) => b.cls), ACCENT_CLASS, CARD_OFF_CLASS, LEGACY_CARD_CLASS, MARKER_CLASS, STILL_CLASS, MOTION_CLASS, STAGE_CLASS, FORCE_MOTION_CLASS, PAUSE_UNFOCUSED_CLASS, ...SKINS.map((s) => skinClass(s.id))]);
var THEME_GROUP = [...THEME_COLORS.map((c) => c.cls), ACCENT_CLASS, CARD_OFF_CLASS, LEGACY_CARD_CLASS];
var URL_VAR = "--background-url";
var OLD_VARS = ["--background-url1", "--background-url2", "--background-url3"];
function wantedClasses(s) {
  const bg = backgroundById(s.look.background, s.look.images);
  const out = /* @__PURE__ */ new Set([MARKER_CLASS, s.look.color]);
  if (bg?.cls) out.add(bg.cls);
  if (bg?.stage) out.add(STAGE_CLASS);
  else if (bg?.kind === "motion") out.add(MOTION_CLASS);
  if (s.look.accent) out.add(ACCENT_CLASS);
  if (!s.look.card) out.add(CARD_OFF_CLASS);
  if (s.motion === "off") out.add(STILL_CLASS);
  if (s.motion === "on") out.add(FORCE_MOTION_CLASS);
  if (s.pauseUnfocused) out.add(PAUSE_UNFOCUSED_CLASS);
  for (const sk of SKINS) if (s.skins[sk.id] ?? true) out.add(skinClass(sk.id));
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
    this.observer?.disconnect();
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
    if (value !== now) {
      this.body.setCssProps({ [URL_VAR]: value });
      changed++;
    }
    const tuned = tuningVars(s.tuning, s.look.card);
    for (const v of TUNING_VARS) {
      const want2 = tuned[v] ?? "";
      if (this.body.style.getPropertyValue(v) !== want2) {
        this.body.setCssProps({ [v]: want2 });
        changed++;
      }
    }
    for (const v of OLD_VARS) if (this.body.style.getPropertyValue(v)) {
      this.body.setCssProps({ [v]: "" });
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
  /** Remove everything Easel added; the theme shows its defaults (Dark, Plasma still, cards). */
  detach() {
    this.observer?.disconnect();
    this.observer = null;
    const cl = this.body.classList;
    for (const b of CSS_BG) cl.remove(b.cls);
    cl.remove(MARKER_CLASS, STILL_CLASS, MOTION_CLASS, STAGE_CLASS, FORCE_MOTION_CLASS, PAUSE_UNFOCUSED_CLASS, ...SKINS.map((s) => skinClass(s.id)));
    for (const c of THEME_GROUP) cl.remove(c);
    this.body.setCssProps(Object.fromEntries([URL_VAR, ...OLD_VARS, ...TUNING_VARS].map((v) => [v, ""])));
  }
};

// src/gallery.ts
var import_obsidian2 = require("obsidian");
var GROUPS = [
  { title: "Theme color", desc: "Follows the theme color.", pick: (b) => b.kind === "static" && b.palette === "theme" },
  { title: "Fixed palette", desc: "Same colors with any theme color.", pick: (b) => b.kind === "static" && b.palette === "fixed" },
  { title: "Motion", desc: "Moves slowly.", pick: (b) => b.kind === "motion" }
];
function renderGallery(root, store, opts) {
  root.addClass("fantasy-easel-gallery");
  const lazy = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const tile = e.target;
      const stage = tile.querySelector(":scope > .fantasy-easel-stage");
      if (e.isIntersecting && !stage) tile.prepend(buildStage(tile, tile.dataset.stage));
      else if (!e.isIntersecting && stage) stage.remove();
    }
  }, { root: opts.scrollRoot, rootMargin: "150px 0px" });
  const { motion } = store.settings;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const moving = !opts.still && (motion === "on" || motion === "auto" && !reduced);
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
        layer.setCssProps({ "--fe-tile-image": `var(--fantasy-easel-grad-${b.key})`, "--fe-tile-motion": b.motion ? motionCss(b.motion) : "none" });
        if (b.motion?.over) {
          const over = tile.createDiv({ cls: "fantasy-easel-tile-layer" });
          over.setCssProps({ "--fe-tile-image": `var(--fantasy-easel-grad-${b.key}-b)`, "--fe-tile-blend": `var(--fantasy-easel-blend-${b.key})`, "--fe-tile-motion": motionCss(b.motion.over) });
        }
        const card = tile.createDiv({ cls: "fantasy-easel-tile-card" });
        card.createDiv({ cls: "fantasy-easel-tile-h", text: "Heading" });
        card.createDiv({ cls: "fantasy-easel-tile-p", text: "Body text on the glass card." });
        tile.addEventListener("click", () => store.setLook({ background: `css-${b.key}` }));
        tile.addEventListener("keydown", (ev) => {
          if (ev.key === "Enter" || ev.key === " ") {
            ev.preventDefault();
            store.setLook({ background: `css-${b.key}` });
          }
        });
      }
    }
  }
  for (const [family, title, desc2] of [
    ["ambient", "Stage \xB7 ambient", "Four layers of color fields and a texture, drifting and turning."],
    ["kinetic", "Stage \xB7 kinetic", "Four layer pictures: glass, prism and light patterns that slide and turn."]
  ]) {
    const section2 = root.createDiv({ cls: "fantasy-easel-gallery-group" });
    section2.createDiv({ cls: "fantasy-easel-gallery-title", text: title });
    section2.createDiv({ cls: "fantasy-easel-gallery-desc setting-item-description", text: desc2 });
    for (const s of STAGES.filter((x) => x.family === family)) {
      const id = `css-${s.key}`;
      const row = section2.createDiv({ cls: "fantasy-easel-gallery-row", attr: { "data-id": id } });
      const label = row.createDiv({ cls: "fantasy-easel-gallery-name" });
      label.createSpan({ text: s.name });
      const check = label.createSpan({ cls: "fantasy-easel-gallery-check" });
      (0, import_obsidian2.setIcon)(check, "check");
      for (const side of ["day", "night"]) {
        const tile = row.createDiv({ cls: `fantasy-easel-tile fantasy-easel-${side} fantasy-easel-bg-${s.key}`, attr: { "aria-label": `${s.name} (${side})`, role: "button", tabindex: "0" } });
        tile.dataset.stage = s.family;
        lazy.observe(tile);
        const card = tile.createDiv({ cls: "fantasy-easel-tile-card" });
        card.createDiv({ cls: "fantasy-easel-tile-h", text: "Heading" });
        card.createDiv({ cls: "fantasy-easel-tile-p", text: "Body text on the glass card." });
        tile.addEventListener("click", () => store.setLook({ background: id }));
        tile.addEventListener("keydown", (ev) => {
          if (ev.key === "Enter" || ev.key === " ") {
            ev.preventDefault();
            store.setLook({ background: id });
          }
        });
      }
    }
  }
  const mine = imageBackgrounds(store.settings.look.images);
  const section = root.createDiv({ cls: "fantasy-easel-gallery-group" });
  section.createDiv({ cls: "fantasy-easel-gallery-title", text: "Your pictures" });
  const desc = section.createDiv({ cls: "fantasy-easel-gallery-desc setting-item-description", text: "Added in settings with +. Same picture in day and night." });
  if (opts.addPicture) {
    const add = desc.createEl("button", { cls: "fantasy-easel-gallery-add", text: "Add picture" });
    add.addEventListener("click", () => opts.addPicture?.());
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
      layer.setCssProps({ "--fe-tile-image": b.url });
      const card = tile.createDiv({ cls: "fantasy-easel-tile-card" });
      card.createDiv({ cls: "fantasy-easel-tile-h", text: "Heading" });
      card.createDiv({ cls: "fantasy-easel-tile-p", text: "Body text on the glass card." });
      tile.addEventListener("click", () => store.setLook({ background: b.id }));
      tile.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter" || ev.key === " ") {
          ev.preventDefault();
          store.setLook({ background: b.id });
        }
      });
    }
  }
  const markCurrent = () => {
    const id = store.settings.look.background;
    root.querySelectorAll(".fantasy-easel-gallery-row").forEach((r) => r.toggleClass("is-current", r.dataset.id === id));
  };
  markCurrent();
  const unsubscribe = store.subscribe(markCurrent);
  return () => {
    unsubscribe();
    lazy.disconnect();
  };
}
var GalleryModal = class extends import_obsidian2.Modal {
  constructor(app, store, managePictures) {
    super(app);
    this.store = store;
    this.managePictures = managePictures;
    this.cleanup = null;
  }
  onOpen() {
    this.modalEl.addClass("fantasy-easel-gallery-modal");
    this.setTitle("Backgrounds");
    const root = this.contentEl.createDiv();
    const add = this.managePictures;
    this.cleanup = renderGallery(root, this.store, { scrollRoot: this.modalEl, addPicture: add ? () => {
      this.close();
      add();
    } : void 0 });
    root.querySelector(".fantasy-easel-gallery-row.is-current")?.scrollIntoView({ block: "center" });
  }
  onClose() {
    this.cleanup?.();
    this.cleanup = null;
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
var STATUS_IDS = ["color", "prev", "background", "next", "gallery", "accent", "card", "motion", "mode"];
var MOTIONS = ["auto", "on", "off"];
var DEFAULT_LOOK = {
  color: THEME_DEFAULTS.color,
  background: DEFAULT_BACKGROUND,
  accent: false,
  card: true,
  images: []
};
var DEFAULT_SETTINGS = { look: DEFAULT_LOOK, motion: "auto", pauseUnfocused: false, statusBar: true, statusItems: STATUS_IDS.map((id) => ({ id, on: true })), tuning: {}, skins: {}, excalidrawBackup: null };
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
  let images = Array.isArray(look.images) ? look.images.filter((x) => !!x && typeof x.id === "string" && typeof x.src === "string").map((x) => ({ id: x.id, src: x.src, ...typeof x.name === "string" && x.name ? { name: x.name } : {} })) : [];
  let background = typeof look.background === "string" ? look.background : "";
  if (!Array.isArray(look.images) && Array.isArray(look.urls)) {
    const old = fromOldUrls(look.urls, background);
    images = old.images;
    if (old.background) background = old.background;
  }
  const seen = /* @__PURE__ */ new Set();
  const statusItems = [];
  for (const x of Array.isArray(data?.statusItems) ? data.statusItems : []) {
    if (!x || !STATUS_IDS.includes(x.id) || seen.has(x.id)) continue;
    seen.add(x.id);
    statusItems.push({ id: x.id, on: x.on !== false });
  }
  for (const id of STATUS_IDS) if (!seen.has(id)) statusItems.push({ id, on: true });
  const tuning = {};
  for (const [k, v] of Object.entries(data?.tuning ?? {})) if (tuningByKey(k) && typeof v === "number" && Number.isFinite(v)) tuning[k] = v;
  const skins = {};
  for (const [k, v] of Object.entries(data?.skins ?? {})) if (typeof v === "boolean") skins[k] = v;
  return {
    look: {
      // a color dropped from the list falls back to Dark
      color: typeof look.color === "string" && colorByCls(look.color) ? look.color : DEFAULT_LOOK.color,
      background: backgroundById(background, images) ? background : DEFAULT_LOOK.background,
      accent: look.accent === true,
      card: look.card !== false,
      images
    },
    motion: MOTIONS.includes(data?.motion) ? data.motion : "auto",
    pauseUnfocused: data?.pauseUnfocused === true,
    statusBar: data?.statusBar !== false,
    statusItems,
    tuning,
    skins,
    excalidrawBackup: data?.excalidrawBackup && typeof data.excalidrawBackup === "object" ? { ...data.excalidrawBackup } : null
  };
}

// src/settings-tab.ts
var import_obsidian5 = require("obsidian");

// src/excalidraw.ts
var import_obsidian4 = require("obsidian");
var ID = "obsidian-excalidraw-plugin";
var EXCALIDRAW_WANTED = [
  { key: "dynamicStyling", label: "Dynamic styling", value: "none" },
  { key: "iframeMatchExcalidrawTheme", label: "Markdown embeds to match Excalidraw theme", value: true },
  { key: "matchTheme", label: "New drawing to match Obsidian theme", value: true },
  { key: "matchThemeAlways", label: "Existing drawings to match Obsidian theme", value: true },
  { key: "matchThemeTrigger", label: "Excalidraw to follow when Obsidian Theme changes", value: true }
];
function excalidraw(app) {
  const p = app.plugins?.getPlugin?.(ID);
  if (!p || typeof p.settings !== "object" || typeof p.saveSettings !== "function") return null;
  return EXCALIDRAW_WANTED.every((w) => w.key in p.settings) ? p : null;
}
var show = (v) => typeof v === "boolean" ? v ? "on" : "off" : String(v);
function excalidrawDiff(app) {
  const p = excalidraw(app);
  if (!p) return [];
  return EXCALIDRAW_WANTED.filter((w) => p.settings[w.key] !== w.value).map((w) => ({ w, now: p.settings[w.key] }));
}
var excalidrawAvailable = (app) => excalidraw(app) !== null;
async function apply(app, store) {
  const p = excalidraw(app);
  if (!p) return;
  const diff = excalidrawDiff(app);
  if (!diff.length) return;
  const backup = { ...Object.fromEntries(diff.map((d) => [d.w.key, d.now])), ...store.settings.excalidrawBackup ?? {} };
  store.set({ excalidrawBackup: backup });
  for (const d of diff) p.settings[d.w.key] = d.w.value;
  await p.saveSettings();
  new import_obsidian4.Notice("Excalidraw settings changed. Reopen open drawings to see it.");
}
async function restoreExcalidraw(app, store) {
  const p = excalidraw(app);
  const backup = store.settings.excalidrawBackup;
  if (!p || !backup) return;
  for (const [k, v] of Object.entries(backup)) if (k in p.settings) p.settings[k] = v;
  await p.saveSettings();
  store.set({ excalidrawBackup: null });
  new import_obsidian4.Notice("Excalidraw settings restored. Reopen open drawings to see it.");
}
var ExcalidrawSettingsModal = class extends import_obsidian4.Modal {
  constructor(app, store) {
    super(app);
    this.store = store;
  }
  onOpen() {
    this.setTitle("Match Excalidraw settings");
    const diff = excalidrawDiff(this.app);
    this.contentEl.createEl("p", { text: "The Excalidraw skin shows the Fantasy wallpaper only when Excalidraw follows the Obsidian theme. Fantasy Easel will change these Excalidraw settings:" });
    const ul = this.contentEl.createEl("ul");
    for (const d of diff) ul.createEl("li", { text: `${d.w.label}: ${show(d.now)} \u2192 ${show(d.w.value)}` });
    this.contentEl.createEl("p", { text: "The current values are kept: Settings \u2192 Fantasy Easel \u2192 Plugin skins \u2192 Restore puts them back." });
    new import_obsidian4.Setting(this.contentEl).addButton((b) => b.setButtonText("Not now").onClick(() => this.close())).addButton((b) => b.setButtonText("Change Excalidraw settings").setCta().onClick(async () => {
      this.close();
      await apply(this.app, this.store);
    }));
  }
  onClose() {
    this.contentEl.empty();
  }
};

// src/options.ts
var colorOptions = () => Object.fromEntries(THEME_COLORS.map((c) => [c.cls, c.name]));
var KIND = { static: "CSS", motion: "Motion", image: "Picture" };
var backgroundOptions = (images) => Object.fromEntries(allBackgrounds(images).map((b) => [b.id, `${b.stage ? "Stage" : KIND[b.kind]} \xB7 ${b.name}`]));
var MOTION_OPTIONS = { auto: "Auto", on: "On", off: "Off" };

// src/settings-tab.ts
var FANTASY_URL = "https://github.com/especialkim/obsidian-theme-fantasy";
var STATUS_LABEL = {
  color: "Theme color",
  prev: "Previous background",
  background: "Background name",
  next: "Next background",
  gallery: "Gallery",
  accent: "Theme accent",
  card: "Card layout",
  motion: "Motion",
  mode: "Dark / light"
};
var FantasyEaselSettingTab = class extends import_obsidian5.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
    this.queued = false;
    this.icon = "palette";
    plugin.register(plugin.store.subscribe(() => this.queueUpdate()));
  }
  queueUpdate() {
    if (this.queued) return;
    this.queued = true;
    queueMicrotask(() => {
      this.queued = false;
      this.update();
    });
  }
  getControlValue(key) {
    const s = this.plugin.store.settings;
    if (key.startsWith("look.")) return s.look[key.slice(5)];
    return s[key];
  }
  setControlValue(key, value) {
    const store = this.plugin.store;
    if (key.startsWith("look.")) store.setLook({ [key.slice(5)]: value });
    else store.set({ [key]: value });
  }
  getSettingDefinitions() {
    if (!this.plugin.active) return this.noTheme();
    const store = this.plugin.store;
    const { look, statusItems, skins } = store.settings;
    const setImages = (images) => {
      const bg = store.settings.look.background;
      const keep = !bg.startsWith("img-") || images.some((x) => `img-${x.id}` === bg && toCssUrl(x.src));
      store.setLook(keep ? { images } : { images, background: DEFAULT_BACKGROUND });
    };
    const patchImage = (id, patch) => setImages(store.settings.look.images.map((x) => x.id === id ? { ...x, ...patch } : x));
    const move = (list, from, to) => {
      const out = [...list];
      const [x] = out.splice(from, 1);
      out.splice(to, 0, x);
      return out;
    };
    return [
      // general rows: no heading (one-section rule)
      { name: "Theme color", desc: "Background tint, and the accent when theme accent is on.", control: { type: "dropdown", key: "look.color", options: colorOptions() } },
      { name: "Theme accent", desc: "Accent follows the theme color (gold in dark mode). Off = Obsidian's accent color.", control: { type: "toggle", key: "look.accent" } },
      { name: "Open style panel", desc: "Sidebar tab with the main switches and style tuning (glass, cards, text, motion), each with a reset.", action: () => void this.plugin.openStylePanel() },
      {
        type: "group",
        heading: "Card layout",
        items: [{ name: "Card layout", desc: "Sidebars and notes as floating glass cards. Spacing and corners: style panel.", control: { type: "toggle", key: "look.card" } }]
      },
      {
        type: "group",
        heading: "Background",
        items: [
          { name: "Background", desc: "CSS, motion, stage or one of your pictures.", control: { type: "dropdown", key: "look.background", options: backgroundOptions(look.images) } },
          { name: "Gallery", desc: "Every background side by side, day and night.", action: () => this.plugin.openGallery() },
          { name: "Motion", desc: 'For moving backgrounds. Auto follows the OS "reduce motion" setting; On moves anyway.', control: { type: "dropdown", key: "motion", options: MOTION_OPTIONS } },
          { name: "Pause when unfocused", desc: "Stop moving backgrounds while you work in another app (saves GPU).", control: { type: "toggle", key: "pauseUnfocused" } }
        ]
      },
      {
        type: "list",
        heading: "Your pictures",
        emptyState: "No pictures yet. Add one with +.",
        addItem: { name: "Add picture", action: () => store.setLook({ images: [...store.settings.look.images, { id: newImageId(), src: "" }] }) },
        onDelete: (i) => setImages(store.settings.look.images.filter((_, j) => j !== i)),
        onReorder: (from, to) => setImages(move(store.settings.look.images, from, to)),
        items: look.images.map((img, i) => ({
          name: img.name?.trim() || `Picture ${i + 1}`,
          render: (setting) => {
            setting.settingEl.addClass("fantasy-easel-picture");
            const id = `img-${img.id}`;
            setting.addText((t) => {
              t.setPlaceholder("Name").setValue(img.name ?? "");
              t.inputEl.addClass("fantasy-easel-picture-name");
              t.inputEl.addEventListener("change", () => patchImage(img.id, { name: t.getValue().trim() }));
            });
            setting.addText((t) => {
              t.setPlaceholder('https://\u2026 or url("\u2026")').setValue(img.src);
              t.inputEl.addEventListener("change", () => patchImage(img.id, { src: t.getValue().trim() }));
            });
            setting.addButton((b) => {
              const using = look.background === id;
              b.setButtonText(using ? "In use" : "Use").setDisabled(!toCssUrl(img.src) || using).onClick(() => store.setLook({ background: id }));
              if (using) b.setCta();
            });
          }
        }))
      },
      {
        type: "group",
        heading: "Status bar",
        items: [{ name: "Show buttons", desc: "Quick controls in the status bar. Choose and order them below.", control: { type: "toggle", key: "statusBar" } }]
      },
      {
        type: "list",
        visible: () => store.settings.statusBar,
        onReorder: (from, to) => store.set({ statusItems: move(store.settings.statusItems, from, to) }),
        items: statusItems.map((x, i) => ({
          name: STATUS_LABEL[x.id],
          render: (setting) => {
            setting.addToggle((t) => t.setValue(x.on).onChange((on) => {
              if (on === store.settings.statusItems[i]?.on) return;
              store.set({ statusItems: store.settings.statusItems.map((y) => y.id === x.id ? { ...y, on } : y) });
            }));
          }
        }))
      },
      {
        type: "group",
        heading: "Plugin skins",
        items: SKINS.map((s) => ({
          name: s.name,
          desc: s.desc,
          render: (setting) => {
            setting.addToggle((t) => t.setValue(skinOn(skins, s)).onChange((v) => {
              if (v === skinOn(store.settings.skins, s)) return;
              store.set({ skins: { ...store.settings.skins, [s.id]: v } });
              if (s.id === "excalidraw" && v && excalidrawDiff(this.app).length) new ExcalidrawSettingsModal(this.app, store).open();
            }));
            if (s.id !== "excalidraw" || !excalidrawAvailable(this.app)) return;
            const diff = excalidrawDiff(this.app).length;
            setting.descEl.createDiv({ text: diff ? `${diff} Excalidraw setting(s) differ from what this skin needs.` : "Excalidraw settings match this skin." });
            if (diff) setting.addButton((b) => b.setButtonText("Match settings\u2026").onClick(() => new ExcalidrawSettingsModal(this.app, store).open()));
            if (store.settings.excalidrawBackup) setting.addButton((b) => b.setButtonText("Restore").setTooltip("Put back the Excalidraw settings from before Fantasy Easel changed them").onClick(() => void restoreExcalidraw(this.app, store)));
          }
        }))
      }
    ];
  }
  /** Without the Fantasy theme: what this plugin is and where to get the theme. Nothing to set. */
  noTheme() {
    return [
      {
        name: "Fantasy theme is not in use",
        desc: "Fantasy Easel is the companion of the Fantasy theme: theme color, accent, card layout, CSS and media-art backgrounds, your own pictures and plugin skins. Install Fantasy, then choose it in Settings \u2192 Appearance \u2192 Themes.",
        render: (setting) => {
          setting.addButton((b) => b.setButtonText("Get Fantasy").setCta().onClick(() => window.open(FANTASY_URL)));
        }
      }
    ];
  }
};

// src/picture-modal.ts
var import_obsidian6 = require("obsidian");
var AddPictureModal = class extends import_obsidian6.Modal {
  constructor(app, store) {
    super(app);
    this.store = store;
    this.src = "";
  }
  onOpen() {
    this.setTitle("Add picture");
    const add = () => {
      if (!toCssUrl(this.src)) return;
      const img = { id: newImageId(), src: this.src.trim() };
      this.store.setLook({ images: [...this.store.settings.look.images, img], background: `img-${img.id}` });
      this.close();
    };
    new import_obsidian6.Setting(this.contentEl).setName("Picture").setDesc('A picture URL (https://\u2026) or a CSS value like url("\u2026").').addText((t) => {
      t.setPlaceholder("https://\u2026").onChange((v) => this.src = v);
      t.inputEl.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter") {
          ev.preventDefault();
          add();
        }
      });
      window.setTimeout(() => t.inputEl.focus(), 0);
    });
    new import_obsidian6.Setting(this.contentEl).addButton((b) => b.setButtonText("Cancel").onClick(() => this.close())).addButton((b) => b.setButtonText("Add and use").setCta().onClick(add));
  }
  onClose() {
    this.contentEl.empty();
  }
};

// src/statusbar.ts
var import_obsidian7 = require("obsidian");
var TIP = { delay: 100, placement: "top" };
var StatusBar = class {
  constructor(app, plugin, store, managePictures) {
    this.app = app;
    this.plugin = plugin;
    this.store = store;
    this.managePictures = managePictures;
    this.items = [];
    this.unsubscribe = null;
    /** layout the buttons were built for (rebuilt when the order or the chosen buttons change) */
    this.built = "";
  }
  /** Build the chosen buttons in the chosen order. Same layout again = nothing to do. */
  show() {
    const items = this.store.settings.statusItems.filter((x) => x.on);
    const layout = items.map((x) => x.id).join(",");
    if (this.unsubscribe && layout === this.built) return;
    this.hide();
    this.built = layout;
    const add = (cls, label, onClick) => {
      const el = this.plugin.addStatusBarItem();
      el.addClass("mod-clickable", "fantasy-easel-sb", cls);
      el.setAttr("aria-label", label);
      (0, import_obsidian7.setTooltip)(el, label, TIP);
      this.plugin.registerDomEvent(el, "click", onClick);
      this.items.push(el);
      return el;
    };
    const menuAt = (ev, make) => make().showAtMouseEvent(ev);
    const build = {
      color: () => {
        const color = add("fantasy-easel-sb-color", "Theme color", (ev) => menuAt(ev, () => colorMenu(this.store)));
        this.swatch = color.createSpan({ cls: "fantasy-easel-swatch" });
        this.colorName = color.createSpan({ cls: "fantasy-easel-sb-text" });
      },
      prev: () => (0, import_obsidian7.setIcon)(add("fantasy-easel-sb-prev", "Previous background", () => stepBackground(this.store, -1)), "chevron-left"),
      background: () => {
        const bg = add("fantasy-easel-sb-bg", "Background", (ev) => menuAt(ev, () => backgroundMenu(this.store, this.managePictures)));
        this.bgKind = bg.createSpan({ cls: "fantasy-easel-sb-kind" });
        this.bgName = bg.createSpan({ cls: "fantasy-easel-sb-text fantasy-easel-sb-bgname" });
      },
      next: () => (0, import_obsidian7.setIcon)(add("fantasy-easel-sb-next", "Next background", () => stepBackground(this.store, 1)), "chevron-right"),
      gallery: () => (0, import_obsidian7.setIcon)(add("fantasy-easel-sb-gallery", "Background gallery (day / night)", () => new GalleryModal(this.app, this.store, this.managePictures).open()), "layout-grid"),
      accent: () => {
        this.accent = add("fantasy-easel-sb-toggle", "Theme accent on / off", () => this.store.setLook({ accent: !this.store.settings.look.accent }));
        (0, import_obsidian7.setIcon)(this.accent, "droplet");
      },
      card: () => {
        this.card = add("fantasy-easel-sb-toggle", "Card layout on / off", () => this.store.setLook({ card: !this.store.settings.look.card }));
        (0, import_obsidian7.setIcon)(this.card, "layout-dashboard");
      },
      motion: () => {
        this.still = add("fantasy-easel-sb-toggle", "Motion", () => {
          const order = MOTIONS;
          this.store.set({ motion: order[(order.indexOf(this.store.settings.motion) + 1) % order.length] });
        });
      },
      // Exception to "public API only": Obsidian has no public call to switch dark / light.
      mode: () => (0, import_obsidian7.setIcon)(add("fantasy-easel-sb-mode", "Dark / light", () => toggleDarkLight(this.app)), "sun-moon")
    };
    for (const x of items) build[x.id]();
    this.unsubscribe = this.store.subscribe(() => this.render());
    this.render();
  }
  hide() {
    this.unsubscribe?.();
    this.unsubscribe = null;
    this.built = "";
    this.swatch = this.colorName = this.bgName = this.bgKind = this.accent = this.card = this.still = void 0;
    this.items.forEach((el) => el.remove());
    this.items = [];
  }
  render() {
    const { look, motion } = this.store.settings;
    const color = colorByCls(look.color);
    if (this.swatch) this.swatch.className = `fantasy-easel-swatch ${look.color}`;
    this.colorName?.setText(color?.name ?? look.color);
    const bg = backgroundById(look.background, look.images);
    this.bgName?.setText(bg?.name ?? look.background);
    if (this.bgKind) (0, import_obsidian7.setIcon)(this.bgKind, bg?.kind === "motion" ? "wind" : bg?.kind === "static" ? "palette" : "image");
    this.accent?.toggleClass("is-on", look.accent);
    this.card?.toggleClass("is-on", look.card);
    const still = this.still;
    if (!still) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    (0, import_obsidian7.setIcon)(still, motion === "off" ? "pause" : motion === "on" ? "play" : "circle-play");
    const tip = motion === "auto" ? `Motion: auto (follows OS reduced motion${reduced ? " \u2014 now paused" : ""}). Click: on` : motion === "on" ? "Motion: on (moves even with OS reduced motion). Click: off" : "Motion: off. Click: auto";
    still.setAttr("aria-label", tip);
    (0, import_obsidian7.setTooltip)(still, tip, TIP);
    still.toggleClass("is-on", motion === "on");
    still.toggleClass("is-idle", bg?.kind !== "motion");
  }
};
function toggleDarkLight(app) {
  app.commands.executeCommandById("theme:toggle-light-dark");
}

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

// src/style-view.ts
var import_obsidian8 = require("obsidian");
var STYLE_VIEW = "fantasy-easel-style";
var StyleView = class extends import_obsidian8.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    /** in-place updates, one per row */
    this.syncs = [];
    this.unsubscribe = null;
    this.galleryCleanup = null;
    this.galleryOpen = false;
    /** what the rows were built for: rebuild when it changes */
    this.built = "";
    /** true while rows take values from the store: a component's own onChange must not write back */
    this.syncing = false;
  }
  getViewType() {
    return STYLE_VIEW;
  }
  getDisplayText() {
    return "Fantasy style";
  }
  getIcon() {
    return "palette";
  }
  async onOpen() {
    this.unsubscribe = this.plugin.store.subscribe(() => this.refresh());
    this.registerEvent(this.app.workspace.on("css-change", () => this.refresh()));
    this.refresh();
  }
  async onClose() {
    this.unsubscribe?.();
    this.unsubscribe = null;
    this.galleryCleanup?.();
    this.galleryCleanup = null;
  }
  shape() {
    const { images } = this.plugin.store.settings.look;
    return `${this.plugin.active}|${images.map((i) => `${i.id}:${i.name ?? ""}:${i.src ? 1 : 0}`).join(",")}`;
  }
  refresh() {
    if (this.shape() !== this.built) this.build();
    else this.sync();
  }
  sync() {
    this.syncing = true;
    try {
      this.syncs.forEach((f) => f());
    } finally {
      this.syncing = false;
    }
  }
  build() {
    this.built = this.shape();
    this.syncs = [];
    this.galleryCleanup?.();
    this.galleryCleanup = null;
    const root = this.contentEl;
    root.empty();
    root.addClass("fantasy-easel-panel");
    if (!this.plugin.active) {
      root.createEl("p", { cls: "setting-item-description", text: "Fantasy Easel works with the Fantasy theme. Choose Fantasy in Settings \u2192 Appearance \u2192 Themes." });
      return;
    }
    const store = this.plugin.store;
    const dark = () => document.body.hasClass("theme-dark");
    const row = (parent, name, desc, isDefault, reset) => {
      const s = new import_obsidian8.Setting(parent).setName(name).setDesc(desc).setClass("fantasy-easel-panel-row");
      if (reset) {
        s.addExtraButton((b) => {
          b.setIcon("rotate-ccw").setTooltip("Reset to default").onClick(reset);
          this.syncs.push(() => {
            const same = isDefault();
            b.setDisabled(same);
            b.extraSettingsEl.toggleClass("is-hidden", same);
            s.settingEl.toggleClass("is-changed", !same);
          });
        });
      }
      return s;
    };
    const heading = (name, reset) => {
      const h = new import_obsidian8.Setting(root).setName(name).setHeading();
      if (reset) h.addExtraButton((b) => {
        b.setIcon("rotate-ccw").setTooltip(reset.tip).onClick(reset.run);
        this.syncs.push(() => b.setDisabled(reset.isDefault()));
      });
      return h;
    };
    const look = () => store.settings.look;
    const lookDefault = () => look().color === DEFAULT_LOOK.color && look().accent === DEFAULT_LOOK.accent && look().card === DEFAULT_LOOK.card && look().background === DEFAULT_LOOK.background && store.settings.motion === DEFAULT_SETTINGS.motion && store.settings.pauseUnfocused === DEFAULT_SETTINGS.pauseUnfocused;
    heading("Look", {
      tip: "Reset the look (color, accent, cards, background, motion)",
      isDefault: lookDefault,
      run: () => store.set({ look: { ...look(), color: DEFAULT_LOOK.color, accent: DEFAULT_LOOK.accent, card: DEFAULT_LOOK.card, background: DEFAULT_LOOK.background }, motion: DEFAULT_SETTINGS.motion, pauseUnfocused: DEFAULT_SETTINGS.pauseUnfocused })
    });
    row(root, "Dark mode", "Obsidian's dark / light mode.", () => true, null).addToggle((t) => {
      t.onChange((v) => {
        if (!this.syncing && v !== dark()) toggleDarkLight(this.app);
      });
      this.syncs.push(() => t.setValue(dark()));
    });
    row(root, "Theme color", "Background tint, and the accent when theme accent is on.", () => look().color === DEFAULT_LOOK.color, () => store.setLook({ color: DEFAULT_LOOK.color })).setClass("fantasy-easel-panel-wide").addDropdown((d) => {
      d.addOptions(colorOptions()).onChange((v) => this.syncing || store.setLook({ color: v }));
      this.syncs.push(() => d.setValue(look().color));
    });
    row(root, "Theme accent", "Accent follows the theme color (gold in dark mode). Off = Obsidian's accent.", () => look().accent === DEFAULT_LOOK.accent, () => store.setLook({ accent: DEFAULT_LOOK.accent })).addToggle((t) => {
      t.onChange((v) => this.syncing || store.setLook({ accent: v }));
      this.syncs.push(() => t.setValue(look().accent));
    });
    row(root, "Card layout", "Sidebars and notes as floating glass cards.", () => look().card === DEFAULT_LOOK.card, () => store.setLook({ card: DEFAULT_LOOK.card })).addToggle((t) => {
      t.onChange((v) => this.syncing || store.setLook({ card: v }));
      this.syncs.push(() => t.setValue(look().card));
    });
    const bgRow = row(root, "Background", "", () => look().background === DEFAULT_LOOK.background, () => store.setLook({ background: DEFAULT_LOOK.background }));
    bgRow.settingEl.addClass("fantasy-easel-panel-wide");
    bgRow.addExtraButton((b) => b.setIcon("chevron-left").setTooltip("Previous background").onClick(() => stepBackground(store, -1)));
    bgRow.addDropdown((d) => {
      d.addOptions(backgroundOptions(look().images)).onChange((v) => this.syncing || store.setLook({ background: v }));
      this.syncs.push(() => d.setValue(look().background));
    });
    bgRow.addExtraButton((b) => b.setIcon("chevron-right").setTooltip("Next background").onClick(() => stepBackground(store, 1)));
    row(root, "Motion", "Moving backgrounds. Auto follows the OS reduce-motion setting.", () => store.settings.motion === DEFAULT_SETTINGS.motion, () => store.set({ motion: DEFAULT_SETTINGS.motion })).addDropdown((d) => {
      d.addOptions(MOTION_OPTIONS).onChange((v) => this.syncing || store.set({ motion: v }));
      this.syncs.push(() => d.setValue(store.settings.motion));
    });
    row(root, "Pause when unfocused", "Stop moving backgrounds while you work in another app.", () => store.settings.pauseUnfocused === DEFAULT_SETTINGS.pauseUnfocused, () => store.set({ pauseUnfocused: DEFAULT_SETTINGS.pauseUnfocused })).addToggle((t) => {
      t.onChange((v) => this.syncing || store.set({ pauseUnfocused: v }));
      this.syncs.push(() => t.setValue(store.settings.pauseUnfocused));
    });
    const value = (t) => store.settings.tuning[t.key] ?? (dark() ? t.def.dark : t.def.light);
    const setTuning = (keys, v) => {
      const tuning = { ...store.settings.tuning };
      for (const k of keys) {
        if (v === null) delete tuning[k];
        else tuning[k] = v;
      }
      store.set({ tuning });
    };
    const show2 = (t, v) => `${Math.round(v * 100) / 100}${t.unit}`;
    for (const g of TUNING_GROUPS) {
      const list = TUNINGS.filter((t) => t.group === g.id);
      const keys = list.map((t) => t.key);
      heading(g.name, { tip: `Reset ${g.name.toLowerCase()}`, isDefault: () => keys.every((k) => !(k in store.settings.tuning)), run: () => setTuning(keys, null) });
      for (const t of list) {
        const r = row(root, t.name, t.desc, () => !(t.key in store.settings.tuning), () => setTuning([t.key], null));
        r.settingEl.addClass("fantasy-easel-panel-wide");
        r.addSlider((sl) => {
          sl.setLimits(t.min, t.max, t.step).setInstant(true).setDisplayFormat((v) => show2(t, v)).onChange((v) => this.syncing || setTuning([t.key], v));
          this.syncs.push(() => {
            const v = value(t);
            if (sl.getValue() !== v) sl.setValue(v);
            const off = !!t.cardOnly && !look().card;
            sl.setDisabled(off);
            r.settingEl.toggleClass("is-disabled", off);
          });
        });
      }
    }
    new import_obsidian8.Setting(root).setClass("fantasy-easel-panel-row").addButton((b) => {
      b.setButtonText("Reset all styles").onClick(() => store.set({ tuning: {} }));
      this.syncs.push(() => b.setDisabled(!Object.keys(store.settings.tuning).length));
    });
    const gHead = new import_obsidian8.Setting(root).setName("Gallery").setDesc("Every background, day and night. Click one to use it.").setHeading();
    const gBody = root.createDiv({ cls: "fantasy-easel-panel-gallery" });
    const setGallery = (open) => {
      this.galleryOpen = open;
      this.galleryCleanup?.();
      this.galleryCleanup = null;
      gBody.empty();
      if (open) this.galleryCleanup = renderGallery(gBody.createDiv(), store, { scrollRoot: this.contentEl, addPicture: () => this.plugin.addPicture(), still: true });
    };
    gHead.addExtraButton((b) => {
      const draw = () => b.setIcon(this.galleryOpen ? "chevron-up" : "chevron-down").setTooltip(this.galleryOpen ? "Hide gallery" : "Show gallery");
      b.onClick(() => {
        setGallery(!this.galleryOpen);
        draw();
      });
      draw();
    });
    setGallery(this.galleryOpen);
    this.sync();
  }
};

// src/main.ts
var FantasyEaselPlugin = class extends import_obsidian9.Plugin {
  constructor() {
    super(...arguments);
    this.stage = new StageHost();
    /** True while the Fantasy theme is the current theme. Otherwise the plugin stays idle. */
    this.active = false;
    /** Menu builders, also for CLI checks (a Menu closes at once when the window has no focus). */
    this.menus = { color: () => colorMenu(this.store), background: () => backgroundMenu(this.store, () => this.addPicture()) };
  }
  syncStage() {
    const { look } = this.store.settings;
    this.stage.sync(backgroundById(look.background, look.images)?.stage);
  }
  /** Public check: the Fantasy theme defines --fantasy-hue on body (theme.css "Theme - Colors"). */
  isFantasy() {
    return getComputedStyle(document.body).getPropertyValue("--fantasy-hue").trim() !== "";
  }
  /** Follow the current theme: work with Fantasy, step back fully with any other theme. */
  refresh() {
    const on = this.isFantasy();
    if (on !== this.active) {
      this.active = on;
      if (on) this.applier.attach();
      else this.applier.detach();
    }
    if (on) {
      this.applier.reconcile();
      this.syncStage();
      if (this.store.settings.statusBar) this.statusBar.show();
      else this.statusBar.hide();
    } else {
      this.stage.remove();
      this.statusBar.hide();
    }
  }
  async onload() {
    const saved = await this.loadData();
    const settings = normalize(saved ?? DEFAULT_SETTINGS);
    this.store = new Store(settings, (s) => this.saveData(s));
    if (!saved) await this.saveData(settings);
    document.body.setCssProps({ "--fantasy-easel-delay": `-${Math.round(Math.random() * 600)}s` });
    this.register(() => document.body.setCssProps({ "--fantasy-easel-delay": "" }));
    this.applier = new Applier(document.body, () => this.store.settings);
    this.statusBar = new StatusBar(this.app, this, this.store, () => this.addPicture());
    this.refresh();
    this.register(this.store.subscribe(() => this.refresh()));
    this.registerEvent(this.app.workspace.on("css-change", () => this.refresh()));
    this.registerView(STYLE_VIEW, (leaf) => new StyleView(leaf, this));
    this.addSettingTab(new FantasyEaselSettingTab(this.app, this));
    this.registerObsidianProtocolHandler("fantasy-easel", () => this.openGallery());
    this.addCommand({ id: "next-background", name: "Next background", callback: () => stepBackground(this.store, 1) });
    this.addCommand({ id: "previous-background", name: "Previous background", callback: () => stepBackground(this.store, -1) });
    this.addCommand({ id: "background-gallery", name: "Background gallery", callback: () => this.openGallery() });
    this.addCommand({ id: "open-style-panel", name: "Open style panel", callback: () => void this.openStylePanel() });
    this.addCommand({ id: "add-picture", name: "Add picture", callback: () => this.addPicture() });
    this.app.workspace.onLayoutReady(() => this.refresh());
  }
  onunload() {
    this.store.flush();
    this.statusBar.hide();
    this.applier.detach();
    this.stage.remove();
  }
  openGallery() {
    if (!this.active) return void new import_obsidian9.Notice("Fantasy Easel works with the Fantasy theme. Choose Fantasy in Settings \u2192 Appearance \u2192 Themes.");
    new GalleryModal(this.app, this.store, () => this.addPicture()).open();
  }
  /** The style panel in the right sidebar (reuses an open one). */
  async openStylePanel() {
    const leaf = await this.app.workspace.ensureSideLeaf(STYLE_VIEW, "right", { active: true, reveal: true });
    await this.app.workspace.revealLeaf(leaf);
  }
  addPicture() {
    new AddPictureModal(this.app, this.store).open();
  }
};
