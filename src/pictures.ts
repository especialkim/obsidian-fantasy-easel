import { AbstractInputSuggest, normalizePath, Platform, type App, type TFile } from "obsidian";
import { DEFAULT_BACKGROUND, toCssUrl, type UserImage } from "./catalog";
import type { Store } from "./store";

// Your pictures from this computer (2026-10-23): a vault path ("Assets/sky.png", or [[sky.png]]),
// file:///… or an absolute path (/Users/…, C:\…). Web addresses (https://) need nothing here.

const IMAGE = /^(png|jpe?g|gif|webp|avif|bmp|svg)$/i;

/**
 * Picture entry → an address Obsidian can show ("" = not found). Vault files go through the
 * public getResourcePath (works on any computer with this vault); files outside the vault get
 * Obsidian's own local prefix (Platform.resourcePathPrefix) and only work on this computer.
 * The browser cannot load file:// in Obsidian, so it is never used as is.
 */
export function resolvePicture(app: App, src: string): string {
  const s = src.trim();
  const fileUrl = /^file:\/\//i.test(s);
  if (fileUrl || s.startsWith("/") || /^[A-Za-z]:[\\/]/.test(s)) {
    let abs = fileUrl ? s.replace(/^file:\/\//i, "") : s;
    try {
      abs = decodeURI(abs);
    } catch {
      // not URL-encoded: use as typed
    }
    return Platform.resourcePathPrefix + encodeURI(abs.replace(/\\/g, "/").replace(/^\/+/, ""));
  }
  const link = s.replace(/^!?\[\[/, "").replace(/(\|.*)?\]\]$/, "");
  const file = app.vault.getFileByPath(normalizePath(link)) ?? app.metadataCache.getFirstLinkpathDest(link, "");
  return file && IMAGE.test(file.extension) ? app.vault.getResourcePath(file) : "";
}

/** Vault image suggestions under a text field (type a few letters of the name or path). */
export class PictureSuggest extends AbstractInputSuggest<TFile> {
  constructor(app: App, private input: HTMLInputElement, private pick: (path: string) => void) {
    super(app, input);
  }

  protected getSuggestions(query: string): TFile[] {
    const q = query.trim().toLowerCase();
    // a web address or a path outside the vault: nothing to suggest
    if (/^(https?|data|file):|^url\(|^\/|^[a-z]:[\\/]/i.test(q)) return [];
    return this.app.vault.getFiles().filter((f) => IMAGE.test(f.extension) && f.path.toLowerCase().includes(q)).slice(0, 50);
  }

  renderSuggestion(file: TFile, el: HTMLElement) {
    el.createDiv({ text: file.name });
    el.createDiv({ cls: "setting-item-description", text: file.parent?.path === "/" ? "" : file.parent?.path ?? "" });
  }

  selectSuggestion(file: TFile) {
    this.input.value = file.path;
    this.pick(file.path);
    this.close();
  }
}

/** Save the picture list (settings list, picture window). A picture that is gone or emptied
 *  cannot stay the background: it falls back to the default. */
export function setPictures(store: Store, images: UserImage[]) {
  const bg = store.settings.look.background;
  const keep = !bg.startsWith("img-") || images.some((x) => `img-${x.id}` === bg && toCssUrl(x.src));
  store.setLook(keep ? { images } : { images, background: DEFAULT_BACKGROUND });
}
