#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const [, , input, outDirArg, maxArg] = process.argv;
if (!input || !outDirArg) {
  console.error('Usage: node scripts/zh/md/split-markdown.mjs <input.md> <outDir> [maxBytes]');
  process.exit(2);
}
const maxBytes = Number(maxArg ?? 50000);
const source = fs.readFileSync(input, 'utf8');
const rel = input.replace(/^[^/]+\//, '').replace(/[^a-zA-Z0-9._-]+/g, '-');
const outDir = path.join(outDirArg, rel);
fs.rmSync(outDir, {recursive: true, force: true});
fs.mkdirSync(outDir, {recursive: true});

const lines = source.match(/[^\n]*\n|[^\n]+$/g) ?? [];
const sections = [];
let current = [];
for (const line of lines) {
  if (/^#\s/.test(line) && current.length > 0) {
    sections.push(current.join(''));
    current = [];
  }
  current.push(line);
}
if (current.length > 0) sections.push(current.join(''));

// Split a text fragment that is itself larger than maxBytes. Prefer blank-line
// paragraph boundaries; fall back to line boundaries (for giant Markdown
// tables) and finally hard byte boundaries. Splits never duplicate content:
// concatenating all parts restores the original text exactly.
const splitOversized = (text) => {
  if (Buffer.byteLength(text) <= maxBytes) return [text];
  const paras = text.split(/(?<=\n)\n(?=\S)/);
  const out = [];
  let buf = '';
  const flush = () => { if (buf) { out.push(buf); buf = ''; } };
  for (const para of paras) {
    if (Buffer.byteLength(para) <= maxBytes) {
      if (buf && Buffer.byteLength(buf + para) > maxBytes) flush();
      buf += para;
      continue;
    }
    flush();
    const lines = para.match(/[^\n]*\n|[^\n]+$/g) ?? [];
    let lineBuf = '';
    for (const line of lines) {
      if (Buffer.byteLength(line) > maxBytes) {
        if (lineBuf) { out.push(lineBuf); lineBuf = ''; }
        let rest = line;
        while (Buffer.byteLength(rest) > maxBytes) {
          let cut = maxBytes;
          while (cut > 1 && Buffer.byteLength(rest.slice(0, cut)) > maxBytes) cut -= 1;
          out.push(rest.slice(0, cut));
          rest = rest.slice(cut);
        }
        lineBuf = rest;
        continue;
      }
      if (lineBuf && Buffer.byteLength(lineBuf + line) > maxBytes) {
        out.push(lineBuf);
        lineBuf = '';
      }
      lineBuf += line;
    }
    if (lineBuf) out.push(lineBuf);
  }
  flush();
  return out;
};

const chunks = [];
let buf = '';
for (const section of sections) {
  if (buf.length > 0 && Buffer.byteLength(buf + section) > maxBytes) {
    chunks.push(buf);
    buf = '';
  }
  for (const piece of splitOversized(section)) {
    if (buf.length > 0 && Buffer.byteLength(buf + piece) > maxBytes) {
      chunks.push(buf); buf = '';
    }
    buf += piece;
  }
}
if (buf.length > 0) chunks.push(buf);

const parts = [];
chunks.forEach((text, i) => {
  const name = `part-${String(i + 1).padStart(3, '0')}.md`;
  fs.writeFileSync(path.join(outDir, name), text);
  parts.push({file: path.join(outDir, name), bytes: Buffer.byteLength(text)});
});
const manifest = {source: input, outDir, maxBytes, parts};
fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify({source: input, parts: parts.length, maxBytes, outDir}));
