import { Plugin } from "obsidian";
import { Applier } from "./apply";
import { GalleryModal } from "./gallery";
import { backgroundMenu, colorMenu, stepBackground } from "./menus";
import { DEFAULT_SETTINGS, normalize, type FantasyEaselSettings } from "./settings";
import { StageHost } from "./stages";
import { backgroundById } from "./catalog";
import { FantasyEaselSettingTab } from "./settings-tab";
import { AddPictureModal } from "./picture-modal";
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
  menus = { color: () => colorMenu(this.store), background: () => backgroundMenu(this.store, () => this.addPicture()) };

  async onload() {
    const saved = (await this.loadData()) as Partial<FantasyEaselSettings> | null;
    const settings = normalize(saved ?? DEFAULT_SETTINGS);
    this.store = new Store(settings, (s) => this.saveData(s));
    if (!saved) await this.saveData(settings);

    // Random start point for motion backgrounds (negative delay = already that far into the cycle)
    document.body.setCssProps({ "--fantasy-easel-delay": `-${Math.round(Math.random() * 600)}s` });
    this.register(() => document.body.setCssProps({ "--fantasy-easel-delay": "" }));
    this.applier = new Applier(document.body, () => this.store.settings);
    this.applier.attach();
    this.syncStage();
    this.statusBar = new StatusBar(this.app, this, this.store, () => this.addPicture());
    if (settings.statusBar) this.statusBar.show();

    this.register(
      this.store.subscribe(() => {
        this.applier.reconcile();
        this.syncStage();
        if (this.store.settings.statusBar) this.statusBar.show();
        else this.statusBar.hide();
      }),
    );

    this.addSettingTab(new FantasyEaselSettingTab(this.app, this));
    // obsidian://fantasy-easel opens the background gallery (the theme's Style Settings notice links here)
    this.registerObsidianProtocolHandler("fantasy-easel", () => this.openGallery());
    this.addCommand({ id: "next-background", name: "Next background", callback: () => stepBackground(this.store, 1) });
    this.addCommand({ id: "previous-background", name: "Previous background", callback: () => stepBackground(this.store, -1) });
    this.addCommand({ id: "background-gallery", name: "Background gallery", callback: () => this.openGallery() });
    this.addCommand({ id: "add-picture", name: "Add picture", callback: () => this.addPicture() });
    this.app.workspace.onLayoutReady(() => { this.applier.reconcile(); this.syncStage(); });
  }

  onunload() {
    this.store.flush();
    this.statusBar.hide();
    this.applier.detach();
    this.stage.remove();
  }

  openGallery() {
    new GalleryModal(this.app, this.store, () => this.addPicture()).open();
  }

  addPicture() {
    new AddPictureModal(this.app, this.store).open();
  }

}
