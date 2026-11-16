/**
 * Structural comparison between a Markdown source and its translation.
 *
 * Shared by `verify-translation.mjs` (one file at a time) and
 * `apply-spec-translations.mjs` (the whole batch), so both apply the same gate.
 */

function frontmatter(text) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(text);
  return match ? match[0] : null;
}

/**
 * Lines that must survive translation unchanged, with fence awareness so that
 * `#` inside a code sample is never read as a heading.
 */
export function structure(text) {
  const lines = text.split('\n');
  const out = {
    headings: [],
    fences: [],
    comments: [],
    links: [],
    listRows: 0,
    tableRows: 0,
    paragraphs: 0,
  };
  let fence = null;
  let previousBlank = true;
  for (const line of lines) {
    const fenceMatch = /^\s*(`{3,}|~{3,})/.exec(line);
    if (fenceMatch) {
      out.fences.push(line.trim());
      if (fence === null) fence = fenceMatch[1][0];
      else if (fenceMatch[1][0] === fence) fence = null;
      previousBlank = false;
      continue;
    }
    if (fence !== null) continue;
    const heading = /^(#{1,6})[ \t]+(.*?)[ \t]*#*[ \t]*$/.exec(line);
    if (heading) {
      out.headings.push(`${heading[1]} ${heading[2]}`);
      previousBlank = false;
      continue;
    }
    if (/^\s*<!--.*-->\s*$/.test(line)) out.comments.push(line.trim());
    for (const link of line.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) out.links.push(link[1]);
    if (/^\s*([-*+]|\d+\.)\s+/.test(line)) out.listRows += 1;
    if (/^\s*\|/.test(line)) out.tableRows += 1;
    if (line.trim() === '') previousBlank = true;
    else if (previousBlank) {
      out.paragraphs += 1;
      previousBlank = false;
    }
  }
  return out;
}

/**
 * Claim definitions the knowledge checker parses — `- **FR5 — text**` bullets and
 * `### FR5 — text` headings. The id and the separator are machine-read, so a
 * translation may only change what comes after them. Each entry is
 * `<id>\u0000<separator>`, with the separator trimmed.
 */
export function claimMarkers(text) {
  const markers = [];
  let fence = null;
  for (const line of text.split('\n')) {
    const fenceMatch = /^\s*(`{3,}|~{3,})/.exec(line);
    if (fenceMatch) {
      if (fence === null) fence = fenceMatch[1][0];
      else if (fenceMatch[1][0] === fence) fence = null;
      continue;
    }
    if (fence !== null) continue;
    const bullet = /^\s*[-*]\s+\*\*([A-Z][A-Z0-9]*-?[0-9]+[a-z]?)(\s+[—–-]{1,2})/.exec(line);
    if (bullet) {
      markers.push(`${bullet[1]}\u0000${bullet[2].trim()}`);
      continue;
    }
    const heading = /^#{2,6}\s+([A-Z][A-Z0-9]*-?[0-9]+[a-z]?)(\s+[—–-]{1,2})/.exec(line);
    if (heading) markers.push(`${heading[1]}\u0000${heading[2].trim()}`);
  }
  return markers;
}

/**
 * Problems a translation introduced; an empty array means the pair is clean.
 *
 * `headings: 'keep'` (the default) requires the English heading text to survive
 * unchanged, which the record schema demands. `headings: 'translate'` allows the
 * text to be localized as long as the number, levels, and order still match.
 */
export function compare(source, translated, {headings = 'keep', paragraphs = true} = {}) {
  const problems = [];
  if (translated.trim() === '') problems.push('translation is empty');

  if (frontmatter(source) !== frontmatter(translated)) {
    problems.push('frontmatter differs from the source');
  }

  const a = structure(source);
  const b = structure(translated);

  const level = (heading) => heading.slice(0, heading.indexOf(' '));
  if (a.headings.length !== b.headings.length) {
    problems.push(`heading count ${b.headings.length} != ${a.headings.length}`);
  } else if (headings === 'translate') {
    a.headings.forEach((heading, i) => {
      if (level(heading) !== level(b.headings[i])) {
        problems.push(`heading ${i + 1} level changed: "${heading}" became "${b.headings[i]}"`);
      }
    });
  } else {
    a.headings.forEach((heading, i) => {
      if (heading !== b.headings[i]) {
        problems.push(`heading ${i + 1} changed: "${heading}" became "${b.headings[i]}"`);
      }
    });
  }

  if (a.fences.length !== b.fences.length) {
    problems.push(`code fence lines ${b.fences.length} != ${a.fences.length}`);
  }
  if (a.comments.length !== b.comments.length) {
    problems.push(`HTML comment lines ${b.comments.length} != ${a.comments.length}`);
  }
  if (a.links.length !== b.links.length) {
    problems.push(`link count ${b.links.length} != ${a.links.length}`);
  } else {
    a.links.forEach((link, i) => {
      if (link !== b.links[i]) problems.push(`link target ${i + 1} changed: ${link} -> ${b.links[i]}`);
    });
  }
  for (const key of ['listRows', 'tableRows']) {
    if (a[key] !== b[key]) problems.push(`${key} ${b[key]} != ${a[key]}`);
  }

  const claimsA = claimMarkers(source);
  const claimsB = claimMarkers(translated);
  if (claimsA.length !== claimsB.length) {
    problems.push(`claim markers ${claimsB.length} != ${claimsA.length}`);
  } else {
    claimsA.forEach((marker, i) => {
      if (marker !== claimsB[i]) {
        problems.push(
          `claim marker ${JSON.stringify(marker.split('\u0000').join(' '))} became ${JSON.stringify(claimsB[i].split('\u0000').join(' '))}`,
        );
      }
    });
  }

  // A translation keeps prose roughly as long as the source; a large drop means
  // content was dropped, a large rise means commentary was added.
  if (paragraphs && a.paragraphs > 0) {
    const ratio = b.paragraphs / a.paragraphs;
    if (ratio < 0.8 || ratio > 1.25) {
      problems.push(`paragraph count ${b.paragraphs} is out of line with ${a.paragraphs}`);
    }
  }

  return problems;
}