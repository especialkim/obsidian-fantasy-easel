import { DEFAULT_BACKGROUND, pictureKind, toCssUrl } from "./catalog";
import { PictureLoader } from "./picture-loader";
import type { Applier } from "./apply";
import type { Store } from "./store";

/** Enabling adds a validated picture to the pickers; applying selects it for display. */
export class PictureActivation {
  checking = "";
  private mode: "enable" | "apply" = "apply";
  private source = "";
  private previous = "";
  private errors = new Map<string, { src: string; message: string }>();
  private listeners = new Set<() => void>();
  private loader = new PictureLoader(() => this.finish());
  private unsubscribe: () => void;

  constructor(private store: Store, private applier: Applier, private notify: (message: string) => void) {
    this.unsubscribe = store.subscribe(() => {
      if (!this.checking) return;
      const img = store.settings.look.images.find((img) => `img-${img.id}` === this.checking);
      if (store.settings.look.background !== this.previous || img?.src !== this.source || (this.mode === "apply" && !img?.enabled)) this.cancel();
    });
  }

  error(id: string) {
    const error = this.errors.get(id);
    const img = this.store.settings.look.images.find((img) => `img-${img.id}` === id);
    return error?.src === img?.src ? error?.message ?? "" : "";
  }

  subscribe(f: () => void) {
    this.listeners.add(f);
    return () => { this.listeners.delete(f); };
  }
  private emit() { this.listeners.forEach((f) => f()); }

  enable(id: string, on: boolean) {
    if (on) return this.start(id, "enable");
    if (this.checking === id) this.cancel();
    const look = this.store.settings.look;
    this.store.setLook({
      images: look.images.map((img) => `img-${img.id}` === id ? { ...img, enabled: false } : img),
      ...(look.background === id ? { background: DEFAULT_BACKGROUND } : {}),
    });
  }

  activate(id: string) {
    if (!id.startsWith("img-")) {
      this.cancel();
      this.store.setLook({ background: id });
      return;
    }
    const img = this.store.settings.look.images.find((img) => `img-${img.id}` === id);
    if (img?.enabled === true) this.start(id, "apply");
  }

  private start(id: string, mode: "enable" | "apply") {
    if (this.checking === id && this.mode === mode) return;
    this.cancel();
    const img = this.store.settings.look.images.find((img) => `img-${img.id}` === id);
    if (!img) return;
    this.mode = mode;
    this.checking = id;
    this.source = img.src;
    this.previous = this.store.settings.look.background;
    this.errors.delete(id);
    this.loader.select(id, toCssUrl(img.src), pictureKind(img.src) === "local");
    if (this.loader.error) this.finish();
    else this.emit();
  }

  /** An enabled picture stopped loading: remove it from pickers and select Silk. */
  unavailable(id: string) {
    const look = this.store.settings.look;
    const img = look.images.find((img) => `img-${img.id}` === id);
    if (!img?.enabled) return;
    const message = "Cannot load picture. Switched to the default Silk background and turned off Use.";
    this.errors.set(id, { src: img.src, message });
    this.store.setLook({
      background: DEFAULT_BACKGROUND,
      images: look.images.map((image) => image.id === img.id ? { ...image, enabled: false } : image),
    });
    this.notify(`Fantasy Easel: ${message}`);
    this.emit();
  }

  private finish() {
    const id = this.checking;
    if (!id) return;
    this.checking = "";
    const look = this.store.settings.look;
    const img = look.images.find((img) => `img-${img.id}` === id);
    if (!img || img.src !== this.source || look.background !== this.previous) return;
    if (this.loader.error) {
      if (this.mode === "apply") return this.unavailable(id);
      const message = "Cannot enable picture. Check the path or URL. Use stays off; the current background is unchanged.";
      this.errors.set(id, { src: img.src, message });
      this.notify(`Fantasy Easel: ${message}`);
    } else {
      this.errors.delete(id);
      if (this.mode === "enable") {
        this.store.setLook({ images: look.images.map((image) => image.id === img.id ? { ...image, enabled: true } : image) });
      } else {
        this.applier.acceptPicture(img.id, img.src, this.loader.value);
        this.store.setLook({ background: id });
      }
    }
    this.emit();
  }

  private cancel() {
    const wasChecking = !!this.checking;
    this.loader.reset();
    this.checking = "";
    if (wasChecking) this.emit();
  }
  dispose() {
    this.unsubscribe();
    this.listeners.clear();
    this.cancel();
  }
}
