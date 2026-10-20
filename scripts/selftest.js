#!/usr/bin/env node
// Source checks (no Obsidian needed):
// 1. catalog classes exist where they must (theme.css or generated styles.css); @settings covered
// 2. plugin UI CSS and src/ (except picture data in backgrounds.ts) have no color literals (UI rule 1-1)
// 3. the marker class alone changes nothing
// 4. Store: re-subscribing listener does not loop
// 5. text contrast through the theme glass, every CSS background x day/night x theme color
//    (`--contrast` prints the worst ratio per background)
const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");

const root = path.join(__dirname, "..");
const theme = fs.readFileSync(path.join(root, "../../../../.obsidian/themes/Fantasy/theme.css"), "utf8");
const styles = fs.readFileSync(path.join(root, "styles.css"), "utf8");

let fail = 0;
const check = (ok, msg) => { if (!ok) { fail++; console.error("FAIL", msg); } };
global.window = { setTimeout: () => 0, clearTimeout: () => {}, matchMedia: () => ({ matches: false }) };
function loadTs(file) {
  const out = esbuild.buildSync({ entryPoints: [path.join(root, file)], bundle: true, platform: "node", format: "cjs", write: false, external: ["obsidian"] }).outputFiles[0].text;
  const mod = { exports: {} };
  new Function("module", "exports", "require", out)(mod, mod.exports, require);
  return mod.exports;
}
const { THEME_COLORS, BACKGROUNDS } = loadTs("src/catalog.ts");
const { CSS_BACKGROUNDS } = loadTs("src/backgrounds.ts");

// ---------- 1. classes ----------
check(THEME_COLORS.length === 11, `theme colors: expected 11, got ${THEME_COLORS.length}`);
for (const c of THEME_COLORS) check(new RegExp(`\\n\\.${c.cls} \\{`).test(theme), `theme.css has no .${c.cls}`);
for (const b of BACKGROUNDS.filter((b) => b.kind === "theme")) check(theme.includes(`body.${b.cls} {`), `theme.css has no ${b.cls}`);
for (const b of CSS_BACKGROUNDS) {
  check(styles.includes(`body.fantasy-easel.fantasy-easel-bg-${b.key} {`), `styles.css (generated) has no fantasy-easel-bg-${b.key}; run npm run build`);
  check(styles.includes(`--fantasy-easel-grad-${b.key}:`), `styles.css has no gradient for ${b.key}`);
  if (b.motion) check(styles.includes(`@keyframes fantasy-easel-${b.motion.frames}`), `styles.css has no keyframes for ${b.key}`);
  check(b.day.length > 0 && b.night.length > 0, `${b.key}: day and night pictures`);
  // known invalid CSS: a circle radius must be a length (circle 30% makes the whole value invalid)
  for (const l of [...b.day, ...b.night]) check(!/circle [\d.]+%/.test(l), `${b.key}: "circle N%" is invalid CSS, use "ellipse X% Y%"`);
}
check(new Set(BACKGROUNDS.map((b) => b.id)).size === BACKGROUNDS.length, "background ids are unique");
const settings = theme.slice(theme.indexOf("/* @settings"), theme.indexOf("*/", theme.indexOf("/* @settings")));
const values = [...settings.matchAll(/value: (fantasy-theme-[A-Za-z0-9-]+)/g)].map((m) => m[1]);
for (const v of values) check(BACKGROUNDS.some((b) => b.cls === v) || THEME_COLORS.some((c) => c.cls === v), `@settings value ${v} not in catalog`);
for (const id of ["fantasy-theme-accent", "fantasy-theme-card-off", "background-url1", "background-url2", "background-url3"]) check(settings.includes(`id: ${id}`), `@settings has no ${id}`);

// ---------- 2. color literals ----------
const lit = /#[0-9a-fA-F]{3,8}\b|\brgba?\(/;
check(styles.includes("/* ---------- 2."), "styles.css has no UI section marker");
check(!lit.test(styles.slice(styles.indexOf("/* ---------- 2."))), "styles.css UI section has a color literal");
for (const f of fs.readdirSync(path.join(root, "src"))) {
  if (f === "backgrounds.ts") continue; // picture data, not UI chrome
  check(!lit.test(fs.readFileSync(path.join(root, "src", f), "utf8")), `src/${f} has a color literal`);
}

// ---------- 3. marker class alone changes nothing ----------
const bgPart = styles.slice(0, styles.indexOf("/* ---------- 2."));
for (const m of bgPart.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/([^{}@]+)\{([^{}]*)\}/g)) {
  const sel = m[1].trim();
  if (/^\d+%$/.test(sel) || /^(from|to)$/.test(sel)) continue;
  const decls = m[2].split(/;(?![^(]*\))/).map((d) => d.trim()).filter(Boolean);
  const gated = /fantasy-easel-(bg-|motion)/.test(sel);
  const risky = decls.filter((d) => !d.startsWith("--fantasy-easel-") || d.startsWith("--background-url"));
  check(gated || risky.length === 0, `styles.css rule "${sel.slice(0, 60)}" affects the look without a background class`);
}

