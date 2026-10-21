// Stage backgrounds: four moving layers over a base (media-art style), from the mockups
//   9 Craft/93 Artifact/2026-10-21, mockup, Obsidian 몽환·자연 CSS 배경 12선.html   (family "ambient")
//   9 Craft/93 Artifact/2026-10-21, mockup, Obsidian 결·파동·비트 CSS 배경 15선.html (family "kinetic")
// Pictures are copied as they are; speed / morph / hue / blur are the values the user picked
// on the mockup sliders (2026-10-21). scripts/build.js writes the per-background variables into
// styles.css; the four layers and their movement are fixed CSS (styles.css "1-4. Stage").
// When motion is off / paused, the stage stays as a still picture at its random start frame.

export type StageFamily = "ambient" | "kinetic";

export interface StagePicture {
  base: string;
  /** ambient: four colors (c1..c4) the layers are built from; kinetic: four layer pictures (g1..g4) */
  layers: [string, string, string, string];
  /** ambient only: texture of layer 3 */
  wave?: string;
  /** blend of layers 2 and 4, and of layer 3 */
  b2: string;
  b3: string;
}

export interface StageBackground {
  key: string;
  name: string;
  family: StageFamily;
  /** mockup sliders: speed (x), morph (x), hue swing (deg), blur / softness (px) */
  speed: number;
  morph: number;
  hue: number;
  blur: number;
  /** kinetic only: blur multiplier of layers 1-3 */
  blurMult?: [number, number, number];
  day: StagePicture;
  night: StagePicture;
}

export const STAGES: StageBackground[] = [
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

/** The stage element: a base and four layers. The family class picks the layer set (styles.css). */
export function buildStage(parent: HTMLElement, family: StageFamily): HTMLElement {
  const stage = parent.createDiv({ cls: `fantasy-easel-stage fe-${family}` });
  for (let i = 1; i <= 4; i++) stage.createDiv({ cls: `fe-l${i}` });
  return stage;
}

/** One stage under `.app-container` while the plugin runs; its family follows the chosen background. */
export class StageHost {
  private el: HTMLElement | null = null;

  sync(family: StageFamily | undefined) {
    const host = document.querySelector<HTMLElement>(".app-container");
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
}
