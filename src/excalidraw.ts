// Excalidraw settings that the Excalidraw skin needs (2026-10-22): the canvas follows the Obsidian
// theme and keeps its own colors, so the Fantasy wallpaper and glass show through.
// Changes another plugin's settings, so only after the user confirms (ExcalidrawSettingsModal),
// through that plugin's own settings object + saveSettings() (writing its data.json directly would
// be overwritten by the running plugin). The values before the change are kept for Restore.
// `app.plugins` is not in the public API: the second exception after the dark / light button.
import { Modal, Notice, Setting, type App } from "obsidian";
import type { Store } from "./store";

const ID = "obsidian-excalidraw-plugin";

interface Wanted {
  key: string;
  label: string;
  value: unknown;
}

/** Labels as Excalidraw shows them (Settings → Excalidraw), checked against 2.29.0. */
export const EXCALIDRAW_WANTED: Wanted[] = [
  { key: "dynamicStyling", label: "Dynamic styling", value: "none" },
  { key: "iframeMatchExcalidrawTheme", label: "Markdown embeds to match Excalidraw theme", value: true },
  { key: "matchTheme", label: "New drawing to match Obsidian theme", value: true },
  { key: "matchThemeAlways", label: "Existing drawings to match Obsidian theme", value: true },
  { key: "matchThemeTrigger", label: "Excalidraw to follow when Obsidian Theme changes", value: true },
];

interface ExcalidrawPlugin {
  settings: Record<string, unknown>;
  saveSettings(): Promise<void>;
}

/** The running Excalidraw plugin, or null (not installed / off / settings shape changed). */
function excalidraw(app: App): ExcalidrawPlugin | null {
  const p = (app as unknown as { plugins?: { getPlugin?(id: string): unknown } }).plugins?.getPlugin?.(ID) as ExcalidrawPlugin | null | undefined;
  if (!p || typeof p.settings !== "object" || typeof p.saveSettings !== "function") return null;
  // every key must exist: a renamed setting means this list is out of date, so change nothing
  return EXCALIDRAW_WANTED.every((w) => w.key in p.settings) ? p : null;
}

const show = (v: unknown) => (typeof v === "boolean" ? (v ? "on" : "off") : String(v));

/** Settings that differ from what the skin needs (empty = all set, or Excalidraw not available). */
export function excalidrawDiff(app: App): { w: Wanted; now: unknown }[] {
  const p = excalidraw(app);
  if (!p) return [];
  return EXCALIDRAW_WANTED.filter((w) => p.settings[w.key] !== w.value).map((w) => ({ w, now: p.settings[w.key] }));
}

export const excalidrawAvailable = (app: App) => excalidraw(app) !== null;

async function apply(app: App, store: Store) {
  const p = excalidraw(app);
  if (!p) return;
  const diff = excalidrawDiff(app);
  if (!diff.length) return;
  // keep the first values seen (a second Match must not overwrite the user's originals)
  const backup = { ...Object.fromEntries(diff.map((d) => [d.w.key, d.now])), ...(store.settings.excalidrawBackup ?? {}) };
  store.set({ excalidrawBackup: backup });
  for (const d of diff) p.settings[d.w.key] = d.w.value;
  await p.saveSettings();
  new Notice("Excalidraw settings changed. Reopen open drawings to see it.");
}

export async function restoreExcalidraw(app: App, store: Store) {
  const p = excalidraw(app);
  const backup = store.settings.excalidrawBackup;
  if (!p || !backup) return;
  for (const [k, v] of Object.entries(backup)) if (k in p.settings) p.settings[k] = v;
  await p.saveSettings();
  store.set({ excalidrawBackup: null });
  new Notice("Excalidraw settings restored. Reopen open drawings to see it.");
}

/**
 * Asks before touching Excalidraw's settings, listing what changes (now → new).
 * - match: from "Match settings…" (the style is already on): change them, or not now.
 * - turnOn: from the Excalidraw style toggle (2026-10-24 user): a warning and one final choice —
 *   turn on and change the settings, turn on only, or cancel (nothing changes, the toggle stays off).
 *   Closing the window counts as cancel.
 */
export class ExcalidrawSettingsModal extends Modal {
  private decided = false;

  constructor(app: App, private store: Store, private turnOn: ((on: boolean) => void) | null = null) {
    super(app);
  }

  onOpen() {
    const diff = excalidrawDiff(this.app);
    const el = this.contentEl;
    this.setTitle(this.turnOn ? "Turn on the Excalidraw style" : "Match Excalidraw settings");
    if (this.turnOn) el.createEl("p", { text: "The Excalidraw style shows the Fantasy wallpaper behind your drawings. For that, Excalidraw has to follow the Obsidian theme." });
    if (diff.length) {
      el.createEl("p", { text: "Fantasy Easel can change these Excalidraw settings for you:" });
      const ul = el.createEl("ul");
      for (const d of diff) ul.createEl("li", { text: `${d.w.label}: ${show(d.now)} → ${show(d.w.value)}` });
      el.createEl("p", { text: "This changes another plugin's settings. The current values are kept, and Settings → Fantasy Easel → Plugin styles → Excalidraw → Restore puts them back." });
    } else {
      el.createEl("p", { text: "Excalidraw's settings already match." });
    }
    el.createEl("p", { text: "One more step in Excalidraw itself: give each drawing a transparent background (canvas background color), or the wallpaper stays hidden behind it." });

    const row = new Setting(el);
    if (this.turnOn) {
      const done = (on: boolean, change: boolean) => async () => {
        this.decided = true;
        this.close();
        if (change) await apply(this.app, this.store);
        this.turnOn?.(on);
      };
      row.addButton((b) => b.setButtonText("Cancel").onClick(done(false, false)));
      if (diff.length) row.addButton((b) => b.setButtonText("Turn on only").onClick(done(true, false)));
      row.addButton((b) => b.setButtonText(diff.length ? "Turn on and change settings" : "Turn on").setCta().onClick(done(true, diff.length > 0)));
    } else {
      row.addButton((b) => b.setButtonText("Not now").onClick(() => this.close()));
      row.addButton((b) => b.setButtonText("Change Excalidraw settings").setCta().onClick(async () => {
        this.close();
        await apply(this.app, this.store);
      }));
    }
  }

  onClose() {
    this.contentEl.empty();
    // closed without a choice (Esc, ×): same as cancel
    if (this.turnOn && !this.decided) this.turnOn(false);
  }
}
