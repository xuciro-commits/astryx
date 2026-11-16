#!/usr/bin/env node
/**
 * Apply translated Markdown files produced by the /tmp/zh-md pipeline back into
 * the repository. Each job's input may be a repository Markdown file or a chunk
 * produced by split-markdown.mjs; chunked jobs are reassembled from the split
 * manifest before writing.
 *
 * Usage:
 *   node scripts/zh/md/apply-translations.mjs --dry-run
 *   node scripts/zh/md/apply-translations.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const args = new Set(process.argv.slice(2));
const apply = args.has('--apply');
if (!apply && !args.has('--dry-run')) {
  console.error('Usage: node scripts/zh/md/apply-translations.mjs --dry-run|--apply');
  process.exit(2);
}

const batchDirs = ['/tmp/zh-md/file-batches', '/tmp/zh-md/docs-batches', '/tmp/zh-md/remaining-batches'];
const jobs = [];
const changelogJobs = JSON.parse(fs.readFileSync('/tmp/zh-md/jobs/changelogs.json', 'utf8'));
jobs.push(...changelogJobs);
for (const batchDir of batchDirs) {
  for (const name of fs.readdirSync(batchDir).filter((f) => /^batch-\d+\.json$/.test(f)).sort()) {
    jobs.push(...JSON.parse(fs.readFileSync(path.join(batchDir, name), 'utf8')));
  }
}

const fenceCount = (text) => (text.match(/^\s*```/gm) ?? []).length;
const missing = [];
const changed = [];
const skipped = [];
const seenSplitDirs = new Set();

for (const job of jobs) {
  const inputPath = path.isAbsolute(job.input) ? job.input : path.join(ROOT, job.input);
  let sourcePath = inputPath;
  let translated;
  if (job.input.includes('/part-') && job.input.startsWith('/tmp/')) {
    const dir = path.dirname(job.input);
    if (seenSplitDirs.has(dir)) continue;
    seenSplitDirs.add(dir);
    const manifestPath = path.join(dir, 'manifest.json');
    if (!fs.existsSync(manifestPath)) {
      missing.push(`${job.input}: missing split manifest ${manifestPath}`);
      continue;
    }
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    sourcePath = path.join(ROOT, manifest.source);
    const parts = [];
    let ok = true;
    for (const part of manifest.parts) {
      const out = path.join(dir, 'translated', path.basename(part.file));
      if (!fs.existsSync(out)) { missing.push(`${out}: missing translated chunk`); ok = false; break; }
      parts.push(fs.readFileSync(out, 'utf8'));
    }
    if (!ok) continue;
    translated = parts.join('');
  } else {
    if (!fs.existsSync(job.output)) { missing.push(`${job.output}: missing translated file`); continue; }
    translated = fs.readFileSync(job.output, 'utf8');
  }

  if (!translated.trim()) { missing.push(`${job.output}: empty translation`); continue; }
  if (!fs.existsSync(sourcePath)) { missing.push(`${sourcePath}: missing source`); continue; }
  const source = fs.readFileSync(sourcePath, 'utf8');
  if (fenceCount(source) !== fenceCount(translated)) {
    missing.push(`${sourcePath}: code fence count ${fenceCount(source)} != ${fenceCount(translated)}`);
    continue;
  }
  if (source === translated) skipped.push(sourcePath);
  else changed.push({ sourcePath, translated, bytes: Buffer.byteLength(translated) });
}

console.log(`jobs=${jobs.length} changed=${changed.length} skipped=${skipped.length} missing=${missing.length}`);
for (const item of changed) console.log(`WRITE ${path.relative(ROOT, item.sourcePath)} (${item.bytes} B)`);
for (const item of skipped) console.log(`SKIP  ${path.relative(ROOT, item)} (unchanged)`);
if (missing.length) {
  console.error('\nMissing or invalid translations:');
  for (const item of missing) console.error(`  ${item}`);
  process.exit(1);
}
if (apply) {
  for (const item of changed) fs.writeFileSync(item.sourcePath, item.translated);
  console.log(`\nApplied ${changed.length} translated Markdown files.`);
}
