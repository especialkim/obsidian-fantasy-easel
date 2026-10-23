#!/usr/bin/env node
// Rewrite scripts/obsidian-vars.txt: CSS variables Obsidian's app.css defines (selftest checks
// the theme reads nothing else without a fallback). app.css comes from Obsidian's asar:
//   npx @electron/asar extract-file ~/Library/Application\ Support/obsidian/obsidian-<ver>.asar app.css
const fs = require("fs");
const path = require("path");
const [file, version = "?"] = process.argv.slice(2);
if (!file) throw new Error("usage: node scripts/obsidian-vars.js <app.css> [obsidian version]");
const names = [...new Set([...fs.readFileSync(file, "utf8").matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]))].sort();
fs.writeFileSync(path.join(__dirname, "obsidian-vars.txt"), `# CSS variables Obsidian's app.css defines (${version}). Regenerate: node scripts/obsidian-vars.js <app.css> <version>\n${names.join("\n")}\n`);
console.log(`${names.length} variables`);
