import { AbstractInputSuggest, normalizePath, Platform, setIcon, type App, type TFile, type TFolder } from "obsidian";
import { DEFAULT_BACKGROUND, newImageId, toCssUrl, type UserImage } from "./catalog";
import { normalizeFolder } from "./settings";
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

/** New pictures go on top (menus, gallery, lists); the first one becomes the background. */
export function addPictures(store: Store, srcs: string[]) {
  const added = srcs.map((src) => ({ id: newImageId(), src, name: "" }));
  if (added.length) store.setLook({ images: [...added, ...store.settings.look.images], background: `img-${added[0].id}` });
}

/** Copy a picture file from outside the vault into it: the Easel picture folder when set (made if
 *  missing; a free name like "sky 1.png"), else Obsidian's attachment folder. Returns the vault path. */
export async function savePictureFile(app: App, file: File, folder: string): Promise<string> {
  const dir = normalizeFolder(folder);
  let path: string;
  if (dir) {
    if (!app.vault.getFolderByPath(dir)) await app.vault.createFolder(dir);
    const dot = file.name.lastIndexOf(".");
    const base = dot > 0 ? file.name.slice(0, dot) : file.name;
    const ext = dot > 0 ? file.name.slice(dot) : "";
    path = normalizePath(`${dir}/${file.name}`);
    for (let n = 1; app.vault.getAbstractFileByPath(path); n++) path = normalizePath(`${dir}/${base} ${n}${ext}`);
  } else {
    path = await app.fileManager.getAvailablePathForAttachment(file.name);
  }
  return (await app.vault.createBinary(path, await file.arrayBuffer())).path;
}

/** One after another: two files with the same name would otherwise pick the same free path. */
async function saveAll(app: App, files: File[], folder: string): Promise<string[]> {
  const out: string[] = [];
  for (const f of files) out.push(await savePictureFile(app, f, folder));
  return out;
}

/**
 * Pictures dropped on a target → their addresses for Your pictures ([] = none was a picture).
 * From Obsidian's file explorer the drag carries obsidian://open?vault=…&file=… (a vault path);
 * files from Finder or the desktop are copied into the vault (savePictureFile), so they work on
 * every device; an image dragged from a browser gives https://.
 */
export async function picturesFromDrop(app: App, data: DataTransfer, folder: string): Promise<string[]> {
  const files = Array.from(data.files).filter((f) => f.type.startsWith("image/"));
  // read the text now: a DataTransfer is empty once the drop event is over
  const lines = (data.getData("text/uri-list") || data.getData("text/plain")).split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith("#"));
  if (files.length) return saveAll(app, files, folder);
  const out: string[] = [];
  for (const line of lines) {
    if (line.startsWith("obsidian://")) {
      const url = new URL(line);
      if (url.searchParams.get("vault") !== app.vault.getName()) continue;
      const path = url.searchParams.get("file") ?? "";
      const hit = app.vault.getFileByPath(path) ?? app.metadataCache.getFirstLinkpathDest(path, "");
      if (hit && IMAGE.test(hit.extension)) out.push(hit.path);
    } else if (/^https?:\/\//i.test(line)) out.push(line);
  }
  return out;
}

const NOT_A_PICTURE = "Not a picture. Drop an image file or a picture from the vault.";
const failed = (err: unknown) => `Could not add the picture: ${err instanceof Error ? err.message : String(err)}`;

/** Let `el` take dropped pictures: `is-drop-target` while a drag is over it, then the addresses
 *  (or an error message when none was a picture). */
export function acceptPictureDrop(app: App, el: HTMLElement, folder: () => string, onPictures: (srcs: string[]) => void, onError: (message: string) => void) {
  let depth = 0;
  const set = (on: boolean) => el.toggleClass("is-drop-target", on);
  el.addEventListener("dragenter", (ev) => { ev.preventDefault(); depth++; set(true); });
  el.addEventListener("dragover", (ev) => { ev.preventDefault(); if (ev.dataTransfer) ev.dataTransfer.dropEffect = "copy"; });
  el.addEventListener("dragleave", () => { if (--depth <= 0) { depth = 0; set(false); } });
  el.addEventListener("drop", (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    depth = 0;
    set(false);
    if (!ev.dataTransfer) return;
    picturesFromDrop(app, ev.dataTransfer, folder()).then((srcs) => (srcs.length ? onPictures(srcs) : onError(NOT_A_PICTURE)), (err: unknown) => onError(failed(err)));
  });
}

/** Ask for picture files (Finder), copy them into the vault, then hand over their vault paths. */
export function choosePictureFiles(app: App, doc: Document, folder: () => string, onPictures: (srcs: string[]) => void, onError: (message: string) => void) {
  const input = doc.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.multiple = true;
  input.addEventListener("change", () => {
    const files = Array.from(input.files ?? []).filter((f) => f.type.startsWith("image/"));
    if (!files.length) return;
    saveAll(app, files, folder()).then(onPictures, (err: unknown) => onError(failed(err)));
  });
  input.click();
}

/**
 * The dashed "add pictures" box (settings, panel gallery): drop pictures on it, or click (Enter)
 * to choose files. Built fresh on each render, so its listeners never pile up.
 */
export function pictureDropZone(app: App, parent: HTMLElement, folder: () => string, onPictures: (srcs: string[]) => void, onError: (message: string) => void): HTMLElement {
  const zone = parent.createDiv({ cls: "fantasy-easel-dropzone", attr: { role: "button", tabindex: "0", "aria-label": "Vault pictures, Finder or desktop files, or images from a browser" } });
  setIcon(zone.createDiv({ cls: "fantasy-easel-dropzone-icon" }), "image-plus");
  const text = zone.createDiv({ cls: "fantasy-easel-dropzone-text" });
  text.createDiv({ cls: "fantasy-easel-dropzone-main", text: "Drop pictures here" });
  text.createDiv({ cls: "fantasy-easel-dropzone-sub", text: "or click to choose files" });
  const choose = () => choosePictureFiles(app, zone.doc, folder, onPictures, onError);
  zone.addEventListener("click", choose);
  zone.addEventListener("keydown", (ev) => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); choose(); } });
  acceptPictureDrop(app, zone, folder, onPictures, onError);
  return zone;
}

/** Vault folders for the "Picture folder" field. */
export class FolderSuggest extends AbstractInputSuggest<TFolder> {
  constructor(app: App, private inputEl: HTMLInputElement, private onPick: (path: string) => void) {
    super(app, inputEl);
  }

  getSuggestions(query: string): TFolder[] {
    const q = query.toLowerCase();
    return this.app.vault.getAllFolders(false).filter((f) => f.path.toLowerCase().includes(q)).slice(0, 50);
  }

  renderSuggestion(folder: TFolder, el: HTMLElement) {
    el.setText(folder.path);
  }

  selectSuggestion(folder: TFolder) {
    this.inputEl.value = folder.path;
    this.onPick(folder.path);
    this.close();
  }
}
