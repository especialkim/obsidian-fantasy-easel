import { ItemView, Setting, SettingGroup, setTooltip, type WorkspaceLeaf } from "obsidian";
import { renderGallery } from "./gallery";
import type FantasyEaselPlugin from "./main";
import { stepBackground, stepColor } from "./menus";
import { ACCENT_DESC, backgroundOptions, colorOptions, MOTION_OPTIONS, paletteDesc } from "./options";
import { DEFAULT_LOOK, DEFAULT_SETTINGS, type Motion } from "./settings";
import { toggleDarkLight } from "./statusbar";
import { isDefaultValue, storeKey, TUNING_GROUPS, TUNINGS, type Mode, type Tuning, type TuningGroup } from "./tuning";

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
    return `${this.plugin.active}|${this.mode()}|${images.map((i) => `${i.id}:${i.name ?? ""}:${i.src ? 1 : 0}`).join(",")}`;
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
    const mode = this.mode();
    const look = () => store.settings.look;

    /** Obsidian's setting group box with a heading and, when given, a reset for the whole group. */
    const group = (name: string, reset?: { isDefault: () => boolean; run: () => void }) => {
      const g = new SettingGroup(root).setHeading(name).addClass("fantasy-easel-panel-group");
      if (reset) g.addExtraButton((b) => {
        b.setIcon("rotate-ccw").setTooltip(`Reset ${name.split(" ·")[0].toLowerCase()}`).onClick(reset.run);
        this.syncs.push(() => b.setDisabled(reset.isDefault()));
      });
      return g;
    };
    /** One line: the name (description as its tooltip), the control, and a reset shown only when changed. */
    const row = (g: SettingGroup, name: string, desc: string, isDefault: (() => boolean) | null, reset: (() => void) | null, add: (s: Setting) => void) => {
      g.addSetting((s) => {
        s.setName(name).setClass("fantasy-easel-panel-row");
        if (desc) setTooltip(s.nameEl, desc, { placement: "left" });
        add(s);
        // no default of ours: an empty reset slot keeps the controls in one column
        if (!isDefault || !reset) s.addExtraButton((b) => {
          b.setIcon("rotate-ccw").setDisabled(true);
          b.extraSettingsEl.addClass("is-hidden");
          b.extraSettingsEl.setAttr("aria-hidden", "true");
        });
        else s.addExtraButton((b) => {
          b.setIcon("rotate-ccw").setTooltip("Reset to default").onClick(reset);
          this.syncs.push(() => {
            const same = isDefault();
            b.setDisabled(same);
            b.extraSettingsEl.toggleClass("is-hidden", same);
            s.settingEl.toggleClass("is-changed", !same);
          });
        });
      });
    };

    // ---------- Look ----------
    const lookKeys = ["color", "accent", "card"] as const;
    const lookG = group("Look", {
      isDefault: () => lookKeys.every((k) => look()[k] === DEFAULT_LOOK[k]),
      run: () => store.setLook({ color: DEFAULT_LOOK.color, accent: DEFAULT_LOOK.accent, card: DEFAULT_LOOK.card }),
    });
    // Obsidian's own setting: no default of ours to reset to
    row(lookG, "Dark mode", "Obsidian's dark / light mode. Glass values are kept per mode.", null, null, (s) => s.addToggle((t) => {
      t.onChange((v) => { if (!this.syncing && v !== (this.mode() === "dark")) toggleDarkLight(this.app); });
      this.syncs.push(() => t.setValue(this.mode() === "dark"));
    }));
    /** Name, then ‹ dropdown › (step without opening the list), then the reset. */
    const picker = (g: SettingGroup, name: string, desc: string, options: Record<string, string>, get: () => string, set: (v: string) => void, step: (dir: 1 | -1) => void, def: string) =>
      row(g, name, desc, () => get() === def, () => set(def), (s) => {
        s.setClass("fantasy-easel-panel-picker");
        s.addExtraButton((b) => b.setIcon("chevron-left").setTooltip(`Previous ${name.toLowerCase()}`).onClick(() => step(-1)));
        s.addDropdown((d) => {
          d.addOptions(options).onChange((v) => this.syncing || set(v));
          this.syncs.push(() => {
            d.setValue(get());
            setTooltip(d.selectEl, options[get()] ?? "");
          });
        });
        s.addExtraButton((b) => b.setIcon("chevron-right").setTooltip(`Next ${name.toLowerCase()}`).onClick(() => step(1)));
      });
    picker(lookG, "Palette", paletteDesc(), colorOptions(), () => look().color, (v) => store.setLook({ color: v }), (dir) => stepColor(store, dir), DEFAULT_LOOK.color);
    row(lookG, "Theme accent", ACCENT_DESC, () => look().accent === DEFAULT_LOOK.accent, () => store.setLook({ accent: DEFAULT_LOOK.accent }), (s) => s.addToggle((t) => {
      t.onChange((v) => this.syncing || store.setLook({ accent: v }));
      this.syncs.push(() => t.setValue(look().accent));
    }));
    row(lookG, "Card layout", "Sidebars and notes as floating glass cards.", () => look().card === DEFAULT_LOOK.card, () => store.setLook({ card: DEFAULT_LOOK.card }), (s) => s.addToggle((t) => {
      t.onChange((v) => this.syncing || store.setLook({ card: v }));
      this.syncs.push(() => t.setValue(look().card));
    }));

    // ---------- tuning (sliders) ----------
    const key = (t: Tuning) => storeKey(t, mode);
    const value = (t: Tuning) => store.settings.tuning[key(t)] ?? t.def[mode];
    const setTuning = (keys: string[], v: number | null) => {
      const tuning = { ...store.settings.tuning };
      for (const k of keys) {
        if (v === null) delete tuning[k];
        else tuning[k] = v;
      }
      store.set({ tuning });
    };
    const show = (t: Tuning, v: number) => `${Math.round(v * 100) / 100}${t.unit}`;
    const sliders = (g: SettingGroup, id: TuningGroup) => {
      for (const t of TUNINGS.filter((x) => x.group === id)) {
        row(g, t.name, t.desc, () => !(key(t) in store.settings.tuning), () => setTuning([key(t)], null), (s) => s.addSlider((sl) => {
          sl.setLimits(t.min, t.max, t.step).setInstant(true).setDisplayFormat((v) => show(t, v)).onChange((v) => this.syncing || setTuning([key(t)], isDefaultValue(t, mode, v) ? null : v));
          this.syncs.push(() => {
            const v = value(t);
            // setValue during a drag would fight the pointer: only when it differs
            if (sl.getValue() !== v) sl.setValue(v);
            const off = !!t.cardOnly && !look().card;
            sl.setDisabled(off);
            s.settingEl.toggleClass("is-disabled", off);
          });
        }));
      }
    };
    const keysOf = (id: TuningGroup) => TUNINGS.filter((t) => t.group === id).map(key);
    const tuned = (id: TuningGroup) => () => keysOf(id).every((k) => !(k in store.settings.tuning));

    // ---------- Background: picture, motion, stage speed ----------
    const bgDefault = () => look().background === DEFAULT_LOOK.background && store.settings.motion === DEFAULT_SETTINGS.motion && store.settings.pauseUnfocused === DEFAULT_SETTINGS.pauseUnfocused && tuned("background")();
    const bgG = group("Background", {
      isDefault: bgDefault,
      run: () => {
        setTuning(keysOf("background"), null);
        store.set({ look: { ...look(), background: DEFAULT_LOOK.background }, motion: DEFAULT_SETTINGS.motion, pauseUnfocused: DEFAULT_SETTINGS.pauseUnfocused });
      },
    });
    picker(bgG, "Background", "CSS, motion, stage or one of your pictures.", backgroundOptions(look().images), () => look().background, (v) => store.setLook({ background: v }), (dir) => stepBackground(store, dir), DEFAULT_LOOK.background);
    row(bgG, "Motion", "Moving backgrounds. Auto follows the OS reduce-motion setting.", () => store.settings.motion === DEFAULT_SETTINGS.motion, () => store.set({ motion: DEFAULT_SETTINGS.motion }), (s) => s.addDropdown((d) => {
      d.addOptions(MOTION_OPTIONS).onChange((v) => this.syncing || store.set({ motion: v as Motion }));
      this.syncs.push(() => d.setValue(store.settings.motion));
    }));
    row(bgG, "Pause when unfocused", "Stop moving backgrounds while you work in another app.", () => store.settings.pauseUnfocused === DEFAULT_SETTINGS.pauseUnfocused, () => store.set({ pauseUnfocused: DEFAULT_SETTINGS.pauseUnfocused }), (s) => s.addToggle((t) => {
      t.onChange((v) => this.syncing || store.set({ pauseUnfocused: v }));
      this.syncs.push(() => t.setValue(store.settings.pauseUnfocused));
    }));
    sliders(bgG, "background");

    // ---------- Glass (per mode) · Cards · Editor ----------
    for (const g of TUNING_GROUPS.filter((x) => x.id !== "background")) {
      const perMode = TUNINGS.some((t) => t.group === g.id && t.perMode);
      const box = group(perMode ? `${g.name} · ${mode} mode` : g.name, { isDefault: tuned(g.id), run: () => setTuning(keysOf(g.id), null) });
      sliders(box, g.id);
    }
    new Setting(root).setClass("fantasy-easel-panel-resetall").addButton((b) => {
      b.setButtonText("Reset all styles").setTooltip("Every slider, both modes").onClick(() => store.set({ tuning: {} }));
      this.syncs.push(() => b.setDisabled(!Object.keys(store.settings.tuning).length));
    });

    // ---------- Gallery (folded: dozens of tiles cost GPU) ----------
    const galleryG = new SettingGroup(root).setHeading("Gallery").addClass("fantasy-easel-panel-group");
    const gBody = root.createDiv({ cls: "fantasy-easel-panel-gallery" });
    const setGallery = (open: boolean) => {
      this.galleryOpen = open;
      this.galleryCleanup?.();
      this.galleryCleanup = null;
      gBody.empty();
      if (open) this.galleryCleanup = renderGallery(gBody.createDiv(), store, { scrollRoot: this.contentEl, addPicture: () => this.plugin.addPicture(), still: true, sides: [mode === "dark" ? "night" : "day"] });
    };
    galleryG.addExtraButton((b) => {
      const draw = () => b.setIcon(this.galleryOpen ? "chevron-up" : "chevron-down").setTooltip(this.galleryOpen ? "Hide gallery" : `Show gallery (${mode} mode)`);
      b.onClick(() => { setGallery(!this.galleryOpen); draw(); });
      draw();
    });
    setGallery(this.galleryOpen);

    this.sync();
  }

  private mode(): Mode {
    return document.body.hasClass("theme-dark") ? "dark" : "light";
  }
}
