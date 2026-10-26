import { Modal, Setting, type App } from "obsidian";
import { newImageId } from "./catalog";
import { PictureSuggest } from "./pictures";
import type { Store } from "./store";

/** Register a picture without changing the active background. */
export class AddPictureModal extends Modal {
  private src = "";
  private alias = "";

  constructor(app: App, private store: Store) {
    super(app);
  }

  onOpen() {
    this.setTitle("Add picture");
    this.modalEl.addClass("fantasy-easel-picture-modal");
    const add = () => {
      if (!this.src.trim()) return;
      const img = { id: newImageId(), name: this.alias.trim(), src: this.src.trim(), enabled: false };
      this.store.setLook({ images: [...this.store.settings.look.images, img] });
      this.close();
    };
    new Setting(this.contentEl)
      .setName("Alias")
      .setClass("fantasy-easel-picture-field")
      .addText((t) => {
        t.setPlaceholder("Optional picture name").onChange((v) => (this.alias = v));
        t.inputEl.setAttr("aria-label", "Picture alias");
        window.setTimeout(() => t.inputEl.focus(), 0);
      });
    new Setting(this.contentEl)
      .setName("Path or URL")
      .setClass("fantasy-easel-picture-field")
      .setDesc("A vault picture (type to search), https://… or a file on this computer (file://…, only here).")
      .addText((t) => {
        t.setPlaceholder("Vault path, https://… or file://…").onChange((v) => (this.src = v));
        t.inputEl.setAttr("aria-label", "Picture path or URL");
        new PictureSuggest(this.app, t.inputEl, (path) => (this.src = path));
        t.inputEl.addEventListener("keydown", (ev) => { if (ev.key === "Enter") { ev.preventDefault(); add(); } });
      });
    new Setting(this.contentEl)
      .addButton((b) => b.setButtonText("Cancel").onClick(() => this.close()))
      .addButton((b) => b.setButtonText("Add").setCta().onClick(add));
  }

  onClose() {
    this.contentEl.empty();
  }
}
