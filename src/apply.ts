import { Notice } from "obsidian";
import { ACCENT_CLASS, BACKGROUNDS, backgroundById, CARD_OFF_CLASS, FORCE_MOTION_CLASS, MARKER_CLASS, MOTION_CLASS, STILL_CLASS, THEME_COLORS, LEGACY_CARD_CLASS } from "./catalog";
import type { FantasyEaselSettings, Look } from "./settings";

/** Every body class Fantasy Easel may add or remove. Other body classes are never touched. */
const MANAGED = new Set<string>([...THEME_COLORS.map((c) => c.cls), ...BACKGROUNDS.map((b) => b.cls), ACCENT_CLASS, CARD_OFF_CLASS, LEGACY_CARD_CLASS, MARKER_CLASS, STILL_CLASS, MOTION_CLASS, FORCE_MOTION_CLASS]);
/** Classes Style Settings also owns (its Fantasy group). */
const THEME_GROUP = [...THEME_COLORS.map((c) => c.cls), ...BACKGROUNDS.filter((b) => b.kind === "theme").map((b) => b.cls), ACCENT_CLASS, CARD_OFF_CLASS, LEGACY_CARD_CLASS];
const URL_VARS = ["--background-url1", "--background-url2", "--background-url3"] as const;

/** Classes the body should have for this look. */
export function wantedClasses(s: FantasyEaselSettings): Set<string> {
  const bg = backgroundById(s.look.background);
  const out = new Set<string>([MARKER_CLASS, s.look.color]);
  if (bg) out.add(bg.cls);
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
    URL_VARS.forEach((v, i) => {
      const value = s.look.urls[i];
      const now = this.body.style.getPropertyValue(v);
      if (value && now !== value) { this.body.style.setProperty(v, value); changed++; }
      else if (!value && now) { this.body.style.removeProperty(v); changed++; }
    });
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
   * Hand the look back. Only Easel's own things are removed; if Style Settings is on, it
   * re-applies its own values (with its own rules) on `parse-style-settings`.
   */
  detach(styleSettings: { enabled: boolean; look: Look | null; trigger: () => void }) {
    this.observer?.disconnect();
    this.observer = null;
    const cl = this.body.classList;
    const usingCssBg = BACKGROUNDS.some((b) => b.kind !== "theme" && cl.contains(b.cls));
    for (const b of BACKGROUNDS) if (b.kind !== "theme") cl.remove(b.cls);
    cl.remove(MARKER_CLASS, STILL_CLASS, MOTION_CLASS, FORCE_MOTION_CLASS);
    URL_VARS.forEach((v) => this.body.style.removeProperty(v));
    if (styleSettings.enabled) {
      // Avoid an empty background for the ~100ms until Style Settings re-applies.
      const bg = styleSettings.look && backgroundById(styleSettings.look.background);
      if (usingCssBg && bg) cl.add(bg.cls);
      styleSettings.trigger();
    } else {
      // Same as "no Easel": nobody owns these classes now.
      for (const c of THEME_GROUP) cl.remove(c);
    }
  }
}
