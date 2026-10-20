import { setIcon, setTooltip, type App, type Plugin } from "obsidian";
import { backgroundById, colorByCls } from "./catalog";
import { GalleryModal } from "./gallery";
import { backgroundMenu, colorMenu, stepBackground } from "./menus";
import { MOTIONS } from "./settings";
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
  private swatch!: HTMLElement;
  private colorName!: HTMLElement;
  private bgName!: HTMLElement;
  private bgKind!: HTMLElement;
  private accent!: HTMLElement;
  private card!: HTMLElement;
  private still!: HTMLElement;

  constructor(private app: App, private plugin: Plugin, private store: Store) {}

  show() {
    if (this.items.length) return;
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

    const color = add("fantasy-easel-sb-color", "Theme color", (ev) => menuAt(ev, () => colorMenu(this.store)));
    this.swatch = color.createSpan({ cls: "fantasy-easel-swatch" });
    this.colorName = color.createSpan({ cls: "fantasy-easel-sb-text" });

    setIcon(add("fantasy-easel-sb-prev", "Previous background", () => stepBackground(this.store, -1)), "chevron-left");
    const bg = add("fantasy-easel-sb-bg", "Background", (ev) => menuAt(ev, () => backgroundMenu(this.store)));
    this.bgKind = bg.createSpan({ cls: "fantasy-easel-sb-kind" });
    this.bgName = bg.createSpan({ cls: "fantasy-easel-sb-text fantasy-easel-sb-bgname" });
    setIcon(add("fantasy-easel-sb-next", "Next background", () => stepBackground(this.store, 1)), "chevron-right");
    setIcon(add("fantasy-easel-sb-gallery", "Background gallery (day / night)", () => new GalleryModal(this.app, this.store).open()), "layout-grid");

    this.accent = add("fantasy-easel-sb-toggle", "Theme accent on / off", () => this.store.setLook({ accent: !this.store.settings.look.accent }));
    setIcon(this.accent, "droplet");
    this.card = add("fantasy-easel-sb-toggle", "Card layout on / off", () => this.store.setLook({ card: !this.store.settings.look.card }));
    setIcon(this.card, "layout-dashboard");
    this.still = add("fantasy-easel-sb-toggle", "Motion", () => {
      const order = MOTIONS;
      this.store.set({ motion: order[(order.indexOf(this.store.settings.motion) + 1) % order.length] });
    });
    setIcon(
      add("fantasy-easel-sb-mode", "Dark / light", () => (this.app as unknown as { commands: { executeCommandById(id: string): boolean } }).commands.executeCommandById("theme:toggle-light-dark")),
      "sun-moon",
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

  private render() {
    const { look, motion } = this.store.settings;
    const color = colorByCls(look.color);
    // The theme color class on the swatch gives it that color's --fantasy-hue (theme.css).
    this.swatch.className = `fantasy-easel-swatch ${look.color}`;
    this.colorName.setText(color?.name ?? look.color);
    const bg = backgroundById(look.background);
    this.bgName.setText(bg?.name ?? look.background);
    setIcon(this.bgKind, bg?.kind === "motion" ? "wind" : bg?.kind === "static" ? "palette" : "image");
    this.accent.toggleClass("is-on", look.accent);
    this.card.toggleClass("is-on", look.card);
    // auto: follows OS reduced motion / on: always moves / off: never moves
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setIcon(this.still, motion === "off" ? "pause" : motion === "on" ? "play" : "circle-play");
    const tip = motion === "auto" ? `Motion: auto (follows OS reduced motion${reduced ? " — now paused" : ""}). Click: on` : motion === "on" ? "Motion: on (moves even with OS reduced motion). Click: off" : "Motion: off. Click: auto";
    this.still.setAttr("aria-label", tip);
    setTooltip(this.still, tip, TIP);
    this.still.toggleClass("is-on", motion === "on");
    this.still.toggleClass("is-idle", bg?.kind !== "motion");
  }
}
