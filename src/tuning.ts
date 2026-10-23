// Style tuning (2026-10-23): values the style panel can change. Each one writes CSS variables
// on body (inline, through apply.ts) that theme.css or styles.css reads. Not set = the theme's
// own value, so "reset" only deletes the override. The variable names are a contract with
// theme.css (checked by scripts/selftest.js).

export type TuningGroup = "glass" | "cards" | "editor" | "background";
export type Mode = "dark" | "light";

export interface Tuning {
  key: string;
  name: string;
  desc: string;
  group: TuningGroup;
  min: number;
  max: number;
  step: number;
  unit: string;
  /** the theme's value when nothing is set, per mode */
  def: { dark: number; light: number };
  /** CSS variables for a value */
  vars: (v: number) => Record<string, string>;
  /** only while the card layout is on (the card variables mean nothing without it) */
  cardOnly?: boolean;
  /** saved separately for dark and light mode (stored as `<key>.dark` / `<key>.light`) */
  perMode?: boolean;
}

/** Panel order. Background (stage speed) sits with the background switches in the panel. */
export const TUNING_GROUPS: { id: TuningGroup; name: string }[] = [
  { id: "background", name: "Background" },
  { id: "glass", name: "Glass" },
  { id: "cards", name: "Cards" },
  { id: "editor", name: "Editor" },
];

/** --h1-size … --h5-size at scale 1 (theme.css body) */
const HEADINGS = [1.42, 1.28, 1.21, 1.14, 1.07];
const round = (n: number) => Math.round(n * 1000) / 1000;

export const TUNINGS: Tuning[] = [
  { key: "opacity", name: "Panel opacity", desc: "How solid the glass panels are.", group: "glass", perMode: true, min: 0.2, max: 0.95, step: 0.01, unit: "", def: { dark: 0.67, light: 0.6 }, vars: (v) => ({ "--background-opacity": `${v}` }) },
  { key: "blur", name: "Glass blur", desc: "Blur of the background behind the panels.", group: "glass", perMode: true, min: 0, max: 24, step: 1, unit: "px", def: { dark: 8, light: 12 }, vars: (v) => ({ "--fantasy-glass-blur": `${v}px` }) },
  { key: "brightness", name: "Background brightness", desc: "Brightness of the background behind the panels.", group: "glass", perMode: true, min: 0.5, max: 1.3, step: 0.01, unit: "", def: { dark: 0.95, light: 0.85 }, vars: (v) => ({ "--fantasy-glass-brightness": `${v}` }) },
  { key: "cardGap", name: "Card gap", desc: "Space around and between the cards (also the window edge).", group: "cards", min: 1, max: 24, step: 1, unit: "px", def: { dark: 8, light: 8 }, vars: (v) => ({ "--cardview-gap": `${v}px` }), cardOnly: true },
  { key: "cardRadius", name: "Card corners", desc: "Corner radius of the cards.", group: "cards", min: 0, max: 32, step: 1, unit: "px", def: { dark: 20, light: 20 }, vars: (v) => ({ "--cardview-radius": `${v}px` }), cardOnly: true },
  { key: "cardPadding", name: "Card padding", desc: "Space inside the cards (top and bottom; sides get half).", group: "cards", min: 0, max: 24, step: 1, unit: "px", def: { dark: 10, light: 10 }, vars: (v) => ({ "--cardview-padding": `${v}px ${v / 2}px` }), cardOnly: true },
  { key: "lineWidth", name: "Note width", desc: "Readable line length.", group: "editor", min: 600, max: 1600, step: 10, unit: "px", def: { dark: 1050, light: 1050 }, vars: (v) => ({ "--file-line-width": `${v}px` }) },
  { key: "headingScale", name: "Heading size", desc: "How much larger headings are than body text (1 = theme).", group: "editor", min: 0, max: 2, step: 0.05, unit: "×", def: { dark: 1, light: 1 }, vars: (v) => Object.fromEntries(HEADINGS.map((h, i) => [`--h${i + 1}-size`, `${round(1 + (h - 1) * v)}em`])) },
  { key: "paragraph", name: "Paragraph spacing", desc: "Space between paragraphs.", group: "editor", min: 0, max: 1.5, step: 0.05, unit: "rem", def: { dark: 1, light: 1 }, vars: (v) => ({ "--p-spacing": `${v}rem` }) },
  { key: "propertiesRadius", name: "Properties corners", desc: "Corner radius of the properties tray.", group: "editor", min: 0, max: 24, step: 1, unit: "px", def: { dark: 8, light: 8 }, vars: (v) => ({ "--metadata-border-radius": `${v}px` }) },
  { key: "stageSpeed", name: "Stage speed", desc: "Speed of the stage backgrounds (four moving layers).", group: "background", min: 0.25, max: 2, step: 0.05, unit: "×", def: { dark: 1, light: 1 }, vars: (v) => ({ "--fantasy-easel-speed": `${v}` }) },
];

/** Gallery tiles show both modes at once: per-mode values also go out as
 *  `--fantasy-easel-g-<key>-dark` / `-light` (raw numbers, styles.css "Gallery"). */
const tileVar = (t: Tuning, m: Mode) => `--fantasy-easel-g-${t.key}-${m}`;

/** Every variable a tuning may write (apply.ts clears the ones not wanted). */
export const TUNING_VARS: string[] = [...new Set([
  ...TUNINGS.flatMap((t) => Object.keys(t.vars(t.def.dark))),
  ...TUNINGS.filter((t) => t.perMode).flatMap((t) => [tileVar(t, "dark"), tileVar(t, "light")]),
])];

export const tuningByKey = (key: string) => TUNINGS.find((t) => t.key === key);

/** Storage key: per-mode tunings keep one value per mode. */
export const storeKey = (t: Tuning, mode: Mode) => (t.perMode ? `${t.key}.${mode}` : t.key);

/** Back at the theme's value (within half a step): saved as "not set", so it is not marked changed. */
export const isDefaultValue = (t: Tuning, mode: Mode, v: number) => Math.abs(v - t.def[mode]) < t.step / 2;

/** Storage key → its tuning and mode (null for unknown keys). */
export function parseStoreKey(k: string): { t: Tuning; mode: Mode | null } | null {
  const [name, m] = k.split(".");
  const t = tuningByKey(name);
  if (!t || (t.perMode ? m !== "dark" && m !== "light" : m !== undefined)) return null;
  return { t, mode: t.perMode ? (m as Mode) : null };
}

const clamp = (t: Tuning, v: unknown) => (typeof v === "number" && Number.isFinite(v) ? Math.min(t.max, Math.max(t.min, v)) : null);

/** Body variables for the saved values in this mode. Values outside the range are clamped. */
export function tuningVars(values: Record<string, number>, card: boolean, mode: Mode): Record<string, string> {
  const out: Record<string, string> = {};
  for (const t of TUNINGS) {
    const v = clamp(t, values[storeKey(t, mode)]);
    if (v !== null && !(t.cardOnly && !card)) Object.assign(out, t.vars(v));
    if (t.perMode) for (const m of ["dark", "light"] as const) {
      const mv = clamp(t, values[storeKey(t, m)]);
      if (mv !== null) out[tileVar(t, m)] = `${mv}`;
    }
  }
  return out;
}
