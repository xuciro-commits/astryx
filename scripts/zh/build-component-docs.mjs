#!/usr/bin/env node
// Turn completed component translation work files into docsZh inline exports.
import * as fs from 'node:fs';
import * as path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..', '..');
const WORK = path.join(ROOT, 'scripts/zh/components');
const only = process.argv.slice(2);
const errors = [];
let written = 0;

function findObjectEnd(source, start) {
  let i = source.indexOf('{', start);
  if (i < 0) throw new Error('no object start');
  let depth = 0;
  let quote = null;
  let escaped = false;
  let lineComment = false;
  let blockComment = false;
  for (; i < source.length; i++) {
    const ch = source[i];
    const next = source[i + 1];
    if (lineComment) {
      if (ch === '\n') lineComment = false;
      continue;
    }
    if (blockComment) {
      if (ch === '*' && next === '/') { blockComment = false; i++; }
      continue;
    }
    if (quote) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '/' && next === '/') { lineComment = true; i++; continue; }
    if (ch === '/' && next === '*') { blockComment = true; i++; continue; }
    if (ch === '"' || ch === "'" || ch === '`') { quote = ch; continue; }
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return i + 1;
    }
  }
  throw new Error('unclosed object');
}

function translationFor(work) {
  const out = {
    name: work.name,
    ...(work.displayName && work.displayName !== work.name ? {displayName: work.displayName} : null),
    ...(work.description ? {description: work.description} : null),
  };
  if (work.usage) {
    const usage = {...work.usage};
    if (Array.isArray(usage.accessibility)) {
      usage.accessibility = usage.accessibility.map(item => {
        const clean = {...item};
        if (!clean.category) delete clean.category;
        if (!clean.requirement) delete clean.requirement;
        if (!Array.isArray(clean.states) || clean.states.length === 0) delete clean.states;
        return clean;
      });
    }
    out.usage = usage;
  }
  if (Array.isArray(work.props)) {
    out.propDescriptions = Object.fromEntries(
      work.props.map(p => [p.name, p.description]).filter(([, description]) => description),
    );
  }
  if (Array.isArray(work.components)) {
    out.components = work.components.map(c => ({
      name: c.name,
      description: c.description ?? '',
      ...(Array.isArray(c.props)
        ? {
            propDescriptions: Object.fromEntries(
              c.props.map(p => [p.name, p.description]).filter(([, description]) => description),
            ),
          }
        : null),
    }));
  }
  if (Array.isArray(work.params)) {
    out.paramDescriptions = Object.fromEntries(work.params.map(p => [p.name, p.description]));
  }
  if (Array.isArray(work.returns)) {
    out.returnDescriptions = Object.fromEntries(work.returns.map(r => [r.name, r.description]));
  }
  return out;
}

for (const name of fs.readdirSync(WORK).filter(n => n.endsWith('.json') && n !== 'index.json')) {
  if (only.length && !only.includes(name.replace(/\.json$/, ''))) continue;
  const work = JSON.parse(fs.readFileSync(path.join(WORK, name), 'utf8'));
  // Skip files that have not been translated yet; writing them would replace
  // an existing docsZh with English source text.
  if (!/[\u4e00-\u9fff]/.test(JSON.stringify(work))) continue;
  const sourcePath = path.join(ROOT, work.file);
  if (!fs.existsSync(sourcePath)) { errors.push(`${name}: source missing`); continue; }
  const translation = translationFor(work);
  const exportText = `export const docsZh = ${JSON.stringify(translation, null, 2)};`;
  let source = fs.readFileSync(sourcePath, 'utf8');
  const match = /export const docsZh\s*=\s*\{/.exec(source);
  if (match) {
    const start = match.index;
    const end = findObjectEnd(source, start);
    // Consume trailing semicolon if present.
    let tail = end;
    if (source[tail] === ';') tail++;
    source = source.slice(0, start) + exportText + source.slice(tail);
  } else {
    source = source.replace(/\s*$/, '\n\n' + exportText + '\n');
  }
  fs.writeFileSync(sourcePath, source);
  written++;
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
}
console.log(`wrote docsZh into ${written} component docs`);
