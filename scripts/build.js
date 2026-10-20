#!/usr/bin/env node
const esbuild = require("esbuild");
const path = require("path");

esbuild
  .build({ absWorkingDir: path.join(__dirname, ".."), entryPoints: ["src/main.ts"], outfile: "main.js", bundle: true, platform: "node", format: "cjs", target: "es2020", external: ["obsidian", "electron"], logLevel: "info" })
  .catch(() => process.exit(1));
