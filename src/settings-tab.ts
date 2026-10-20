import { Menu, PluginSettingTab, Setting, type App } from "obsidian";
import { backgroundById, colorByCls } from "./catalog";
import type FantasyEaselPlugin from "./main";
import { backgroundMenu, colorMenu } from "./menus";
import { MOTIONS } from "./settings";

/** v0.1: lists open as Obsidian Menus (same as the status bar). Swatch grid / tiles come later. */
export class FantasyEaselSettingTab extends PluginSettingTab {
  private unsubscribe: (() => void) | null = null;

  constructor(app: App, private plugin: FantasyEaselPlugin) {
    super(app, plugin);
  }

  private queued = false;

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

    const bg = backgroundById(look.background);
    new Setting(containerEl)
      .setName("Background")
      .setDesc(bg ? `${bg.name} (${bg.kind === "theme" ? "theme image" : `CSS · ${bg.kind}`})` : look.background)
      .addButton((b) => b.setButtonText("Change").onClick((ev) => backgroundMenu(store).showAtMouseEvent(ev)));

    new Setting(containerEl).setName("Theme accent").setDesc("Use the theme color as the accent.").addToggle((t) => t.setValue(look.accent).onChange((v) => store.setLook({ accent: v })));
    new Setting(containerEl).setName("Card layout").addToggle((t) => t.setValue(look.card).onChange((v) => store.setLook({ card: v })));

    look.urls.forEach((url, i) => {
      new Setting(containerEl)
        .setName(`Custom background URL ${i + 1}`)
        .setDesc('CSS value, same as Style Settings: url("https://…"). Empty = theme default.')
        .addText((t) => {
          t.inputEl.type = "text";
          t.setValue(url).setPlaceholder('url("…")');
          // Save on blur so redraws do not steal focus while typing.
          t.inputEl.addEventListener("change", () => {
            const urls = [...store.settings.look.urls] as typeof look.urls;
            urls[i] = t.getValue().trim();
            store.setLook({ urls });
          });
        });
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
