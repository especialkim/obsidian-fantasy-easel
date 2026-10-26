import { Menu } from "obsidian";
import { allBackgrounds, THEME_COLORS } from "./catalog";
import type { Store } from "./store";

const KIND_LABEL = { static: "CSS · static", motion: "CSS · motion", image: "Your pictures" } as const;

/** Theme color list. Same menu from the status bar and the settings tab. */
export function colorMenu(store: Store): Menu {
  const menu = new Menu();
  for (const c of THEME_COLORS) {
    menu.addItem((item) =>
      item
        .setTitle(c.name)
        .setChecked(store.settings.look.color === c.cls)
        .onClick(() => store.setLook({ color: c.cls })),
    );
  }
  return menu;
}

/** Background list grouped by kind (CSS static, CSS motion, your pictures). */
export function backgroundMenu(store: Store, managePictures?: () => void): Menu {
  const menu = new Menu();
  const all = allBackgrounds(store.settings.look.images);
  for (const kind of ["static", "motion", "image"] as const) {
    const list = all.filter((b) => b.kind === kind);
    if (kind === "image" && !list.length && !managePictures) continue;
    if (kind !== "static") menu.addSeparator();
    menu.addItem((item) => item.setTitle(KIND_LABEL[kind]).setIsLabel(true));
    for (const b of list) {
      menu.addItem((item) =>
        item
          .setTitle(b.name)
          .setChecked(store.settings.look.background === b.id)
          .onClick(() => store.chooseBackground(b.id)),
      );
    }
    if (kind === "image" && managePictures) menu.addItem((item) => item.setTitle("Add picture…").setIcon("plus").onClick(managePictures));
  }
  return menu;
}

/** Next / previous palette (wraps). */
export function stepColor(store: Store, dir: 1 | -1) {
  const i = THEME_COLORS.findIndex((c) => c.cls === store.settings.look.color);
  store.setLook({ color: THEME_COLORS[(i + dir + THEME_COLORS.length) % THEME_COLORS.length].cls });
}

/** Next / previous background in menu order (wraps). */
export function stepBackground(store: Store, dir: 1 | -1) {
  const all = allBackgrounds(store.settings.look.images);
  const i = all.findIndex((b) => b.id === store.settings.look.background);
  const next = all[(i + dir + all.length) % all.length];
  store.chooseBackground(next.id);
}
