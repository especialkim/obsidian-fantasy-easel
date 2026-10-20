"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => FantasyEaselPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian5 = require("obsidian");

// src/apply.ts
var import_obsidian = require("obsidian");

// src/catalog.ts
var THEME_COLORS = [
  { cls: "fantasy-theme-MochaBrown", name: "Mocha Brown" },
  { cls: "fantasy-theme-OceanTeal", name: "Ocean Teal" },
  { cls: "fantasy-theme-MysticPurple", name: "Mystic Purple" },
  { cls: "fantasy-theme-SkyBlue", name: "Sky Blue" },
  { cls: "fantasy-theme-EmeraldGreen", name: "Emerald Green" },
  { cls: "fantasy-theme-ForestGreen", name: "Forest Green" },
  { cls: "fantasy-theme-TangerineOrange", name: "Tangerine Orange" },
  { cls: "fantasy-theme-BurntSienna", name: "Burnt Sienna" },
  { cls: "fantasy-theme-ChiliPepper", name: "Chili Pepper" },
  { cls: "fantasy-theme-OrchidMagenta", name: "Orchid Magenta" },
  { cls: "fantasy-theme-Black", name: "Dark" }
];
var themeBg = (key, name) => ({ id: key, name, kind: "theme", cls: `fantasy-theme-background-${key}` });
var cssBg = (key, name, kind) => ({ id: `css-${key}`, name, kind, cls: `fantasy-easel-bg-${key}` });
var BACKGROUNDS = [
  themeBg("none", "None"),
  themeBg("paper", "Paper Texture"),
  themeBg("newspaper", "News Texture"),
  themeBg("beach", "Beach"),
  themeBg("rainy", "Rainy"),
  themeBg("snow", "Snow"),
  themeBg("custom1", "Custom URL 1"),
  themeBg("custom2", "Custom URL 2"),
  themeBg("custom3", "Custom URL 3"),
  cssBg("dusk", "Dusk", "static"),
  cssBg("aurora", "Aurora", "static"),
  cssBg("horizon", "Horizon", "static"),
  cssBg("prism", "Prism Mesh", "static"),
  cssBg("grain", "Soft Grain", "static"),
  cssBg("aurora-drift", "Aurora Drift", "motion"),
  cssBg("tide", "Tide", "motion"),
  cssBg("nebula", "Nebula", "motion")
];
var ACCENT_CLASS = "fantasy-theme-accent";
var CARD_CLASS = "fantasy-theme-card-layout";
var MARKER_CLASS = "fantasy-easel";
var STILL_CLASS = "fantasy-easel-still";
var FORCE_MOTION_CLASS = "fantasy-easel-force-motion";
var MOTION_CLASS = "fantasy-easel-motion";
var SS_SECTION = "Fantasy-theme-settings";
var SS_KEYS = {
  color: "fantasy-theme",
  background: "fantasy-theme-background",
  accent: "fantasy-theme-accent",
  card: "fantasy-theme-card-layout",
  url: ["background-url1", "background-url2", "background-url3"]
};
var THEME_DEFAULTS = {
  color: "fantasy-theme-Black",
  background: "custom3"
};
var colorByCls = (cls) => THEME_COLORS.find((c) => c.cls === cls);
var backgroundById = (id) => BACKGROUNDS.find((b) => b.id === id);

