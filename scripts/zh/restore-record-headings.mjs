#!/usr/bin/env node
/**
 * Restore schema-controlled English section headings in translated knowledge
 * records. `scripts/check-knowledge.mjs` requires the exact English section
 * names and order from the record schema, so only the prose under a heading is
 * localized. This script maps the current heading lines onto the headings of the
 * committed (English) version by position and rewrites the heading text.
 *
 * Heading lines come in matching order and level between the two versions; a
 * record whose heading list does not line up is reported and left untouched.
 *
 * Two kinds of file are reverted whole rather than repaired: the record
 * templates under `docs/templates/knowledge/`, which define the section names
 * the validator compares against, and the generated agent skill, which must
 * match `renderComputerAgentText` byte for byte.
 *
 * Usage:
 *   node scripts/zh/restore-record-headings.mjs --dry-run
 *   node scripts/zh/restore-record-headings.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const {isValidatedRecordPath} = require('../../.github/scripts/knowledge-paths.cjs');

const ROOT = process.cwd();
const REVERT_PREFIXES = ['docs/templates/knowledge/'];
const REVERT_FILES = new Set(['plugins/astryx/skills/astryx/SKILL.md']);
const args = new Set(process.argv.slice(2));
const apply = args.has('--apply');
if (!apply && !args.has('--dry-run')) {
  console.error('Usage: node scripts/zh/restore-record-headings.mjs --dry-run|--apply');
  process.exit(2);
}

const git = (list) => execFileSync('git', list, {cwd: ROOT, encoding: 'utf8'});

const modified = git(['diff', '--name-only', '--diff-filter=MRC', 'HEAD'])
  .split('\n')
  .filter((name) => name.endsWith('.md'));

const HEADING = /^(#{1,6})[ \t]+(.*?)[ \t]*#*[ \t]*$/;

/**
 * Headings that sit outside fenced code blocks, with their line offsets.
 */
function headingsOf(text) {
  const lines = text.split('\n');
  const found = [];
  let fence = null;
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const fenceMatch = /^\s*(`{3,}|~{3,})/.exec(line);
    if (fenceMatch) {
      if (fence === null) fence = fenceMatch[1][0];
      else if (fenceMatch[1][0] === fence) fence = null;
      continue;
    }
    if (fence !== null) continue;
    const heading = HEADING.exec(line);
    if (heading) found.push({index: i, level: heading[1], text: heading[2]});
  }
  return {lines, found};
}

const results = {updated: [], skipped: [], unchanged: []};

const reverted = [];

for (const rel of modified) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) continue;
  const current = fs.readFileSync(full, 'utf8');
  let original;
  try {
    original = git(['show', `HEAD:${rel}`]);
  } catch {
    continue;
  }
  if (original === current) continue;
  if (
    REVERT_FILES.has(rel) ||
    REVERT_PREFIXES.some((prefix) => rel.startsWith(prefix))
  ) {
    if (apply) fs.writeFileSync(full, original);
    reverted.push(rel);
    continue;
  }
  if (!isValidatedRecordPath(rel)) continue;
  const now = headingsOf(current);
  const before = headingsOf(original);
  if (now.found.length === 0) {
    results.skipped.push(`${rel}: no headings`);
    continue;
  }
  if (now.found.length !== before.found.length) {
    results.skipped.push(
      `${rel}: heading count ${now.found.length} != ${before.found.length}`,
    );
    continue;
  }
  const mismatched = now.found
    .map((heading, i) => ({heading, source: before.found[i]}))
    .filter(({heading, source}) => heading.level !== source.level);
  if (mismatched.length > 0) {
    results.skipped.push(
      `${rel}: heading level drift at ${mismatched
        .slice(0, 3)
        .map(({heading}) => heading.index + 1)
        .join(', ')}`,
    );
    continue;
  }
  const changed = now.found.filter(
    (heading, i) => heading.text !== before.found[i].text,
  );
  if (changed.length === 0) {
    results.unchanged.push(rel);
    continue;
  }
  for (const heading of changed) {
    const source = before.found[now.found.indexOf(heading)];
    now.lines[heading.index] = `${heading.level} ${source.text}`;
  }
  if (apply) fs.writeFileSync(full, now.lines.join('\n'));
  results.updated.push({file: rel, headings: changed.length});
}

console.log(
  JSON.stringify(
    {
      mode: apply ? 'apply' : 'dry-run',
      updated: results.updated.length,
      unchanged: results.unchanged.length,
      reverted,
      skipped: results.skipped,
      files: results.updated,
    },
    null,
    2,
  ),
);