export interface MatchSegment {
  text: string;
  match: boolean;
}

export function highlightMatch(text: string, query: string): MatchSegment[] {
  if (!query || !text) return [{ text, match: false }];
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const segments: MatchSegment[] = [];
  let cursor = 0;

  while (cursor < text.length) {
    const idx = lowerText.indexOf(lowerQuery, cursor);
    if (idx === -1) {
      segments.push({ text: text.slice(cursor), match: false });
      break;
    }
    if (idx > cursor) {
      segments.push({ text: text.slice(cursor, idx), match: false });
    }
    segments.push({ text: text.slice(idx, idx + query.length), match: true });
    cursor = idx + query.length;
  }

  return segments;
}