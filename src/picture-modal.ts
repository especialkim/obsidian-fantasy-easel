import { Modal, Setting, type App } from "obsidian";
import { newImageId, toCssUrl } from "./catalog";
import { PictureSuggest } from "./pictures";
import type { Store } from "./store";

/** Add one picture and use it as the background (Obsidian Modal; no detour through settings).
 *  The same fields as a row of Settings → Your pictures: name and address, plus a preview. */
export class AddPictureModal extends Modal {
  private src = "";
  private name = "";

  constructor(app: App, private store: Store) {
    super(app);
  }

  onOpen() {
    this.setTitle("Add picture");
    this.modalEl.addClass("fantasy-easel-add-picture");
    const images = this.store.settings.look.images;
    const fallback = `Picture ${images.length + 1}`;

    new Setting(this.contentEl)
      .setName("Name")
      .setDesc("Shown in the menus and the gallery. Empty: " + fallback + ".")
      .addText((t) => t.setPlaceholder(fallback).onChange((v) => (this.name = v)));

    let preview: HTMLElement;
    let note: HTMLElement;
    const show = () => {
      const url = toCssUrl(this.src);
      preview.toggleClass("is-empty", !url);
      preview.setCssProps({ "--fantasy-easel-preview": url || "none" });
      note.setText(this.src.trim() && !url ? "Not found: check the path or address." : "");
    };
    const add = () => {
      if (!toCssUrl(this.src)) return void note.setText(this.src.trim() ? "Not found: check the path or address." : "Choose a picture first.");
      const img = { id: newImageId(), src: this.src.trim(), name: this.name.trim() };
      this.store.setLook({ images: [...this.store.settings.look.images, img], background: `img-${img.id}` });
      this.close();
    };
    const pick = new Setting(this.contentEl)
      .setName("Picture")
      .setDesc("A vault picture (type to search), https://… or a file on this computer (file://…, only here).")
      .setClass("fantasy-easel-add-picture-src")
      .addText((t) => {
        t.setPlaceholder("Vault path, https://… or file://…").onChange((v) => { this.src = v; show(); });
        new PictureSuggest(this.app, t.inputEl, (path) => { this.src = path; t.setValue(path); show(); });
        t.inputEl.addEventListener("keydown", (ev) => { if (ev.key === "Enter") { ev.preventDefault(); add(); } });
        window.setTimeout(() => t.inputEl.focus(), 0);
      });
    preview = this.contentEl.createDiv({ cls: "fantasy-easel-add-picture-preview is-empty" });
    preview.createSpan({ text: "Preview" });
    note = pick.descEl.createDiv({ cls: "fantasy-easel-add-picture-note mod-warning" });

    new Setting(this.contentEl)
      .addButton((b) => b.setButtonText("Cancel").onClick(() => this.close()))
      .addButton((b) => b.setButtonText("Add and use").setCta().onClick(add));
  }

  onClose() {
    this.contentEl.empty();
  }
}
