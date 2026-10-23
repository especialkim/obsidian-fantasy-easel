import { ItemView, Setting, type WorkspaceLeaf } from "obsidian";
import { renderGallery } from "./gallery";
import type FantasyEaselPlugin from "./main";
import { stepBackground } from "./menus";
import { backgroundOptions, colorOptions, MOTION_OPTIONS } from "./options";
import { DEFAULT_LOOK, DEFAULT_SETTINGS, type Motion } from "./settings";
import { toggleDarkLight } from "./statusbar";
import { TUNING_GROUPS, TUNINGS, type Tuning } from "./tuning";

export const STYLE_VIEW = "fantasy-easel-style";

/**
 * Style panel (sidebar tab, command "Open style panel"): the big switches (mode, color, accent,
 * cards, background, motion) and the style tuning sliders, each with a reset to its default.
 * Changes apply at once and stay (same store as settings and status bar). Rows update in place,
 * so a slider keeps its drag while the store notifies; the panel is rebuilt only when the
 * background list changes (your pictures).
 */
export class StyleView extends ItemView {
  /** in-place updates, one per row */
  private syncs: (() => void)[] = [];
  private unsubscribe: (() => void) | null = null;
  private galleryCleanup: (() => void) | null = null;
  private galleryOpen = false;
  /** what the rows were built for: rebuild when it changes */
  private built = "";
  /** true while rows take values from the store: a component's own onChange must not write back */
  private syncing = false;

  constructor(leaf: WorkspaceLeaf, private plugin: FantasyEaselPlugin) {
    super(leaf);
  }

  getViewType() {
    return STYLE_VIEW;
  }

  getDisplayText() {
    return "Fantasy style";
  }

  getIcon() {
    return "palette";
  }

  async onOpen() {
    this.unsubscribe = this.plugin.store.subscribe(() => this.refresh());
    // dark / light switched, or the theme changed: defaults and the mode toggle follow
    this.registerEvent(this.app.workspace.on("css-change", () => this.refresh()));
    this.refresh();
  }

  async onClose() {
    this.unsubscribe?.();
    this.unsubscribe = null;
    this.galleryCleanup?.();
    this.galleryCleanup = null;
  }

  private shape() {
    const { images } = this.plugin.store.settings.look;
    return `${this.plugin.active}|${images.map((i) => `${i.id}:${i.name ?? ""}:${i.src ? 1 : 0}`).join(",")}`;
  }

  private refresh() {
    if (this.shape() !== this.built) this.build();
    else this.sync();
  }

  private sync() {
    this.syncing = true;
    try {
      this.syncs.forEach((f) => f());
    } finally {
      this.syncing = false;
    }
  }

