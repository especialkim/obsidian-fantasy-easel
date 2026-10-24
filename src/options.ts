import { allBackgrounds, THEME_COLORS, type UserImage } from "./catalog";

// Dropdown options (value → label), shared by the settings tab and the style panel.

export const colorOptions = (): Record<string, string> => Object.fromEntries(THEME_COLORS.map((c) => [c.cls, c.name]));

/** The kind goes before the name: an Obsidian dropdown has no group titles. */
const KIND = { static: "CSS", motion: "Motion", image: "Picture" } as const;

export const backgroundOptions = (images: UserImage[]): Record<string, string> =>
  Object.fromEntries(allBackgrounds(images).map((b) => [b.id, `${b.stage ? "Stage" : KIND[b.kind]} · ${b.name}`]));

export const MOTION_OPTIONS: Record<string, string> = { on: "Moving", auto: "Follow system", off: "Still" };

export const MOTION_DESC = 'Moving backgrounds. Follow system: still when "Reduce motion" is on in macOS or Windows. To save battery, choose Still or pause when unfocused.';

export const QUALITY_OPTIONS: Record<string, string> = { full: "Full", light: "Light" };

export const QUALITY_DESC = "Light: one blur and no hue shift, lighter on the GPU (default on Windows). Full: the complete look (default on macOS).";

/** What the palette changes depends on the mode (theme.css: dark tints the glass, light glass is white). */
export const paletteDesc = (): string =>
  document.body.hasClass("theme-dark")
    ? "Dark mode: tint of the glass panels and the hue of palette backgrounds."
    : "Light mode: accent (when theme accent is on), heading colors and the hue of palette backgrounds.";

export const ACCENT_DESC = "Accent from the palette (gold in dark mode). Off = Obsidian's accent color.";
