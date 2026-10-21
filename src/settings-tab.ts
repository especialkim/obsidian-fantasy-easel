import { Menu, PluginSettingTab, Setting, type App } from "obsidian";
import { backgroundById, colorByCls, DEFAULT_BACKGROUND, newImageId, toCssUrl } from "./catalog";
import type FantasyEaselPlugin from "./main";
import { GalleryModal } from "./gallery";
import { backgroundMenu, colorMenu } from "./menus";
import { MOTIONS } from "./settings";
import { skinOn, SKINS } from "./skins";

/** Where to get the theme (not in the community store yet). */
const FANTASY_URL = "https://github.com/especialkim/obsidian-theme-fantasy";

/** Sections: Look · Background · Your pictures · Plugin skins · Controls. Lists open as Obsidian Menus (same as the status bar). */
export class FantasyEaselSettingTab extends PluginSettingTab {
  private unsubscribe: (() => void) | null = null;

  constructor(app: App, private plugin: FantasyEaselPlugin) {
    super(app, plugin);
  }

  private queued = false;
  /** after +: focus the new picture field once */
  private focusLast = false;

  display() {
    // Subscribe once per open; store changes (here, status bar, commands) redraw via render().
    if (!this.unsubscribe) this.unsubscribe = this.plugin.store.subscribe(() => this.queueRender());
    this.render();
  }

  /** One redraw after the current event (several changes in one click redraw once). */
  private queueRender() {
    if (this.queued) return;
    this.queued = true;
    queueMicrotask(() => {
      this.queued = false;
      if (this.unsubscribe) this.render();
    });
  }

