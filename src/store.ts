import type { FantasyEaselSettings, Look } from "./settings";

/**
 * One place for the current settings. Every change goes through here: the applier
 * re-applies, the status bar and settings tab redraw, and the save is batched (300ms).
 */
export class Store {
  private listeners = new Set<() => void>();
  private saveTimer: number | null = null;

  constructor(public settings: FantasyEaselSettings, private save: (s: FantasyEaselSettings) => Promise<void>) {}

  setLook(patch: Partial<Look>) {
    this.set({ look: { ...this.settings.look, ...patch } });
  }

  set(patch: Partial<FantasyEaselSettings>) {
    this.settings = { ...this.settings, ...patch };
    // Copy first: a listener may unsubscribe / subscribe while we notify. Set.forEach visits
    // entries added during the loop, so a listener that re-subscribes would loop forever.
    [...this.listeners].forEach((f) => f());
    if (this.saveTimer !== null) window.clearTimeout(this.saveTimer);
    this.saveTimer = window.setTimeout(() => this.flush(), 300);
  }

  /** Write a pending save now (unload). */
  flush() {
    if (this.saveTimer === null) return;
    window.clearTimeout(this.saveTimer);
    this.saveTimer = null;
    void this.save(this.settings);
  }

  subscribe(f: () => void): () => void {
    this.listeners.add(f);
    return () => this.listeners.delete(f);
  }
}
