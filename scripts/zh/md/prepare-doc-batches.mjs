#!/usr/bin/env node
/**
 * Build translation work items for every Markdown file under docs/ except
 * docs/specs/ (handled separately). Large files are split into ~45 KB chunks
 * with split-markdown.mjs; small files are single jobs.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = process.cwd();
const OUT = '/tmp/zh-md/docs-files';
const SPLIT = '/tmp/zh-md/docs-split';
const BATCH = '/tmp/zh-md/docs-batches';
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(SPLIT, { recursive: true });
fs.mkdirSync(BATCH, { recursive: true });

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(full) : entry.name.endsWith('.md') ? [full] : [];
});
const files = walk(path.join(ROOT, 'docs')).filter((file) => !file.includes('/docs/specs/'));

const jobs = [];
for (const file of files.sort()) {
  const rel = path.relative(ROOT, file);
  const size = fs.statSync(file).size;
  if (size <= 45000) {
    const out = path.join(OUT, rel.replaceAll('/', '__'), 'translated', 'whole.md');
    jobs.push({ input: rel, output: out, bytes: size });
  } else {
    const splitDir = path.join(SPLIT, rel.replaceAll('/', '__'));
    const info = JSON.parse(execFileSync(process.execPath, ['scripts/zh/md/split-markdown.mjs', rel, splitDir, '45000'], { cwd: ROOT, encoding: 'utf8' }));
    const manifest = JSON.parse(fs.readFileSync(path.join(info.outDir, 'manifest.json'), 'utf8'));
    for (const part of manifest.parts) {
      jobs.push({ input: part.file, output: path.join(manifest.outDir, 'translated', path.basename(part.file)), bytes: part.bytes });
    }
  }
}

// Greedy bin packing, at most 3 jobs per batch and <= 110 KB of source text.
const batches = [];
let current = [];
let currentBytes = 0;
for (const job of jobs.sort((a, b) => b.bytes - a.bytes)) {
  if (current.length >= 3 || currentBytes + job.bytes > 110000) {
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
