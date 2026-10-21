import { Modal, setIcon, type App } from "obsidian";
import { CSS_BACKGROUNDS, motionCss, type CssBackground } from "./backgrounds";
import { imageBackgrounds } from "./catalog";
import { buildStage, STAGES } from "./stages";
import type { Store } from "./store";

const GROUPS: { title: string; desc: string; pick: (b: CssBackground) => boolean }[] = [
  { title: "Theme color", desc: "Follows the theme color.", pick: (b) => b.kind === "static" && b.palette === "theme" },
  { title: "Fixed palette", desc: "Same colors with any theme color.", pick: (b) => b.kind === "static" && b.palette === "fixed" },
  { title: "Motion", desc: "Moves slowly.", pick: (b) => b.kind === "motion" },
];

/**
 * All CSS backgrounds side by side: day (light mode) and night (dark mode) picture for each,
 * under a glass card like the theme's, so they can be compared as they will look.
 * Tiles use the same gradient variables as the real background (`.fantasy-easel-day/-night`).
 * Click a tile to use that background.
 */
export class GalleryModal extends Modal {
  private unsubscribe: (() => void) | null = null;
  private lazy: IntersectionObserver | null = null;

  constructor(app: App, private store: Store, private managePictures?: () => void) {
    super(app);
  }

  onOpen() {
    this.modalEl.addClass("fantasy-easel-gallery-modal");
    this.setTitle("Backgrounds");
    this.unsubscribe = this.store.subscribe(() => this.markCurrent());
    const root = this.contentEl.createDiv({ cls: "fantasy-easel-gallery" });
    this.lazy = new IntersectionObserver((entries) => {
      // Only tiles near the view keep a stage: built on the way in, removed on the way out.
      for (const e of entries) {
        const tile = e.target as HTMLElement;
        const stage = tile.querySelector(":scope > .fantasy-easel-stage");
        if (e.isIntersecting && !stage) tile.prepend(buildStage(tile, tile.dataset.stage as "ambient" | "kinetic"));
        else if (!e.isIntersecting && stage) stage.remove();
      }
    }, { root: this.modalEl, rootMargin: "150px 0px" });
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
          layer.setCssProps({ "--fe-tile-image": `var(--fantasy-easel-grad-${b.key})`, "--fe-tile-motion": b.motion ? motionCss(b.motion) : "none" });
          if (b.motion?.over) {
            // upper layer: blend var comes from the tile's day / night class
            const over = tile.createDiv({ cls: "fantasy-easel-tile-layer" });
            over.setCssProps({ "--fe-tile-image": `var(--fantasy-easel-grad-${b.key}-b)`, "--fe-tile-blend": `var(--fantasy-easel-blend-${b.key})`, "--fe-tile-motion": motionCss(b.motion.over) });
          }
          const card = tile.createDiv({ cls: "fantasy-easel-tile-card" });
          card.createDiv({ cls: "fantasy-easel-tile-h", text: "Heading" });
          card.createDiv({ cls: "fantasy-easel-tile-p", text: "Body text on the glass card." });
          tile.addEventListener("click", () => this.store.setLook({ background: `css-${b.key}` }));
          tile.addEventListener("keydown", (ev) => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); this.store.setLook({ background: `css-${b.key}` }); } });
        }
      }
    }
    // Stages: four moving layers (media-art mockups, 2026-10-21)
    for (const [family, title, desc] of [
      ["ambient", "Stage · ambient", "Four layers of color fields and a texture, drifting and turning."],
      ["kinetic", "Stage · kinetic", "Four layer pictures: glass, prism and light patterns that slide and turn."],
    ] as const) {
      const section = root.createDiv({ cls: "fantasy-easel-gallery-group" });
      section.createDiv({ cls: "fantasy-easel-gallery-title", text: title });
      section.createDiv({ cls: "fantasy-easel-gallery-desc setting-item-description", text: desc });
      for (const s of STAGES.filter((x) => x.family === family)) {
        const id = `css-${s.key}`;
        const row = section.createDiv({ cls: "fantasy-easel-gallery-row", attr: { "data-id": id } });
        const label = row.createDiv({ cls: "fantasy-easel-gallery-name" });
        label.createSpan({ text: s.name });
        const check = label.createSpan({ cls: "fantasy-easel-gallery-check" });
        setIcon(check, "check");
        for (const side of ["day", "night"] as const) {
          const tile = row.createDiv({ cls: `fantasy-easel-tile fantasy-easel-${side} fantasy-easel-bg-${s.key}`, attr: { "aria-label": `${s.name} (${side})`, role: "button", tabindex: "0" } });
          // built when scrolled into view (dozens of four-layer stages at once overrun the GPU)
          tile.dataset.stage = s.family;
          this.lazy?.observe(tile);
          const card = tile.createDiv({ cls: "fantasy-easel-tile-card" });
          card.createDiv({ cls: "fantasy-easel-tile-h", text: "Heading" });
          card.createDiv({ cls: "fantasy-easel-tile-p", text: "Body text on the glass card." });
          tile.addEventListener("click", () => this.store.setLook({ background: id }));
          tile.addEventListener("keydown", (ev) => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); this.store.setLook({ background: id }); } });
        }
      }
    }

    // Your pictures: same picture day and night
    const mine = imageBackgrounds(this.store.settings.look.images);
    const section = root.createDiv({ cls: "fantasy-easel-gallery-group" });
    section.createDiv({ cls: "fantasy-easel-gallery-title", text: "Your pictures" });
    const desc = section.createDiv({ cls: "fantasy-easel-gallery-desc setting-item-description", text: "Added in settings with +. Same picture in day and night." });
    if (this.managePictures) {
      const add = desc.createEl("button", { cls: "fantasy-easel-gallery-add", text: "Add picture" });
      add.addEventListener("click", () => { this.close(); this.managePictures?.(); });
    }
    for (const b of mine) {
      const row = section.createDiv({ cls: "fantasy-easel-gallery-row", attr: { "data-id": b.id } });
      const label = row.createDiv({ cls: "fantasy-easel-gallery-name" });
      label.createSpan({ text: b.name });
      const check = label.createSpan({ cls: "fantasy-easel-gallery-check" });
      setIcon(check, "check");
      for (const side of ["day", "night"] as const) {
        const tile = row.createDiv({ cls: `fantasy-easel-tile fantasy-easel-${side}`, attr: { "aria-label": `${b.name} (${side})`, role: "button", tabindex: "0" } });
        const layer = tile.createDiv({ cls: "fantasy-easel-tile-layer" });
        layer.setCssProps({ "--fe-tile-image": b.url! });
        const card = tile.createDiv({ cls: "fantasy-easel-tile-card" });
        card.createDiv({ cls: "fantasy-easel-tile-h", text: "Heading" });
        card.createDiv({ cls: "fantasy-easel-tile-p", text: "Body text on the glass card." });
        tile.addEventListener("click", () => this.store.setLook({ background: b.id }));
        tile.addEventListener("keydown", (ev) => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); this.store.setLook({ background: b.id }); } });
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
    this.lazy?.disconnect();
    this.lazy = null;
    this.contentEl.empty();
  }
}
