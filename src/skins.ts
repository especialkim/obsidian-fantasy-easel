// Plugin styles: CSS that fits another plugin to the Fantasy glass. Moved out of the theme (2026-10-21),
// split into parts that switch on and off one by one (2026-10-24). Source: skins/<id>.css with
// `/* part: <part> */` markers; scripts/build.js puts every selector of a part behind
// `body.fantasy-easel-skin-<id>-<part>`. Settings keys: `<id>` (the plugin) and `<id>.<part>`.

export interface SkinPart {
  id: string;
  name: string;
  desc: string;
}

export interface Skin {
  id: string;
  name: string;
  desc: string;
  parts: SkinPart[];
}

export const SKINS: Skin[] = [
  {
    id: "excalidraw", name: "Excalidraw", desc: "Drawings over the Fantasy wallpaper, embedded notes on glass.",
    parts: [
      { id: "canvas", name: "See-through canvas", desc: "The canvas has no background of its own: the Fantasy wallpaper shows behind the drawing." },
      { id: "embeds", name: "Embedded notes on glass", desc: "Notes placed in a drawing sit on a tinted glass card with some padding." },
      { id: "properties", name: "Hide properties in embeds", desc: "Embedded notes show their text without the properties block." },
      { id: "toolbar", name: "Toolbar", desc: "Top-right tools wrap, the sidebar button and title line up, key hints are smaller." },
    ],
  },
  {
    id: "dataview", name: "Dataview", desc: "Query results on the glass card.",
    parts: [
      { id: "card", name: "Results on glass", desc: "Query results (tables, lists, tasks) sit on a rounded glass card." },
      { id: "table", name: "Tables", desc: "Tables fill the width; header and cells use the note's table text size." },
      { id: "tasks", name: "Task lists", desc: "Tasks in results line up with the note's own lists." },
      { id: "text", name: "Result text", desc: "Slightly smaller result text; DataviewJS headings in the theme heading colors." },
    ],
  },
  {
    id: "kanban", name: "Kanban", desc: "Boards in the glass colors.",
    parts: [
      { id: "glass", name: "Glass board", desc: "Board and lanes use the glass colors instead of solid panels." },
      { id: "layout", name: "Wrapping lanes", desc: "Lanes wrap onto new rows and scroll inside (35% of the window high)." },
      { id: "lanes", name: "Lane headers", desc: "Lane titles on a band; the first and last lane in the accent color." },
      { id: "cards", name: "Cards and buttons", desc: "Card hover border, new item and lane settings buttons in the theme." },
      { id: "headings", name: "Headings in cards", desc: "Headings inside cards in the theme heading colors and sizes." },
      { id: "search", name: "Search matches", desc: "Search matches on the board in larger text." },
    ],
  },
];

export const skinPartClass = (skin: string, part: string) => `fantasy-easel-skin-${skin}-${part}`;
/** Class of the whole-plugin switch in older versions (only removed now). */
export const skinClass = (id: string) => `fantasy-easel-skin-${id}`;

/** On unless the user turned it off. The CSS only matches that plugin's own elements. */
export const skinOn = (skins: Record<string, boolean>, s: Skin) => skins[s.id] ?? true;
export const partOn = (skins: Record<string, boolean>, s: Skin, p: SkinPart) => skins[`${s.id}.${p.id}`] ?? true;

/** Part classes the body should have. */
export const skinClasses = (skins: Record<string, boolean>): string[] =>
  SKINS.flatMap((s) => (skinOn(skins, s) ? s.parts.filter((p) => partOn(skins, s, p)).map((p) => skinPartClass(s.id, p.id)) : []));

export const ALL_SKIN_CLASSES: string[] = SKINS.flatMap((s) => [skinClass(s.id), ...s.parts.map((p) => skinPartClass(s.id, p.id))]);
