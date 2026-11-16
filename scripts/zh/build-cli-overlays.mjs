#!/usr/bin/env node
// Turn completed translation work files into .doc.zh.mjs overlays.
import * as fs from 'node:fs';
import * as path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..', '..');
const WORK = path.join(ROOT, 'scripts/zh/cli');
const errors = [];
let written = 0;

for (const name of fs.readdirSync(WORK).filter(n => n.endsWith('.json'))) {
  const work = JSON.parse(fs.readFileSync(path.join(WORK, name), 'utf8'));
  if (!/[\u4e00-\u9fff]/.test(JSON.stringify(work))) continue;
  const baselinePath = path.join(ROOT, 'scripts/zh/cli-baseline', name);
  const baseline = fs.existsSync(baselinePath)
    ? JSON.parse(fs.readFileSync(baselinePath, 'utf8'))
    : null;
  const outPath = path.join(ROOT, work.source.replace(/\.doc\.mjs$/, '.doc.zh.mjs'));
  if (!fs.existsSync(path.join(ROOT, work.source))) {
    errors.push(`${name}: source missing`);
    continue;
  }
  const sections = [];
  for (const [index, section] of work.sections.entries()) {
    if (section.section && !section.title) {
      errors.push(`${name}: section "${section.section}" has no Chinese title`);
      continue;
    }
    const content = Array(section.blockCount ?? 0).fill(null);
    for (const block of section.blocks ?? []) {
      if (block.i == null || block.i < 0 || block.i >= content.length) {
        errors.push(`${name}: block index ${block.i} out of range in "${section.section}"`);
        continue;
      }
      if (block.type === 'prose' && block.text)
        content[block.i] = {type: 'prose', text: block.text};
      else if (block.type === 'list' && Array.isArray(block.items) && block.items.length)
        content[block.i] = {type: 'list', items: block.items};
      else if (block.type === 'table')
        content[block.i] = {
          type: 'table',
          ...(Array.isArray(block.headers) && block.headers.length ? {headers: block.headers} : null),
          ...(Array.isArray(block.rows) && block.rows.length ? {rows: block.rows} : null),
        };
      else if (block.type === 'heading' && block.text)
        content[block.i] = {type: 'heading', text: block.text};
      else if (block.type === 'code' && block.label)
        content[block.i] = {type: 'code', label: block.label};
    }
    sections.push({
      section: section.section,
      ...(section.title ? {title: section.title} : null),
      content,
    });
  }
  const translation = {
    ...(work.title ? {title: work.title} : null),
    ...(work.description ? {description: work.description} : null),
    ...(work.summary ? {summary: work.summary} : null),
    ...(work.slots && Object.keys(work.slots).length ? {slots: work.slots} : null),
    ...(Array.isArray(work.blocks) && work.blocks.length
      ? {
          blocks: work.blocks.filter(
            block =>
              block &&
              (block.text ||
                block.items?.length ||
                block.label ||
                block.headers?.length ||
                block.rows?.length),
          ),
        }
      : null),
    sections,
  };
  fs.writeFileSync(
    outPath,
    `// Copyright (c) Meta Platforms, Inc. and affiliates.\n\n// Chinese translation overlay for ${path.basename(work.source)}.\nexport const docsZh = ${JSON.stringify(translation, null, 2)};\n`,
  );
  written++;
}
if (errors.length) {
  console.error(`\n${errors.length} issue(s):`);
  for (const error of errors.slice(0, 100)) console.error(`  ${error}`);
  process.exitCode = 1;
}
console.log(`wrote ${written} Chinese CLI doc overlays`);