// src/apply.ts
var MANAGED = /* @__PURE__ */ new Set([...THEME_COLORS.map((c) => c.cls), ...BACKGROUNDS.map((b) => b.cls), ACCENT_CLASS, CARD_CLASS, MARKER_CLASS, STILL_CLASS, MOTION_CLASS, FORCE_MOTION_CLASS]);
var THEME_GROUP = [...THEME_COLORS.map((c) => c.cls), ...BACKGROUNDS.filter((b) => b.kind === "theme").map((b) => b.cls), ACCENT_CLASS, CARD_CLASS];
var URL_VARS = ["--background-url1", "--background-url2", "--background-url3"];
function wantedClasses(s) {
  const bg = backgroundById(s.look.background);
  const out = /* @__PURE__ */ new Set([MARKER_CLASS, s.look.color]);
  if (bg) out.add(bg.cls);
  if (bg?.kind === "motion") out.add(MOTION_CLASS);
  if (s.look.accent) out.add(ACCENT_CLASS);
  if (s.look.card) out.add(CARD_CLASS);
  if (s.motion === "off") out.add(STILL_CLASS);
  if (s.motion === "on") out.add(FORCE_MOTION_CLASS);
  return out;
}
var Applier = class {
  constructor(body, get) {
    this.body = body;
    this.get = get;
    this.observer = null;
    this.hits = [];
    /** reconcile runs (for tests: settled = no new runs) */
    this.runs = 0;
  }
  attach() {
    this.observer = new MutationObserver(() => this.onMutation());
    this.observer.observe(this.body, { attributes: true, attributeFilter: ["class"], subtree: false });
    this.reconcile();
  }
  /** Bring body in line with the wanted state. Returns how many changes were made. */
  reconcile() {
    const s = this.get();
    const want = wantedClasses(s);
    const cl = this.body.classList;
    let changed = 0;
    for (const c of MANAGED) {
      const has = cl.contains(c);
      if (want.has(c) && !has) {
        cl.add(c);
        changed++;
      } else if (!want.has(c) && has) {
        cl.remove(c);
        changed++;
      }
    }
    URL_VARS.forEach((v, i) => {
      const value = s.look.urls[i];
      const now = this.body.style.getPropertyValue(v);
      if (value && now !== value) {
        this.body.style.setProperty(v, value);
        changed++;
      } else if (!value && now) {
        this.body.style.removeProperty(v);
        changed++;
      }
    });
    this.observer?.takeRecords();
    if (changed) this.runs++;
    return changed;
  }
  onMutation() {
    const now = Date.now();
    this.hits = this.hits.filter((t) => now - t < 1e3);
    this.hits.push(now);
    if (this.hits.length > 10) {
      this.observer?.disconnect();
      this.observer = null;
      console.warn("[fantasy-easel] body classes keep changing (10+ times in 1s). Stopped keeping the Fantasy look.");
      new import_obsidian.Notice("Fantasy Easel: another plugin keeps changing the theme classes. Stopped syncing. Reload Fantasy Easel to retry.");
      return;
    }
    this.reconcile();
  }
  /**
   * Hand the look back. Only Easel's own things are removed; if Style Settings is on, it
   * re-applies its own values (with its own rules) on `parse-style-settings`.
   */
  detach(styleSettings) {
    this.observer?.disconnect();
    this.observer = null;
    const cl = this.body.classList;
    const usingCssBg = BACKGROUNDS.some((b) => b.kind !== "theme" && cl.contains(b.cls));
    for (const b of BACKGROUNDS) if (b.kind !== "theme") cl.remove(b.cls);
    cl.remove(MARKER_CLASS, STILL_CLASS, MOTION_CLASS, FORCE_MOTION_CLASS);
    URL_VARS.forEach((v) => this.body.style.removeProperty(v));
    if (styleSettings.enabled) {
      const bg = styleSettings.look && backgroundById(styleSettings.look.background);
      if (usingCssBg && bg) cl.add(bg.cls);
      styleSettings.trigger();
    } else {
      for (const c of THEME_GROUP) cl.remove(c);
    }
  }
};

// src/menus.ts
var import_obsidian2 = require("obsidian");
var KIND_LABEL = { theme: "Theme images", static: "CSS \xB7 static", motion: "CSS \xB7 motion" };
function colorMenu(store) {
  const menu = new import_obsidian2.Menu();
  for (const c of THEME_COLORS) {
    menu.addItem(
      (item) => item.setTitle(c.name).setChecked(store.settings.look.color === c.cls).onClick(() => store.setLook({ color: c.cls }))
    );
  }
  return menu;
}
function backgroundMenu(store) {
  const menu = new import_obsidian2.Menu();
  for (const kind of ["theme", "static", "motion"]) {
    if (kind !== "theme") menu.addSeparator();
    menu.addItem((item) => item.setTitle(KIND_LABEL[kind]).setIsLabel(true));
    for (const b of BACKGROUNDS.filter((b2) => b2.kind === kind)) {
      menu.addItem(
        (item) => item.setTitle(b.name).setChecked(store.settings.look.background === b.id).onClick(() => store.setLook({ background: b.id }))
      );
    }
  }
  return menu;
}
function stepBackground(store, dir) {
  const i = BACKGROUNDS.findIndex((b) => b.id === store.settings.look.background);
  const next = BACKGROUNDS[(i + dir + BACKGROUNDS.length) % BACKGROUNDS.length];
  store.setLook({ background: next.id });
}

