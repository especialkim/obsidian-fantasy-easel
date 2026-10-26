import { Notice } from "obsidian";
import { ACCENT_CLASS, backgroundById, CARD_OFF_CLASS, CSS_BG, FORCE_MOTION_CLASS, LIGHT_CLASS, MARKER_CLASS, MOTION_CLASS, PAUSE_UNFOCUSED_CLASS, STAGE_CLASS, STILL_CLASS, THEME_COLORS, LEGACY_CARD_CLASS, pictureKind, toCssUrl } from "./catalog";
import { PictureLoader } from "./picture-loader";
import type { FantasyEaselSettings } from "./settings";
import { ALL_SKIN_CLASSES, skinClasses } from "./skins";
import { TUNING_VARS, tuningVars } from "./tuning";

/** Every body class Fantasy Easel may add or remove. Other body classes are never touched. */
const MANAGED = new Set<string>([...THEME_COLORS.map((c) => c.cls), ...CSS_BG.map((b) => b.cls!), ACCENT_CLASS, CARD_OFF_CLASS, LEGACY_CARD_CLASS, MARKER_CLASS, STILL_CLASS, MOTION_CLASS, STAGE_CLASS, FORCE_MOTION_CLASS, LIGHT_CLASS, PAUSE_UNFOCUSED_CLASS, ...ALL_SKIN_CLASSES]);
/** Theme classes (removed on unload: without Easel the theme shows its defaults). */
const THEME_GROUP = [...THEME_COLORS.map((c) => c.cls), ACCENT_CLASS, CARD_OFF_CLASS, LEGACY_CARD_CLASS];
/** Your picture goes here as a body inline variable (beats the theme's Plasma and any class rule). */
const URL_VAR = "--background-url";
/** Variables older versions wrote inline; only removed. */
const OLD_VARS = ["--background-url1", "--background-url2", "--background-url3"] as const;

/** Classes the body should have for this look. */
export function wantedClasses(s: FantasyEaselSettings, windows = false): Set<string> {
  const bg = backgroundById(s.look.background, s.look.images);
  const out = new Set<string>([MARKER_CLASS, s.look.color]);
  if (bg?.cls) out.add(bg.cls);
  if (bg?.stage) out.add(STAGE_CLASS);
  else if (bg?.kind === "motion") out.add(MOTION_CLASS);
  if (s.look.accent) out.add(ACCENT_CLASS);
  if (!s.look.card) out.add(CARD_OFF_CLASS);
  if (s.motion === "off") out.add(STILL_CLASS);
  if (s.motion === "on") out.add(FORCE_MOTION_CLASS);
  if (s.pauseUnfocused) out.add(PAUSE_UNFOCUSED_CLASS);
  if (isLight(s, windows)) out.add(LIGHT_CLASS);
  for (const c of skinClasses(s.skins)) out.add(c);
  return out;
}

/** Light path for moving backgrounds: the chosen quality, or Light on Windows when not chosen. */
export const isLight = (s: FantasyEaselSettings, windows: boolean) => (s.motionQuality ?? (windows ? "light" : "full")) === "light";

/**
 * The only code that writes body classes / body variables (single gate).
 * Keeps the body equal to the wanted state: if anything else changes these classes, a class
 * observer puts the wanted state back. Reconcile only fixes differences, so it settles
 * by itself (no flag needed); own mutations are dropped with takeRecords().
 */
export class Applier {
  private pictureListeners = new Set<() => void>();
  private picture = new PictureLoader(() => {
    this.reconcile();
    this.pictureListeners.forEach((f) => f());
  });
  get pictureError() { return this.picture.error; }
  acceptPicture(id: string, src: string, css: string) {
    this.picture.accept(JSON.stringify([id, src, css]), css);
  }
  subscribePictures(f: () => void) {
    this.pictureListeners.add(f);
    return () => { this.pictureListeners.delete(f); };
  }
  retryPicture() {
    this.picture.reset();
    this.reconcile();
    this.pictureListeners.forEach((f) => f());
  }
  private observer: MutationObserver | null = null;
  private hits: number[] = [];
  /** reconcile runs (for tests: settled = no new runs) */
  runs = 0;

  constructor(private body: HTMLElement, private get: () => FantasyEaselSettings) {}

  attach() {
    // never two observers: a second one would fight the first with older settings
    this.observer?.disconnect();
    this.observer = new MutationObserver(() => this.onMutation());
    this.observer.observe(this.body, { attributes: true, attributeFilter: ["class"], subtree: false });
    this.reconcile();
  }

  /** Bring body in line with the wanted state. Returns how many changes were made. */
  reconcile(): number {
    const s = this.get();
    const want = wantedClasses(s, this.body.hasClass("mod-windows"));
    const cl = this.body.classList;
    let changed = 0;
    for (const c of MANAGED) {
      const has = cl.contains(c);
      if (want.has(c) && !has) { cl.add(c); changed++; }
      else if (!want.has(c) && has) { cl.remove(c); changed++; }
    }
    const selected = s.look.images.find((img) => img.enabled === true && `img-${img.id}` === s.look.background);
    const css = selected ? toCssUrl(selected.src) : "";
    this.picture.select(selected ? JSON.stringify([selected.id, selected.src, css]) : "", css, !!selected && pictureKind(selected.src) === "local");
    const value = this.picture.value;
    const now = this.body.style.getPropertyValue(URL_VAR);
    if (value !== now) { this.body.setCssProps({ [URL_VAR]: value }); changed++; }
    // style panel values: body inline variables; a value not set leaves the theme's own
    const tuned = tuningVars(s.tuning, s.look.card, this.body.hasClass("theme-dark") ? "dark" : "light");
    for (const v of TUNING_VARS) {
      const want = tuned[v] ?? "";
      if (this.body.style.getPropertyValue(v) !== want) { this.body.setCssProps({ [v]: want }); changed++; }
    }
    for (const v of OLD_VARS) if (this.body.style.getPropertyValue(v)) { this.body.setCssProps({ [v]: "" }); changed++; }
    this.observer?.takeRecords();
    if (changed) this.runs++;
    return changed;
  }

  private onMutation() {
    const now = Date.now();
    this.hits = this.hits.filter((t) => now - t < 1000);
    this.hits.push(now);
    if (this.hits.length > 10) {
      // Someone else keeps changing the same classes. Stop fighting.
      this.observer?.disconnect();
      this.observer = null;
      console.warn("[fantasy-easel] body classes keep changing (10+ times in 1s). Stopped keeping the Fantasy look.");
      new Notice("Fantasy Easel: another plugin keeps changing the theme classes. Stopped syncing. Reload Fantasy Easel to retry.");
      return;
    }
    this.reconcile();
  }

  /** Remove everything Easel added; the theme shows its defaults (Dark, Plasma still, cards). */
  detach() {
    this.picture.reset();
    this.observer?.disconnect();
    this.observer = null;
    const cl = this.body.classList;
    for (const b of CSS_BG) cl.remove(b.cls!);
    cl.remove(MARKER_CLASS, STILL_CLASS, MOTION_CLASS, STAGE_CLASS, FORCE_MOTION_CLASS, LIGHT_CLASS, PAUSE_UNFOCUSED_CLASS, ...ALL_SKIN_CLASSES);
    for (const c of THEME_GROUP) cl.remove(c);
    this.body.setCssProps(Object.fromEntries([URL_VAR, ...OLD_VARS, ...TUNING_VARS].map((v) => [v, ""])));
  }
}
