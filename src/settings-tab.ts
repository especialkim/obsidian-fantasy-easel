import { PluginSettingTab, type App, type SettingDefinitionItem } from "obsidian";
import { DEFAULT_BACKGROUND, newImageId, toCssUrl, type UserImage } from "./catalog";
import type FantasyEaselPlugin from "./main";
import { excalidrawAvailable, excalidrawDiff, ExcalidrawSettingsModal, restoreExcalidraw } from "./excalidraw";
import { backgroundOptions, colorOptions, MOTION_OPTIONS } from "./options";
import { skinOn, SKINS } from "./skins";
import type { StatusId } from "./settings";

/** Where to get the theme (not in the community store yet). */
const FANTASY_URL = "https://github.com/especialkim/obsidian-theme-fantasy";

const STATUS_LABEL: Record<StatusId, string> = {
  color: "Theme color",
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
 * without a heading, then Card layout · Background · Your pictures · Status bar · Plugin skins.
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
  }

  private queueUpdate() {
    if (this.queued) return;
    this.queued = true;
    queueMicrotask(() => {
      this.queued = false;
      this.update();
    });
  }

  getControlValue(key: string): unknown {
    const s = this.plugin.store.settings;
    if (key.startsWith("look.")) return (s.look as unknown as Record<string, unknown>)[key.slice(5)];
    return (s as unknown as Record<string, unknown>)[key];
  }

  setControlValue(key: string, value: unknown) {
    const store = this.plugin.store;
    if (key.startsWith("look.")) store.setLook({ [key.slice(5)]: value });
    else store.set({ [key]: value });
  }

  getSettingDefinitions(): SettingDefinitionItem[] {
    if (!this.plugin.active) return this.noTheme();
    const store = this.plugin.store;
    const { look, statusItems, skins } = store.settings;
    const setImages = (images: UserImage[]) => {
      // a picture that is gone or emptied cannot stay the background
      const bg = store.settings.look.background;
      const keep = !bg.startsWith("img-") || images.some((x) => `img-${x.id}` === bg && toCssUrl(x.src));
      store.setLook(keep ? { images } : { images, background: DEFAULT_BACKGROUND });
    };
    const patchImage = (id: string, patch: Partial<UserImage>) => setImages(store.settings.look.images.map((x) => (x.id === id ? { ...x, ...patch } : x)));
    const move = <T,>(list: T[], from: number, to: number) => {
      const out = [...list];
      const [x] = out.splice(from, 1);
      out.splice(to, 0, x);
      return out;
    };

    return [
      // general rows: no heading (one-section rule)
      { name: "Theme color", desc: "Background tint, and the accent when theme accent is on.", control: { type: "dropdown", key: "look.color", options: colorOptions() } },
      { name: "Theme accent", desc: "Accent follows the theme color (gold in dark mode). Off = Obsidian's accent color.", control: { type: "toggle", key: "look.accent" } },
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
          { name: "Motion", desc: 'For moving backgrounds. Auto follows the OS "reduce motion" setting; On moves anyway.', control: { type: "dropdown", key: "motion", options: MOTION_OPTIONS } },
          { name: "Pause when unfocused", desc: "Stop moving backgrounds while you work in another app (saves GPU).", control: { type: "toggle", key: "pauseUnfocused" } },
        ],
      },
      {
        type: "list",
        heading: "Your pictures",
        emptyState: "No pictures yet. Add one with +.",
        addItem: { name: "Add picture", action: () => store.setLook({ images: [...store.settings.look.images, { id: newImageId(), src: "" }] }) },
        onDelete: (i) => setImages(store.settings.look.images.filter((_, j) => j !== i)),
        onReorder: (from, to) => setImages(move(store.settings.look.images, from, to)),
        items: look.images.map((img, i) => ({
          name: img.name?.trim() || `Picture ${i + 1}`,
          render: (setting) => {
            setting.settingEl.addClass("fantasy-easel-picture");
            const id = `img-${img.id}`;
            // saved on change (blur / Enter), so a redraw never steals focus while typing
            setting.addText((t) => {
              t.setPlaceholder("Name").setValue(img.name ?? "");
              t.inputEl.addClass("fantasy-easel-picture-name");
              t.inputEl.addEventListener("change", () => patchImage(img.id, { name: t.getValue().trim() }));
            });
            setting.addText((t) => {
              t.setPlaceholder('https://… or url("…")').setValue(img.src);
              t.inputEl.addEventListener("change", () => patchImage(img.id, { src: t.getValue().trim() }));
            });
            setting.addButton((b) => {
              const using = look.background === id;
              b.setButtonText(using ? "In use" : "Use").setDisabled(!toCssUrl(img.src) || using).onClick(() => store.setLook({ background: id }));
              if (using) b.setCta();
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
        heading: "Plugin skins",
        items: SKINS.map((s) => ({
          name: s.name,
          desc: s.desc,
          render: (setting) => {
            setting.addToggle((t) => t.setValue(skinOn(skins, s)).onChange((v) => {
              if (v === skinOn(store.settings.skins, s)) return;
              store.set({ skins: { ...store.settings.skins, [s.id]: v } });
              // turning the Excalidraw skin on: offer the Excalidraw settings it needs
              if (s.id === "excalidraw" && v && excalidrawDiff(this.app).length) new ExcalidrawSettingsModal(this.app, store).open();
            }));
            if (s.id !== "excalidraw" || !excalidrawAvailable(this.app)) return;
            const diff = excalidrawDiff(this.app).length;
            setting.descEl.createDiv({ text: diff ? `${diff} Excalidraw setting(s) differ from what this skin needs.` : "Excalidraw settings match this skin." });
            if (diff) setting.addButton((b) => b.setButtonText("Match settings…").onClick(() => new ExcalidrawSettingsModal(this.app, store).open()));
            if (store.settings.excalidrawBackup) setting.addButton((b) => b.setButtonText("Restore").setTooltip("Put back the Excalidraw settings from before Fantasy Easel changed them").onClick(() => void restoreExcalidraw(this.app, store)));
          },
        })),
      },
    ];
  }

  /** Without the Fantasy theme: what this plugin is and where to get the theme. Nothing to set. */
  private noTheme(): SettingDefinitionItem[] {
    return [
      {
        name: "Fantasy theme is not in use",
        desc: "Fantasy Easel is the companion of the Fantasy theme: theme color, accent, card layout, CSS and media-art backgrounds, your own pictures and plugin skins. Install Fantasy, then choose it in Settings → Appearance → Themes.",
        render: (setting) => {
          setting.addButton((b) => b.setButtonText("Get Fantasy").setCta().onClick(() => window.open(FANTASY_URL)));
        },
      },
    ];
  }
}