// src/settings.ts
var MOTIONS = ["auto", "on", "off"];
var DEFAULT_LOOK = {
  color: THEME_DEFAULTS.color,
  background: THEME_DEFAULTS.background,
  accent: false,
  card: false,
  urls: ["", "", ""]
};
var DEFAULT_SETTINGS = { look: DEFAULT_LOOK, motion: "auto", statusBar: true };
var SS_DATA = (app) => `${app.vault.configDir}/plugins/obsidian-style-settings/data.json`;
async function readStyleSettingsLook(app) {
  let raw = {};
  let found = false;
  try {
    const path = SS_DATA(app);
    if (await app.vault.adapter.exists(path)) {
      raw = JSON.parse(await app.vault.adapter.read(path));
      found = Object.keys(raw).some((k) => k.startsWith(`${SS_SECTION}@@`));
    }
  } catch (e) {
    console.warn("[fantasy-easel] could not read Style Settings data", e);
  }
  const get = (key) => raw[`${SS_SECTION}@@${key}`];
  const color = typeof get(SS_KEYS.color) === "string" && colorByCls(get(SS_KEYS.color)) ? get(SS_KEYS.color) : DEFAULT_LOOK.color;
  const bgCls = get(SS_KEYS.background);
  const bgId = typeof bgCls === "string" ? bgCls.replace("fantasy-theme-background-", "") : "";
  const urls = SS_KEYS.url.map((k) => typeof get(k) === "string" ? get(k) : "");
  return {
    found,
    look: {
      color,
      background: backgroundById(bgId) ? bgId : DEFAULT_LOOK.background,
      accent: get(SS_KEYS.accent) === true,
      card: get(SS_KEYS.card) === true,
      urls
    }
  };
}
function normalize(data) {
  const look = data?.look ?? {};
  const urls = Array.isArray(look.urls) ? look.urls : [];
  return {
    look: {
      color: typeof look.color === "string" && colorByCls(look.color) ? look.color : DEFAULT_LOOK.color,
      background: typeof look.background === "string" && backgroundById(look.background) ? look.background : DEFAULT_LOOK.background,
      accent: look.accent === true,
      card: look.card === true,
      urls: [0, 1, 2].map((i) => typeof urls[i] === "string" ? urls[i] : "")
    },
    motion: MOTIONS.includes(data?.motion) ? data.motion : "auto",
    statusBar: data?.statusBar !== false
  };
}

// src/settings-tab.ts
var import_obsidian3 = require("obsidian");
var FantasyEaselSettingTab = class extends import_obsidian3.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
    this.unsubscribe = null;
  }
  display() {
    const { containerEl } = this;
    const store = this.plugin.store;
    const { look, motion, statusBar } = store.settings;
    containerEl.empty();
    containerEl.addClass("fantasy-easel-settings");
    this.unsubscribe?.();
    this.unsubscribe = store.subscribe(() => this.display());
    containerEl.createEl("p", {
      cls: "setting-item-description",
      text: `While Fantasy Easel is on, it owns the Fantasy look. Changes made in Style Settings' Fantasy section are put back right away. Use "Import from Style Settings" below to take those values.`
    });
    new import_obsidian3.Setting(containerEl).setName("Theme color").setDesc(colorByCls(look.color)?.name ?? look.color).addButton((b) => b.setButtonText("Change").onClick((ev) => colorMenu(store).showAtMouseEvent(ev)));
    const bg = backgroundById(look.background);
    new import_obsidian3.Setting(containerEl).setName("Background").setDesc(bg ? `${bg.name} (${bg.kind === "theme" ? "theme image" : `CSS \xB7 ${bg.kind}`})` : look.background).addButton((b) => b.setButtonText("Change").onClick((ev) => backgroundMenu(store).showAtMouseEvent(ev)));
    new import_obsidian3.Setting(containerEl).setName("Theme accent").setDesc("Use the theme color as the accent.").addToggle((t) => t.setValue(look.accent).onChange((v) => store.setLook({ accent: v })));
    new import_obsidian3.Setting(containerEl).setName("Card layout").addToggle((t) => t.setValue(look.card).onChange((v) => store.setLook({ card: v })));
    look.urls.forEach((url, i) => {
      new import_obsidian3.Setting(containerEl).setName(`Custom background URL ${i + 1}`).setDesc('CSS value, same as Style Settings: url("https://\u2026"). Empty = theme default.').addText((t) => {
        t.inputEl.type = "text";
        t.setValue(url).setPlaceholder('url("\u2026")');
        t.inputEl.addEventListener("change", () => {
          const urls = [...store.settings.look.urls];
          urls[i] = t.getValue().trim();
          store.setLook({ urls });
        });
      });
    });
    new import_obsidian3.Setting(containerEl).setName("Motion backgrounds").setDesc(`Auto follows the OS "reduce motion" setting${window.matchMedia("(prefers-reduced-motion: reduce)").matches ? " (on here, so motion is paused)" : ""}. On moves anyway. All pause while the window is not focused.`).addButton((b) => b.setButtonText(motion === "auto" ? "Auto" : motion === "on" ? "On" : "Off").onClick((ev) => {
      const menu = new import_obsidian3.Menu();
      for (const m of MOTIONS) menu.addItem((i) => i.setTitle(m === "auto" ? "Auto" : m === "on" ? "On" : "Off").setChecked(m === motion).onClick(() => store.set({ motion: m })));
      menu.showAtMouseEvent(ev);
    }));
    new import_obsidian3.Setting(containerEl).setName("Status bar buttons").setDesc("Quick controls for trying looks.").addToggle((t) => t.setValue(statusBar).onChange((v) => store.set({ statusBar: v })));
    new import_obsidian3.Setting(containerEl).setName("Import from Style Settings").setDesc("Take the Fantasy values saved in Style Settings.").addButton((b) => b.setButtonText("Import").onClick(() => void this.plugin.importFromStyleSettings()));
  }
  hide() {
    this.unsubscribe?.();
    this.unsubscribe = null;
  }
};

