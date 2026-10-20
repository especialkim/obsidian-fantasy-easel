import { Menu } from "obsidian";
import { BACKGROUNDS, THEME_COLORS } from "./catalog";
import type { Store } from "./store";

const KIND_LABEL = { theme: "Theme images", static: "CSS · static", motion: "CSS · motion" } as const;

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

/** Background list grouped by kind (theme images, CSS static, CSS motion). */
export function backgroundMenu(store: Store): Menu {
  const menu = new Menu();
  for (const kind of ["theme", "static", "motion"] as const) {
    if (kind !== "theme") menu.addSeparator();
    menu.addItem((item) => item.setTitle(KIND_LABEL[kind]).setIsLabel(true));
    for (const b of BACKGROUNDS.filter((b) => b.kind === kind)) {
      menu.addItem((item) =>
        item
          .setTitle(b.name)
          .setChecked(store.settings.look.background === b.id)
          .onClick(() => store.setLook({ background: b.id })),
      );
    }
  }
  return menu;
}

/** Next / previous background in catalog order (wraps). */
export function stepBackground(store: Store, dir: 1 | -1) {
  const i = BACKGROUNDS.findIndex((b) => b.id === store.settings.look.background);
  const next = BACKGROUNDS[(i + dir + BACKGROUNDS.length) % BACKGROUNDS.length];
  store.setLook({ background: next.id });
}
