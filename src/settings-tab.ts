import { PluginSettingTab, setIcon, setTooltip, TextComponent, type App, type SettingDefinitionItem, type SettingDefinitionPage } from "obsidian";
import { DEFAULT_BACKGROUND, type UserImage } from "./catalog";
import type FantasyEaselPlugin from "./main";
import { excalidrawAvailable, excalidrawDiff, ExcalidrawSettingsModal, restoreExcalidraw } from "./excalidraw";
import { ACCENT_DESC, backgroundOptions, colorOptions, MOTION_DESC, MOTION_OPTIONS, paletteDesc, QUALITY_DESC, QUALITY_OPTIONS } from "./options";
import { isLight } from "./apply";
import { PictureSuggest } from "./pictures";
import { partOn, skinOn, SKINS } from "./skins";
import type { StatusId } from "./settings";

/** Where to get the theme (not in the community store yet). */
const FANTASY_URL = "https://github.com/especialkim/obsidian-theme-fantasy";

const STATUS_LABEL: Record<StatusId, string> = {
  color: "Palette",
  prev: "Previous background",
  background: "Background name",
  next: "Next background",
  gallery: "Gallery",
  accent: "Theme accent",
  card: "Card layout",
  motion: "Motion",
  mode: "Dark / light",
};

/**
 * Declarative settings (Obsidian 1.13 `getSettingDefinitions`, the documented way): general rows
 * without a heading, then Card layout · Background · Your pictures · Status bar · Plugin styles (a page per plugin).
 * Controls bind to keys like `look.color`; getControlValue / setControlValue map them to the store.
 * Fine style tuning lives in the style panel (sidebar), not here.
 */
export class FantasyEaselSettingTab extends PluginSettingTab {
  private queued = false;

  constructor(app: App, private plugin: FantasyEaselPlugin) {
    super(app, plugin);
    this.icon = "palette";
    // Changes from the status bar, the style panel or commands: re-read the definitions once.
    plugin.register(plugin.store.subscribe(() => this.queueUpdate()));
    plugin.register(plugin.applier.subscribePictures(() => this.queueUpdate()));
    plugin.register(plugin.pictures.subscribe(() => this.queueUpdate()));
    // dark / light switched: the palette description changes
    plugin.registerEvent(app.workspace.on("css-change", () => this.queueUpdate()));
  }

  /** recent update() times: a redraw that keeps causing redraws is stopped (2026-10-24: one froze Obsidian) */
  private updates: number[] = [];

  /** Re-read the definitions once, on the next frame, and only while the tab is on screen. A
   *  microtask here could chain forever and freeze the window; a frame always lets it breathe. */
  private queueUpdate() {
    if (this.queued || !this.containerEl.isConnected) return;
    this.queued = true;
    window.requestAnimationFrame(() => {
      this.queued = false;
      if (!this.containerEl.isConnected) return;
      const now = Date.now();
      this.updates = this.updates.filter((t) => now - t < 1000);
      if (this.updates.length >= 10) {
        console.warn("[fantasy-easel] settings tab redraws keep repeating; stopped until it is reopened");
        return;
      }
      this.updates.push(now);
      this.update();
    });
  }

  getControlValue(key: string): unknown {
    const s = this.plugin.store.settings;
    if (key.startsWith("look.")) return (s.look as unknown as Record<string, unknown>)[key.slice(5)];
    // not chosen yet: show the OS default
    if (key === "motionQuality") return s.motionQuality ?? (isLight(s, document.body.hasClass("mod-windows")) ? "light" : "full");
    return (s as unknown as Record<string, unknown>)[key];
  }

  setControlValue(key: string, value: unknown) {
    // the same value again (a control set while rendering): nothing to save, nothing to redraw
    if (this.getControlValue(key) === value) return;
    const store = this.plugin.store;
    if (key === "look.background") return store.chooseBackground(String(value));
    if (key.startsWith("look.")) store.setLook({ [key.slice(5)]: value });
    else store.set({ [key]: value });
  }