  private render() {
    const { containerEl } = this;
    const store = this.plugin.store;
    const { look, motion, statusBar, skins } = store.settings;
    containerEl.empty();
    containerEl.addClass("fantasy-easel-settings");

    if (!this.plugin.active) {
      this.renderNoTheme();
      return;
    }

    const heading = (name: string, desc?: string) => {
      const h = new Setting(containerEl).setName(name).setHeading();
      if (desc) h.setDesc(desc);
      return h;
    };

    // ---------- Look ----------
    heading("Look", "The Fantasy theme reads these. Without this plugin it shows Dark, Plasma (still) and cards.");
    new Setting(containerEl)
      .setName("Theme color")
      .setDesc(colorByCls(look.color)?.name ?? look.color)
      .addButton((b) => b.setButtonText("Change").onClick((ev) => colorMenu(store).showAtMouseEvent(ev)));
    new Setting(containerEl).setName("Theme accent").setDesc("Accent from the theme: theme color in light mode, gold in dark mode. Off = Obsidian's accent color.").addToggle((t) => t.setValue(look.accent).onChange((v) => store.setLook({ accent: v })));
    new Setting(containerEl).setName("Card layout").setDesc("Sidebars and notes as floating glass cards.").addToggle((t) => t.setValue(look.card).onChange((v) => store.setLook({ card: v })));

    // ---------- Background ----------
    heading("Background");
    const bg = backgroundById(look.background, look.images);
    new Setting(containerEl)
      .setName("Background")
      .setDesc(bg ? `${bg.name} (${bg.kind === "image" ? "your picture" : `CSS · ${bg.kind}`})` : look.background)
      .addButton((b) => b.setButtonText("Gallery").onClick(() => this.plugin.openGallery()))
      .addButton((b) => b.setButtonText("Change").onClick((ev) => backgroundMenu(store).showAtMouseEvent(ev)));
    new Setting(containerEl)
      .setName("Motion")
      .setDesc(`For moving backgrounds. Auto follows the OS "reduce motion" setting${window.matchMedia("(prefers-reduced-motion: reduce)").matches ? " (on here, so motion is paused)" : ""}. On moves anyway. `)
      .addButton((b) => b.setButtonText(motion === "auto" ? "Auto" : motion === "on" ? "On" : "Off").onClick((ev) => {
        const menu = new Menu();
        for (const m of MOTIONS) menu.addItem((i) => i.setTitle(m === "auto" ? "Auto" : m === "on" ? "On" : "Off").setChecked(m === motion).onClick(() => store.set({ motion: m })));
        menu.showAtMouseEvent(ev);
      }));

    new Setting(containerEl)
      .setName("Pause when unfocused")
      .setDesc("Stop moving backgrounds while you work in another app (saves GPU). Off = keep moving.")
      .addToggle((t) => t.setValue(this.plugin.store.settings.pauseUnfocused).onChange((v) => store.set({ pauseUnfocused: v })));

    new Setting(containerEl)
      .setName("Your pictures")
      .setDesc('A picture URL (https://…) or a CSS value like url("…"). Add as many as you like with +.')
      .setHeading()
      .addExtraButton((b) => b.setIcon("plus").setTooltip("Add picture").onClick(() => {
        store.setLook({ images: [...store.settings.look.images, { id: newImageId(), src: "" }] });
        this.focusLast = true;
      }));
    look.images.forEach((img, i) => {
      const id = `img-${img.id}`;
      const usable = !!toCssUrl(img.src);
      const row = new Setting(containerEl).setClass("fantasy-easel-picture").setName(`Picture ${i + 1}`);
      row.addText((t) => {
        t.setValue(img.src).setPlaceholder("https://…");
        // Save on change (blur / Enter) so redraws do not steal focus while typing.
        t.inputEl.addEventListener("change", () => {
          const src = t.getValue().trim();
          const images = store.settings.look.images.map((x) => (x.id === img.id ? { ...x, src } : x));
          // An emptied picture cannot stay the background.
          const patch = !src && store.settings.look.background === id ? { images, background: DEFAULT_BACKGROUND } : { images };
          store.setLook(patch);
        });
        if (this.focusLast && i === look.images.length - 1) {
          this.focusLast = false;
          window.setTimeout(() => t.inputEl.focus(), 0);
        }
      });
      row.addButton((b) => {
        b.setButtonText(look.background === id ? "In use" : "Use").setDisabled(!usable || look.background === id).onClick(() => store.setLook({ background: id }));
        if (look.background === id) b.setCta();
      });
      row.addExtraButton((b) => b.setIcon("trash-2").setTooltip("Remove").onClick(() => {
        const images = store.settings.look.images.filter((x) => x.id !== img.id);
        store.setLook(store.settings.look.background === id ? { images, background: DEFAULT_BACKGROUND } : { images });
      }));
    });

    // ---------- Plugin skins ----------
    heading("Plugin skins", "Extra CSS that fits a plugin to the Fantasy glass. It only touches that plugin's own elements.");
    for (const s of SKINS) {
      new Setting(containerEl)
        .setName(s.name)
        .setDesc(s.desc)
        .addToggle((t) => t.setValue(skinOn(skins, s)).onChange((v) => store.set({ skins: { ...store.settings.skins, [s.id]: v } })));
    }

    // ---------- Controls ----------
    heading("Controls");
    new Setting(containerEl).setName("Status bar buttons").setDesc("Quick controls: theme color, background, gallery, accent, cards, motion.").addToggle((t) => t.setValue(statusBar).onChange((v) => store.set({ statusBar: v })));
  }

  /** Without the Fantasy theme: what this plugin is and where to get the theme. Nothing to set. */
  private renderNoTheme() {
    const { containerEl } = this;
    new Setting(containerEl).setName("Fantasy Easel").setHeading();
    containerEl.createEl("p", {
      cls: "setting-item-description",
      text: "Fantasy Easel is the companion of the Fantasy theme. With Fantasy it sets the theme color, accent, card layout, CSS and media-art backgrounds (still or moving), your own pictures and plugin skins, with quick status bar controls. With any other theme it does nothing.",
    });
    new Setting(containerEl)
      .setName("Fantasy theme is not in use")
      .setDesc("Install Fantasy, then choose it in Settings → Appearance → Themes. These settings appear once Fantasy is active.")
      .addButton((b) => b.setButtonText("Get Fantasy").setCta().onClick(() => window.open(FANTASY_URL)));
  }

  hide() {
    this.unsubscribe?.();
    this.unsubscribe = null;
  }
}