// ---------- 4. store ----------
{
  const { Store } = loadTs("src/store.ts");
  const store = new Store({ look: {}, motion: "auto", statusBar: true }, async () => {});
  let calls = 0, off = null;
  const listen = () => { calls++; if (calls > 50) throw new Error("loop"); off && off(); off = store.subscribe(listen); };
  off = store.subscribe(listen);
  let ok = true;
  try { store.set({ motion: "on" }); } catch { ok = false; }
  check(ok && calls === 1, `store notify with re-subscribing listener: ${calls} calls`);
}

// ---------- 5. contrast through the glass ----------
// Worst case: text over glass over the brightest / darkest color the picture uses (blur only
// averages, so real values sit between these). Glass from theme.css: dark = theme color rgb at 0.6
// over the backdrop at brightness(0.8); light = (251,251,253) at 0.67 over brightness(1.05).
const TEXT = { night: [181, 181, 181], day: [80, 80, 80] }; // --text-normal measured in Obsidian
const hsl2rgb = (h, s, l) => { h = ((h % 360) + 360) % 360; s /= 100; l /= 100; const k = (n) => (n + h / 30) % 12; const a = s * Math.min(l, 1 - l); const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))); return [f(0) * 255, f(8) * 255, f(4) * 255]; };
const parseColors = (layer, hue) => {
  const s = layer.replace(/\{H([+-]\d+)?\}/g, (_m, off) => String(hue + (off ? Number(off) : 0)));
  const out = [];
  for (const m of s.matchAll(/hsl\(([-\d.]+) ([\d.]+)% ([\d.]+)%(?: \/ ([\d.]+))?\)|rgba?\((\d+) (\d+) (\d+)(?: \/ ([\d.]+))?\)|#([0-9a-fA-F]{6})\b/g)) {
    if (m[1] !== undefined) out.push({ rgb: hsl2rgb(+m[1], +m[2], +m[3]), a: m[4] ? +m[4] : 1 });
    else if (m[5] !== undefined) out.push({ rgb: [+m[5], +m[6], +m[7]], a: m[8] ? +m[8] : 1 });
    else out.push({ rgb: [0, 2, 4].map((i) => parseInt(m[9].slice(i, i + 2), 16)), a: 1 });
  }
  return out;
};
const lum = (c) => { const f = (v) => { v = Math.max(0, Math.min(255, v)) / 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const mix = (top, a, bottom) => top.map((v, i) => v * a + bottom[i] * (1 - a));
const themeRgb = (cls) => { const m = theme.match(new RegExp(`\\.${cls} \\{[^}]*--fantasy-background-color-rgb: (\\d+), (\\d+), (\\d+)`)); return m ? [+m[1], +m[2], +m[3]] : [30, 30, 30]; };
const themeHue = (cls) => { const m = theme.match(new RegExp(`\\.${cls} \\{[^}]*--fantasy-hue: (\\d+)`)); return m ? +m[1] : 230; };
const report = [];
for (const b of CSS_BACKGROUNDS) {
  for (const side of ["day", "night"]) {
    let worst = Infinity, at = "";
    for (const c of THEME_COLORS) {
      const hue = themeHue(c.cls);
      const layers = b[side];
      const base = parseColors(layers[layers.length - 1], hue).filter((x) => x.a === 1).map((x) => x.rgb);
      const bases = base.length ? base : [side === "day" ? [255, 255, 255] : [0, 0, 0]];
      const cands = [...bases];
      for (const l of layers.slice(0, -1)) for (const x of parseColors(l, hue)) for (const bs of bases) cands.push(mix(x.rgb, x.a, bs));
      for (const bg of cands) {
        const eff = side === "night" ? mix(themeRgb(c.cls), 0.6, bg.map((v) => v * 0.8)) : mix([251, 251, 253], 0.67, bg.map((v) => Math.min(255, v * 1.05)));
        const r = ratio(TEXT[side], eff);
        if (r < worst) { worst = r; at = c.name; }
      }
    }
    report.push(`${b.key}/${side}=${worst.toFixed(2)}`);
    check(worst >= 4.5, `contrast ${b.key} ${side}: ${worst.toFixed(2)} < 4.5 (worst with ${at})`);
  }
}
if (process.argv.includes("--contrast")) console.log(report.join("  "));

console.log(fail ? `${fail} failed` : `ok: ${THEME_COLORS.length} colors, ${BACKGROUNDS.length - CSS_BACKGROUNDS.length} theme backgrounds, ${CSS_BACKGROUNDS.length} CSS backgrounds, contrast >= 4.5`);
process.exit(fail ? 1 : 0);
