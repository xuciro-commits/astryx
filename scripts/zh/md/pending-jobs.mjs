#!/usr/bin/env node
/**
 * List the jobs of a translation plan that are not done yet: the output file is
 * missing, or it exists but fails the structural gate against its source slice.
 *
 * Prints one `index` per line, ready to hand to the batch runner, plus a summary
 * on stderr.
 *
 * Usage:
 *   node scripts/zh/md/pending-jobs.mjs /tmp/zh-spec/jobs.json
 */
import fs from 'node:fs';
import {compare} from './compare-structure.mjs';
import {alignClaimMarkers} from './normalize.mjs';

const planPath = process.argv[2];
if (!planPath) {
  console.error('Usage: node scripts/zh/md/pending-jobs.mjs <jobs.json>');
  process.exit(2);
}

const plan = JSON.parse(fs.readFileSync(planPath, 'utf8'));
const pending = [];
const reasons = {missing: 0, failing: 0, done: 0};
const failures = [];

for (const [index, job] of plan.jobs.entries()) {
  if (!fs.existsSync(job.output)) {
    pending.push(index);
    reasons.missing += 1;
    continue;
  }
  const source = fs.readFileSync(job.input, 'utf8');
  const problems = compare(
    source,
    alignClaimMarkers(source, fs.readFileSync(job.output, 'utf8')),
    {headings: job.headings ?? 'keep'},
  );
  if (problems.length > 0) {
    pending.push(index);
    reasons.failing += 1;
    if (failures.length < 10) failures.push({id: job.id, problems: problems.slice(0, 3)});
  } else {
    reasons.done += 1;
  }
}

console.log(pending.join(' '));
console.error(JSON.stringify({plan: planPath, total: plan.jobs.length, ...reasons, failures}, null, 2));