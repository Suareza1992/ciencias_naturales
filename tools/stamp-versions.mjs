#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════════
// stamp-versions.mjs — cache-busting for GitHub Pages.
//
// GitHub Pages serves every file with a fixed 10-minute cache. Right after a
// deploy, a visitor could get the NEW index.html with an OLD cached
// explorer.js and the page would break. This script fixes that by adding a
// content hash to every local .js / .css / .svg reference in the HTML:
//
//     <script src="shared/explorer.js?v=3f9a1c0b"></script>
//
// When a file changes, its hash changes, so the URL changes and browsers
// fetch the new file. Unchanged files keep their URL and stay cached.
//
// Usage (from the site folder, before committing a deploy):
//     node tools/stamp-versions.mjs           → rewrite the HTML files
//     node tools/stamp-versions.mjs --check   → only report; exit 1 if stale
// No dependencies — plain Node 18+.
// ═══════════════════════════════════════════════════════════════════════════

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT  = join(dirname(fileURLToPath(import.meta.url)), '..');
const CHECK = process.argv.includes('--check');

const hashOf = file => createHash('sha256').update(readFileSync(file)).digest('hex').slice(0, 8);

// src="…" or href="…" pointing at a local .js/.css/.svg (optionally already ?v=…)
const REF = /\b(src|href)="(?!https?:|\/\/|data:|#)([^"?#]+\.(?:js|css|svg))(?:\?v=[0-9a-f]+)?"/g;

let stale = 0;
for (const name of readdirSync(ROOT).filter(f => f.endsWith('.html'))) {
  const path = join(ROOT, name);
  const html = readFileSync(path, 'utf8');
  const missing = [];
  const out = html.replace(REF, (all, attr, file) => {
    const target = join(ROOT, file);
    if (!existsSync(target)) { missing.push(file); return all; }
    return `${attr}="${file}?v=${hashOf(target)}"`;
  });
  if (missing.length) { console.error(`✗ ${name}: missing files ${missing.join(', ')}`); process.exitCode = 1; }
  if (out !== html) {
    stale++;
    if (CHECK) console.log(`• ${name} has outdated version stamps`);
    else { writeFileSync(path, out); console.log(`✓ stamped ${name}`); }
  } else console.log(`= ${name} up to date`);
}
if (CHECK && stale) { console.log('\nRun: node tools/stamp-versions.mjs'); process.exitCode = 1; }
