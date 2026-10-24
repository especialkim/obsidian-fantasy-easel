import { setIcon, setTooltip, type App, type Plugin } from "obsidian";
import { backgroundById, colorByCls } from "./catalog";
import { GalleryModal } from "./gallery";
import { backgroundMenu, colorMenu, stepBackground } from "./menus";
import { MOTIONS, type StatusId } from "./settings";
import type { Store } from "./store";

const TIP = { delay: 100, placement: "top" } as const;

/**
 * Quick test controls in the status bar. One status bar item per button so each gets
 * Obsidian's own hover (mod-clickable). Redraws from the store, so changes made in the
 * settings tab or by commands show here too.
 */
export class StatusBar {
  private items: HTMLElement[] = [];
  private unsubscribe: (() => void) | null = null;
  // only the buttons that are shown exist
  private swatch?: HTMLElement;
  private colorName?: HTMLElement;
  private bgName?: HTMLElement;
  private bgKind?: HTMLElement;
  private accent?: HTMLElement;
  private card?: HTMLElement;
  private still?: HTMLElement;

  constructor(private app: App, private plugin: Plugin, private store: Store, private managePictures: () => void) {}

  /** layout the buttons were built for (rebuilt when the order or the chosen buttons change) */
  private built = "";

  /** Build the chosen buttons in the chosen order. Same layout again = nothing to do. */
  show() {
    const items = this.store.settings.statusItems.filter((x) => x.on);
    const layout = items.map((x) => x.id).join(",");
    if (this.unsubscribe && layout === this.built) return;
    this.hide();
    this.built = layout;
    const add = (cls: string, label: string, onClick: (ev: MouseEvent) => void) => {
      const el = this.plugin.addStatusBarItem();
      el.addClass("mod-clickable", "fantasy-easel-sb", cls);
      el.setAttr("aria-label", label);
      setTooltip(el, label, TIP);
      this.plugin.registerDomEvent(el, "click", onClick);
      this.items.push(el);
      return el;
    };
    const menuAt = (ev: MouseEvent, make: () => { showAtMouseEvent(ev: MouseEvent): unknown }) => make().showAtMouseEvent(ev);

    const build: Record<StatusId, () => void> = {
      color: () => {
        const color = add("fantasy-easel-sb-color", "Palette", (ev) => menuAt(ev, () => colorMenu(this.store)));
        this.swatch = color.createSpan({ cls: "fantasy-easel-swatch" });
        this.colorName = color.createSpan({ cls: "fantasy-easel-sb-text" });
      },
      prev: () => setIcon(add("fantasy-easel-sb-prev", "Previous background", () => stepBackground(this.store, -1)), "chevron-left"),
      background: () => {
        const bg = add("fantasy-easel-sb-bg", "Background", (ev) => menuAt(ev, () => backgroundMenu(this.store, this.managePictures)));
        this.bgKind = bg.createSpan({ cls: "fantasy-easel-sb-kind" });
        this.bgName = bg.createSpan({ cls: "fantasy-easel-sb-text fantasy-easel-sb-bgname" });
      },
      next: () => setIcon(add("fantasy-easel-sb-next", "Next background", () => stepBackground(this.store, 1)), "chevron-right"),
      gallery: () => setIcon(add("fantasy-easel-sb-gallery", "Background gallery (day / night)", () => new GalleryModal(this.app, this.store, this.managePictures).open()), "layout-grid"),
      accent: () => {
        this.accent = add("fantasy-easel-sb-toggle", "Theme accent on / off", () => this.store.setLook({ accent: !this.store.settings.look.accent }));
        setIcon(this.accent, "droplet");
      },
      card: () => {
        this.card = add("fantasy-easel-sb-toggle", "Card layout on / off", () => this.store.setLook({ card: !this.store.settings.look.card }));
        setIcon(this.card, "layout-dashboard");
      },
      motion: () => {
        this.still = add("fantasy-easel-sb-toggle", "Motion", () => {
          const order = MOTIONS;
          this.store.set({ motion: order[(order.indexOf(this.store.settings.motion) + 1) % order.length] });
        });
      },
      // Exception to "public API only": Obsidian has no public call to switch dark / light.
      mode: () => setIcon(add("fantasy-easel-sb-mode", "Dark / light", () => toggleDarkLight(this.app)), "sun-moon"),
    };
    for (const x of items) build[x.id]();

    this.unsubscribe = this.store.subscribe(() => this.render());
    this.render();
  }

  hide() {
    this.unsubscribe?.();
    this.unsubscribe = null;
    this.built = "";
    this.swatch = this.colorName = this.bgName = this.bgKind = this.accent = this.card = this.still = undefined;
    this.items.forEach((el) => el.remove());
    this.items = [];
  }

  private render() {
    const { look, motion } = this.store.settings;
    const color = colorByCls(look.color);
    // The theme color class on the swatch gives it that color's --fantasy-hue (theme.css).
    if (this.swatch) this.swatch.className = `fantasy-easel-swatch ${look.color}`;
    this.colorName?.setText(color?.name ?? look.color);
    const bg = backgroundById(look.background, look.images);
    this.bgName?.setText(bg?.name ?? look.background);
    if (this.bgKind) setIcon(this.bgKind, bg?.kind === "motion" ? "wind" : bg?.kind === "static" ? "palette" : "image");
    this.accent?.toggleClass("is-on", look.accent);
    this.card?.toggleClass("is-on", look.card);
    const still = this.still;
    if (!still) return;
    // on = Moving, auto = Follow system (OS reduce motion), off = Still; clicks go in that order
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setIcon(still, motion === "off" ? "pause" : motion === "on" ? "play" : "circle-play");
    const tip = motion === "on" ? "Motion: Moving. Click: Follow system" : motion === "auto" ? `Motion: Follow system (${reduced ? "Reduce motion is on, so still" : "moving"}). Click: Still` : "Motion: Still. Click: Moving";
    still.setAttr("aria-label", tip);
    setTooltip(still, tip, TIP);
    still.toggleClass("is-on", motion === "on");
    still.toggleClass("is-idle", bg?.kind !== "motion");
  }
}

/** Exception to "public API only" (AGENTS 12): Obsidian has no public call to switch dark / light. */
export function toggleDarkLight(app: App) {
  (app as unknown as { commands: { executeCommandById(id: string): boolean } }).commands.executeCommandById("theme:toggle-light-dark");
}
