import { Plugin } from "obsidian";
import { Applier } from "./apply";
import { GalleryModal } from "./gallery";
import { backgroundMenu, colorMenu, stepBackground } from "./menus";
import { DEFAULT_SETTINGS, normalize, type FantasyEaselSettings } from "./settings";
import { applySkins, removeSkins } from "./skins";
import { StageHost } from "./stages";
import { backgroundById } from "./catalog";
import { FantasyEaselSettingTab } from "./settings-tab";
import { StatusBar } from "./statusbar";
import { Store } from "./store";

export default class FantasyEaselPlugin extends Plugin {
  store!: Store;
  applier!: Applier;
  private statusBar!: StatusBar;
  private stage = new StageHost();
  private syncStage() {
    const { look } = this.store.settings;
    this.stage.sync(backgroundById(look.background, look.images)?.stage);
  }
  /** Menu builders, also for CLI checks (a Menu closes at once when the window has no focus). */
  menus = { color: () => colorMenu(this.store), background: () => backgroundMenu(this.store, () => this.openSettings()) };

  async onload() {
    const saved = (await this.loadData()) as Partial<FantasyEaselSettings> | null;
    const settings = normalize(saved ?? DEFAULT_SETTINGS);
    this.store = new Store(settings, (s) => this.saveData(s));
    if (!saved) await this.saveData(settings);

    // Random start point for motion backgrounds (negative delay = already that far into the cycle)
    document.body.style.setProperty("--fantasy-easel-delay", `-${Math.round(Math.random() * 600)}s`);
    this.register(() => document.body.style.removeProperty("--fantasy-easel-delay"));
    this.applier = new Applier(document.body, () => this.store.settings);
    this.applier.attach();
    applySkins(this.app, settings.skins);
    this.syncStage();
    this.statusBar = new StatusBar(this.app, this, this.store, () => this.openSettings());
    if (settings.statusBar) this.statusBar.show();

    this.register(
      this.store.subscribe(() => {
        this.applier.reconcile();
        applySkins(this.app, this.store.settings.skins);
        this.syncStage();
        if (this.store.settings.statusBar) this.statusBar.show();
        else this.statusBar.hide();
      }),
    );

    this.addSettingTab(new FantasyEaselSettingTab(this.app, this));
    // obsidian://fantasy-easel opens these settings (the theme's Style Settings notice links here)
    this.registerObsidianProtocolHandler("fantasy-easel", () => this.openSettings());
    this.addCommand({ id: "next-background", name: "Next background", callback: () => stepBackground(this.store, 1) });
    this.addCommand({ id: "previous-background", name: "Previous background", callback: () => stepBackground(this.store, -1) });
    this.addCommand({ id: "background-gallery", name: "Background gallery", callback: () => new GalleryModal(this.app, this.store, () => this.openSettings()).open() });
    this.app.workspace.onLayoutReady(() => { this.applier.reconcile(); this.syncStage(); });
  }

  onunload() {
    this.store.flush();
    this.statusBar.hide();
    this.applier.detach();
    removeSkins();
    this.stage.remove();
  }

  /** Open this plugin's settings tab (to add pictures). */
  openSettings() {
    const setting = (this.app as unknown as { setting: { open(): void; openTabById(id: string): void } }).setting;
    setting.open();
    setting.openTabById(this.manifest.id);
  }
}
