import type { App } from "obsidian";
import { backgroundById, colorByCls, SS_KEYS, SS_SECTION, THEME_DEFAULTS } from "./catalog";

/** What the theme shows. Same meaning as the theme's Style Settings values. */
export interface Look {
  /** theme color body class, e.g. `fantasy-theme-ForestGreen` */
  color: string;
  /** background id from catalog (`custom2`, `css-aurora`, ...) */
  background: string;
  accent: boolean;
  card: boolean;
  /** `--background-url1..3`, CSS value as Style Settings stores it (`url("...")`); "" = theme default */
  urls: [string, string, string];
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
  background: THEME_DEFAULTS.background,
  accent: false,
  card: false,
  urls: ["", "", ""],
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
  const bgCls = get(SS_KEYS.background);
  const bgId = typeof bgCls === "string" ? bgCls.replace("fantasy-theme-background-", "") : "";
  const urls = SS_KEYS.url.map((k) => (typeof get(k) === "string" ? (get(k) as string) : "")) as Look["urls"];
  return {
    found,
    look: {
      color,
      background: backgroundById(bgId) ? bgId : DEFAULT_LOOK.background,
      accent: get(SS_KEYS.accent) === true,
      card: get(SS_KEYS.card) === true,
      urls,
    },
  };
}

/** Fill missing / invalid fields from defaults (data.json written by an older version or by hand). */
export function normalize(data: Partial<FantasyEaselSettings> | null | undefined): FantasyEaselSettings {
  const look: Partial<Look> = data?.look ?? {};
  const urls = Array.isArray(look.urls) ? look.urls : [];
  return {
    look: {
      color: typeof look.color === "string" && colorByCls(look.color) ? look.color : DEFAULT_LOOK.color,
      background: typeof look.background === "string" && backgroundById(look.background) ? look.background : DEFAULT_LOOK.background,
      accent: look.accent === true,
      card: look.card === true,
      urls: [0, 1, 2].map((i) => (typeof urls[i] === "string" ? urls[i] : "")) as Look["urls"],
    },
    motion: MOTIONS.includes(data?.motion as Motion) ? (data!.motion as Motion) : "auto",
    statusBar: data?.statusBar !== false,
  };
}
