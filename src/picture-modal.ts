import { Modal, Setting, type App } from "obsidian";
import { newImageId, toCssUrl } from "./catalog";
import { PictureSuggest } from "./pictures";
import type { Store } from "./store";

/** Add one picture and use it as the background (Obsidian Modal; no detour through settings). */
export class AddPictureModal extends Modal {
  private src = "";

  constructor(app: App, private store: Store) {
    super(app);
  }

  onOpen() {
    this.setTitle("Add picture");
    const add = () => {
      if (!toCssUrl(this.src)) return;
      const img = { id: newImageId(), src: this.src.trim() };
      this.store.setLook({ images: [...this.store.settings.look.images, img], background: `img-${img.id}` });
      this.close();
    };
    new Setting(this.contentEl)
      .setName("Picture")
      .setDesc("A vault picture (type to search), https://… or a file on this computer (file://…, only here).")
      .addText((t) => {
        t.setPlaceholder("Vault path, https://… or file://…").onChange((v) => (this.src = v));
        new PictureSuggest(this.app, t.inputEl, (path) => (this.src = path));
        t.inputEl.addEventListener("keydown", (ev) => { if (ev.key === "Enter") { ev.preventDefault(); add(); } });
        window.setTimeout(() => t.inputEl.focus(), 0);
      });
    new Setting(this.contentEl)
      .addButton((b) => b.setButtonText("Cancel").onClick(() => this.close()))
      .addButton((b) => b.setButtonText("Add and use").setCta().onClick(add));
  }

  onClose() {
    this.contentEl.empty();
  }
}