  getSettingDefinitions(): SettingDefinitionItem[] {
    if (!this.plugin.active) return this.noTheme();
    const store = this.plugin.store;
    const { look, statusItems } = store.settings;
    const setImages = (images: UserImage[]) => {
      // a picture that is gone or emptied cannot stay the background
      const bg = store.settings.look.background;
      const keep = !bg.startsWith("img-") || images.some((x) => `img-${x.id}` === bg && x.enabled === true && x.src.trim());
      store.setLook(keep ? { images } : { images, background: DEFAULT_BACKGROUND });
    };
    const patchImage = (id: string, patch: Partial<UserImage>) => setImages(store.settings.look.images.map((x) => (x.id === id ? { ...x, ...patch, ...(patch.src !== undefined && patch.src !== x.src ? { enabled: false } : {}) } : x)));
    const move = <T,>(list: T[], from: number, to: number) => {
      const out = [...list];
      const [x] = out.splice(from, 1);
      out.splice(to, 0, x);
      return out;
    };

    return [
      // general rows: no heading (one-section rule)
      { name: "Palette", desc: paletteDesc(), control: { type: "dropdown", key: "look.color", options: colorOptions() } },
      { name: "Theme accent", desc: ACCENT_DESC, control: { type: "toggle", key: "look.accent" } },
      { name: "Open style panel", desc: "Sidebar tab with the main switches and style tuning (glass, cards, text, motion), each with a reset.", action: () => void this.plugin.openStylePanel() },
      {
        type: "group",
        heading: "Card layout",
        items: [{ name: "Card layout", desc: "Sidebars and notes as floating glass cards. Spacing and corners: style panel.", control: { type: "toggle", key: "look.card" } }],
      },
      {
        type: "group",
        heading: "Background",
        items: [
          { name: "Background", desc: "CSS, motion, stage or one of your pictures.", control: { type: "dropdown", key: "look.background", options: backgroundOptions(look.images) } },
          { name: "Gallery", desc: "Every background side by side, day and night.", action: () => this.plugin.openGallery() },
          { name: "Motion", desc: MOTION_DESC, control: { type: "dropdown", key: "motion", options: MOTION_OPTIONS } },
          { name: "Motion quality", desc: QUALITY_DESC, control: { type: "dropdown", key: "motionQuality", options: QUALITY_OPTIONS } },
          { name: "Pause when unfocused", desc: "Stop moving backgrounds while you work in another app (saves GPU).", control: { type: "toggle", key: "pauseUnfocused" } },
        ],
      },
      {
        type: "list",
        heading: "Your pictures",
        emptyState: "No pictures yet. Add one with +: a vault picture (type to search), https://… or file://… (this computer only).",
        addItem: { name: "Add picture", action: () => this.plugin.addPicture() },
        onDelete: (i) => setImages(store.settings.look.images.filter((_, j) => j !== i)),
        onReorder: (from, to) => setImages(move(store.settings.look.images, from, to)),
        items: look.images.map((img, i) => ({
          name: img.name?.trim() || `Picture ${i + 1}`,
          desc: this.plugin.pictures.error(`img-${img.id}`) || (look.background === `img-${img.id}` ? this.plugin.applier.pictureError : ""),
          render: (setting) => {
            setting.settingEl.addClass("fantasy-easel-picture");
            setTooltip(setting.nameEl, img.name?.trim() || `Picture ${i + 1}`);
            const id = `img-${img.id}`;
            const selected = look.background === id;
            const error = this.plugin.pictures.error(id) || (selected ? this.plugin.applier.pictureError : "");
            const using = selected && img.enabled === true && !error;
            const checking = this.plugin.pictures.checking === id;
            setting.nameEl.empty();
            if (using) {
              const check = setting.nameEl.createSpan({ cls: "fantasy-easel-picture-active", attr: { "aria-label": "Active picture" } });
              setIcon(check, "check");
            }
            setting.descEl.addClass("fantasy-easel-picture-error");
            const fields = setting.settingEl.createDiv({ cls: "fantasy-easel-picture-fields" });
            const field = (label: string, suffix: string) => {
              const text = new TextComponent(fields);
              text.inputEl.id = `fantasy-easel-${img.id}-${suffix}`;
              text.inputEl.setAttr("aria-label", label);
              text.inputEl.addClass(`fantasy-easel-picture-${suffix}`);
              setTooltip(text.inputEl, label);
              return text;
            };
            // saved on change (blur / Enter), so a redraw never steals focus while typing
            const alias = field("Alias", "alias").setPlaceholder("Alias").setValue(img.name ?? "");
            alias.inputEl.addEventListener("change", () => patchImage(img.id, { name: alias.getValue().trim() }));
            const path = field("Path or URL", "path").setPlaceholder("Vault path, https://… or file://…").setValue(img.src);
            path.inputEl.addEventListener("change", () => patchImage(img.id, { src: path.getValue().trim() }));
            new PictureSuggest(this.app, path.inputEl, (value) => patchImage(img.id, { src: value }));
            setting.addToggle((toggle) => {
              toggle.setValue(img.enabled === true).setDisabled(checking || !img.src.trim()).onChange((on) => this.plugin.pictures.enable(id, on));
              toggle.toggleEl.setAttr("aria-label", "Use in background choices");
              setTooltip(toggle.toggleEl, "Use in background choices");
            });
            setting.addButton((b) => {
              b.setButtonText(checking ? "Checking…" : "Apply").setDisabled(img.enabled !== true || using || checking).onClick(() => store.chooseBackground(id));
            });
          },
        })),
      },
      {
        type: "group",
        heading: "Status bar",
        items: [{ name: "Show buttons", desc: "Quick controls in the status bar. Choose and order them below.", control: { type: "toggle", key: "statusBar" } }],
      },
      {
        type: "list",
        visible: () => store.settings.statusBar,
        onReorder: (from, to) => store.set({ statusItems: move(store.settings.statusItems, from, to) }),
        items: statusItems.map((x, i) => ({
          name: STATUS_LABEL[x.id],
          render: (setting) => {
            setting.addToggle((t) => t.setValue(x.on).onChange((on) => {
              if (on === store.settings.statusItems[i]?.on) return;
              store.set({ statusItems: store.settings.statusItems.map((y) => (y.id === x.id ? { ...y, on } : y)) });
            }));
          },
        })),
      },
      {
        type: "group",
        heading: "Plugin styles",
        items: SKINS.map((sk): SettingDefinitionPage => {
          const on = () => skinOn(store.settings.skins, sk);
          const count = () => sk.parts.filter((p) => partOn(store.settings.skins, sk, p)).length;
          const setSkin = (key: string, v: boolean) => store.set({ skins: { ...store.settings.skins, [key]: v } });
          const isExcalidraw = sk.id === "excalidraw";
          return {
            type: "page",
            name: sk.name,
            desc: sk.desc,
            displayValue: () => (on() ? `${count()} of ${sk.parts.length} on` : "Off"),
            // Excalidraw: its own settings differ from what the canvas / embeds parts need
            status: () => (isExcalidraw && on() && excalidrawAvailable(this.app) && excalidrawDiff(this.app).length ? "warning" : null),
            items: [
              {
                name: `${sk.name} style`,
                desc: "Fit this plugin to the Fantasy glass. Only that plugin's own elements are touched.",
                render: (setting) => {
                  setting.addToggle((t) => t.setValue(on()).onChange((v) => {
                    if (v === on()) return;
                    // the Excalidraw style changes how drawings look and may change Excalidraw's settings:
                    // warn and let the user make one final choice before anything is turned on
                    if (isExcalidraw && v && excalidrawAvailable(this.app)) {
                      new ExcalidrawSettingsModal(this.app, store, (yes) => {
                        if (yes) setSkin(sk.id, true);
                        else t.setValue(false); // cancel: the switch goes back to off (onChange returns: already off)
                      }).open();
                      return;
                    }
                    setSkin(sk.id, v);
                  }));
                },
              },
              {
                type: "group",
                heading: "Parts",
                items: sk.parts.map((p) => ({
                  name: p.name,
                  desc: p.desc,
                  render: (setting) => {
                    setting.addToggle((t) => t.setValue(partOn(store.settings.skins, sk, p)).setDisabled(!on()).onChange((v) => {
                      if (v !== partOn(store.settings.skins, sk, p)) setSkin(`${sk.id}.${p.id}`, v);
                    }));
                    setting.settingEl.toggleClass("is-disabled", !on());
                  },
                })),
              },
              ...(isExcalidraw ? [this.excalidrawRow()] : []),
            ],
          };
        }),
      },
    ];
  }

