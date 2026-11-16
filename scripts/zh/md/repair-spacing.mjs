#!/usr/bin/env node
/**
 * Restore the blank lines between blocks in a translated Markdown page.
 *
 * The prose is already translated; this only re-separates blocks so the page
 * renders as it did in the source: headings, fenced code, tables, lists, and
 * quoted blocks each need a blank line around them, and each prose paragraph —
 * now reflowed onto a single line — needs a blank line from its neighbour.
 *
 * Usage:
 *   node scripts/zh/md/repair-spacing.mjs --check docs/architecture/cli-surface.md …
 *   node scripts/zh/md/repair-spacing.mjs --write docs/architecture/cli-surface.md …
 */
import fs from 'node:fs';

const FENCE = /^\s*(`{3,}|~{3,})/;
const HEADING = /^(#{1,6})[ \t]+/;
const TABLE = /^\s*\|/;
const LIST = /^\s*([-*+]|\d+\.)[ \t]+/;
const QUOTE = /^\s*>/;
const INDENTED_CODE = /^( {4,}|\t)/;

const classify = (line) => {
  if (line.trim() === '') return 'blank';
  if (HEADING.test(line)) return 'heading';
  if (FENCE.test(line)) return 'fence';
  if (TABLE.test(line)) return 'table';
  if (LIST.test(line)) return 'list';
  if (QUOTE.test(line)) return 'quote';
  if (/^\s*<!--/.test(line)) return 'comment';
  if (INDENTED_CODE.test(line)) return 'code';
  return 'prose';
};

/** Kinds that must never be glued to a neighbouring block. */
const BLOCK = new Set(['heading', 'fence', 'table', 'list', 'quote', 'comment', 'code']);

function repair(text) {
  const all = text.split('\n');
  // Frontmatter is YAML, not Markdown: leave it exactly as it is.
  let head = [];
  let lines = all;
  if (all[0] === '---') {
    const close = all.findIndex((line, index) => index > 0 && line === '---');
    if (close > 0) {
      head = all.slice(0, close + 1);
      lines = all.slice(close + 1);
    }
  }
  const out = [];
  let fence = null;
  let previous = 'blank';
  let previousLine = '';

  for (const line of lines) {
    const kind = classify(line);
    const fenceLine = FENCE.test(line);
    const insideFence = fence !== null;

    if (!insideFence) {
      const startsBlock = BLOCK.has(kind);
      const continuesList = kind === 'list' && (previous === 'list' || previous === 'blank');
      const continuesTable = kind === 'table' && previous === 'table';
      const continuesCode = kind === 'code' && previous === 'code';
      const needsBlank =
        previous !== 'blank' &&
        (startsBlock ||
          (kind === 'prose' && previous === 'prose') ||
          (startsBlock && previous === 'prose')) &&
        !continuesList &&
        !continuesTable &&
        !continuesCode &&
        // A fence that closes is handled by its own line, not this one.
        !(fenceLine && insideFence);
      if (needsBlank) out.push('');
    }

    out.push(line);
    if (fenceLine) {
      if (fence === null) fence = FENCE.exec(line)[1][0];
      else if (FENCE.exec(line)[1][0] === fence) {
        fence = null;
        // A blank line after the closing fence, unless the input has one already.
        out.push('');
        previous = 'blank';
        previousLine = '';
        continue;
      }
    }
    previous = kind;
    previousLine = line;
  }

  // Collapse the blank runs the insertion may have produced and trim the edges.
  const collapsed = [];
  for (const line of head) collapsed.push(line);
  if (head.length) collapsed.push('');
  for (const line of out) {
    if (line.trim() === '' && collapsed.length && collapsed[collapsed.length - 1].trim() === '') continue;
    collapsed.push(line);
  }
  while (collapsed.length && collapsed[0].trim() === '') collapsed.shift();
  return `${collapsed.join('\n').replace(/\n+$/, '')}\n`;
}

const args = process.argv.slice(2);
const write = args.includes('--write');
const files = args.filter((arg) => !arg.startsWith('--'));
if (files.length === 0) {
  console.error('Usage: node scripts/zh/md/repair-spacing.mjs [--write] <file…>');
  process.exit(2);
}

let changed = 0;
for (const file of files) {
  const before = fs.readFileSync(file, 'utf8');
  const after = repair(before);
  const blanksBefore = before.split('\n').filter((line) => line.trim() === '').length;
  const blanksAfter = after.split('\n').filter((line) => line.trim() === '').length;
  if (after !== before) {
    changed += 1;
    if (write) fs.writeFileSync(file, after);
  }
  console.log(`${file}: blank lines ${blanksBefore} -> ${blanksAfter}${write ? '' : ' (check only)'}`);
}
console.log(`\n${changed} of ${files.length} files changed`);