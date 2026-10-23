// Values Fantasy Easel can choose. Class names must match theme.css (checked by scripts/selftest.js).
// CSS backgrounds come from src/backgrounds.ts (styles.css is generated from it).
import { CSS_BACKGROUNDS, type BgPalette } from "./backgrounds";
import { STAGES, type StageFamily } from "./stages";

export interface ThemeColor {
  /** body class defined in theme.css */
  cls: string;
  name: string;
}

/** Theme colors that sit well with the accent (dark accent = gold 44°): cool and purple tones.
 *  Warm browns / reds / orange (0–30°) and Forest (next to Emerald) were dropped 2026-10-21. */
export const THEME_COLORS: ThemeColor[] = [
  { cls: "fantasy-theme-Black", name: "Dark" },
  { cls: "fantasy-theme-SkyBlue", name: "Sky Blue" },
  { cls: "fantasy-theme-OceanTeal", name: "Ocean Teal" },
  { cls: "fantasy-theme-EmeraldGreen", name: "Emerald Green" },
  { cls: "fantasy-theme-MysticPurple", name: "Mystic Purple" },
  { cls: "fantasy-theme-OrchidMagenta", name: "Orchid Magenta" },
];

export type BackgroundKind = "static" | "motion" | "image";

export interface Background {
  /** stored value: `css-<key>` or `img-<id>` */
  id: string;
  name: string;
  kind: BackgroundKind;
  /** CSS backgrounds: follows the theme color, or a fixed palette */
  palette?: BgPalette;
  /** body class `fantasy-easel-bg-<key>` (CSS backgrounds only; your pictures use a body variable) */
  cls?: string;
  /** your pictures: CSS value for `--background-url` */
  url?: string;
  /** stage backgrounds (four moving layers, src/stages.ts): which layer set */
  stage?: StageFamily;
}

/** CSS backgrounds (src/backgrounds.ts is the source). The theme itself shows Plasma, still. */
export const CSS_BG: Background[] = [
  ...CSS_BACKGROUNDS.map((b): Background => ({ id: `css-${b.key}`, name: b.name, kind: b.kind, palette: b.palette, cls: `fantasy-easel-bg-${b.key}` })),
  ...STAGES.map((s): Background => ({ id: `css-${s.key}`, name: s.name, kind: "motion", palette: "fixed", cls: `fantasy-easel-bg-${s.key}`, stage: s.family })),
];

/** A picture the user added (Settings → Your pictures). */
export interface UserImage {
  id: string;
  /** what the user typed: a URL or a CSS value like url("…") */
  src: string;
  /** your name for it (lists, status bar); "" = Picture N */
  name?: string;
}

/** `https://…` → `url("https://…")`; a value that already is `url(…)` stays. "" = not usable. */
export function toCssUrl(src: string): string {
  const s = src.trim();
  if (!s) return "";
  if (/^url\(/i.test(s)) return s;
  return `url("${s.replace(/["\\]/g, "\\$&")}")`;
}

/** Your pictures as backgrounds (empty entries left out). */
export const imageBackgrounds = (images: UserImage[]): Background[] =>
  images.map((img, i) => ({ id: `img-${img.id}`, name: img.name?.trim() || `Picture ${i + 1}`, kind: "image" as const, url: toCssUrl(img.src) })).filter((b) => b.url);

/** Every background to choose from, in menu / step order. */
export const allBackgrounds = (images: UserImage[]): Background[] => [...CSS_BG, ...imageBackgrounds(images)];

export const newImageId = () => Math.random().toString(36).slice(2, 8);

export const ACCENT_CLASS = "fantasy-theme-accent";
/** Card layout is on by default in the theme; this class turns it off. */
export const CARD_OFF_CLASS = "fantasy-theme-card-off";
/** Old "card layout on" class (theme before 2026-10-20). Only removed, never added. */
export const LEGACY_CARD_CLASS = "fantasy-theme-card-layout";
/** Present on body while Fantasy Easel manages the theme. */
export const MARKER_CLASS = "fantasy-easel";
/** Present on body when motion backgrounds should not move (motion: off). */
export const STILL_CLASS = "fantasy-easel-still";
/** Present on body when motion backgrounds move even with OS reduced motion (motion: on). */
export const FORCE_MOTION_CLASS = "fantasy-easel-force-motion";
/** Present on body when moving backgrounds should pause while the window is not focused. */
export const PAUSE_UNFOCUSED_CLASS = "fantasy-easel-pause-unfocused";
/** Present on body while a stage background is chosen (shows the four-layer stage). */
export const STAGE_CLASS = "fantasy-easel-stage-on";
/** Present on body while a motion background is chosen (draws the moving layer). */
export const MOTION_CLASS = "fantasy-easel-motion";

/** Theme color without a class (theme.css body defaults). */
export const THEME_DEFAULTS = {
  color: "fantasy-theme-Black",
};

/** Plasma: the theme's own background (still); Easel adds its motion. */
export const DEFAULT_BACKGROUND = "css-plasma";

export const colorByCls = (cls: string) => THEME_COLORS.find((c) => c.cls === cls);
export const backgroundById = (id: string, images: UserImage[] = []) => allBackgrounds(images).find((b) => b.id === id);
