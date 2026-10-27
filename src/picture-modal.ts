import { Modal, Setting, type App } from "obsidian";
import { newImageId, toCssUrl } from "./catalog";
import { PictureSuggest, setPictures } from "./pictures";
import type { Store } from "./store";

const NOT_FOUND = "Not found: check the path or address.";

/**
 * Your pictures in one window (status bar menu, command, "+" in the panel gallery): add one at
 * the top (name, address, preview), and use or remove any below, newest first. Renaming and
 * reordering stay in Settings → Your pictures. Removing takes the entry off the list only (the
 * file stays), so there is no confirmation.
 */
export class PicturesModal extends Modal {
  private unsubscribe: (() => void) | null = null;

  constructor(app: App, private store: Store) {
    super(app);
  }

  onOpen() {
    this.setTitle("Your pictures");
    this.modalEl.addClass("fantasy-easel-pictures");
    this.addForm(this.contentEl.createDiv());
    const list = this.contentEl.createDiv({ cls: "fantasy-easel-pictures-list" });
    const draw = () => this.drawList(list);
    draw();
    this.unsubscribe = this.store.subscribe(draw);
  }

  onClose() {
    this.unsubscribe?.();
    this.unsubscribe = null;
    this.contentEl.empty();
  }

  /** Name, address (vault search), preview, "Add and use". The window stays open for the next one. */
  private addForm(el: HTMLElement) {
    let src = "";
    let name = "";
    let nameInput: HTMLInputElement;
    let srcInput: HTMLInputElement;
    const fallback = () => `Picture ${this.store.settings.look.images.length + 1}`;

    new Setting(el).setName("Name").addText((t) => {
      nameInput = t.inputEl;
      t.setPlaceholder(fallback()).onChange((v) => (name = v));
    });
    const srcRow = new Setting(el)
      .setName("Picture")
      .setDesc("A vault picture (type to search), https://… or a file on this computer (file://…, only here).")
      .setClass("fantasy-easel-pictures-src")
      .addText((t) => {
        srcInput = t.inputEl;
        t.setPlaceholder("Vault path, https://… or file://…").onChange((v) => { src = v; show(); });
        new PictureSuggest(this.app, t.inputEl, (path) => { src = path; t.setValue(path); show(); });
        t.inputEl.addEventListener("keydown", (ev) => { if (ev.key === "Enter") { ev.preventDefault(); add(); } });
        window.setTimeout(() => t.inputEl.focus(), 0);
      });
    const note = srcRow.descEl.createDiv({ cls: "fantasy-easel-pictures-note mod-warning" });
    const preview = el.createDiv({ cls: "fantasy-easel-pictures-preview is-empty" });
    new Setting(el).addButton((b) => b.setButtonText("Add and use").setCta().onClick(() => add()));

    function show() {
      const url = toCssUrl(src);
      preview.toggleClass("is-empty", !url);
      preview.setCssProps({ "--fantasy-easel-preview": url || "none" });
      note.setText(src.trim() && !url ? NOT_FOUND : "");
    }
    const add = () => {
      if (!toCssUrl(src)) return void note.setText(src.trim() ? NOT_FOUND : "Choose a picture first.");
      const img = { id: newImageId(), src: src.trim(), name: name.trim() };
      // newest on top: first in the list, the menus and the gallery
      this.store.setLook({ images: [img, ...this.store.settings.look.images], background: `img-${img.id}` });
      src = name = "";
      nameInput.value = srcInput.value = "";
      nameInput.placeholder = fallback();
      show();
      srcInput.focus();
    };
  }

  /** Each picture: thumbnail, name, Use (or "In use"), remove. */
  private drawList(el: HTMLElement) {
    el.empty();
    const { images, background } = this.store.settings.look;
    if (!images.length) {
      el.createDiv({ cls: "setting-item-description fantasy-easel-pictures-empty", text: "No pictures yet." });
      return;
    }
    images.forEach((img, i) => {
      const url = toCssUrl(img.src);
      const id = `img-${img.id}`;
      const row = new Setting(el).setName(img.name?.trim() || `Picture ${i + 1}`).setClass("fantasy-easel-pictures-row");
      if (!url) row.setDesc(img.src.trim() ? NOT_FOUND : "No address yet (Settings → Your pictures).");
      const thumb = createDiv({ cls: "fantasy-easel-pictures-thumb" });
      thumb.setCssProps({ "--fantasy-easel-preview": url || "none" });
      row.settingEl.prepend(thumb);
      if (background === id) row.controlEl.createSpan({ cls: "fantasy-easel-pictures-inuse", text: "In use" });
      else if (url) row.addButton((b) => b.setButtonText("Use").onClick(() => this.store.setLook({ background: id })));
      row.addExtraButton((b) => {
        b.setIcon("trash-2").setTooltip("Remove from the list (the file stays)").onClick(() => setPictures(this.store, this.store.settings.look.images.filter((x) => x.id !== img.id)));
      });
    });
  }
}
