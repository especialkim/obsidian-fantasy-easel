import { Modal, setIcon, type App } from "obsidian";
import { CSS_BACKGROUNDS, type CssBackground } from "./backgrounds";
import type { Store } from "./store";

const GROUPS: { title: string; desc: string; pick: (b: CssBackground) => boolean }[] = [
  { title: "Theme color", desc: "Follows the theme color.", pick: (b) => b.kind === "static" && b.palette === "theme" },
  { title: "Fixed palette", desc: "Same colors with any theme color.", pick: (b) => b.kind === "static" && b.palette === "fixed" },
  { title: "Motion", desc: "Moves slowly. Pauses when the window is not focused.", pick: (b) => b.kind === "motion" },
];

/**
 * All CSS backgrounds side by side: day (light mode) and night (dark mode) picture for each,
 * under a glass card like the theme's, so they can be compared as they will look.
 * Tiles use the same gradient variables as the real background (`.fantasy-easel-day/-night`).
 * Click a tile to use that background.
 */
export class GalleryModal extends Modal {
  private unsubscribe: (() => void) | null = null;

  constructor(app: App, private store: Store) {
    super(app);
  }

  onOpen() {
    this.modalEl.addClass("fantasy-easel-gallery-modal");
    this.setTitle("Backgrounds");
    this.unsubscribe = this.store.subscribe(() => this.markCurrent());
    const root = this.contentEl.createDiv({ cls: "fantasy-easel-gallery" });
    const { motion } = this.store.settings;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const moving = motion === "on" || (motion === "auto" && !reduced);
    root.toggleClass("is-still", !moving);

    const head = root.createDiv({ cls: "fantasy-easel-gallery-head" });
    head.createSpan({ text: "Day" });
    head.createSpan({ text: "Night" });

    for (const g of GROUPS) {
      const section = root.createDiv({ cls: "fantasy-easel-gallery-group" });
      section.createDiv({ cls: "fantasy-easel-gallery-title", text: g.title });
      section.createDiv({ cls: "fantasy-easel-gallery-desc setting-item-description", text: g.desc });
      for (const b of CSS_BACKGROUNDS.filter(g.pick)) {
        const row = section.createDiv({ cls: "fantasy-easel-gallery-row", attr: { "data-id": `css-${b.key}` } });
        const label = row.createDiv({ cls: "fantasy-easel-gallery-name" });
        label.createSpan({ text: b.name });
        const check = label.createSpan({ cls: "fantasy-easel-gallery-check" });
        setIcon(check, "check");
        for (const side of ["day", "night"] as const) {
          const tile = row.createDiv({ cls: `fantasy-easel-tile fantasy-easel-${side}`, attr: { "aria-label": `${b.name} (${side})`, role: "button", tabindex: "0" } });
          const layer = tile.createDiv({ cls: "fantasy-easel-tile-layer" });
          layer.style.setProperty("background-image", `var(--fantasy-easel-grad-${b.key})`);
          if (b.motion) layer.style.setProperty("animation", `fantasy-easel-${b.motion.frames} ${b.motion.seconds}s ${b.motion.alternate ? "ease-in-out" : "linear"} infinite${b.motion.alternate ? " alternate" : ""}`);
          const card = tile.createDiv({ cls: "fantasy-easel-tile-card" });
          card.createDiv({ cls: "fantasy-easel-tile-h", text: "Heading" });
          card.createDiv({ cls: "fantasy-easel-tile-p", text: "Body text on the glass card." });
          tile.addEventListener("click", () => this.store.setLook({ background: `css-${b.key}` }));
          tile.addEventListener("keydown", (ev) => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); this.store.setLook({ background: `css-${b.key}` }); } });
        }
      }
    }
    this.markCurrent();
    root.querySelector(".fantasy-easel-gallery-row.is-current")?.scrollIntoView({ block: "center" });
  }

  private markCurrent() {
    const id = this.store.settings.look.background;
    this.contentEl.querySelectorAll<HTMLElement>(".fantasy-easel-gallery-row").forEach((r) => r.toggleClass("is-current", r.dataset.id === id));
  }

  onClose() {
    this.unsubscribe?.();
    this.unsubscribe = null;
    this.contentEl.empty();
  }
}
