#!/usr/bin/env node
// Add namespace-level copy (summary, slots, blocks) to the existing CLI translation work files.
import * as fs from 'node:fs';
import * as path from 'node:path';
import {pathToFileURL} from 'node:url';

const ROOT = path.resolve(import.meta.dirname, '..', '..');
const DOCS = path.join(ROOT, 'packages/cli/assets/docs');
const OUT = path.join(ROOT, 'scripts/zh/cli');

function blockSkeleton(block, i) {
  if (!block || typeof block !== 'object') return null;
  if (block.type === 'prose') return {i, type: 'prose', text: block.text ?? ''};
  if (block.type === 'list') return {i, type: 'list', items: block.items ?? []};
  if (block.type === 'table')
    return {i, type: 'table', headers: block.headers ?? [], rows: block.rows ?? []};
  if (block.type === 'heading') return {i, type: 'heading', text: block.text ?? ''};
  if (block.type === 'code' && block.label) return {i, type: 'code', label: block.label};
  return null;
}

const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.doc\.mjs$/.test(entry.name) && !/\.(zh|dense)\./.test(entry.name))
      files.push(full);
  }
}
walk(DOCS);

let count = 0;
for (const file of files.sort()) {
  const rel = path.relative(DOCS, file);
  const topic = rel.replace(/\.doc\.mjs$/, '').replaceAll('/', '-');
  const mod = await import(pathToFileURL(file).href);
  const doc = mod.docs;
  if (!doc || doc.type !== 'namespace') continue;
  const workPath = path.join(OUT, `${topic}.json`);
  const work = fs.existsSync(workPath)
    ? JSON.parse(fs.readFileSync(workPath, 'utf8'))
    : {topic, source: path.relative(ROOT, file), title: doc.title ?? '', description: '', sections: []};
  work.summary = work.summary ?? doc.summary ?? '';
  work.slots = work.slots ?? Object.fromEntries(
    Object.entries(doc.slots ?? {}).map(([key, slot]) => [key, {title: slot.title ?? ''}]),
  );
  if (!Array.isArray(work.blocks) || work.blocks.length !== (doc.blocks ?? []).length) {
    work.blocks = (doc.blocks ?? []).map(blockSkeleton).filter(Boolean);
  }
  fs.writeFileSync(workPath, JSON.stringify(work, null, 2) + '\n');
  count++;
}
console.log(`updated ${count} namespace work files`);
