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

export type BackgroundKind = "theme" | "static" | "motion";

export interface Background {
  /** stored value */
  id: string;
  name: string;
  kind: BackgroundKind;
  /** CSS backgrounds: follows the theme color, or a fixed palette */
  palette?: BgPalette;
  /** body class: theme background class, or `fantasy-easel-bg-<key>` for CSS backgrounds */
  cls: string;
}

const themeBg = (key: string, name: string): Background => ({ id: key, name, kind: "theme", cls: `fantasy-theme-background-${key}` });

export const BACKGROUNDS: Background[] = [
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
  ...CSS_BACKGROUNDS.map((b): Background => ({ id: `css-${b.key}`, name: b.name, kind: b.kind, palette: b.palette, cls: `fantasy-easel-bg-${b.key}` })),
];

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
  background: "fantasy-theme-background",
  accent: "fantasy-theme-accent",
  cardOff: "fantasy-theme-card-off",
  /** old toggle (on = card layout); read on import if the new one was never saved */
  cardLegacy: "fantasy-theme-card-layout",
  url: ["background-url1", "background-url2", "background-url3"] as const,
};

/** Defaults declared in theme.css `@settings`. */
export const THEME_DEFAULTS = {
  color: "fantasy-theme-Black",
  background: "custom3",
};

export const colorByCls = (cls: string) => THEME_COLORS.find((c) => c.cls === cls);
export const backgroundById = (id: string) => BACKGROUNDS.find((b) => b.id === id);
