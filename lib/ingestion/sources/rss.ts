export type RssItem = {
  title: string;
  link: string;
  pubDate: string | null;
  source_name: string;
};

export async function fetchRssFeed(feedUrl: string, sourceName: string): Promise<RssItem[]> {
  const res = await fetch(feedUrl, { cache: 'no-store' });
  if (!res.ok) throw new Error('RSS ' + feedUrl + ' -> ' + res.status);
  const xml = await res.text();
  const items: RssItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const title = extractTag(block, 'title');
    const link = extractTag(block, 'link');
    const pubDate = extractTag(block, 'pubDate');
    if (title && link) items.push({ title: title, link: link, pubDate: pubDate, source_name: sourceName });
  }
  return items;
}

function extractTag(block: string, tag: string): string | null {
  const pattern = new RegExp('<' + tag + '[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></' + tag + '>|<' + tag + '[^>]*>([\\s\\S]*?)</' + tag + '>');
  const m = block.match(pattern);
  return m ? (m[1] ?? m[2] ?? null) : null;
}