// src/statusbar.ts
var import_obsidian4 = require("obsidian");
var TIP = { delay: 100, placement: "top" };
var StatusBar = class {
  constructor(app, plugin, store) {
    this.app = app;
    this.plugin = plugin;
    this.store = store;
    this.items = [];
    this.unsubscribe = null;
  }
  show() {
    if (this.items.length) return;
    const add = (cls, label, onClick) => {
      const el = this.plugin.addStatusBarItem();
      el.addClass("mod-clickable", "fantasy-easel-sb", cls);
      el.setAttr("aria-label", label);
      (0, import_obsidian4.setTooltip)(el, label, TIP);
      this.plugin.registerDomEvent(el, "click", onClick);
      this.items.push(el);
      return el;
    };
    const menuAt = (ev, make) => make().showAtMouseEvent(ev);
    const color = add("fantasy-easel-sb-color", "Theme color", (ev) => menuAt(ev, () => colorMenu(this.store)));
    this.swatch = color.createSpan({ cls: "fantasy-easel-swatch" });
    this.colorName = color.createSpan({ cls: "fantasy-easel-sb-text" });
    (0, import_obsidian4.setIcon)(add("fantasy-easel-sb-prev", "Previous background", () => stepBackground(this.store, -1)), "chevron-left");
    const bg = add("fantasy-easel-sb-bg", "Background", (ev) => menuAt(ev, () => backgroundMenu(this.store)));
    this.bgKind = bg.createSpan({ cls: "fantasy-easel-sb-kind" });
    this.bgName = bg.createSpan({ cls: "fantasy-easel-sb-text fantasy-easel-sb-bgname" });
    (0, import_obsidian4.setIcon)(add("fantasy-easel-sb-next", "Next background", () => stepBackground(this.store, 1)), "chevron-right");
    this.accent = add("fantasy-easel-sb-toggle", "Theme accent on / off", () => this.store.setLook({ accent: !this.store.settings.look.accent }));
    (0, import_obsidian4.setIcon)(this.accent, "droplet");
    this.card = add("fantasy-easel-sb-toggle", "Card layout on / off", () => this.store.setLook({ card: !this.store.settings.look.card }));
    (0, import_obsidian4.setIcon)(this.card, "layout-dashboard");
    this.still = add("fantasy-easel-sb-toggle", "Motion", () => {
      const order = MOTIONS;
      this.store.set({ motion: order[(order.indexOf(this.store.settings.motion) + 1) % order.length] });
    });
    (0, import_obsidian4.setIcon)(
      add("fantasy-easel-sb-mode", "Dark / light", () => this.app.commands.executeCommandById("theme:toggle-light-dark")),
      "sun-moon"
    );
    this.unsubscribe = this.store.subscribe(() => this.render());
    this.render();
  }
  hide() {
    this.unsubscribe?.();
    this.unsubscribe = null;
    this.items.forEach((el) => el.remove());
    this.items = [];
  }
  render() {
    const { look, motion } = this.store.settings;
    const color = colorByCls(look.color);
    this.swatch.className = `fantasy-easel-swatch ${look.color}`;
    this.colorName.setText(color?.name ?? look.color);
    const bg = backgroundById(look.background);
    this.bgName.setText(bg?.name ?? look.background);
    (0, import_obsidian4.setIcon)(this.bgKind, bg?.kind === "motion" ? "wind" : bg?.kind === "static" ? "palette" : "image");
    this.accent.toggleClass("is-on", look.accent);
    this.card.toggleClass("is-on", look.card);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    (0, import_obsidian4.setIcon)(this.still, motion === "off" ? "pause" : motion === "on" ? "play" : "circle-play");
    const tip = motion === "auto" ? `Motion: auto (follows OS reduced motion${reduced ? " \u2014 now paused" : ""}). Click: on` : motion === "on" ? "Motion: on (moves even with OS reduced motion). Click: off" : "Motion: off. Click: auto";
    this.still.setAttr("aria-label", tip);
    (0, import_obsidian4.setTooltip)(this.still, tip, TIP);
    this.still.toggleClass("is-on", motion === "on");
    this.still.toggleClass("is-idle", bg?.kind !== "motion");
  }
};

