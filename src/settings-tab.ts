import { Menu, PluginSettingTab, Setting, type App } from "obsidian";
import { backgroundById, colorByCls, DEFAULT_BACKGROUND, newImageId, toCssUrl } from "./catalog";
import type FantasyEaselPlugin from "./main";
import { GalleryModal } from "./gallery";
import { backgroundMenu, colorMenu } from "./menus";
import { MOTIONS } from "./settings";

/** v0.1: lists open as Obsidian Menus (same as the status bar). Swatch grid / tiles come later. */
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
    const { look, motion, statusBar } = store.settings;
    containerEl.empty();
    containerEl.addClass("fantasy-easel-settings");

    containerEl.createEl("p", {
      cls: "setting-item-description",
      text: "While Fantasy Easel is on, it owns the Fantasy look. Changes made in Style Settings' Fantasy section are put back right away. Use \"Import from Style Settings\" below to take those values.",
    });

    new Setting(containerEl)
      .setName("Theme color")
      .setDesc(colorByCls(look.color)?.name ?? look.color)
      .addButton((b) => b.setButtonText("Change").onClick((ev) => colorMenu(store).showAtMouseEvent(ev)));

    const bg = backgroundById(look.background, look.images);
    new Setting(containerEl)
      .setName("Background")
      .setDesc(bg ? `${bg.name} (${bg.kind === "image" ? "your picture" : `CSS · ${bg.kind}`})` : look.background)
      .addButton((b) => b.setButtonText("Gallery").onClick(() => new GalleryModal(this.app, store).open()))
      .addButton((b) => b.setButtonText("Change").onClick((ev) => backgroundMenu(store).showAtMouseEvent(ev)));

    new Setting(containerEl).setName("Theme accent").setDesc("Use the theme color as the accent.").addToggle((t) => t.setValue(look.accent).onChange((v) => store.setLook({ accent: v })));
    new Setting(containerEl).setName("Card layout").addToggle((t) => t.setValue(look.card).onChange((v) => store.setLook({ card: v })));

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

    new Setting(containerEl)
      .setName("Motion backgrounds")
      .setDesc(`Auto follows the OS "reduce motion" setting${window.matchMedia("(prefers-reduced-motion: reduce)").matches ? " (on here, so motion is paused)" : ""}. On moves anyway. All pause while the window is not focused.`)
      .addButton((b) => b.setButtonText(motion === "auto" ? "Auto" : motion === "on" ? "On" : "Off").onClick((ev) => {
        const menu = new Menu();
        for (const m of MOTIONS) menu.addItem((i) => i.setTitle(m === "auto" ? "Auto" : m === "on" ? "On" : "Off").setChecked(m === motion).onClick(() => store.set({ motion: m })));
        menu.showAtMouseEvent(ev);
      }));
    new Setting(containerEl).setName("Status bar buttons").setDesc("Quick controls for trying looks.").addToggle((t) => t.setValue(statusBar).onChange((v) => store.set({ statusBar: v })));

    new Setting(containerEl)
      .setName("Import from Style Settings")
      .setDesc("Take the Fantasy values saved in Style Settings.")
      .addButton((b) => b.setButtonText("Import").onClick(() => void this.plugin.importFromStyleSettings()));
  }

  hide() {
    this.unsubscribe?.();
    this.unsubscribe = null;
  }
}
