#!/usr/bin/env node
/**
 * Plan translation jobs for the record pages under docs/specs.
 *
 * Each job is one Markdown file, or one contiguous slice of a file too large to
 * translate in one pass. Slices are cut at `##` section boundaries and never
 * inside a fenced code block; a single oversized section is cut at blank lines
 * between paragraphs instead. Every byte of the source lands in exactly one
 * slice, so the slices can be concatenated back into the finished page.
 *
 * Usage:
 *   node scripts/zh/md/plan-spec-jobs.mjs [--max-bytes 45000] [--out /tmp/zh-spec]
 */
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const {isValidatedRecordPath} = require('../../../.github/scripts/knowledge-paths.cjs');

const args = process.argv.slice(2);
const argValue = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? fallback : args[index + 1];
};

const ROOT = process.cwd();
const MAX_BYTES = Number(argValue('max-bytes', 45000));
const OUT = argValue('out', '/tmp/zh-spec');
const PATHS_FILE = argValue('paths-file', null);
const HEADINGS = argValue('headings', null);
const FROM_HEAD = args.includes('--from-head');
const PREFIX = argValue('prefix', 'docs/specs/');

const all = execFileSync('git', ['ls-files', '*.md'], {cwd: ROOT, encoding: 'utf8'})
  .trim()
  .split('\n')
  .filter(Boolean);
const sources = PATHS_FILE
  ? fs.readFileSync(PATHS_FILE, 'utf8').trim().split('\n').filter(Boolean).sort()
  : all.filter((rel) => rel.startsWith(PREFIX)).sort();

const slugOf = (rel) =>
  rel.replace(/\.[a-z]+\.md$/, '').replace(/\.md$/, '').replace(/\//g, '__');

const byteLength = (s) => Buffer.byteLength(s, 'utf8');

/**
 * Cut a document into slices of at most MAX_BYTES at line boundaries, never
 * inside a fenced code block. A cut prefers the most recent line that starts a
 * `##` section or follows a blank line; without one the cut falls where the
 * slice filled up. Slices are exact line ranges, so joining them with `\n`
 * reproduces the source byte for byte.
 */
function slices(text) {
  const lines = text.split('\n');
  const parts = [];
  let start = 0;
  let size = 0;
  let fence = null;
  let goodCut = -1;
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const fenceMatch = /^\s*(`{3,}|~{3,})/.exec(line);
    if (fenceMatch) {
      if (fence === null) fence = fenceMatch[1][0];
      else if (fenceMatch[1][0] === fence) fence = null;
    }
    size += byteLength(line) + 1;
    if (fence === null) {
      if (line.trim() === '' || /^##\s/.test(lines[index + 1] ?? '')) goodCut = index + 1;
    }
    if (size >= MAX_BYTES && fence === null && index + 1 < lines.length) {
      const cut = goodCut > start + 1 ? goodCut : index + 1;
      parts.push(lines.slice(start, cut).join('\n'));
      start = cut;
      size = byteLength(lines.slice(start, index + 1).join('\n')) + 1;
      goodCut = -1;
    }
  }
  if (start < lines.length) parts.push(lines.slice(start).join('\n'));
  return parts;
}

const jobs = [];
const summaries = [];

for (const rel of sources) {
  const text = FROM_HEAD
    ? execFileSync('git', ['show', `HEAD:${rel}`], {cwd: ROOT, encoding: 'utf8'})
    : fs.readFileSync(path.join(ROOT, rel), 'utf8');
  const slug = slugOf(rel);
  const parts = byteLength(text) > MAX_BYTES ? slices(text) : [text];
  const dir = path.join(OUT, 'work', slug);
  fs.mkdirSync(dir, {recursive: true});
  const outputs = [];
  parts.forEach((part, index) => {
    const name = parts.length === 1 ? 'whole.md' : `part-${String(index + 1).padStart(3, '0')}.md`;
    const input = path.join(dir, `source-${name}`);
    fs.writeFileSync(input, part);
    const output = path.join(dir, name.replace('part-', 'zh-part-'));
    outputs.push(output);
    jobs.push({
      id: `${slug}${parts.length === 1 ? '' : `#${index + 1}`}`,
      headings: HEADINGS ?? (isValidatedRecordPath(rel) ? 'keep' : 'translate'),
      slug,
      repoPath: rel,
      part: parts.length === 1 ? 0 : index + 1,
      parts: parts.length,
      input,
      output,
      bytes: byteLength(part),
    });
  });
  summaries.push({repoPath: rel, slug, bytes: byteLength(text), parts: parts.length, outputs});
}

fs.mkdirSync(OUT, {recursive: true});
fs.writeFileSync(path.join(OUT, 'jobs.json'), JSON.stringify({jobs, files: summaries}, null, 2));

const byBytes = [...jobs].sort((a, b) => b.bytes - a.bytes);
console.log(
  JSON.stringify(
    {
      maxBytes: MAX_BYTES,
      files: summaries.length,
      parts: jobs.length,
      splitFiles: summaries.filter((s) => s.parts > 1).length,
      totalBytes: jobs.reduce((sum, job) => sum + job.bytes, 0),
      largest: byBytes.slice(0, 5).map((job) => [job.id, job.bytes]),
      out: OUT,
    },
    null,
    2,
  ),
);