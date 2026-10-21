// Plugin skins: CSS that fits a plugin to the Fantasy glass. Moved out of the theme (2026-10-21).
// Source: skins/<id>.css. scripts/build.js puts each into styles.css with every selector behind
// `body.fantasy-easel-skin-<id>`; turning a skin on / off only toggles that body class.

export interface Skin {
  id: string;
  name: string;
  desc: string;
}

export const SKINS: Skin[] = [
  { id: "dataview", name: "Dataview", desc: "Query results (tables, lists, tasks) sit on the glass card with rounded corners and slightly smaller text." },
  { id: "kanban", name: "Kanban", desc: "Board, lanes and cards use the glass colors; lane headers follow the heading colors." },
];

export const skinClass = (id: string) => `fantasy-easel-skin-${id}`;

/** On unless the user turned it off. The CSS only matches that plugin's own elements. */
export const skinOn = (skins: Record<string, boolean>, s: Skin) => skins[s.id] ?? true;
