#!/usr/bin/env node
/**
 * Collect the translated slices planned by `plan-spec-jobs.mjs`, stitch each
 * record back together in slice order, run the structural gate over the whole
 * record, and write the pages that pass into `docs/specs`.
 *
 * Records that are missing a slice or fail the gate are reported and left
 * untouched, so the batch can be re-run once the remaining slices are done.
 *
 * Usage:
 *   node scripts/zh/md/apply-spec-translations.mjs [--out /tmp/zh-spec] [--dry-run]
 */
import fs from 'node:fs';
import path from 'node:path';
import {compare} from './compare-structure.mjs';
import {alignClaimMarkers} from './normalize.mjs';

const args = process.argv.slice(2);
const argValue = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? fallback : args[index + 1];
};
const OUT = argValue('out', '/tmp/zh-spec');
const DRY = args.includes('--dry-run');

const plan = JSON.parse(fs.readFileSync(path.join(OUT, 'jobs.json'), 'utf8'));
const bySlug = new Map();
for (const job of plan.jobs) {
  if (!bySlug.has(job.slug)) bySlug.set(job.slug, []);
  bySlug.get(job.slug).push(job);
}

const ready = [];
const missing = [];
const failed = [];

for (const file of plan.files) {
  const jobs = bySlug.get(file.slug).sort((a, b) => a.part - b.part);
  const absent = jobs.filter((job) => !fs.existsSync(job.output));
  if (absent.length > 0) {
    missing.push({repoPath: file.repoPath, missing: absent.map((job) => path.basename(job.output))});
    continue;
  }
  // The slice copies under the plan's work directory are byte-exact copies of
  // the source; reading them (rather than the repo page, which a previous run
  // may already have replaced) keeps the gate honest on repeated runs.
  const source = jobs.map((job) => fs.readFileSync(job.input, 'utf8')).join('\n');
  const translated = alignClaimMarkers(
    source,
    jobs.map((job) => fs.readFileSync(job.output, 'utf8')).join('\n'),
  );
  const problems = compare(source, translated, {
    headings: jobs[0].headings ?? 'keep',
    paragraphs: !plan.looseParagraphs,
  });
  if (problems.length > 0) {
    failed.push({repoPath: file.repoPath, problems: problems.slice(0, 6)});
    continue;
  }
  ready.push({repoPath: file.repoPath, translated});
  if (!DRY) fs.writeFileSync(file.repoPath, translated);
}

console.log(
  JSON.stringify(
    {
      mode: DRY ? 'dry-run' : 'apply',
      files: plan.files.length,
      written: DRY ? 0 : ready.length,
      ready: ready.length,
      missing: missing.length,
      failed: failed.length,
      failures: [...failed, ...missing].slice(0, 400),
    },
    null,
    2,
  ),
);