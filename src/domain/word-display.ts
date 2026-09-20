import type { Morpheme, Word } from './models';

export type TextSegment = { text: string; highlighted: boolean };

function segments(text: string, ranges: { start: number; end: number }[]): TextSegment[] {
  const result: TextSegment[] = [];
  let cursor = 0;
  for (const range of ranges.sort((a, b) => a.start - b.start)) {
    if (range.start < cursor) continue;
    if (range.start > cursor) result.push({ text: text.slice(cursor, range.start), highlighted: false });
    result.push({ text: text.slice(range.start, range.end), highlighted: true });
    cursor = range.end;
  }
  if (cursor < text.length) result.push({ text: text.slice(cursor), highlighted: false });
  return result;
}

// Match complete words, including explicitly supplied inflections, never substrings.
export function sentenceSegments(text: string, word: Pick<Word, 'spelling' | 'forms'>): TextSegment[] {
  const forms = new Set([word.spelling, ...word.forms].map(form => form.toLowerCase()));
  const ranges = [...text.matchAll(/[a-z]+(?:['’-][a-z]+)*/gi)]
    .filter(match => forms.has(match[0].toLowerCase()))
    .map(match => ({ start: match.index!, end: match.index! + match[0].length }));
  return segments(text, ranges);
}

export function morphemeSegments(word: Word, morphemes: Morpheme[]): TextSegment[] {
  const spelling = word.spelling.toLowerCase();
  const ranges: { start: number; end: number }[] = [];
  for (const morpheme of morphemes) {
    if (!word.morphemes.includes(morpheme.id)) continue;
    const variants = morpheme.label.split('/').map(part => part.trim().replace(/^-|-$/g, '').toLowerCase()).sort((a, b) => b.length - a.length);
    for (const part of variants) {
      if (!part) continue;
      const start = morpheme.kind === 'prefix' ? (spelling.startsWith(part) ? 0 : -1)
        : morpheme.kind === 'suffix' ? (spelling.endsWith(part) ? spelling.length - part.length : -1)
          : spelling.indexOf(part);
      if (start < 0) continue; // Historical spelling changes must not invent a match.
      const end = start + part.length;
      if (!ranges.some(range => start < range.end && end > range.start)) ranges.push({ start, end });
      break;
    }
  }
  return segments(word.spelling, ranges);
}

export function nextFeaturedWord(pool: Word[], currentId: string, random = Math.random): Word | undefined {
  const candidates = pool.filter(word => word.id !== currentId);
  return candidates[Math.min(candidates.length - 1, Math.floor(random() * candidates.length))] ?? pool[0];
}
