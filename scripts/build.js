#!/usr/bin/env node
// 1. styles.css: rewrite the generated CSS-background block from src/backgrounds.ts
// 2. main.js: bundle the plugin
const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const BEGIN = "/* BEGIN generated: CSS backgrounds (src/backgrounds.ts, scripts/build.js). Do not edit. */";
const END = "/* END generated: CSS backgrounds */";

/** Load a TS module from src/ (bundled in memory). */
function loadTs(file) {
  const out = esbuild.buildSync({ entryPoints: [path.join(root, file)], bundle: true, platform: "node", format: "cjs", write: false }).outputFiles[0].text;
  const mod = { exports: {} };
  new Function("module", "exports", "require", out)(mod, mod.exports, require);
  return mod.exports;
}

/** Stage backgrounds: per-background variables (pictures per mode, slider values). */
function stageCss() {
  const { STAGES } = loadTs("src/stages.ts");
  const pic = (p) => [`--fe-base: ${p.base};`, ...p.layers.map((l, i) => `--fe-${i + 1}: ${l};`), ...(p.wave ? [`--fe-wave: ${p.wave};`] : []), `--fe-b2: ${p.b2};`, `--fe-b3: ${p.b3};`].map((l) => `\t${l}`).join("\n");
  return STAGES.map((s) => {
    const bm = s.blurMult ? s.blurMult.map((m, i) => ` --fe-bm${i + 1}: ${m};`).join("") : "";
    return [
      `.theme-dark.fantasy-easel-bg-${s.key},\n.fantasy-easel-night.fantasy-easel-bg-${s.key} {\n${pic(s.night)}\n}`,
      `.theme-light.fantasy-easel-bg-${s.key},\n.fantasy-easel-day.fantasy-easel-bg-${s.key} {\n${pic(s.day)}\n}`,
      `.fantasy-easel-bg-${s.key} { --fe-speed: ${s.speed}; --fe-morph: ${s.morph}; --fe-hue: ${s.hue}deg; --fe-blur: ${s.blur}px;${bm} }`,
    ].join("\n");
  }).join("\n\n");
}

function backgroundCss() {
  const { CSS_BACKGROUNDS, KEYFRAMES, resolveHue, motionCss } = loadTs("src/backgrounds.ts");
  const list = (layers) => layers.map((l) => `\n\t\t${resolveHue(l)}`).join(",");
  const vars = (side) => CSS_BACKGROUNDS.map((b) => {
    const lines = [`\t--fantasy-easel-grad-${b.key}:${list(b[side])};`];
    const over = b.motion && b.motion.over;
    if (over) lines.push(`\t--fantasy-easel-grad-${b.key}-b:${list(over[side])};`, `\t--fantasy-easel-blend-${b.key}: ${over.blend[side]};`);
    return lines.join("\n");
  }).join("\n");
  const pick = CSS_BACKGROUNDS.map((b) => {
    let extra = "";
    if (b.motion) extra += ` --fantasy-easel-motion: ${motionCss(b.motion)};`;
    if (b.motion && b.motion.over) extra += ` --fantasy-easel-motion-b: ${motionCss(b.motion.over)}; --fantasy-easel-layer-b: var(--fantasy-easel-grad-${b.key}-b); --fantasy-easel-blend-b: var(--fantasy-easel-blend-${b.key});`;
    return `body.fantasy-easel.fantasy-easel-bg-${b.key} { --background-url: var(--fantasy-easel-grad-${b.key});${extra} }`;
  }).join("\n");
  const used = [...new Set(CSS_BACKGROUNDS.filter((b) => b.motion).flatMap((b) => [...b.motion.parts, ...(b.motion.over ? b.motion.over.parts : [])].map((p) => p.frames)))];
  const frames = used.map((k) => `@keyframes fantasy-easel-${k} { ${KEYFRAMES[k]} }`).join("\n");
  return [
    BEGIN,
    "/* Day pictures (light mode, and gallery tiles marked day) */",
    `body.theme-light,\n.fantasy-easel-day {\n${vars("day")}\n}`,
    "",
    "/* Night pictures (dark mode, and gallery tiles marked night) */",
    `body.theme-dark,\n.fantasy-easel-night {\n${vars("night")}\n}`,
    "",
    "/* Choosing one: (0,2,1) beats the theme's body.fantasy-theme-background-* (0,1,1) */",
    pick,
    "",
    frames,
    "",
    "/* Stage backgrounds (src/stages.ts): pictures per mode and slider values. Layers: section 1-4. */",
    stageCss(),
    END,
  ].join("\n");
}

const stylesPath = path.join(root, "styles.css");
const styles = fs.readFileSync(stylesPath, "utf8");
const a = styles.indexOf(BEGIN), b = styles.indexOf(END);
if (a < 0 || b < 0) { console.error("styles.css: generated block markers not found"); process.exit(1); }
const next = styles.slice(0, a) + backgroundCss() + styles.slice(b + END.length);
if (next !== styles) fs.writeFileSync(stylesPath, next);

esbuild
  .build({ absWorkingDir: root, entryPoints: ["src/main.ts"], outfile: "main.js", bundle: true, platform: "node", format: "cjs", target: "es2020", external: ["obsidian", "electron"], loader: { ".css": "text" }, logLevel: "info" })
  .catch(() => process.exit(1));
