/** Validate the selected picture before replacing the theme's default background.
 * The saved selection is never changed. Cancelled/late loads cannot replace a newer selection. */
export class PictureLoader {
  private key = "";
  private cancel: (() => void) | null = null;
  value = "";
  error = "";

  constructor(private changed: () => void, private makeImage: () => HTMLImageElement = () => new Image()) {}

  select(key: string, css: string, local = false) {
    if (key === this.key) return;
    this.reset();
    this.key = key;
    if (!key) return;
    const match = /^url\(\s*(["']?)(.*?)\1\s*\)$/i.exec(css);
    if (!match?.[2]) {
      this.error = "Cannot load picture. Showing Silk; the saved path is kept.";
      return;
    }
    const img = this.makeImage();
    const finish = (ok: boolean) => {
      if (this.key !== key || this.cancel !== cancel) return;
      cancel();
      this.cancel = null;
      this.value = ok ? css : "";
      this.error = ok ? "" : "Cannot load picture. Showing Silk; the saved path is kept.";
      this.changed();
    };
    const timer = window.setTimeout(() => finish(false), 10000);
    const cancel = () => {
      window.clearTimeout(timer);
      img.onload = img.onerror = null;
      img.removeAttribute("src");
    };
    this.cancel = cancel;
    img.onload = () => finish(true);
    img.onerror = () => finish(false);
    const href = match[2].replace(/\\(["\\])/g, "$1");
    // Local files can disappear while the browser still has their old decoded image.
    // Revalidate local resources on focus/retry without changing remote/signed URLs.
    const hash = href.indexOf("#");
    const base = hash < 0 ? href : href.slice(0, hash);
    img.src = local ? `${base}${base.includes("?") ? "&" : "?"}fantasy-easel-check=${Date.now()}${hash < 0 ? "" : href.slice(hash)}` : href;
  }

  reset() {
    this.cancel?.();
    this.cancel = null;
    this.key = "";
    this.value = "";
    this.error = "";
  }

  accept(key: string, css: string) {
    this.reset();
    this.key = key;
    this.value = css;
  }
}
