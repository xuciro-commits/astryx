/**
 * Restore the structure of translated `docsZh` exports.
 *
 * The component-doc translation replaced each `docsZh` with a flattened,
 * descriptions-only object: `props` became a `propDescriptions` map, and
 * `theming`, `displayName`, `isHiddenFromOverview` disappeared. The CLI reads
 * `docsZh` as a ComponentDoc overlay, and the repo tests require the `props`
 * array to exist, so the flattened shape regresses both.
 *
 * This rebuilds every translated export in the shape of the English base doc
 * (`docs`) while keeping the translated strings already in `docsZh`. Where the
 * base doc has no entry (a component that never had one), the existing keys are
 * left alone.
 *
 * Usage:
 *   node scripts/zh/md/repair-docszh.mjs            # report only
 *   node scripts/zh/md/repair-docszh.mjs --write    # rewrite the files
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';



const WRITE = process.argv.includes('--write');
const ROOT = execFileSync('git', ['rev-parse', '--show-toplevel'], {encoding: 'utf8'}).trim();
const CJK = /[\u3400-\u9fff]/;

const acornPath = fs
  .readdirSync(path.join(ROOT, 'node_modules/.pnpm'))
  .filter((entry) => /^acorn@/.test(entry))
  .sort()
  .at(-1);
const acorn = await import(
  pathToFileURL(path.join(ROOT, 'node_modules/.pnpm', acornPath, 'node_modules/acorn/dist/acorn.mjs')).href
);

const isPlainObject = (v) =>
  v !== null && typeof v === 'object' && !Array.isArray(v) &&
  Object.getPrototypeOf(v) === Object.prototype;

/** Prefer a string that carries Chinese; else the newer one. */
function pickString(base, overlay) {
  if (typeof overlay !== 'string' || overlay.length === 0) return base;
  if (typeof base !== 'string') return overlay;
  if (CJK.test(base) && !CJK.test(overlay)) return base;
  return overlay;
}

/**
 * Merge a translated overlay onto the structural base: the shape comes from
 * `base`, the words from `overlay`. Arrays merge elementwise when their lengths
 * agree, otherwise the overlay wins (it was written against this document).
 */
function merge(base, overlay) {
  if (overlay === undefined) return base;
  if (base === undefined) return overlay;
  if (typeof overlay === 'string') return pickString(base, overlay);
  if (Array.isArray(base) && Array.isArray(overlay)) {
    if (base.length !== overlay.length) return overlay;
    return base.map((item, i) => merge(item, overlay[i]));
  }
  if (isPlainObject(base) && isPlainObject(overlay)) {
    const out = {};
    for (const key of Object.keys(base)) out[key] = merge(base[key], overlay[key]);
    for (const key of Object.keys(overlay)) if (!(key in out)) out[key] = overlay[key];
    return out;
  }
  return overlay ?? base;
}

/** `props` keeps the base entry's type/default and takes the translated text. */
function mergeProps(baseProps, zh) {
  if (!Array.isArray(baseProps)) return zh.props ?? undefined;
  const byName = new Map((zh.props ?? []).map((p) => [p.name, p]));
  const descriptions = zh.propDescriptions ?? {};
  return baseProps.map((prop) => {
    const translated = byName.get(prop.name) ?? {};
    const description =
      typeof descriptions[prop.name] === 'string'
        ? descriptions[prop.name]
        : merge(prop.description, translated.description);
    return {...prop, ...translated, description};
  });
}

/** `params`/`returns` mirror `propDescriptions`/`returnDescriptions`. */
function mergeParams(baseParams, zh) {
  if (!Array.isArray(baseParams)) return zh.params ?? undefined;
  const descriptions = zh.paramDescriptions ?? {};
  return baseParams.map((param) => {
    const description = descriptions[param.name] ?? param.description;
    return {...param, description};
  });
}

function rebuildZh(base, zh) {
  if (!base) return zh;
  const next = merge(base, zh);
  if (Array.isArray(base.props)) next.props = mergeProps(base.props, zh);
  if (Array.isArray(base.params)) next.params = mergeParams(base.params, zh);
  if (Array.isArray(base.returns) && zh.returnDescriptions) {
    next.returns = (base.returns ?? []).map((entry) => {
      const description = zh.returnDescriptions[entry.name] ?? entry.description;
      return {...entry, description};
    });
  }
  return next;
}

/** Locate `export const docsZh = …` so only that declaration is replaced. */
function findExport(source) {
  const ast = acorn.parse(source, {ecmaVersion: 'latest', sourceType: 'module'});
  for (const node of ast.body) {
    if (node.type !== 'ExportNamedDeclaration') continue;
    const decl = node.declaration;
    if (decl?.type !== 'VariableDeclaration') continue;
    if (decl.declarations.some((d) => d.id?.name === 'docsZh')) return node;
  }
  return null;
}

function serialize(value) {
  return JSON.stringify(value, null, 2);
}

async function main() {
  const changed = execFileSync('git', ['diff', '--name-only', '--', 'packages/core/src/**/*.doc.mjs'], {
    cwd: ROOT,
    encoding: 'utf8',
  })
    .split('\n')
    .filter(Boolean);

  const tmpdir = fs.mkdtempSync(path.join(os.tmpdir(), 'docszh-'));
  const report = {files: changed.length, rebuilt: 0, unchanged: 0, problems: []};

  for (const rel of changed) {
    const file = path.join(ROOT, rel);
    const source = fs.readFileSync(file, 'utf8');
    let mod;
    try {
      mod = await import(pathToFileURL(file).href);
    } catch (error) {
      report.problems.push(`${rel}: import failed: ${error.message}`);
      continue;
    }
    const zh = mod.docsZh;
    if (!zh) continue;
    // The committed `docsZh` is the structural base: it is already a
    // ComponentDoc, while the working-tree translation flattened it.
    let head;
    try {
      const headPath = path.join(tmpdir, rel.replace(/\//g, '__'));
      if (!fs.existsSync(headPath)) {
        headPath.endsWith('.mjs') &&
          fs.writeFileSync(headPath, execFileSync('git', ['show', `HEAD:${rel}`], {cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024}));
      }
      head = (await import(pathToFileURL(headPath).href)).docsZh;
    } catch {
      head = undefined;
    }
    if (!head) {
      report.unchanged += 1;
      continue;
    }
    const base = head;
    const next = rebuildZh(base, zh);
    if (JSON.stringify(next) === JSON.stringify(zh)) {
      report.unchanged += 1;
      continue;
    }

    const node = findExport(source);
    if (!node) {
      report.problems.push(`${rel}: no docsZh export found in source`);
      continue;
    }
    const replacement = `export const docsZh = ${serialize(next)};\n`;
    const updated = source.slice(0, node.start) + replacement + source.slice(node.end + 1);
    if (WRITE) fs.writeFileSync(file, updated);
    report.rebuilt += 1;
  }

  fs.rmSync(tmpdir, {recursive: true, force: true});
  console.log(JSON.stringify(report, null, 2));
}

await main();