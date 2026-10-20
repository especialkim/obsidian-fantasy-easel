#!/usr/bin/env node
// Source checks (no Obsidian needed):
// 1. every class in src/catalog.ts exists where it must (theme.css or styles.css)
// 2. every theme `@settings` option is covered by the catalog
// 3. plugin UI CSS (section 2 of styles.css) and src/ have no color literals (plugin UI rule 1-1)
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const themePath = path.join(root, "../../../../.obsidian/themes/Fantasy/theme.css");
const theme = fs.readFileSync(themePath, "utf8");
const styles = fs.readFileSync(path.join(root, "styles.css"), "utf8");
const catalog = fs.readFileSync(path.join(root, "src/catalog.ts"), "utf8");

let fail = 0;
const check = (ok, msg) => { if (!ok) { fail++; console.error("FAIL", msg); } };

const colorCls = [...catalog.matchAll(/cls: "(fantasy-theme-[A-Za-z]+)"/g)].map((m) => m[1]);
const themeBg = [...catalog.matchAll(/themeBg\("([a-z0-9]+)"/g)].map((m) => m[1]);
const cssBg = [...catalog.matchAll(/cssBg\("([a-z0-9-]+)", "[^"]+", "(static|motion)"\)/g)].map((m) => ({ key: m[1], kind: m[2] }));

check(colorCls.length === 11, `theme colors: expected 11, got ${colorCls.length}`);
for (const c of colorCls) check(new RegExp(`\\n\\.${c} \\{`).test(theme), `theme.css has no .${c}`);
for (const b of themeBg) check(theme.includes(`body.fantasy-theme-background-${b} {`), `theme.css has no background ${b}`);
for (const b of cssBg) check(styles.includes(`.fantasy-easel-bg-${b.key} {`), `styles.css has no .fantasy-easel-bg-${b.key}`);
for (const b of cssBg.filter((b) => b.kind === "motion")) check(styles.includes(`@keyframes fantasy-easel-${b.key}`), `styles.css has no keyframes for motion ${b.key}`);

// @settings options
const settings = theme.slice(theme.indexOf("/* @settings"), theme.indexOf("*/", theme.indexOf("/* @settings")));
const values = [...settings.matchAll(/value: (fantasy-theme-[A-Za-z0-9-]+)/g)].map((m) => m[1]);
for (const v of values) {
  if (v.startsWith("fantasy-theme-background-")) check(themeBg.includes(v.replace("fantasy-theme-background-", "")), `@settings background ${v} not in catalog`);
  else check(colorCls.includes(v), `@settings color ${v} not in catalog`);
}
check(values.length === 20, `@settings options: expected 20, got ${values.length}`);
for (const id of ["fantasy-theme-accent", "fantasy-theme-card-layout", "background-url1", "background-url2", "background-url3"]) check(settings.includes(`id: ${id}`), `@settings has no ${id}`);

// color literals
const lit = /#[0-9a-fA-F]{3,8}\b|\brgba?\(/;
const ui = styles.slice(styles.indexOf("/* ---------- 2."));
check(styles.includes("/* ---------- 2."), "styles.css has no UI section marker");
check(!lit.test(ui), "styles.css UI section has a color literal");
for (const f of fs.readdirSync(path.join(root, "src"))) {
  const src = fs.readFileSync(path.join(root, "src", f), "utf8");
  check(!lit.test(src), `src/${f} has a color literal`);
}

// 4. the marker class alone changes nothing: rules with real declarations (or --background-url)
//    must require a background / motion class; body-wide rules may only define Easel variables.
const bgPart = styles.slice(0, styles.indexOf("/* ---------- 2."));
for (const m of bgPart.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/([^{}@]+)\{([^{}]*)\}/g)) {
  const sel = m[1].trim();
  const decls = m[2].split(";").map((d) => d.trim()).filter(Boolean);
  if (/^\d+%$/.test(sel)) continue; // keyframe steps
  const gated = /fantasy-easel-(bg-|motion)/.test(sel);
  const risky = decls.filter((d) => !d.startsWith("--fantasy-easel-") || d.startsWith("--background-url"));
  check(gated || risky.length === 0, `styles.css rule "${sel.slice(0, 60)}" affects the look without a background class`);
}

console.log(fail ? `${fail} failed` : `ok: ${colorCls.length} colors, ${themeBg.length} theme backgrounds, ${cssBg.length} CSS backgrounds`);
process.exit(fail ? 1 : 0);
