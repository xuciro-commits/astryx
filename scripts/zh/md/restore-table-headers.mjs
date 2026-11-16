#!/usr/bin/env node
/**
 * Restore the machine-read table headers that a translation must not touch.
 *
 * `<!-- design-decisions:v1 -->` marks a table whose columns the knowledge
 * checker parses by exact name; translating them makes the record invalid.
 *
 * Usage: node scripts/zh/md/restore-table-headers.mjs [--write] [paths...]
 */
import fs from 'node:fs';
import cp from 'node:child_process';

const HEADER = '| ID | Decision | Intent or reason | Applies to | Allowed variation |';
const MARKER = '<!-- design-decisions:v1 -->';
const WRITE = process.argv.includes('--write');
const paths = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));

const files = paths.length
  ? paths
  : cp
      .execSync('git status --porcelain docs/specs', {encoding: 'utf8'})
      .split('\n')
      .filter(Boolean)
      .map((line) => line.slice(3).trim());

let changed = 0;
for (const file of files) {
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  const marker = lines.findIndex((line) => line.trim() === MARKER);
  if (marker === -1) continue;
  let header = -1;
  for (let i = marker + 1; i < lines.length; i += 1) {
    if (lines[i].trim().startsWith('|')) {
      header = i;
      break;
    }
  }
  if (header === -1 || lines[header].trim() === HEADER) continue;
  lines[header] = HEADER;
  changed += 1;
  if (WRITE) fs.writeFileSync(file, lines.join('\n'));
  else console.log(file);
}
console.log(JSON.stringify({files: files.length, changed, write: WRITE}));
