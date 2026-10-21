import { Notice } from "obsidian";
import { ACCENT_CLASS, backgroundById, CARD_OFF_CLASS, CSS_BG, FORCE_MOTION_CLASS, MARKER_CLASS, MOTION_CLASS, STILL_CLASS, THEME_COLORS, LEGACY_CARD_CLASS } from "./catalog";
import type { FantasyEaselSettings } from "./settings";

/** Every body class Fantasy Easel may add or remove. Other body classes are never touched. */
const MANAGED = new Set<string>([...THEME_COLORS.map((c) => c.cls), ...CSS_BG.map((b) => b.cls!), ACCENT_CLASS, CARD_OFF_CLASS, LEGACY_CARD_CLASS, MARKER_CLASS, STILL_CLASS, MOTION_CLASS, FORCE_MOTION_CLASS]);
/** Classes Style Settings also owns (its Fantasy group). */
const THEME_GROUP = [...THEME_COLORS.map((c) => c.cls), ACCENT_CLASS, CARD_OFF_CLASS, LEGACY_CARD_CLASS];
/** Your picture goes here as a body inline variable (beats the theme's Plasma and any class rule). */
const URL_VAR = "--background-url";
/** Variables older versions wrote inline; only removed. */
const OLD_VARS = ["--background-url1", "--background-url2", "--background-url3"] as const;

/** Classes the body should have for this look. */
export function wantedClasses(s: FantasyEaselSettings): Set<string> {
  const bg = backgroundById(s.look.background, s.look.images);
  const out = new Set<string>([MARKER_CLASS, s.look.color]);
  if (bg?.cls) out.add(bg.cls);
  if (bg?.kind === "motion") out.add(MOTION_CLASS);
  if (s.look.accent) out.add(ACCENT_CLASS);
  if (!s.look.card) out.add(CARD_OFF_CLASS);
  if (s.motion === "off") out.add(STILL_CLASS);
  if (s.motion === "on") out.add(FORCE_MOTION_CLASS);
  return out;
}

/**
 * The only code that writes body classes / body variables (single gate).
 * Keeps the body equal to the wanted state: Style Settings re-applies its own values on
 * `css-change` (dark/light switch, theme change) by removing the whole Fantasy group, so a
 * class observer puts the wanted state back. Reconcile only fixes differences, so it settles
 * by itself (no flag needed); own mutations are dropped with takeRecords().
 */
export class Applier {
  private observer: MutationObserver | null = null;
  private hits: number[] = [];
  /** reconcile runs (for tests: settled = no new runs) */
  runs = 0;

  constructor(private body: HTMLElement, private get: () => FantasyEaselSettings) {}

  attach() {
    // Observer first: Style Settings re-applies ~100ms after load and would otherwise win.
    this.observer = new MutationObserver(() => this.onMutation());
    this.observer.observe(this.body, { attributes: true, attributeFilter: ["class"], subtree: false });
    this.reconcile();
  }

  /** Bring body in line with the wanted state. Returns how many changes were made. */
  reconcile(): number {
    const s = this.get();
    const want = wantedClasses(s);
    const cl = this.body.classList;
    let changed = 0;
    for (const c of MANAGED) {
      const has = cl.contains(c);
      if (want.has(c) && !has) { cl.add(c); changed++; }
      else if (!want.has(c) && has) { cl.remove(c); changed++; }
    }
    const value = backgroundById(s.look.background, s.look.images)?.url ?? "";
    const now = this.body.style.getPropertyValue(URL_VAR);
    if (value && now !== value) { this.body.style.setProperty(URL_VAR, value); changed++; }
    else if (!value && now) { this.body.style.removeProperty(URL_VAR); changed++; }
    for (const v of OLD_VARS) if (this.body.style.getPropertyValue(v)) { this.body.style.removeProperty(v); changed++; }
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

  /**
   * Hand the look back. Only Easel's own things are removed (the theme shows Plasma, still);
   * if Style Settings is on, it re-applies its own values on `parse-style-settings`.
   */
  detach(styleSettings: { enabled: boolean; trigger: () => void }) {
    this.observer?.disconnect();
    this.observer = null;
    const cl = this.body.classList;
    for (const b of CSS_BG) cl.remove(b.cls!);
    cl.remove(MARKER_CLASS, STILL_CLASS, MOTION_CLASS, FORCE_MOTION_CLASS);
    for (const v of [URL_VAR, ...OLD_VARS]) this.body.style.removeProperty(v);
    if (styleSettings.enabled) styleSettings.trigger();
    // Same as "no Easel": nobody owns these classes now.
    else for (const c of THEME_GROUP) cl.remove(c);
  }
}
