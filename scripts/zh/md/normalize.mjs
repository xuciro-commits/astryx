/**
 * Repair the machine-read prefixes of claim definitions in a translation.
 *
 * Translators like to turn the single em dash of `- **FR5 — text**` into a
 * doubled `——`, into a hyphen, or to drop the surrounding spaces — and they
 * also swap an ASCII hyphen source for an em dash. The knowledge checker parses
 * those markers, so they must keep the source's exact shape.
 *
 * `alignClaimMarkers(source, translated)` walks both texts and, for the nth
 * claim marker of each, rewrites the translated line's id and separator to the
 * source's. The text after the separator is untouched. A marker with no
 * separator at all is left alone: that is a real structural loss the gate must
 * keep reporting, not something a normalizer should invent.
 */
const BULLET = /^(\s*[-*]\s+\*\*[A-Z][A-Z0-9]*-?[0-9]+[a-z]?)\s*([—–-]{1,3})\s*/;
const HEADING = /^(#{2,6}\s+[A-Z][A-Z0-9]*-?[0-9]+[a-z]?)\s*([—–-]{1,3})\s*/;

function markers(text) {
  const found = [];
  let fence = null;
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const fenceMatch = /^\s*(```+|~~~+)/.exec(line);
    if (fenceMatch) {
      if (!fence) fence = fenceMatch[1];
      else if (fenceMatch[1][0] === fence[0]) fence = null;
      continue;
    }
    if (fence) continue;
    for (const pattern of [BULLET, HEADING]) {
      const match = pattern.exec(line);
      if (!match) continue;
      found.push({index: i, prefix: match[1], separator: match[2], rest: line.slice(match[0].length)});
      break;
    }
  }
  return {lines, found};
}

/** Rewrites every claim marker's separator to the source's separator. */
export function alignClaimMarkers(source, translated) {
  const sourceMarkers = markers(source).found;
  const {lines, found} = markers(translated);
  let changed = false;
  found.forEach((marker, position) => {
    const reference = sourceMarkers[position];
    if (!reference) return;
    const sameId = reference.prefix.replace(/^[-*\s]+/, '') === marker.prefix.replace(/^[-*\s]+/, '');
    if (!sameId) return;
    const rewritten = `${reference.prefix} ${reference.separator} ${marker.rest}`;
    if (rewritten !== lines[marker.index]) {
      lines[marker.index] = rewritten;
      changed = true;
    }
  });
  return changed ? lines.join('\n') : translated;
}

/** Kept for callers that have no source text: normalizes to a single em dash. */
export function normalizeClaimMarkers(text) {
  let changed = false;
  const lines = text.split('\n').map((line) => {
    for (const pattern of [BULLET, HEADING]) {
      const match = pattern.exec(line);
      if (!match) continue;
      const prefix = match[1];
      const rest = line.slice(match[0].length);
      // Never touch a line whose marker already reads exactly `ID — text`.
      if (line === `${prefix} — ${rest}`) return line;
      changed = true;
      return `${prefix} — ${rest}`;
    }
    return line;
  });
  return changed ? lines.join('\n') : text;
}