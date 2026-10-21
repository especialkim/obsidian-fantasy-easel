import type { App } from "obsidian";
import { backgroundById, colorByCls, DEFAULT_BACKGROUND, newImageId, SS_KEYS, SS_SECTION, THEME_DEFAULTS, type UserImage } from "./catalog";

/** What the theme shows. Same meaning as the theme's Style Settings values. */
export interface Look {
  /** theme color body class, e.g. `fantasy-theme-ForestGreen` */
  color: string;
  /** background id: `css-<key>` (catalog) or `img-<id>` (your pictures) */
  background: string;
  accent: boolean;
  card: boolean;
  /** your pictures, added one by one with + in settings */
  images: UserImage[];
}

export type Motion = "auto" | "on" | "off";
export const MOTIONS: Motion[] = ["auto", "on", "off"];

export interface FantasyEaselSettings {
  look: Look;
  /** motion backgrounds: auto = follow OS reduced motion, on = always move, off = never move.
   *  All pause while the window is not focused. */
  motion: Motion;
  statusBar: boolean;
}

export const DEFAULT_LOOK: Look = {
  color: THEME_DEFAULTS.color,
  background: DEFAULT_BACKGROUND,
  accent: false,
  card: true,
  images: [],
};

export const DEFAULT_SETTINGS: FantasyEaselSettings = { look: DEFAULT_LOOK, motion: "auto", statusBar: true };

const SS_DATA = (app: App) => `${app.vault.configDir}/plugins/obsidian-style-settings/data.json`;

/** Read the Fantasy values Style Settings saved. Missing values fall back to the theme defaults. */
export async function readStyleSettingsLook(app: App): Promise<{ look: Look; found: boolean }> {
  let raw: Record<string, unknown> = {};
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
  const get = (key: string) => raw[`${SS_SECTION}@@${key}`];
  const color = typeof get(SS_KEYS.color) === "string" && colorByCls(get(SS_KEYS.color) as string) ? (get(SS_KEYS.color) as string) : DEFAULT_LOOK.color;
  // Old theme versions had Custom URL 1-3 in Style Settings: bring the filled ones over as pictures.
  const old = fromOldUrls(SS_KEYS.url.map((k) => get(k)), get(SS_KEYS.background));
  return {
    found,
    look: {
      color,
      background: old.background ?? DEFAULT_LOOK.background,
      accent: get(SS_KEYS.accent) === true,
      // new toggle = "card off"; else the old "card on" toggle; else the theme default (on)
      card: typeof get(SS_KEYS.cardOff) === "boolean" ? get(SS_KEYS.cardOff) !== true : typeof get(SS_KEYS.cardLegacy) === "boolean" ? get(SS_KEYS.cardLegacy) === true : true,
      images: old.images,
    },
  };
}

/**
 * Old 3 fixed URL slots → pictures. `chosen` is the old background id / class; when it was
 * `customN` and slot N is filled, that picture becomes the background.
 */
function fromOldUrls(urls: unknown[], chosen: unknown): { images: UserImage[]; background?: string } {
  const images: UserImage[] = [];
  let background: string | undefined;
  const pick = typeof chosen === "string" ? chosen.replace("fantasy-theme-background-", "") : "";
  urls.forEach((u, i) => {
    if (typeof u !== "string" || !u.trim()) return;
    const img = { id: newImageId(), src: u.trim() };
    images.push(img);
    if (pick === `custom${i + 1}`) background = `img-${img.id}`;
  });
  return { images, background };
}

/** Fill missing / invalid fields from defaults (data.json written by an older version or by hand). */
export function normalize(data: Partial<FantasyEaselSettings> | null | undefined): FantasyEaselSettings {
  const look: Partial<Look> & { urls?: unknown[] } = data?.look ?? {};
  let images: UserImage[] = Array.isArray(look.images)
    ? look.images.filter((x): x is UserImage => !!x && typeof x.id === "string" && typeof x.src === "string").map((x) => ({ id: x.id, src: x.src }))
    : [];
  let background = typeof look.background === "string" ? look.background : "";
  // data.json from before 2026-10-21: three URL slots, theme background ids
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
      images,
    },
    motion: MOTIONS.includes(data?.motion as Motion) ? (data!.motion as Motion) : "auto",
    statusBar: data?.statusBar !== false,
  };
}
