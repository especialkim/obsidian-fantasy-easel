# Fantasy Easel

Companion plugin for the [Fantasy](https://github.com/especialkim/obsidian-theme-fantasy) Obsidian theme.
The theme has no Style Settings options; everything is set here.

- **Look**: palette (6: Graphite, Sky, Ocean, Emerald, Mystic, Orchid), theme accent, card layout
- **Background**: CSS backgrounds (still and moving), 19 four-layer "stage" backgrounds, your own pictures with names (a vault picture, a web address, or a file on this computer)
- **Style panel** (command "Open style panel", a sidebar tab): the main switches and 11 style sliders (glass per dark / light mode, cards, editor, stage speed), each with a reset to the default
- **Motion**: auto (follows OS reduce motion) / on / off, optional pause while Obsidian is not focused
- **Plugin skins**: Dataview, Excalidraw, Kanban. The Excalidraw skin can also set the Excalidraw options it needs (follow the Obsidian theme, no dynamic styling), only after you confirm, with Restore
- **Gallery**: every background side by side in day and night, under a glass card
- **Status bar**: palette, previous / next background, gallery, accent, cards, motion, dark / light. Choose the buttons and their order in settings

Without this plugin the theme shows the Graphite palette, the Plasma background (still) and card layout.

With any other theme the plugin stays idle (no classes, no background, no status bar) and its settings only point to the Fantasy theme. It switches on by itself when Fantasy becomes the current theme.

## Disclosures

- **Network use**: a picture you add as a web address (`https://…`) is loaded from that site. Nothing else goes over the network; the built-in backgrounds are CSS only.
- **Files outside the vault**: a picture you add as `file://…` or an absolute path is read from that place on your computer (only to show it as the background). It works only on that computer; vault pictures work wherever the vault is.

## Install (manual)

Copy `manifest.json`, `main.js` and `styles.css` into `<vault>/.obsidian/plugins/fantasy-easel/`, then turn on **Fantasy Easel** in Settings → Community plugins. Desktop only, Obsidian 1.13 or later.

## Develop

```bash
npm install
npm run check   # TypeScript
npm test        # selftest (reads the Fantasy theme at ../../../../.obsidian/themes/Fantasy/theme.css)
npm run build   # writes the generated parts of styles.css and main.js
```

- `src/backgrounds.ts`, `src/stages.ts`: background sources. `styles.css` blocks marked "generated" are written by the build.
- `skins/*.css`: plugin skins; the build puts every selector behind `body.fantasy-easel-skin-<id>`.

## License

MIT
