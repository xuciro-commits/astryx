#!/usr/bin/env node
/**
 * Compare a Markdown source with its Simplified Chinese translation and report
 * every structural difference a translation must not introduce.
 *
 * The record schema, the code samples, and the inline identifiers are not
 * translated, so the two files must agree on: frontmatter bytes, heading lines
 * (number, level, and English text), fenced-code lines, comment lines, link
 * targets, and the count of list/table rows. Prose is free to change.
 *
 * Usage:
 *   node scripts/zh/md/verify-translation.mjs <source.md> <translated.md>
 */
import fs from 'node:fs';
import {compare} from './compare-structure.mjs';
import {alignClaimMarkers} from './normalize.mjs';

const args = process.argv.slice(2);
const headingsIndex = args.indexOf('--headings');
const headings = headingsIndex === -1 ? 'keep' : args[headingsIndex + 1];
const [sourceArg, translatedArg] = args.filter(
  (arg, index) => !arg.startsWith('--') && (headingsIndex === -1 || index !== headingsIndex + 1),
);
if (!sourceArg || !translatedArg) {
  console.error('Usage: node scripts/zh/md/verify-translation.mjs <source.md> <translated.md>');
  process.exit(2);
}

const source = fs.readFileSync(sourceArg, 'utf8');
const problems = compare(
  source,
  alignClaimMarkers(source, fs.readFileSync(translatedArg, 'utf8')),
  {headings},
);

if (problems.length === 0) {
  console.log(`ok: ${translatedArg}`);
} else {
  console.log(`problems in ${translatedArg}:`);
  for (const problem of problems) console.log(`- ${problem}`);
  process.exitCode = 1;
}