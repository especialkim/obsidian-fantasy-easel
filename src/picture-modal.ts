import { ButtonComponent, Modal, setIcon, setTooltip, TextComponent, type App } from "obsidian";
import { newImageId, toCssUrl } from "./catalog";
import { PictureSuggest, setPictures } from "./pictures";
import type { Store } from "./store";

const NOT_FOUND = "Not found. Check the path or address.";

/**
 * Your pictures in one window (status bar menu, command, "+" in the panel gallery).
 * Top: one add row (preview slot, address with vault search, optional name, Add).
 * Below: the pictures as cards like the gallery tiles, newest first. Click a card to use it;
 * the one in use has the accent ring and a check; remove shows on hover or focus. Removing
 * takes the entry off the list only (the file stays), so there is no confirmation.
 * Renaming and reordering stay in Settings → Your pictures.
 */
export class PicturesModal extends Modal {
  private unsubscribe: (() => void) | null = null;

  constructor(app: App, private store: Store) {
    super(app);
  }

  onOpen() {
    this.setTitle("Your pictures");
    this.modalEl.addClass("fantasy-easel-pictures");
    this.addRow(this.contentEl.createDiv({ cls: "fantasy-easel-pictures-add" }));
    const grid = this.contentEl.createDiv({ cls: "fantasy-easel-pictures-grid" });
    const draw = () => this.drawCards(grid);
    draw();
    this.unsubscribe = this.store.subscribe(draw);
  }

  onClose() {
    this.unsubscribe?.();
    this.unsubscribe = null;
    this.contentEl.empty();
  }

  private addRow(el: HTMLElement) {
    const preview = el.createDiv({ cls: "fantasy-easel-pictures-preview is-empty" });
    setIcon(preview, "image-plus");
    const fields = el.createDiv({ cls: "fantasy-easel-pictures-fields" });
    const src = new TextComponent(fields).setPlaceholder("Vault picture, https://… or file://…");
    src.inputEl.addClass("fantasy-easel-pictures-src");
    setTooltip(src.inputEl, "Type to search the vault. A file:// picture works only on this computer.");
    const line = fields.createDiv({ cls: "fantasy-easel-pictures-line" });
    const name = new TextComponent(line).setPlaceholder("Name (optional)");
    const add = new ButtonComponent(line).setButtonText("Add").setCta();
    const note = fields.createDiv({ cls: "fantasy-easel-pictures-note" });

    const show = () => {
      const url = toCssUrl(src.getValue());
      preview.toggleClass("is-empty", !url);
      preview.setCssProps({ "--fantasy-easel-preview": url || "none" });
      note.setText(src.getValue().trim() && !url ? NOT_FOUND : "");
    };
    const submit = () => {
      const value = src.getValue().trim();
      if (!toCssUrl(value)) {
        note.setText(value ? NOT_FOUND : "Enter a picture first.");
        return src.inputEl.focus();
      }
      const img = { id: newImageId(), src: value, name: name.getValue().trim() };
      // newest first: in this grid, the menus and the gallery; added = in use
      this.store.setLook({ images: [img, ...this.store.settings.look.images], background: `img-${img.id}` });
      src.setValue("");
      name.setValue("");
      show();
      src.inputEl.focus();
    };
    src.onChange(show);
    new PictureSuggest(this.app, src.inputEl, (path) => { src.setValue(path); show(); });
    for (const input of [src.inputEl, name.inputEl]) {
      input.addEventListener("keydown", (ev) => { if (ev.key === "Enter") { ev.preventDefault(); submit(); } });
    }
    add.onClick(submit);
    window.setTimeout(() => src.inputEl.focus(), 0);
  }

  private drawCards(grid: HTMLElement) {
    grid.empty();
    const { images, background } = this.store.settings.look;
    grid.toggleClass("is-empty", !images.length);
    if (!images.length) {
      grid.createDiv({ cls: "fantasy-easel-pictures-empty", text: "No pictures yet. Add one above." });
      return;
    }
    images.forEach((img, i) => {
      const url = toCssUrl(img.src);
      const id = `img-${img.id}`;
      const label = img.name?.trim() || `Picture ${i + 1}`;
      const card = grid.createDiv({ cls: "fantasy-easel-pictures-card", attr: { role: "button", tabindex: url ? "0" : "-1", "aria-label": url ? `Use ${label}` : `${label}: ${NOT_FOUND}` } });
      card.toggleClass("is-current", background === id);
      card.toggleClass("is-missing", !url);
      const pic = card.createDiv({ cls: "fantasy-easel-pictures-pic" });
      pic.setCssProps({ "--fantasy-easel-preview": url || "none" });
      if (!url) pic.createSpan({ cls: "fantasy-easel-pictures-missing", text: img.src.trim() ? "Not found" : "No address" });
      const check = pic.createDiv({ cls: "fantasy-easel-pictures-check" });
      setIcon(check, "check");
      const remove = pic.createDiv({ cls: "clickable-icon fantasy-easel-pictures-remove", attr: { role: "button", tabindex: "0", "aria-label": `Remove ${label} (the file stays)` } });
      setIcon(remove, "trash-2");
      card.createDiv({ cls: "fantasy-easel-pictures-name", text: label });

      const use = () => { if (url) this.store.setLook({ background: id }); };
      const drop = () => setPictures(this.store, this.store.settings.look.images.filter((x) => x.id !== img.id));
      card.addEventListener("click", use);
      card.addEventListener("keydown", (ev) => {
        if (ev.target !== card) return;
        if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); use(); }
        else if (ev.key === "Delete" || ev.key === "Backspace") { ev.preventDefault(); drop(); }
      });
      remove.addEventListener("click", (ev) => { ev.stopPropagation(); drop(); });
      remove.addEventListener("keydown", (ev) => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); ev.stopPropagation(); drop(); } });
    });
  }
}
