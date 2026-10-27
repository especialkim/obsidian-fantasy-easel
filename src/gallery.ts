import { setIcon } from "obsidian";
import { CSS_BACKGROUNDS, motionCss, type CssBackground } from "./backgrounds";
import { imageBackgrounds } from "./catalog";
import { buildStage, STAGES } from "./stages";
import type { Store } from "./store";


/**
 * All backgrounds side by side: day (light mode) and night (dark mode) picture for each,
 * under a glass card like the theme's, so they can be compared as they will look.
 * Tiles use the same gradient variables as the real background (`.fantasy-easel-day/-night`).
 * Click a tile to use that background. Drawn in the style panel (the gallery window was removed
 * 2026-10-27: tiles built and dropped while scrolling flickered, and it hid the background it set).
 * Returns the cleanup (unsubscribes).
 */
export function renderGallery(root: HTMLElement, store: Store, opts: { addPicture?: () => void; still?: boolean; sides?: ("day" | "night")[] }): () => void {
  root.addClass("fantasy-easel-gallery");
  const { motion } = store.settings;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const moving = !opts.still && (motion === "on" || (motion === "auto" && !reduced));
  root.toggleClass("is-still", !moving);

  // both modes side by side, or only the current one (style panel)
  const sides = opts.sides ?? (["day", "night"] as const);
  root.toggleClass("is-single", sides.length === 1);
  if (sides.length > 1) {
    const head = root.createDiv({ cls: "fantasy-easel-gallery-head" });
    head.createSpan({ text: "Day" });
    head.createSpan({ text: "Night" });
  }

  // the same three groups as the menus and dropdowns (src/options.ts): still, moving, your pictures
  const group = (title: string, desc: string) => {
    const section = root.createDiv({ cls: "fantasy-easel-gallery-group" });
    const head = section.createDiv({ cls: "fantasy-easel-gallery-title" });
    head.createSpan({ text: title });
    section.createDiv({ cls: "fantasy-easel-gallery-desc setting-item-description", text: desc });
    return { section, head };
  };
  const cssRows = (section: HTMLElement, list: CssBackground[]) => {
    for (const b of list) {
      const row = section.createDiv({ cls: "fantasy-easel-gallery-row", attr: { "data-id": `css-${b.key}` } });
      const label = row.createDiv({ cls: "fantasy-easel-gallery-name" });
      label.createSpan({ text: b.name });
      const check = label.createSpan({ cls: "fantasy-easel-gallery-check" });
      setIcon(check, "check");
      for (const side of sides) {
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
        tile.addEventListener("click", () => store.setLook({ background: `css-${b.key}` }));
        tile.addEventListener("keydown", (ev) => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); store.setLook({ background: `css-${b.key}` }); } });
      }
    }
  };

  cssRows(group("Still", "Gradients that hold still. Some follow the palette, some keep their own colors.").section, CSS_BACKGROUNDS.filter((b) => b.kind === "static"));

  // Moving: slow gradients, then the stages (four moving layers, media-art mockups 2026-10-21)
  const movingSection = group("Moving", "Slow gradients, then stages: four layers that drift and turn (Stage speed).").section;
  cssRows(movingSection, CSS_BACKGROUNDS.filter((b) => b.kind === "motion"));
  {
    const section = movingSection;
    for (const s of STAGES) {
      const id = `css-${s.key}`;
      const row = section.createDiv({ cls: "fantasy-easel-gallery-row", attr: { "data-id": id } });
      const label = row.createDiv({ cls: "fantasy-easel-gallery-name" });
      label.createSpan({ text: s.name });
      const check = label.createSpan({ cls: "fantasy-easel-gallery-check" });
      setIcon(check, "check");
      for (const side of sides) {
        const tile = row.createDiv({ cls: `fantasy-easel-tile fantasy-easel-${side} fantasy-easel-bg-${s.key}`, attr: { "aria-label": `${s.name} (${side})`, role: "button", tabindex: "0" } });
        // built once, up front: the panel tiles are small and still, and building them on the way
        // in (and dropping them on the way out) left them filling in slowly while scrolling (2026-10-28)
        tile.dataset.stage = s.family;
        tile.prepend(buildStage(tile, s.family));
        const card = tile.createDiv({ cls: "fantasy-easel-tile-card" });
        card.createDiv({ cls: "fantasy-easel-tile-h", text: "Heading" });
        card.createDiv({ cls: "fantasy-easel-tile-p", text: "Body text on the glass card." });
        tile.addEventListener("click", () => store.setLook({ background: id }));
        tile.addEventListener("keydown", (ev) => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); store.setLook({ background: id }); } });
      }
    }
  }

  // Your pictures: same picture day and night
  const mine = imageBackgrounds(store.settings.look.images);
  const { section, head } = group("Your pictures", "Your own pictures. The same picture day and night.");
  // "+" at the right of the title, like the list in settings
  if (opts.addPicture) {
    const add = head.createDiv({ cls: "clickable-icon fantasy-easel-gallery-add", attr: { "aria-label": "Add picture", role: "button", tabindex: "0" } });
    setIcon(add, "plus");
    add.addEventListener("click", () => opts.addPicture?.());
    add.addEventListener("keydown", (ev) => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); opts.addPicture?.(); } });
  }
  if (!mine.length) section.createDiv({ cls: "fantasy-easel-gallery-empty setting-item-description", text: "No pictures yet. Add one with +." });
  for (const b of mine) {
    const row = section.createDiv({ cls: "fantasy-easel-gallery-row", attr: { "data-id": b.id } });
    const label = row.createDiv({ cls: "fantasy-easel-gallery-name" });
    label.createSpan({ text: b.name });
    const check = label.createSpan({ cls: "fantasy-easel-gallery-check" });
    setIcon(check, "check");
    for (const side of sides) {
      const tile = row.createDiv({ cls: `fantasy-easel-tile fantasy-easel-${side}`, attr: { "aria-label": `${b.name} (${side})`, role: "button", tabindex: "0" } });
      const layer = tile.createDiv({ cls: "fantasy-easel-tile-layer" });
      layer.setCssProps({ "--fe-tile-image": b.url! });
      const card = tile.createDiv({ cls: "fantasy-easel-tile-card" });
      card.createDiv({ cls: "fantasy-easel-tile-h", text: "Heading" });
      card.createDiv({ cls: "fantasy-easel-tile-p", text: "Body text on the glass card." });
      tile.addEventListener("click", () => store.setLook({ background: b.id }));
      tile.addEventListener("keydown", (ev) => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); store.setLook({ background: b.id }); } });
    }
  }
  const markCurrent = () => {
    const id = store.settings.look.background;
    root.querySelectorAll<HTMLElement>(".fantasy-easel-gallery-row").forEach((r) => r.toggleClass("is-current", r.dataset.id === id));
  };
  markCurrent();
  const unsubscribe = store.subscribe(markCurrent);
  return unsubscribe;
}
