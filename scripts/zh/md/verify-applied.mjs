#!/usr/bin/env node
/**
 * Re-check every file already written back from a translation plan.
 *
 * The source is the concatenation of the plan's input slices (the English
 * text the translators were given), the translation is the file now in the
 * repository, so this catches anything the write step itself got wrong.
 *
 * Usage: node scripts/zh/md/verify-applied.mjs [--out /tmp/zh-spec]
 */
import fs from 'node:fs';
import path from 'node:path';
import {compare} from './compare-structure.mjs';

const args = process.argv.slice(2);
const index = args.indexOf('--out');
const OUT = index === -1 ? '/tmp/zh-spec' : args[index + 1];

const plan = JSON.parse(fs.readFileSync(path.join(OUT, 'jobs.json'), 'utf8'));
const bySlug = new Map();
for (const job of plan.jobs) {
  if (!bySlug.has(job.slug)) bySlug.set(job.slug, []);
  bySlug.get(job.slug).push(job);
}

const failures = [];
let checked = 0;
for (const file of plan.files) {
  const jobs = bySlug.get(file.slug).sort((a, b) => a.part - b.part);
  const source = jobs.map((job) => fs.readFileSync(job.input, 'utf8')).join('\n');
  const translated = fs.readFileSync(path.join(process.cwd(), file.repoPath), 'utf8');
  const problems = compare(source, translated, {
    headings: jobs[0].headings ?? 'keep',
    paragraphs: !plan.looseParagraphs,
  });
  checked += 1;
  if (problems.length > 0) failures.push({repoPath: file.repoPath, problems});
}

console.log(JSON.stringify({checked, failed: failures.length, failures: failures.slice(0, 40)}, null, 2));
