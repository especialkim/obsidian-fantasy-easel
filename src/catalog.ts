// Values Fantasy Easel can choose. Class names must match theme.css (checked by scripts/selftest.js).
// CSS backgrounds come from src/backgrounds.ts (styles.css is generated from it).
import { CSS_BACKGROUNDS, type BgPalette } from "./backgrounds";

export interface ThemeColor {
  /** body class written by the theme's Style Settings `class-select` */
  cls: string;
  name: string;
}

export const THEME_COLORS: ThemeColor[] = [
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
  { cls: "fantasy-theme-Black", name: "Dark" },
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
}

/** CSS backgrounds (src/backgrounds.ts is the source). The theme itself shows Plasma, still. */
export const CSS_BG: Background[] = CSS_BACKGROUNDS.map((b): Background => ({ id: `css-${b.key}`, name: b.name, kind: b.kind, palette: b.palette, cls: `fantasy-easel-bg-${b.key}` }));

/** A picture the user added (Settings → Your pictures). */
export interface UserImage {
  id: string;
  /** what the user typed: a URL or a CSS value like url("…") */
  src: string;
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
  images.map((img, i) => ({ id: `img-${img.id}`, name: `Picture ${i + 1}`, kind: "image" as const, url: toCssUrl(img.src) })).filter((b) => b.url);

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
/** Present on body while a motion background is chosen (draws the moving layer). */
export const MOTION_CLASS = "fantasy-easel-motion";

/** Style Settings section id and keys of the Fantasy theme (`@settings` in theme.css). */
export const SS_SECTION = "Fantasy-theme-settings";
export const SS_KEYS = {
  color: "fantasy-theme",
  /** removed from the theme (2026-10-21); read once to bring old custom pictures over */
  background: "fantasy-theme-background",
  accent: "fantasy-theme-accent",
  cardOff: "fantasy-theme-card-off",
  /** old toggle (on = card layout); read on import if the new one was never saved */
  cardLegacy: "fantasy-theme-card-layout",
  url: ["background-url1", "background-url2", "background-url3"] as const,
};

/** Theme color default declared in theme.css `@settings`. */
export const THEME_DEFAULTS = {
  color: "fantasy-theme-Black",
};

/** Plasma: the theme's own background (still); Easel adds its motion. */
export const DEFAULT_BACKGROUND = "css-plasma";

export const colorByCls = (cls: string) => THEME_COLORS.find((c) => c.cls === cls);
export const backgroundById = (id: string, images: UserImage[] = []) => allBackgrounds(images).find((b) => b.id === id);
