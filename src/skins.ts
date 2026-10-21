// Plugin skins: CSS that fits a plugin to the Fantasy glass. Moved out of the theme (2026-10-21)
// so the theme stays core-only; each skin is a <style> added only while it is on.
import type { App } from "obsidian";
import dataviewCss from "../skins/dataview.css";
import kanbanCss from "../skins/kanban.css";

export interface Skin {
  id: string;
  name: string;
  /** plugin id in Obsidian (installed = default on) */
  plugin: string;
  desc: string;
  css: string;
}

export const SKINS: Skin[] = [
  { id: "dataview", name: "Dataview", plugin: "dataview", desc: "Query results (tables, lists, tasks) sit on the glass card with rounded corners and slightly smaller text.", css: dataviewCss },
  { id: "kanban", name: "Kanban", plugin: "obsidian-kanban", desc: "Board, lanes and cards use the glass colors; lane headers follow the heading colors.", css: kanbanCss },
];

type PluginsApi = { manifests: Record<string, unknown> };
export const isInstalled = (app: App, plugin: string) => !!(app as unknown as { plugins: PluginsApi }).plugins.manifests[plugin];

/** On = the user's choice, else on when the plugin is installed. */
export const skinOn = (app: App, skins: Record<string, boolean>, s: Skin) => skins[s.id] ?? isInstalled(app, s.plugin);

const ATTR = "data-fantasy-easel-skin";

/** Keep one <style> per skin that is on; remove the others. */
export function applySkins(app: App, skins: Record<string, boolean>) {
  for (const s of SKINS) {
    const el = document.head.querySelector(`style[${ATTR}="${s.id}"]`);
    const on = skinOn(app, skins, s);
    if (on && !el) document.head.createEl("style", { attr: { [ATTR]: s.id }, text: s.css });
    else if (!on && el) el.remove();
  }
}

export function removeSkins() {
  document.head.querySelectorAll(`style[${ATTR}]`).forEach((el) => el.remove());
}
