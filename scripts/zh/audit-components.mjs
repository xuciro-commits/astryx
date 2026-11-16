#!/usr/bin/env node
import * as fs from 'node:fs';
import * as path from 'node:path';
import {pathToFileURL} from 'node:url';
import {loadComponentDoc} from '../../packages/cli/foundation/discovery/component-loader.mjs';

const ROOT = path.resolve(import.meta.dirname, '..', '..');
const roots = ['packages/core/src', 'packages/lab/src', 'packages/richtext/src', 'packages/vega/src', 'packages/charts/src'];
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
const stats = {total: 0, noZh: 0, usageMissing: 0, propMissing: 0, anyMissing: 0};
const rows = [];
for (const file of files.sort()) {
  stats.total++;
  let base, zh;
  try {
    base = await loadComponentDoc(file);
  } catch (e) { rows.push({file: path.relative(ROOT,file), error: String(e).slice(0,100)}); continue; }
  try {
    zh = await loadComponentDoc(file, {lang: 'zh'});
  } catch (e) { rows.push({file: path.relative(ROOT,file), error: 'zh: '+String(e).slice(0,100)}); continue; }
  const source = fs.readFileSync(file, 'utf8');
  const hasZh = /export const docsZh\s*=/.test(source);
  if (!hasZh) stats.noZh++;
  const missing = [];
  if (base.usage?.description && !zh.usage?.description) missing.push('usage');
  if (base.usage?.description && zh.usage?.description === base.usage.description) missing.push('usage-same');
  const bp = base.props ?? [];
  for (const p of bp) {
    const zp = (zh.props ?? []).find(x => x.name === p.name);
    if (!zp?.description || zp.description === p.description) missing.push(`prop:${p.name}`);
  }
  for (const bc of base.components ?? []) {
    const zc = (zh.components ?? []).find(x => x.name === bc.name);
    if (bc.description && (!zc?.description || zc.description === bc.description)) missing.push(`component:${bc.name}`);
    for (const p of bc.props ?? []) {
      const zp = (zc?.props ?? []).find(x => x.name === p.name);
      if (!zp?.description || zp.description === p.description) missing.push(`${bc.name}.prop:${p.name}`);
    }
  }
  if (missing.some(m => m === 'usage' || m === 'usage-same')) stats.usageMissing++;
  const pm = missing.filter(m => m.includes('.prop:') || m.startsWith('prop:')).length;
  if (pm) stats.propMissing += pm;
  if (missing.length) { stats.anyMissing++; rows.push({file: path.relative(ROOT,file), noZh: !hasZh, missing}); }
}
console.log(JSON.stringify(stats, null, 2));
fs.writeFileSync(path.join(ROOT, 'scripts/zh/component-audit.json'), JSON.stringify(rows, null, 2));
console.log('rows', rows.length, 'written scripts/zh/component-audit.json');
