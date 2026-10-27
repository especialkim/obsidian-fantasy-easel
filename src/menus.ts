import { Menu } from "obsidian";
import { allBackgrounds, THEME_COLORS } from "./catalog";
import { backgroundGroups, PICTURES_GROUP } from "./options";
import type { Store } from "./store";

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

/** Background list under group titles (still, moving, your pictures); the gallery first, for
 *  choosing by picture when the names say little. */
export function backgroundMenu(store: Store, managePictures?: () => void, openGallery?: () => void): Menu {
  const menu = new Menu();
  if (openGallery) {
    menu.addItem((item) => item.setTitle("Open gallery…").setIcon("layout-grid").onClick(openGallery));
    menu.addSeparator();
  }
  const groups = backgroundGroups(store.settings.look.images);
  if (managePictures && !groups.some((g) => g.label === PICTURES_GROUP)) groups.push({ label: PICTURES_GROUP, list: [] });
  groups.forEach((g, i) => {
    if (i) menu.addSeparator();
    menu.addItem((item) => item.setTitle(g.label).setIsLabel(true));
    for (const b of g.list) {
      menu.addItem((item) =>
        item
          .setTitle(b.name)
          .setChecked(store.settings.look.background === b.id)
          .onClick(() => store.setLook({ background: b.id })),
      );
    }
    if (g.label === PICTURES_GROUP && managePictures) menu.addItem((item) => item.setTitle("Manage pictures…").setIcon("image-plus").onClick(managePictures));
  });
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
  store.setLook({ background: next.id });
}
