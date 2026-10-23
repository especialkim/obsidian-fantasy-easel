import { isDefaultValue, parseStoreKey, tuningByKey } from "./tuning";
import { backgroundById, colorByCls, DEFAULT_BACKGROUND, newImageId, THEME_DEFAULTS, type UserImage } from "./catalog";

/** What the theme shows. */
export interface Look {
  /** theme color body class, e.g. `fantasy-theme-SkyBlue` */
  color: string;
  /** background id: `css-<key>` (catalog) or `img-<id>` (your pictures) */
  background: string;
  accent: boolean;
  card: boolean;
  /** your pictures, added one by one with + in settings */
  images: UserImage[];
}

/** Status bar buttons, in the order the user set (settings → Status bar). */
export type StatusId = "color" | "prev" | "background" | "next" | "gallery" | "accent" | "card" | "motion" | "mode";
export const STATUS_IDS: StatusId[] = ["color", "prev", "background", "next", "gallery", "accent", "card", "motion", "mode"];
export interface StatusItem {
  id: StatusId;
  on: boolean;
}

export type Motion = "auto" | "on" | "off";
export const MOTIONS: Motion[] = ["auto", "on", "off"];

export interface FantasyEaselSettings {
  look: Look;
  /** motion backgrounds: auto = follow OS reduced motion, on = always move, off = never move.
   *  See pauseUnfocused for the window-focus pause. */
  motion: Motion;
  /** pause moving backgrounds while the Obsidian window is not focused (saves GPU; off = keep moving) */
  pauseUnfocused: boolean;
  statusBar: boolean;
  /** which status bar buttons show, in this order */
  statusItems: StatusItem[];
  /** style panel values (src/tuning.ts key → value); missing = the theme's own value */
  tuning: Record<string, number>;
  /** plugin skins the user turned on / off. Missing = on when that plugin is installed. */
  skins: Record<string, boolean>;
  /** Excalidraw settings before Easel changed them (Restore puts them back); null = untouched */
  excalidrawBackup: Record<string, unknown> | null;
}

export const DEFAULT_LOOK: Look = {
  color: THEME_DEFAULTS.color,
  background: DEFAULT_BACKGROUND,
  accent: false,
  card: true,
  images: [],
};

export const DEFAULT_SETTINGS: FantasyEaselSettings = { look: DEFAULT_LOOK, motion: "auto", pauseUnfocused: false, statusBar: true, statusItems: STATUS_IDS.map((id) => ({ id, on: true })), tuning: {}, skins: {}, excalidrawBackup: null };

/**
 * Old 3 fixed URL slots (data.json before 2026-10-21) → pictures. `chosen` is the old
 * background id; when it was `customN` and slot N is filled, that picture becomes the background.
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
    ? look.images.filter((x): x is UserImage => !!x && typeof x.id === "string" && typeof x.src === "string").map((x) => ({ id: x.id, src: x.src, ...(typeof x.name === "string" && x.name ? { name: x.name } : {}) }))
    : [];
  let background = typeof look.background === "string" ? look.background : "";
  if (!Array.isArray(look.images) && Array.isArray(look.urls)) {
    const old = fromOldUrls(look.urls, background);
    images = old.images;
    if (old.background) background = old.background;
  }
  // status bar: saved order first (known ids, no repeats), then buttons added in a later version
  const seen = new Set<StatusId>();
  const statusItems: StatusItem[] = [];
  for (const x of Array.isArray(data?.statusItems) ? data!.statusItems : []) {
    if (!x || !STATUS_IDS.includes(x.id) || seen.has(x.id)) continue;
    seen.add(x.id);
    statusItems.push({ id: x.id, on: x.on !== false });
  }
  for (const id of STATUS_IDS) if (!seen.has(id)) statusItems.push({ id, on: true });
  const tuning: Record<string, number> = {};
  for (const [k, v] of Object.entries(data?.tuning ?? {})) {
    if (typeof v !== "number" || !Number.isFinite(v)) continue;
    const parsed = parseStoreKey(k);
    // a value equal to the theme's is "not set" (older versions saved it after a drag back)
    if (parsed) { if (!isDefaultValue(parsed.t, parsed.mode ?? "dark", v)) tuning[k] = v; }
    // before per-mode glass (2026-10-23): one value for both modes
    else if (tuningByKey(k)?.perMode) for (const m of ["dark", "light"]) tuning[`${k}.${m}`] ??= v;
  }
  const skins: Record<string, boolean> = {};
  for (const [k, v] of Object.entries(data?.skins ?? {})) if (typeof v === "boolean") skins[k] = v;
  return {
    look: {
      // a color dropped from the list falls back to Dark
      color: typeof look.color === "string" && colorByCls(look.color) ? look.color : DEFAULT_LOOK.color,
      // a vault picture may not resolve yet (vault index not ready at load): keep it if the entry exists
      background: backgroundById(background, images) || images.some((x) => `img-${x.id}` === background && x.src.trim()) ? background : DEFAULT_LOOK.background,
      accent: look.accent === true,
      card: look.card !== false,
      images,
    },
    motion: MOTIONS.includes(data?.motion as Motion) ? (data!.motion as Motion) : "auto",
    pauseUnfocused: data?.pauseUnfocused === true,
    statusBar: data?.statusBar !== false,
    statusItems,
    tuning,
    skins,
    excalidrawBackup: data?.excalidrawBackup && typeof data.excalidrawBackup === "object" ? { ...data.excalidrawBackup } : null,
  };
}
