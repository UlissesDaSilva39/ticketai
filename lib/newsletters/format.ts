// GRID Newsletters: shared constants and the article renderer.
// Articles are written in a small Markdown dialect. The renderer escapes ALL
// HTML first, then adds a fixed set of tags, so user text can never inject
// scripts. Embeds are built from parsed IDs for an allowlist of music players.

export const CATEGORIES = [
  { id: "releases", label: "Releases & news" },
  { id: "gig-diary", label: "Gig diary" },
  { id: "studio", label: "Studio & production tips" },
  { id: "scene", label: "Scene reports" },
  { id: "gear", label: "Gear reviews" },
  { id: "business", label: "Music business" },
  { id: "other", label: "Other" },
] as const;
export type CategoryId = (typeof CATEGORIES)[number]["id"];
export const isCategory = (v: unknown): v is CategoryId => CATEGORIES.some((c) => c.id === v);
export const categoryLabel = (id: string) => CATEGORIES.find((c) => c.id === id)?.label ?? "Other";

export const FREQUENCIES = [
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "biweekly", label: "Every two weeks" },
  { id: "monthly", label: "Monthly" },
] as const;
export type FrequencyId = (typeof FREQUENCIES)[number]["id"];
export const isFrequency = (v: unknown): v is FrequencyId => FREQUENCIES.some((f) => f.id === v);
export const frequencyLabel = (id: string) => FREQUENCIES.find((f) => f.id === id)?.label ?? "";

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

/** Music players that can be embedded by pasting a link on its own line. */
export function embedFor(url: string): { src: string; height: number; title: string } | null {
  const u = url.trim();
  let m = u.match(/^https:\/\/open\.spotify\.com\/(?:intl-[a-z]{2}\/)?(track|album|playlist|episode|show|artist)\/([A-Za-z0-9]{10,40})(?:[?#].*)?$/);
  if (m) return { src: `https://open.spotify.com/embed/${m[1]}/${m[2]}`, height: m[1] === "track" || m[1] === "episode" ? 152 : 352, title: "Spotify player" };
  m = u.match(/^https:\/\/(?:www\.|m\.)?(?:youtube\.com\/watch\?(?:.*&)?v=|youtu\.be\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{11})(?:[?&#].*)?$/);
  if (m) return { src: `https://www.youtube-nocookie.com/embed/${m[1]}`, height: 315, title: "YouTube video" };
  m = u.match(/^https:\/\/(?:www\.|m\.)?soundcloud\.com\/[A-Za-z0-9_-]+\/(?:sets\/)?[A-Za-z0-9_-]+\/?(?:[?#].*)?$/);
  if (m) {
    const clean = u.split(/[?#]/)[0];
    return { src: `https://w.soundcloud.com/player/?url=${encodeURIComponent(clean)}&color=%23059669&visual=false`, height: 166, title: "SoundCloud player" };
  }
  return null;
}

/** Bold, italic, inline code and links, applied to already-escaped text. */
function inline(escaped: string): string {
  return escaped
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer nofollow">$1</a>');
}

/** GRID Markdown to safe HTML. */
export function renderArticle(md: string): string {
  const lines = md.replace(/\r\n?/g, "\n").split("\n");
  const out: string[] = [];
  let para: string[] = [];
  let list: { type: "ul" | "ol"; items: string[] } | null = null;
  let quote: string[] = [];

  const flushPara = () => {
    if (para.length) out.push(`<p>${para.map((l) => inline(esc(l))).join("<br>")}</p>`);
    para = [];
  };
  const flushList = () => {
    if (list) out.push(`<${list.type}>${list.items.map((i) => `<li>${inline(esc(i))}</li>`).join("")}</${list.type}>`);
    list = null;
  };
  const flushQuote = () => {
    if (quote.length) out.push(`<blockquote>${quote.map((l) => inline(esc(l))).join("<br>")}</blockquote>`);
    quote = [];
  };
  const flushAll = () => {
    flushPara();
    flushList();
    flushQuote();
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    const t = line.trim();
    if (!t || /^#{1,2}$/.test(t)) {
      // Blank line, or an empty heading left by the Style menu.
      flushAll();
      continue;
    }
    const embed = embedFor(t);
    if (embed) {
      flushAll();
      out.push(
        `<figure class="grid-embed"><iframe src="${esc(embed.src)}" title="${embed.title}" height="${embed.height}" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" allowfullscreen></iframe></figure>`
      );
      continue;
    }
    let m = t.match(/^!\[([^\]]*)\]\((https:\/\/[^\s)]+)\)$/);
    if (m) {
      flushAll();
      out.push(`<figure><img src="${esc(m[2])}" alt="${esc(m[1])}" loading="lazy">${m[1] ? `<figcaption>${esc(m[1])}</figcaption>` : ""}</figure>`);
      continue;
    }
    if (/^(-{3,}|\*{3,})$/.test(t)) {
      flushAll();
      out.push("<hr>");
      continue;
    }
    m = t.match(/^(#{1,2})\s+(.+)$/);
    if (m) {
      flushAll();
      const tag = m[1].length === 1 ? "h2" : "h3";
      out.push(`<${tag}>${inline(esc(m[2]))}</${tag}>`);
      continue;
    }
    m = t.match(/^>\s?(.*)$/);
    if (m) {
      flushPara();
      flushList();
      quote.push(m[1]);
      continue;
    }
    m = t.match(/^[-*]\s+(.+)$/);
    if (m) {
      flushPara();
      flushQuote();
      if (list?.type !== "ul") {
        flushList();
        list = { type: "ul", items: [] };
      }
      list.items.push(m[1]);
      continue;
    }
    m = t.match(/^\d+[.)]\s+(.+)$/);
    if (m) {
      flushPara();
      flushQuote();
      if (list?.type !== "ol") {
        flushList();
        list = { type: "ol", items: [] };
      }
      list.items.push(m[1]);
      continue;
    }
    flushList();
    flushQuote();
    para.push(line);
  }
  flushAll();
  return out.join("\n");
}

/** Plain-text preview for cards and notifications. */
export function excerpt(md: string, max = 180): string {
  const text = md
    .split("\n")
    .filter((l) => !embedFor(l.trim()) && !/^!\[/.test(l.trim()))
    .join(" ")
    .replace(/<[^>]*>/g, "")
    .replace(/[#>*_`<]/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^\s*[-\d.)]+\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

export const readingMinutes = (md: string) => Math.max(1, Math.round(md.split(/\s+/).filter(Boolean).length / 200));