  private build() {
    this.built = this.shape();
    this.syncs = [];
    this.galleryCleanup?.();
    this.galleryCleanup = null;
    const root = this.contentEl;
    root.empty();
    root.addClass("fantasy-easel-panel");
    if (!this.plugin.active) {
      root.createEl("p", { cls: "setting-item-description", text: "Fantasy Easel works with the Fantasy theme. Choose Fantasy in Settings → Appearance → Themes." });
      return;
    }
    const store = this.plugin.store;
    const dark = () => document.body.hasClass("theme-dark");

    /** A row with a reset button that is enabled (and the row marked) only when the value differs. */
    const row = (parent: HTMLElement, name: string, desc: string, isDefault: () => boolean, reset: (() => void) | null) => {
      const s = new Setting(parent).setName(name).setDesc(desc).setClass("fantasy-easel-panel-row");
      if (reset) {
        s.addExtraButton((b) => {
          b.setIcon("rotate-ccw").setTooltip("Reset to default").onClick(reset);
          this.syncs.push(() => {
            const same = isDefault();
            b.setDisabled(same);
            b.extraSettingsEl.toggleClass("is-hidden", same);
            s.settingEl.toggleClass("is-changed", !same);
          });
        });
      }
      return s;
    };
    const heading = (name: string, reset?: { isDefault: () => boolean; run: () => void; tip: string }) => {
      const h = new Setting(root).setName(name).setHeading();
      if (reset) h.addExtraButton((b) => {
        b.setIcon("rotate-ccw").setTooltip(reset.tip).onClick(reset.run);
        this.syncs.push(() => b.setDisabled(reset.isDefault()));
      });
      return h;
    };

    // ---------- Look: the big switches ----------
    const look = () => store.settings.look;
    const lookDefault = () =>
      look().color === DEFAULT_LOOK.color && look().accent === DEFAULT_LOOK.accent && look().card === DEFAULT_LOOK.card && look().background === DEFAULT_LOOK.background && store.settings.motion === DEFAULT_SETTINGS.motion && store.settings.pauseUnfocused === DEFAULT_SETTINGS.pauseUnfocused;
    heading("Look", {
      tip: "Reset the look (color, accent, cards, background, motion)",
      isDefault: lookDefault,
      run: () => store.set({ look: { ...look(), color: DEFAULT_LOOK.color, accent: DEFAULT_LOOK.accent, card: DEFAULT_LOOK.card, background: DEFAULT_LOOK.background }, motion: DEFAULT_SETTINGS.motion, pauseUnfocused: DEFAULT_SETTINGS.pauseUnfocused }),
    });

    // Obsidian's own setting (no default of ours to reset to)
    row(root, "Dark mode", "Obsidian's dark / light mode.", () => true, null).addToggle((t) => {
      t.onChange((v) => { if (!this.syncing && v !== dark()) toggleDarkLight(this.app); });
      this.syncs.push(() => t.setValue(dark()));
    });
    row(root, "Theme color", "Background tint, and the accent when theme accent is on.", () => look().color === DEFAULT_LOOK.color, () => store.setLook({ color: DEFAULT_LOOK.color })).setClass("fantasy-easel-panel-wide").addDropdown((d) => {
      d.addOptions(colorOptions()).onChange((v) => this.syncing || store.setLook({ color: v }));
      this.syncs.push(() => d.setValue(look().color));
    });
    row(root, "Theme accent", "Accent follows the theme color (gold in dark mode). Off = Obsidian's accent.", () => look().accent === DEFAULT_LOOK.accent, () => store.setLook({ accent: DEFAULT_LOOK.accent })).addToggle((t) => {
      t.onChange((v) => this.syncing || store.setLook({ accent: v }));
      this.syncs.push(() => t.setValue(look().accent));
    });
    row(root, "Card layout", "Sidebars and notes as floating glass cards.", () => look().card === DEFAULT_LOOK.card, () => store.setLook({ card: DEFAULT_LOOK.card })).addToggle((t) => {
      t.onChange((v) => this.syncing || store.setLook({ card: v }));
      this.syncs.push(() => t.setValue(look().card));
    });
    const bgRow = row(root, "Background", "", () => look().background === DEFAULT_LOOK.background, () => store.setLook({ background: DEFAULT_LOOK.background }));
    bgRow.settingEl.addClass("fantasy-easel-panel-wide");
    bgRow.addExtraButton((b) => b.setIcon("chevron-left").setTooltip("Previous background").onClick(() => stepBackground(store, -1)));
    bgRow.addDropdown((d) => {
      d.addOptions(backgroundOptions(look().images)).onChange((v) => this.syncing || store.setLook({ background: v }));
      this.syncs.push(() => d.setValue(look().background));
    });
    bgRow.addExtraButton((b) => b.setIcon("chevron-right").setTooltip("Next background").onClick(() => stepBackground(store, 1)));
    row(root, "Motion", "Moving backgrounds. Auto follows the OS reduce-motion setting.", () => store.settings.motion === DEFAULT_SETTINGS.motion, () => store.set({ motion: DEFAULT_SETTINGS.motion })).addDropdown((d) => {
      d.addOptions(MOTION_OPTIONS).onChange((v) => this.syncing || store.set({ motion: v as Motion }));
      this.syncs.push(() => d.setValue(store.settings.motion));
    });
    row(root, "Pause when unfocused", "Stop moving backgrounds while you work in another app.", () => store.settings.pauseUnfocused === DEFAULT_SETTINGS.pauseUnfocused, () => store.set({ pauseUnfocused: DEFAULT_SETTINGS.pauseUnfocused })).addToggle((t) => {
      t.onChange((v) => this.syncing || store.set({ pauseUnfocused: v }));
      this.syncs.push(() => t.setValue(store.settings.pauseUnfocused));
    });

    // ---------- Style tuning ----------
    const value = (t: Tuning) => store.settings.tuning[t.key] ?? (dark() ? t.def.dark : t.def.light);
    const setTuning = (keys: string[], v: number | null) => {
      const tuning = { ...store.settings.tuning };
      for (const k of keys) {
        if (v === null) delete tuning[k];
        else tuning[k] = v;
      }
      store.set({ tuning });
    };
    const show = (t: Tuning, v: number) => `${Math.round(v * 100) / 100}${t.unit}`;
    for (const g of TUNING_GROUPS) {
      const list = TUNINGS.filter((t) => t.group === g.id);
      const keys = list.map((t) => t.key);
      heading(g.name, { tip: `Reset ${g.name.toLowerCase()}`, isDefault: () => keys.every((k) => !(k in store.settings.tuning)), run: () => setTuning(keys, null) });
      for (const t of list) {
        const r = row(root, t.name, t.desc, () => !(t.key in store.settings.tuning), () => setTuning([t.key], null));
        // narrow sidebar: slider under the name; Obsidian's slider shows its own value
        r.settingEl.addClass("fantasy-easel-panel-wide");
        r.addSlider((sl) => {
          sl.setLimits(t.min, t.max, t.step).setInstant(true).setDisplayFormat((v) => show(t, v)).onChange((v) => this.syncing || setTuning([t.key], v));
          this.syncs.push(() => {
            const v = value(t);
            // setValue during a drag would fight the pointer: only when it differs
            if (sl.getValue() !== v) sl.setValue(v);
            const off = !!t.cardOnly && !look().card;
            sl.setDisabled(off);
            r.settingEl.toggleClass("is-disabled", off);
          });
        });
      }
    }
    new Setting(root).setClass("fantasy-easel-panel-row").addButton((b) => {
      b.setButtonText("Reset all styles").onClick(() => store.set({ tuning: {} }));
      this.syncs.push(() => b.setDisabled(!Object.keys(store.settings.tuning).length));
    });

    // ---------- Gallery (folded: dozens of tiles cost GPU) ----------
    const gHead = new Setting(root).setName("Gallery").setDesc("Every background, day and night. Click one to use it.").setHeading();
    const gBody = root.createDiv({ cls: "fantasy-easel-panel-gallery" });
    const setGallery = (open: boolean) => {
      this.galleryOpen = open;
      this.galleryCleanup?.();
      this.galleryCleanup = null;
      gBody.empty();
      if (open) this.galleryCleanup = renderGallery(gBody.createDiv(), store, { scrollRoot: this.contentEl, addPicture: () => this.plugin.addPicture(), still: true });
    };
    gHead.addExtraButton((b) => {
      const draw = () => b.setIcon(this.galleryOpen ? "chevron-up" : "chevron-down").setTooltip(this.galleryOpen ? "Hide gallery" : "Show gallery");
      b.onClick(() => { setGallery(!this.galleryOpen); draw(); });
      draw();
    });
    setGallery(this.galleryOpen);

    this.sync();
  }
}
