#!/usr/bin/env node
/**
 * Build translation work items for the remaining Markdown groups:
 * .changeset, .github, .claude, scripts, plugins.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const OUT = '/tmp/zh-md/remaining-files';
const BATCH = '/tmp/zh-md/remaining-batches';
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(BATCH, { recursive: true });

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(full) : entry.name.endsWith('.md') ? [full] : [];
});

const groups = ['.changeset', '.github', '.claude', 'scripts', 'plugins'];
const files = groups.flatMap((group) => walk(path.join(ROOT, group)));

const jobs = files.sort().map((file) => {
  const rel = path.relative(ROOT, file);
  return {
    input: rel,
    output: path.join(OUT, rel.replaceAll('/', '__'), 'translated', 'whole.md'),
    bytes: fs.statSync(file).size,
  };
});

// Greedy bin packing: at most 20 jobs per batch, <= 30 KB of source text.
const batches = [];
let current = [];
let currentBytes = 0;
for (const job of jobs.sort((a, b) => b.bytes - a.bytes)) {
  if (current.length >= 20 || (current.length > 0 && currentBytes + job.bytes > 30000)) {
    batches.push(current);
    current = [];
    currentBytes = 0;
  }
  current.push(job);
  currentBytes += job.bytes;
}
if (current.length) batches.push(current);
for (const file of fs.readdirSync(BATCH)) fs.unlinkSync(path.join(BATCH, file));
batches.forEach((batch, i) => {
  const name = `batch-${String(i + 1).padStart(2, '0')}.json`;
  fs.writeFileSync(path.join(BATCH, name), JSON.stringify(batch, null, 2) + '\n');
});
console.log(JSON.stringify({ files: files.length, jobs: jobs.length, batches: batches.length, bytes: jobs.reduce((n, j) => n + j.bytes, 0) }, null, 2));