// src/store.ts
var Store = class {
  constructor(settings, save) {
    this.settings = settings;
    this.save = save;
    this.listeners = /* @__PURE__ */ new Set();
    this.saveTimer = null;
  }
  setLook(patch) {
    this.set({ look: { ...this.settings.look, ...patch } });
  }
  set(patch) {
    this.settings = { ...this.settings, ...patch };
    this.listeners.forEach((f) => f());
    if (this.saveTimer !== null) window.clearTimeout(this.saveTimer);
    this.saveTimer = window.setTimeout(() => this.flush(), 300);
  }
  /** Write a pending save now (unload). */
  flush() {
    if (this.saveTimer === null) return;
    window.clearTimeout(this.saveTimer);
    this.saveTimer = null;
    void this.save(this.settings);
  }
  subscribe(f) {
    this.listeners.add(f);
    return () => this.listeners.delete(f);
  }
};

// src/main.ts
var STYLE_SETTINGS_ID = "obsidian-style-settings";
var FantasyEaselPlugin = class extends import_obsidian5.Plugin {
  constructor() {
    super(...arguments);
    /** Menu builders, also for CLI checks (a Menu closes at once when the window has no focus). */
    this.menus = { color: () => colorMenu(this.store), background: () => backgroundMenu(this.store) };
    /** Style Settings' saved Fantasy look, for the hand-back on unload. */
    this.ssLook = null;
  }
  async onload() {
    const saved = await this.loadData();
    const ss = await readStyleSettingsLook(this.app);
    this.ssLook = ss.found ? ss.look : null;
    const settings = saved ? normalize(saved) : { ...DEFAULT_SETTINGS, look: ss.look };
    this.store = new Store(settings, (s) => this.saveData(s));
    if (!saved) await this.saveData(settings);
    this.applier = new Applier(document.body, () => this.store.settings);
    this.applier.attach();
    this.statusBar = new StatusBar(this.app, this, this.store);
    if (settings.statusBar) this.statusBar.show();
    this.register(
      this.store.subscribe(() => {
        this.applier.reconcile();
        if (this.store.settings.statusBar) this.statusBar.show();
        else this.statusBar.hide();
      })
    );
    this.addSettingTab(new FantasyEaselSettingTab(this.app, this));
    this.addCommand({ id: "next-background", name: "Next background", callback: () => stepBackground(this.store, 1) });
    this.addCommand({ id: "previous-background", name: "Previous background", callback: () => stepBackground(this.store, -1) });
    this.addCommand({ id: "import-style-settings", name: "Import from Style Settings", callback: () => void this.importFromStyleSettings() });
    this.app.workspace.onLayoutReady(() => this.applier.reconcile());
  }
  onunload() {
    this.store.flush();
    this.statusBar.hide();
    const plugins = this.app.plugins;
    this.applier.detach({
      enabled: !!plugins.plugins[STYLE_SETTINGS_ID],
      look: this.ssLook,
      trigger: () => this.app.workspace.trigger("parse-style-settings")
    });
  }
  async importFromStyleSettings() {
    const ss = await readStyleSettingsLook(this.app);
    this.ssLook = ss.found ? ss.look : null;
    this.store.setLook(ss.look);
    new import_obsidian5.Notice(ss.found ? "Fantasy Easel: imported from Style Settings." : "Fantasy Easel: no Style Settings values, used theme defaults.");
  }
};
