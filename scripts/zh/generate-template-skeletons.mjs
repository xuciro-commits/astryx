#!/usr/bin/env node
// Build a translation work file for page-template gallery metadata.
import * as fs from 'node:fs';
import * as path from 'node:path';
import {pathToFileURL} from 'node:url';

const ROOT = path.resolve(import.meta.dirname, '..', '..');
const PAGES = path.join(ROOT, 'packages/cli/assets/templates/pages');
const out = {};
for (const entry of fs.readdirSync(PAGES, {withFileTypes: true})) {
  if (!entry.isDirectory()) continue;
  const docPath = path.join(PAGES, entry.name, 'template.doc.mjs');
  if (!fs.existsSync(docPath)) continue;
  const mod = await import(pathToFileURL(docPath).href);
  const doc = mod.doc ?? {};
  out[entry.name] = {
    slug: entry.name,
    file: path.relative(ROOT, docPath),
    name: doc.name ?? entry.name,
    description: doc.description ?? '',
    category: doc.category ?? '',
  };
}
const target = path.join(ROOT, 'scripts/zh/templates.json');
fs.writeFileSync(target, JSON.stringify(out, null, 2) + '\n');
console.log(`wrote ${Object.keys(out).length} page-template metadata records`);
