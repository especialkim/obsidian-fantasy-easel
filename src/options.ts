import { allBackgrounds, THEME_COLORS, type UserImage } from "./catalog";

// Dropdown options (value → label), shared by the settings tab and the style panel.

export const colorOptions = (): Record<string, string> => Object.fromEntries(THEME_COLORS.map((c) => [c.cls, c.name]));

/** The kind goes before the name: an Obsidian dropdown has no group titles. */
const KIND = { static: "CSS", motion: "Motion", image: "Picture" } as const;

export const backgroundOptions = (images: UserImage[]): Record<string, string> =>
  Object.fromEntries(allBackgrounds(images).map((b) => [b.id, `${b.stage ? "Stage" : KIND[b.kind]} · ${b.name}`]));

export const MOTION_OPTIONS: Record<string, string> = { auto: "Auto", on: "On", off: "Off" };