  /** Excalidraw's own settings that the canvas / embeds parts need: match (with a confirm) or restore. */
  private excalidrawRow(): SettingDefinitionItem {
    const store = this.plugin.store;
    return {
      name: "Excalidraw settings",
      desc: "The see-through canvas and glass embeds need five Excalidraw settings (follow the Obsidian theme, no dynamic styling).",
      visible: () => excalidrawAvailable(this.app),
      render: (setting) => {
        const diff = excalidrawDiff(this.app).length;
        setting.descEl.createDiv({ text: diff ? `${diff} setting(s) differ.` : "They match." });
        if (diff) setting.addButton((b) => b.setButtonText("Match settings…").onClick(() => new ExcalidrawSettingsModal(this.app, store).open()));
        if (store.settings.excalidrawBackup) setting.addButton((b) => b.setButtonText("Restore").setTooltip("Put back the Excalidraw settings from before Fantasy Easel changed them").onClick(() => void restoreExcalidraw(this.app, store)));
      },
    };
  }

  /** Without the Fantasy theme: what this plugin is and where to get the theme. Nothing to set. */
  private noTheme(): SettingDefinitionItem[] {
    return [
      {
        name: "Fantasy theme is not in use",
        desc: "Fantasy Easel is the companion of the Fantasy theme: palette, accent, card layout, CSS and media-art backgrounds, your own pictures and plugin styles. Install Fantasy, then choose it in Settings → Appearance → Themes.",
        render: (setting) => {
          setting.addButton((b) => b.setButtonText("Get Fantasy").setCta().onClick(() => window.open(FANTASY_URL)));
        },
      },
    ];
  }
}
