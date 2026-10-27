import { allBackgrounds, THEME_COLORS, type Background, type UserImage } from "./catalog";

// Dropdown options (value → label), shared by the settings tab and the style panel.

export const colorOptions = (): Record<string, string> => Object.fromEntries(THEME_COLORS.map((c) => [c.cls, c.name]));

export const PICTURES_GROUP = "Your pictures";

/** What a viewer sees, not how it is drawn: still, moving (CSS motion and stages), your pictures. */
const GROUP = { static: "Still", motion: "Moving", image: PICTURES_GROUP } as const;

/** The group goes before the name: an Obsidian dropdown has no group titles (settings tab). */
export const backgroundOptions = (images: UserImage[]): Record<string, string> =>
  Object.fromEntries(allBackgrounds(images).map((b) => [b.id, `${b.kind === "image" ? "Picture" : GROUP[b.kind]} · ${b.name}`]));

/** Backgrounds under group titles, in list order (status bar menu, style panel): Still, Moving, Your pictures. */
export function backgroundGroups(images: UserImage[]): { label: string; list: Background[] }[] {
  const label = (b: Background) => GROUP[b.kind];
  const groups: { label: string; list: Background[] }[] = [];
  for (const b of allBackgrounds(images)) {
    const last = groups[groups.length - 1];
    if (last?.label === label(b)) last.list.push(b);
    else groups.push({ label: label(b), list: [b] });
  }
  return groups;
}

export const FANTASY_URL = "https://github.com/especialkim/obsidian-theme-fantasy";

export const NO_THEME_TEXT = "Fantasy Easel works with the Fantasy theme. Choose Fantasy in Settings → Appearance → Themes.";

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
