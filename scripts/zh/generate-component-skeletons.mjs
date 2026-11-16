#!/usr/bin/env node
// Build translation work files from every component/hook doc.
import * as fs from 'node:fs';
import * as path from 'node:path';
import {loadComponentDoc} from '../../packages/cli/foundation/discovery/component-loader.mjs';

const ROOT = path.resolve(import.meta.dirname, '..', '..');
const OUT = path.join(ROOT, 'scripts/zh/components');
const roots = process.argv.slice(2).filter(a => !a.startsWith('--')).length
  ? process.argv.slice(2).filter(a => !a.startsWith('--'))
  : ['packages/core/src', 'packages/lab/src', 'packages/richtext/src', 'packages/vega/src'];
const files = [];
for (const root of roots) {
  const dir = path.join(ROOT, root);
  if (!fs.existsSync(dir)) continue;
  const walk = d => {
    for (const e of fs.readdirSync(d, {withFileTypes: true})) {
      const f = path.join(d, e.name);
      if (e.isDirectory()) walk(f);
      else if (e.name.endsWith('.doc.mjs') && !/\.(zh|dense)\./.test(e.name)) files.push(f);
    }
  };
  walk(dir);
}

const text = value => (typeof value === 'string' ? value : '');
const usageSkeleton = usage => {
  if (!usage) return undefined;
  const out = {};
  if (text(usage.description)) out.description = usage.description;
  if (Array.isArray(usage.bestPractices) && usage.bestPractices.length)
    out.bestPractices = usage.bestPractices.map(p => ({
      guidance: p.guidance,
      description: text(p.description),
    }));
  if (Array.isArray(usage.accessibility) && usage.accessibility.length)
    out.accessibility = usage.accessibility.map(a => ({
      name: text(a.name),
      category: text(a.category),
      criterion: text(a.criterion),
      requirement: text(a.requirement),
      states: Array.isArray(a.states) ? a.states : [],
      description: text(a.description),
    }));
  if (Array.isArray(usage.anatomy) && usage.anatomy.length)
    out.anatomy = usage.anatomy.map(a => ({
      name: text(a.name),
      required: a.required,
      description: text(a.description),
    }));
  return Object.keys(out).length ? out : undefined;
};
const propsSkeleton = props =>
  Array.isArray(props) && props.length
    ? props.map(p => ({name: p.name, description: text(p.description)}))
    : undefined;

fs.mkdirSync(OUT, {recursive: true});
let count = 0;
const indexPath = path.join(OUT, 'index.json');
const index = fs.existsSync(indexPath)
  ? JSON.parse(fs.readFileSync(indexPath, 'utf8'))
  : [];
for (const file of files.sort()) {
  const rel = path.relative(ROOT, file);
  const slug = rel.replace(/^packages\//, '').replace(/\/src\//, '-').replace(/\.doc\.mjs$/, '').replaceAll('/', '-');
  const doc = await loadComponentDoc(file);
  const work = {
    slug,
    file: rel,
    name: doc.name ?? '',
    displayName: doc.displayName ?? doc.name ?? '',
    ...(text(doc.description) ? {description: doc.description} : null),
    ...(usageSkeleton(doc.usage) ? {usage: usageSkeleton(doc.usage)} : null),
    ...(propsSkeleton(doc.props) ? {props: propsSkeleton(doc.props)} : null),
    ...(Array.isArray(doc.components)
      ? {
          components: doc.components.map(c => ({
            name: c.name ?? '',
            ...(text(c.description) ? {description: c.description} : null),
            ...(usageSkeleton(c.usage) ? {usage: usageSkeleton(c.usage)} : null),
            ...(propsSkeleton(c.props) ? {props: propsSkeleton(c.props)} : null),
          })),
        }
      : null),
    ...(Array.isArray(doc.params)
      ? {params: doc.params.map(p => ({name: p.name, description: text(p.description)}))}
      : null),
    ...(Array.isArray(doc.returns)
      ? {returns: doc.returns.map(r => ({name: r.name, description: text(r.description)}))}
      : null),
  };
  const outPath = path.join(OUT, `${slug}.json`);
  if (fs.existsSync(outPath) && !process.argv.includes('--force')) continue;
  fs.writeFileSync(outPath, JSON.stringify(work, null, 2) + '\n');
  if (!index.some(item => item.slug === slug)) index.push({slug, file: rel});
  count++;
}
fs.writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n');
console.log(`wrote ${count} component skeletons to ${path.relative(ROOT, OUT)}`);
