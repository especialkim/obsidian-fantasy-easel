import { Notice, Plugin } from "obsidian";
import { Applier } from "./apply";
import { GalleryModal } from "./gallery";
import { backgroundMenu, colorMenu, stepBackground } from "./menus";
import { DEFAULT_SETTINGS, normalize, readStyleSettingsLook, type FantasyEaselSettings, type Look } from "./settings";
import { FantasyEaselSettingTab } from "./settings-tab";
import { StatusBar } from "./statusbar";
import { Store } from "./store";

const STYLE_SETTINGS_ID = "obsidian-style-settings";

/** Loaded plugins (a plugin turned off without saving is gone from here but still in enabledPlugins). */
type PluginsApi = { plugins: Record<string, unknown> };

export default class FantasyEaselPlugin extends Plugin {
  store!: Store;
  applier!: Applier;
  private statusBar!: StatusBar;
  /** Menu builders, also for CLI checks (a Menu closes at once when the window has no focus). */
  menus = { color: () => colorMenu(this.store), background: () => backgroundMenu(this.store) };
  /** Style Settings' saved Fantasy look, for the hand-back on unload. */
  private ssLook: Look | null = null;

  async onload() {
    const saved = (await this.loadData()) as Partial<FantasyEaselSettings> | null;
    const ss = await readStyleSettingsLook(this.app);
    this.ssLook = ss.found ? ss.look : null;
    // First run: start from what Style Settings shows now, so turning Easel on changes nothing.
    const settings = saved ? normalize(saved) : { ...DEFAULT_SETTINGS, look: ss.look };
    this.store = new Store(settings, (s) => this.saveData(s));
    if (!saved) await this.saveData(settings);

    // Random start point for motion backgrounds (negative delay = already that far into the cycle)
    document.body.style.setProperty("--fantasy-easel-delay", `-${Math.round(Math.random() * 600)}s`);
    this.register(() => document.body.style.removeProperty("--fantasy-easel-delay"));
    this.applier = new Applier(document.body, () => this.store.settings);
    this.applier.attach();
    this.statusBar = new StatusBar(this.app, this, this.store);
    if (settings.statusBar) this.statusBar.show();

    this.register(
      this.store.subscribe(() => {
        this.applier.reconcile();
        if (this.store.settings.statusBar) this.statusBar.show();
        else this.statusBar.hide();
      }),
    );

    this.addSettingTab(new FantasyEaselSettingTab(this.app, this));
    this.addCommand({ id: "next-background", name: "Next background", callback: () => stepBackground(this.store, 1) });
    this.addCommand({ id: "previous-background", name: "Previous background", callback: () => stepBackground(this.store, -1) });
    this.addCommand({ id: "background-gallery", name: "Background gallery", callback: () => new GalleryModal(this.app, this.store).open() });
    this.addCommand({ id: "import-style-settings", name: "Import from Style Settings", callback: () => void this.importFromStyleSettings() });
    // Style Settings may apply after us on startup; the observer handles that, this is a last check.
    this.app.workspace.onLayoutReady(() => this.applier.reconcile());
  }

  onunload() {
    this.store.flush();
    this.statusBar.hide();
    const plugins = (this.app as unknown as { plugins: PluginsApi }).plugins;
    this.applier.detach({
      enabled: !!plugins.plugins[STYLE_SETTINGS_ID],
      look: this.ssLook,
      trigger: () => this.app.workspace.trigger("parse-style-settings"),
    });
  }

  async importFromStyleSettings() {
    const ss = await readStyleSettingsLook(this.app);
    this.ssLook = ss.found ? ss.look : null;
    this.store.setLook(ss.look);
    new Notice(ss.found ? "Fantasy Easel: imported from Style Settings." : "Fantasy Easel: no Style Settings values, used theme defaults.");
  }
}
