import { Notice, Plugin, type TAbstractFile } from "obsidian";
import { Applier } from "./apply";
import { GalleryModal } from "./gallery";
import { backgroundMenu, colorMenu, stepBackground } from "./menus";
import { DEFAULT_SETTINGS, normalize, type FantasyEaselSettings } from "./settings";
import { StageHost } from "./stages";
import { backgroundById, setPictureResolver } from "./catalog";
import { resolvePicture } from "./pictures";
import { FantasyEaselSettingTab } from "./settings-tab";
import { AddPictureModal } from "./picture-modal";
import { PictureActivation } from "./picture-activation";
import { StatusBar } from "./statusbar";
import { Store } from "./store";
import { STYLE_VIEW, StyleView } from "./style-view";

export default class FantasyEaselPlugin extends Plugin {
  store!: Store;
  applier!: Applier;
  pictures!: PictureActivation;
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
  menus = { color: () => colorMenu(this.store), background: () => backgroundMenu(this.store, () => this.addPicture()) };

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
    this.pictures = new PictureActivation(this.store, this.applier, (message) => { new Notice(message); });
    this.store.backgroundChooser = (id) => this.pictures.activate(id);
    this.statusBar = new StatusBar(this.app, this, this.store, () => this.addPicture());
    const fallbackUnavailable = () => {
      if (this.active && this.applier.pictureError) this.pictures.unavailable(this.store.settings.look.background);
    };
    this.register(this.applier.subscribePictures(fallbackUnavailable));
    this.refresh();
    fallbackUnavailable();

    this.register(this.store.subscribe(() => { this.refresh(); fallbackUnavailable(); }));
    // theme switched (or snippets changed): start or stop
    this.registerEvent(this.app.workspace.on("css-change", () => this.refresh()));
    // Recheck external files/URLs when returning to Obsidian. Vault changes are immediate.
    const retryPicture = () => { if (this.active) this.applier.retryPicture(); };
    this.registerDomEvent(window, "focus", retryPicture);
    const pictureChanged = (file: TAbstractFile) => {
      if (this.store.settings.look.images.some((img) => `img-${img.id}` === this.store.settings.look.background && img.src.trim() === file.path)) retryPicture();
    };
    this.registerEvent(this.app.vault.on("create", pictureChanged));
    this.registerEvent(this.app.vault.on("delete", pictureChanged));
    this.registerEvent(this.app.vault.on("modify", pictureChanged));

    this.registerView(STYLE_VIEW, (leaf) => new StyleView(leaf, this));
    this.addSettingTab(new FantasyEaselSettingTab(this.app, this));
    // obsidian://fantasy-easel opens the background gallery (the theme's Style Settings notice links here)
    this.registerObsidianProtocolHandler("fantasy-easel", () => this.openGallery());
    this.addCommand({ id: "next-background", name: "Next background", callback: () => stepBackground(this.store, 1) });
    this.addCommand({ id: "previous-background", name: "Previous background", callback: () => stepBackground(this.store, -1) });
    this.addCommand({ id: "background-gallery", name: "Background gallery", callback: () => this.openGallery() });
    // no default hotkey (plugin guidelines)
    this.addCommand({ id: "open-style-panel", name: "Open style panel", callback: () => void this.openStylePanel() });
    this.addCommand({ id: "add-picture", name: "Add picture", callback: () => this.addPicture() });
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
    this.pictures.dispose();
    this.store.backgroundChooser = null;
    this.store.flush();
    this.statusBar.hide();
    // always: an observer left running after unload keeps old settings and fights the next load
    this.applier.detach();
    this.stage.remove();
  }

  openGallery() {
    if (!this.active) return void new Notice("Fantasy Easel works with the Fantasy theme. Choose Fantasy in Settings → Appearance → Themes.");
    new GalleryModal(this.app, this.store, () => this.addPicture()).open();
  }

  /** The style panel in the right sidebar (reuses an open one). */
  async openStylePanel() {
    const leaf = await this.app.workspace.ensureSideLeaf(STYLE_VIEW, "right", { active: true, reveal: true });
    await this.app.workspace.revealLeaf(leaf);
  }

  addPicture() {
    new AddPictureModal(this.app, this.store).open();
  }

}
