import { Notice, Plugin } from "obsidian";
import { Applier } from "./apply";
import { backgroundMenu, colorMenu, stepBackground } from "./menus";
import { NO_THEME_TEXT } from "./options";
import { DEFAULT_SETTINGS, normalize, type FantasyEaselSettings } from "./settings";
import { StageHost } from "./stages";
import { backgroundById, setPictureResolver } from "./catalog";
import { resolvePicture } from "./pictures";
import { FantasyEaselSettingTab } from "./settings-tab";
import { PicturesModal } from "./picture-modal";
import { StatusBar } from "./statusbar";
import { Store } from "./store";
import { STYLE_VIEW, StyleView } from "./style-view";

export default class FantasyEaselPlugin extends Plugin {
  store!: Store;
  applier!: Applier;
  private statusBar!: StatusBar;
  private stage = new StageHost();
  private syncStage() {
    const { look } = this.store.settings;
    this.stage.sync(backgroundById(look.background, look.images)?.stage);
  }
  /** True while the Fantasy theme is the current theme. Otherwise the plugin stays idle. */
  active = false;

  /** Public check: the Fantasy theme defines --fantasy-hue on body (theme.css "Theme - Colors"). */
  private isFantasy() {
    return getComputedStyle(document.body).getPropertyValue("--fantasy-hue").trim() !== "";
  }

  /** Follow the current theme: work with Fantasy, step back fully with any other theme. */
  private refresh() {
    const on = this.isFantasy();
    if (on !== this.active) {
      this.active = on;
      if (on) this.applier.attach();
      else this.applier.detach();
    }
    if (on) {
      this.applier.reconcile();
      this.syncStage();
      if (this.store.settings.statusBar) this.statusBar.show();
      else this.statusBar.hide();
    } else {
      this.stage.remove();
      this.statusBar.hide();
    }
  }

  /** Menu builders, also for CLI checks (a Menu closes at once when the window has no focus). */
  menus = { color: () => colorMenu(this.store), background: () => backgroundMenu(this.store, () => this.managePictures(), () => void this.openGallery()) };

  async onload() {
    const saved = (await this.loadData()) as Partial<FantasyEaselSettings> | null;
    const settings = normalize(saved ?? DEFAULT_SETTINGS);
    // local pictures (vault path, file://, absolute path) need the app to become an address
    setPictureResolver((src) => resolvePicture(this.app, src));
    this.register(() => setPictureResolver(null));
    this.store = new Store(settings, (s) => this.saveData(s));
    if (!saved) await this.saveData(settings);

    // Random start point for motion backgrounds (negative delay = already that far into the cycle)
    document.body.setCssProps({ "--fantasy-easel-delay": `-${Math.round(Math.random() * 600)}s` });
    this.register(() => document.body.setCssProps({ "--fantasy-easel-delay": "" }));
    this.applier = new Applier(document.body, () => this.store.settings);
    this.statusBar = new StatusBar(this.app, this, this.store, () => this.managePictures(), () => void this.openGallery());
    this.refresh();

    this.register(this.store.subscribe(() => this.refresh()));
    // theme switched (or snippets changed): start or stop
    this.registerEvent(this.app.workspace.on("css-change", () => this.refresh()));

    this.registerView(STYLE_VIEW, (leaf) => new StyleView(leaf, this));
    this.addSettingTab(new FantasyEaselSettingTab(this.app, this));
    // obsidian://fantasy-easel opens the background gallery (the theme's Style Settings notice links here)
    this.registerObsidianProtocolHandler("fantasy-easel", () => void this.openGallery());
    // without the Fantasy theme these change nothing you can see: hidden from the palette
    const whenActive = (run: () => void) => (checking: boolean) => {
      if (!this.active) return false;
      if (!checking) run();
      return true;
    };
    this.addCommand({ id: "next-background", name: "Next background", checkCallback: whenActive(() => stepBackground(this.store, 1)) });
    this.addCommand({ id: "previous-background", name: "Previous background", checkCallback: whenActive(() => stepBackground(this.store, -1)) });
    this.addCommand({ id: "background-gallery", name: "Background gallery", callback: () => void this.openGallery() });
    // no default hotkey (plugin guidelines)
    this.addCommand({ id: "open-style-panel", name: "Open style panel", callback: () => void this.openStylePanel() });
    this.addCommand({ id: "manage-pictures", name: "Manage pictures", checkCallback: whenActive(() => this.managePictures()) });
    // a vault picture that is renamed or moved keeps working
    this.registerEvent(this.app.vault.on("rename", (file, oldPath) => {
      const images = this.store.settings.look.images;
      if (images.some((x) => x.src.trim() === oldPath)) this.store.setLook({ images: images.map((x) => (x.src.trim() === oldPath ? { ...x, src: file.path } : x)) });
    }));
    // the vault index is ready only after layout: vault pictures resolve from then on
    this.app.workspace.onLayoutReady(() => {
      this.applier.reconcile();
      this.refresh();
    });
  }

  onunload() {
    this.store.flush();
    this.statusBar.hide();
    // always: an observer left running after unload keeps old settings and fights the next load
    this.applier.detach();
    this.stage.remove();
  }

  /** The gallery lives in the style panel: open the panel with the gallery unfolded and in view
   *  (status bar, menu, command, settings, obsidian://fantasy-easel), one click. */
  async openGallery() {
    if (!this.active) return void new Notice(NO_THEME_TEXT);
    (await this.openStylePanel())?.showGallery();
  }

  /** The style panel in the right sidebar (reuses an open one). */
  async openStylePanel(): Promise<StyleView | null> {
    const leaf = await this.app.workspace.ensureSideLeaf(STYLE_VIEW, "right", { active: true, reveal: true });
    await this.app.workspace.revealLeaf(leaf);
    return leaf.view instanceof StyleView ? leaf.view : null;
  }

  /** Your pictures window: add, use, remove. */
  managePictures() {
    new PicturesModal(this.app, this.store).open();
  }

}
