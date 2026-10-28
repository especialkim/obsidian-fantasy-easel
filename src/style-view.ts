import { ItemView, Notice, Setting, SettingGroup, setTooltip, type WorkspaceLeaf } from "obsidian";
import { renderGallery } from "./gallery";
import type FantasyEaselPlugin from "./main";
import { stepBackground, stepColor } from "./menus";
import { ACCENT_DESC, backgroundGroups, colorOptions, FANTASY_URL, NO_THEME_TEXT, MOTION_DESC, MOTION_OPTIONS, paletteDesc, QUALITY_DESC, QUALITY_OPTIONS } from "./options";
import { isLight } from "./apply";
import { addPictures, pictureDropZone } from "./pictures";
import { backgroundById } from "./catalog";
import { DEFAULT_LOOK, DEFAULT_SETTINGS, type Motion, type MotionQuality } from "./settings";
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
  /** unfold the gallery (and redraw its button); set by build() */
  private unfoldGallery: (() => HTMLElement) | null = null;
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
      root.createEl("p", { cls: "setting-item-description", text: NO_THEME_TEXT });
      new Setting(root).addButton((b) => b.setButtonText("Get Fantasy").setCta().onClick(() => window.open(FANTASY_URL)));
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
        // the name in its own span: a long one ends in … (the name box is a flex row for the changed dot)
        s.setClass("fantasy-easel-panel-row").nameEl.createSpan({ cls: "fantasy-easel-panel-name", text: name });
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
    /** Name, then ‹ dropdown › (step without opening the list), then the reset. Grouped options show
     *  group titles in the list and only the name in the closed dropdown (narrow sidebar). */
    type Groups = { label: string; options: Record<string, string> }[];
    const picker = (g: SettingGroup, name: string, desc: string, options: Record<string, string> | Groups, get: () => string, set: (v: string) => void, step: (dir: 1 | -1) => void, def: string) =>
      row(g, name, desc, () => get() === def, () => set(def), (s) => {
        s.setClass("fantasy-easel-panel-picker");
        s.addExtraButton((b) => b.setIcon("chevron-left").setTooltip(`Previous ${name.toLowerCase()}`).onClick(() => step(-1)));
        s.addDropdown((d) => {
          const tips: Record<string, string> = {};
          if (Array.isArray(options)) {
            for (const grp of options) {
              const og = d.selectEl.createEl("optgroup", { attr: { label: grp.label } });
              for (const [v, text] of Object.entries(grp.options)) {
                og.createEl("option", { value: v, text });
                tips[v] = `${grp.label} · ${text}`;
              }
            }
          } else {
            d.addOptions(options);
            Object.assign(tips, options);
          }
          d.onChange((v) => this.syncing || set(v));
          this.syncs.push(() => {
            d.setValue(get());
            setTooltip(d.selectEl, tips[get()] ?? "");
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
    /** a stage background is chosen and allowed to move (Still freezes it; Follow system may move) */
    const stageMoving = () => !!backgroundById(look().background, look().images)?.stage && store.settings.motion !== "off";
    const show = (t: Tuning, v: number) => `${Math.round(v * 100) / 100}${t.unit}`;
    const sliders = (g: SettingGroup, id: TuningGroup) => {
      for (const t of TUNINGS.filter((x) => x.group === id)) {
        row(g, t.name, t.desc, () => !(key(t) in store.settings.tuning), () => setTuning([key(t)], null), (s) => s.addSlider((sl) => {
          sl.setLimits(t.min, t.max, t.step).setInstant(true).setDisplayFormat((v) => show(t, v)).onChange((v) => this.syncing || setTuning([key(t)], isDefaultValue(t, mode, v) ? null : v));
          this.syncs.push(() => {
            const v = value(t);
            // setValue during a drag would fight the pointer: only when it differs
            if (sl.getValue() !== v) sl.setValue(v);
            const off = (!!t.cardOnly && !look().card) || (!!t.stageOnly && !stageMoving());
            sl.setDisabled(off);
            s.settingEl.toggleClass("is-disabled", off);
          });
        }));
      }
    };
    const keysOf = (id: TuningGroup) => TUNINGS.filter((t) => t.group === id).map(key);
    const tuned = (id: TuningGroup) => () => keysOf(id).every((k) => !(k in store.settings.tuning));

    // ---------- Background: picture, motion, stage speed ----------
    const bgDefault = () => look().background === DEFAULT_LOOK.background && store.settings.motion === DEFAULT_SETTINGS.motion && store.settings.motionQuality === null && store.settings.pauseUnfocused === DEFAULT_SETTINGS.pauseUnfocused && tuned("background")();
    const bgG = group("Background", {
      isDefault: bgDefault,
      run: () => {
        setTuning(keysOf("background"), null);
        store.set({ look: { ...look(), background: DEFAULT_LOOK.background }, motion: DEFAULT_SETTINGS.motion, motionQuality: null, pauseUnfocused: DEFAULT_SETTINGS.pauseUnfocused });
      },
    });
    picker(bgG, "Background", "Still, moving or one of your pictures.", backgroundGroups(look().images).map((grp) => ({ label: grp.label, options: Object.fromEntries(grp.list.map((b) => [b.id, b.name])) })), () => look().background, (v) => store.setLook({ background: v }), (dir) => stepBackground(store, dir), DEFAULT_LOOK.background);
    row(bgG, "Motion", MOTION_DESC, () => store.settings.motion === DEFAULT_SETTINGS.motion, () => store.set({ motion: DEFAULT_SETTINGS.motion }), (s) => s.addDropdown((d) => {
      d.addOptions(MOTION_OPTIONS).onChange((v) => this.syncing || store.set({ motion: v as Motion }));
      this.syncs.push(() => d.setValue(store.settings.motion));
    }));
    // not chosen = the OS default (Light on Windows); reset goes back to that
    row(bgG, "Motion quality", QUALITY_DESC, () => store.settings.motionQuality === null, () => store.set({ motionQuality: null }), (s) => s.addDropdown((d) => {
      d.addOptions(QUALITY_OPTIONS).onChange((v) => this.syncing || store.set({ motionQuality: v as MotionQuality }));
      this.syncs.push(() => d.setValue(store.settings.motionQuality ?? (isLight(store.settings, document.body.hasClass("mod-windows")) ? "light" : "full")));
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
    // in a group box like the others (same width)
    new SettingGroup(root).addClass("fantasy-easel-panel-group").addSetting((s) => {
      s.setClass("fantasy-easel-panel-resetall").addButton((b) => {
        b.setButtonText("Reset all styles").setTooltip("Every slider, both modes").onClick(() => store.set({ tuning: {} }));
        this.syncs.push(() => b.setDisabled(!Object.keys(store.settings.tuning).length));
      });
    });

    // ---------- Gallery (folded: dozens of tiles cost GPU) ----------
    const galleryG = new SettingGroup(root).setHeading("Gallery").addClass("fantasy-easel-panel-group");
    const gBody = root.createDiv({ cls: "fantasy-easel-panel-gallery" });
    const setGallery = (open: boolean) => {
      this.galleryOpen = open;
      this.galleryCleanup?.();
      this.galleryCleanup = null;
      gBody.empty();
      if (open) this.galleryCleanup = renderGallery(gBody.createDiv(), store, { addPicture: () => this.plugin.managePictures(), dropZone: (parent) => void pictureDropZone(this.app, parent, () => store.settings.pictureFolder, (srcs) => addPictures(store, srcs), (message) => new Notice(message)), still: true, sides: [mode === "dark" ? "night" : "day"] });
    };
    let draw = () => {};
    galleryG.addExtraButton((b) => {
      draw = () => b.setIcon(this.galleryOpen ? "chevron-up" : "chevron-down").setTooltip(this.galleryOpen ? "Hide gallery" : `Show gallery (${mode} mode)`);
      b.onClick(() => { setGallery(!this.galleryOpen); draw(); });
      draw();
    });
    this.unfoldGallery = () => {
      if (!this.galleryOpen) { setGallery(true); draw(); }
      return gBody.previousElementSibling instanceof HTMLElement ? gBody.previousElementSibling : gBody;
    };
    setGallery(this.galleryOpen);

    this.sync();
  }

  /** Gallery unfolded and scrolled to the top of the panel (status bar, command, settings): one click. */
  showGallery() {
    const head = this.unfoldGallery?.();
    if (head) window.requestAnimationFrame(() => head.scrollIntoView({ block: "start", behavior: "smooth" }));
  }

  private mode(): Mode {
    return document.body.hasClass("theme-dark") ? "dark" : "light";
  }
}
