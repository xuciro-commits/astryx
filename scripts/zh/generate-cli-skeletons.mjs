#!/usr/bin/env node
// Build translation work files from the authored CLI docs.
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
    return {
      i,
      type: 'table',
      headers: block.headers ?? [],
      rows: block.rows ?? [],
    };
  if (block.type === 'heading') return {i, type: 'heading', text: block.text ?? ''};
  if (block.type === 'code' && block.label)
    return {i, type: 'code', label: block.label};
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

fs.mkdirSync(OUT, {recursive: true});
let count = 0;
for (const file of files.sort()) {
  const rel = path.relative(DOCS, file);
  const topic = rel.replace(/\.doc\.mjs$/, '').replaceAll('/', '-');
  const mod = await import(pathToFileURL(file).href);
  const doc = mod.docs;
  if (!doc) continue;
  const work = {
    topic,
    source: path.relative(ROOT, file),
    title: doc.title ?? '',
    description: doc.description ?? '',
    sections: (doc.sections ?? []).map(section => ({
      section: section.title ?? '',
      title: '',
      blockCount: (section.content ?? []).length,
      blocks: (section.content ?? [])
        .map(blockSkeleton)
        .filter(Boolean),
    })),
  };
  fs.writeFileSync(path.join(OUT, `${topic}.json`), JSON.stringify(work, null, 2) + '\n');
  count++;
}
console.log(`wrote ${count} skeletons to ${path.relative(ROOT, OUT)}`);
