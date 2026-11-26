"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ArticleBody from "@/components/newsletters/ArticleBody";
import { uploadImage } from "@/components/newsletters/uploadImage";
import { embedFor, excerpt, readingMinutes } from "@/lib/newsletters/format";

type Article = { id: string; newsletterId: string | null; title: string; summary: string; body: string; coverUrl: string | null; published: boolean };

const tool =
  "w-9 h-9 flex items-center justify-center rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:opacity-40";

const Icon = {
  bullets: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01" /></svg>,
  numbers: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" d="M10 6h10M10 12h10M10 18h10M4 5h1v4M4 15h2l-2 3h2" /></svg>,
  quote: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M7.5 7C5 7 3 9 3 11.5S5 16 7.5 16c.3 0 .5 0 .8-.1L6 19h2.5l2.5-4.5c.4-.8.5-1.6.5-2.5C11.5 9 9.7 7 7.5 7zm9 0C14 7 12 9 12 11.5s2 4.5 4.5 4.5c.3 0 .5 0 .8-.1L15 19h2.5l2.5-4.5c.4-.8.5-1.6.5-2.5C20.5 9 18.7 7 16.5 7z" /></svg>,
  divider: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" d="M4 12h16" /></svg>,
  link: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1" /></svg>,
  image: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 16l5-5 4 4 3-3 6 6M15.5 9.5h.01" /></svg>,
  music: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z" /></svg>,
};

export default function ArticleEditor({
  article,
  newsletters,
  author,
}: {
  article: Article;
  newsletters: { id: string; name: string }[];
  author: { name: string; avatarUrl: string | null };
}) {
  const router = useRouter();
  const [title, setTitle] = useState(article.title);
  const [body, setBody] = useState(article.body);
  const [summary, setSummary] = useState(article.summary);
  const [coverUrl, setCoverUrl] = useState<string | null>(article.coverUrl);
  const [newsletterId, setNewsletterId] = useState<string | null>(article.newsletterId);
  const [mode, setMode] = useState<"write" | "preview">("write");
  const [save, setSave] = useState<"saved" | "dirty" | "saving" | "error">("saved");
  const [busy, setBusy] = useState("");
  const [msg, setMsg] = useState("");
  const [publishOpen, setPublishOpen] = useState(false);
  const [notify, setNotify] = useState(true);
  const [embedOpen, setEmbedOpen] = useState(false);
  const [embedUrl, setEmbedUrl] = useState("");
  const ta = useRef<HTMLTextAreaElement>(null);
  const loaded = useRef(false);
  // Cursor position to restore after a toolbar edit. Applied in a layout effect,
  // i.e. right after React updates the textarea and before the next keystroke.
  const pendingSel = useRef<[number, number] | null>(null);
  useLayoutEffect(() => {
    const el = ta.current;
    const sel = pendingSel.current;
    if (!el || !sel) return;
    pendingSel.current = null;
    el.focus();
    el.setSelectionRange(sel[0], sel[1]);
  }, [body, mode]);

  // ---------- autosave ----------
  const persist = useCallback(async () => {
    setSave("saving");
    try {
      const res = await fetch(`/api/articles/${article.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title, body, summary, coverUrl, newsletterId }),
      });
      if (!res.ok) throw new Error();
      setSave("saved");
      return true;
    } catch {
      setSave("error");
      return false;
    }
  }, [article.id, title, body, summary, coverUrl, newsletterId]);

  useEffect(() => {
    if (!loaded.current) {
      loaded.current = true;
      return;
    }
    setSave("dirty");
    const t = setTimeout(persist, 1500);
    return () => clearTimeout(t);
  }, [title, body, summary, coverUrl, newsletterId, persist]);

  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => {
      if (save === "dirty" || save === "saving") e.preventDefault();
    };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [save]);

  // ---------- toolbar helpers ----------
  const edit = (fn: (text: string, start: number, end: number) => { text: string; selStart: number; selEnd: number }) => {
    const el = ta.current;
    if (!el) {
      setMode("write");
      return;
    }
    el.focus();
    // Work from what's on screen (not React state), so fast typing is never lost.
    const before = el.value;
    const r = fn(before, el.selectionStart, el.selectionEnd);
    // Replace only the part that changed, through the browser's own editing
    // command: React's onChange then syncs state, and Ctrl+Z undoes it.
    let a = 0;
    while (a < before.length && a < r.text.length && before[a] === r.text[a]) a++;
    let zOld = before.length;
    let zNew = r.text.length;
    while (zOld > a && zNew > a && before[zOld - 1] === r.text[zNew - 1]) {
      zOld--;
      zNew--;
    }
    el.setSelectionRange(a, zOld);
    const inserted = r.text.slice(a, zNew);
    const ok = inserted ? document.execCommand("insertText", false, inserted) : document.execCommand("delete");
    if (ok && el.value === r.text) {
      el.setSelectionRange(r.selStart, r.selEnd);
    } else {
      // Fallback for browsers without execCommand on textareas.
      pendingSel.current = [r.selStart, r.selEnd];
      setBody(r.text);
    }
  };
  const wrap = (mark: string, placeholder: string) =>
    edit((t, s, e) => {
      const sel = t.slice(s, e) || placeholder;
      const text = t.slice(0, s) + mark + sel + mark + t.slice(e);
      return { text, selStart: s + mark.length, selEnd: s + mark.length + sel.length };
    });
  const linePrefix = (prefix: string | ((i: number) => string), strip = /^(#{1,2}\s|>\s?|[-*]\s|\d+[.)]\s)/) =>
    edit((t, s, e) => {
      const ls = t.lastIndexOf("\n", s - 1) + 1;
      const le = t.indexOf("\n", e) === -1 ? t.length : t.indexOf("\n", e);
      const lines = t.slice(ls, le).split("\n").map((l, i) => (typeof prefix === "function" ? prefix(i) : prefix) + l.replace(strip, ""));
      const block = lines.join("\n");
      return { text: t.slice(0, ls) + block + t.slice(le), selStart: ls, selEnd: ls + block.length };
    });
  // Blocks (track players, images, dividers) always go on their own line, after
  // the line the cursor is on, so they never split a sentence or **bold** text.
  const insertBlock = (block: string) =>
    edit((t, _s, e) => {
      const nl = t.indexOf("\n", e);
      const at = nl === -1 ? t.length : nl;
      const before = t.slice(0, at).replace(/\n+$/, "");
      const after = t.slice(at).replace(/^\n+/, "");
      const pre = before ? "\n\n" : "";
      const ins = `${pre}${block}\n\n`;
      const pos = before.length + ins.length;
      return { text: before + ins + after, selStart: pos, selEnd: pos };
    });
  const setStyle = (v: string) => {
    if (v === "h2") linePrefix("# ");
    else if (v === "h3") linePrefix("## ");
    else linePrefix("");
  };
  const addLink = () => {
    const url = window.prompt("Link address (https://…)");
    if (!url) return;
    if (!/^https?:\/\/\S+$/.test(url.trim())) return setMsg("Links must start with http:// or https://");
    edit((t, s, e) => {
      const label = t.slice(s, e) || "link text";
      const md = `[${label}](${url.trim()})`;
      return { text: t.slice(0, s) + md + t.slice(e), selStart: s + 1, selEnd: s + 1 + label.length };
    });
  };
  const addEmbed = () => {
    const e = embedFor(embedUrl);
    if (!e) return setMsg("Paste a Spotify, SoundCloud or YouTube link.");
    insertBlock(embedUrl.trim().split("#")[0]);
    setEmbedUrl("");
    setEmbedOpen(false);
    setMsg("");
  };
  const onImage = async (file: File | undefined, target: "cover" | "inline") => {
    if (!file) return;
    setBusy(target);
    setMsg("");
    try {
      const url = await uploadImage(file);
      if (target === "cover") setCoverUrl(url);
      else insertBlock(`![${file.name.replace(/\.[^.]+$/, "").replace(/[\]_-]+/g, " ")}](${url})`);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy("");
    }
  };

  // ---------- publish ----------
  const canPublish = title.trim().length >= 5 && body.trim().length >= 50;
  async function publish() {
    setBusy("publish");
    setMsg("");
    const ok = await persist();
    if (!ok) {
      setBusy("");
      return setMsg("Couldn't save your latest changes. Please try again.");
    }
    try {
      const res = await fetch(`/api/articles/${article.id}/publish`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ notify }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "Couldn't publish.");
      router.push(d.url);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Couldn't publish.");
      setBusy("");
    }
  }

  async function removeDraft() {
    if (!confirm(article.published ? "Delete this published article? This can't be undone." : "Delete this draft?")) return;
    const res = await fetch(`/api/articles/${article.id}`, { method: "DELETE" });
    if (res.ok) router.push("/newsletters");
  }

  const nlName = newsletters.find((n) => n.id === newsletterId)?.name;
  const saveLabel = { saved: "Saved", dirty: "Unsaved changes", saving: "Saving…", error: "Not saved, retrying soon" }[save];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* TOP BAR: author, toolbar, manage, next */}
      <div className="sticky top-14 z-30 bg-white/95 dark:bg-zinc-950/95 backdrop-blur border-b border-gray-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 overflow-hidden flex items-center justify-center font-bold text-emerald-700 flex-none">
              {author.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={author.avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                author.name[0]
              )}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-gray-900 dark:text-white truncate max-w-[160px]">{author.name}</p>
              <label className="sr-only" htmlFor="nl-select">Publish as</label>
              <select
                id="nl-select"
                value={newsletterId ?? ""}
                onChange={(e) => setNewsletterId(e.target.value || null)}
                disabled={article.published}
                className="text-xs text-gray-600 dark:text-gray-400 bg-transparent focus:outline-none cursor-pointer max-w-[180px]"
              >
                <option value="">Individual article</option>
                {newsletters.map((n) => (
                  <option key={n.id} value={n.id}>
                    Newsletter: {n.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div role="toolbar" aria-label="Formatting" className="flex items-center gap-0.5 bg-gray-100 dark:bg-zinc-900 rounded-full px-2 py-1 overflow-x-auto max-w-full">
            <label className="sr-only" htmlFor="style">Text style</label>
            <select id="style" defaultValue="" onChange={(e) => { setStyle(e.target.value); e.target.value = ""; }} className="bg-transparent text-sm font-semibold text-gray-700 dark:text-gray-200 px-2 focus:outline-none cursor-pointer">
              <option value="" disabled>Style</option>
              <option value="p">Normal</option>
              <option value="h2">Heading</option>
              <option value="h3">Subheading</option>
            </select>
            <button type="button" className={`${tool} font-bold font-serif`} onClick={() => wrap("**", "bold text")} aria-label="Bold" title="Bold">B</button>
            <button type="button" className={`${tool} italic font-serif`} onClick={() => wrap("*", "italic text")} aria-label="Italic" title="Italic">I</button>
            <button type="button" className={tool} onClick={() => linePrefix("- ")} aria-label="Bulleted list" title="Bulleted list">{Icon.bullets}</button>
            <button type="button" className={tool} onClick={() => linePrefix((i) => `${i + 1}. `)} aria-label="Numbered list" title="Numbered list">{Icon.numbers}</button>
            <button type="button" className={tool} onClick={() => linePrefix("> ")} aria-label="Quote" title="Quote">{Icon.quote}</button>
            <button type="button" className={tool} onClick={() => insertBlock("---")} aria-label="Divider" title="Divider">{Icon.divider}</button>
            <button type="button" className={tool} onClick={addLink} aria-label="Link" title="Link">{Icon.link}</button>
            <label className={`${tool} cursor-pointer`} title="Image" aria-label="Insert image">
              {busy === "inline" ? <span className="text-xs">…</span> : Icon.image}
              <input type="file" accept="image/*" className="sr-only" onChange={(e) => onImage(e.target.files?.[0], "inline")} />
            </label>
            <button type="button" className={`${tool} text-emerald-700 dark:text-emerald-400`} onClick={() => setEmbedOpen((o) => !o)} aria-label="Embed a track" title="Embed a track (Spotify, SoundCloud, YouTube)" aria-expanded={embedOpen}>{Icon.music}</button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-full border border-gray-300 dark:border-zinc-700 overflow-hidden text-sm font-semibold" role="tablist" aria-label="Editor mode">
              {(["write", "preview"] as const).map((m) => (
                <button key={m} type="button" role="tab" aria-selected={mode === m} onClick={() => setMode(m)} className={`px-3 py-1.5 capitalize ${mode === m ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900" : "text-gray-700 dark:text-gray-300"}`}>
                  {m}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setPublishOpen(true)} className="px-5 py-2 rounded-full font-bold text-white bg-emerald-600 hover:bg-emerald-700">
              {article.published ? "Update →" : "Next →"}
            </button>
          </div>
        </div>
        {embedOpen && (
          <div className="max-w-6xl mx-auto px-4 pb-3 flex flex-wrap items-center gap-2">
            <label htmlFor="embed" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Embed a track:</label>
            <input
              id="embed"
              value={embedUrl}
              onChange={(e) => setEmbedUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addEmbed())}
              placeholder="Paste a Spotify, SoundCloud or YouTube link"
              className="flex-1 min-w-[220px] px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm"
            />
            <button type="button" onClick={addEmbed} className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700">Add player</button>
            {embedUrl && <span className="text-xs text-gray-500">{embedFor(embedUrl) ? "✓ " + embedFor(embedUrl)!.title : "Not a supported link yet"}</span>}
          </div>
        )}
      </div>

      {/* CANVAS */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {msg && <p role="alert" className="mb-4 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 p-3 text-sm">{msg}</p>}

        <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-800 bg-[#f3f2ef] dark:bg-zinc-900 mb-8">
          {coverUrl ? (
            <div className="relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coverUrl} alt="Cover" className="w-full aspect-[1.91/1] object-cover" />
              <div className="absolute top-3 right-3 flex gap-2">
                <label className="cursor-pointer px-3 py-1.5 rounded-full bg-white/90 text-sm font-semibold text-gray-800 shadow">
                  {busy === "cover" ? "Uploading…" : "Change"}
                  <input type="file" accept="image/*" className="sr-only" onChange={(e) => onImage(e.target.files?.[0], "cover")} />
                </label>
                <button type="button" onClick={() => setCoverUrl(null)} className="px-3 py-1.5 rounded-full bg-white/90 text-sm font-semibold text-gray-800 shadow">Remove</button>
              </div>
            </div>
          ) : (
            <div className="aspect-[2.6/1] flex flex-col items-center justify-center text-center p-6">
              <span className="text-4xl mb-2" aria-hidden="true">🖼️</span>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">Add a cover image: artwork, a gig photo or a studio shot. 1920×1080 works best.</p>
              <label className="cursor-pointer px-4 py-2 rounded-full border border-gray-500 dark:border-zinc-500 text-sm font-semibold text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-zinc-800">
                {busy === "cover" ? "Uploading…" : "⬆ Upload from computer"}
                <input type="file" accept="image/*" className="sr-only" onChange={(e) => onImage(e.target.files?.[0], "cover")} />
              </label>
            </div>
          )}
        </div>

        <label htmlFor="title" className="sr-only">Title</label>
        <textarea
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value.replace(/\n/g, " "))}
          maxLength={150}
          rows={1}
          placeholder="Title"
          className="w-full resize-none bg-transparent text-4xl font-bold text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none mb-6 [field-sizing:content]"
        />

        {mode === "write" ? (
          <>
            <label htmlFor="body" className="sr-only">Article</label>
            <textarea
              id="body"
              ref={ta}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={"Write here. Tell your fans about your new release, a gig, or what's happening in the studio…\n\nTip: use the toolbar above for headings, lists and quotes, and the ♫ button to embed a track."}
              className="w-full min-h-[50vh] resize-none bg-transparent text-[17px] leading-8 text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none [field-sizing:content]"
            />
          </>
        ) : body.trim() ? (
          <ArticleBody body={body} />
        ) : (
          <p className="text-gray-400">Nothing to preview yet.</p>
        )}
      </div>

      {/* STATUS PILL */}
      <div className="fixed left-4 bottom-4 z-30 px-4 py-2 rounded-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2" role="status">
        <span className={`w-2 h-2 rounded-full ${save === "saved" ? "bg-emerald-500" : save === "error" ? "bg-red-500" : "bg-amber-500"}`} aria-hidden="true" />
        {article.published ? "Published" : "Draft"} · {saveLabel}
        <span className="text-gray-400 hidden sm:inline">· {readingMinutes(body)} min read</span>
      </div>

      {/* PUBLISH PANEL */}
      {publishOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="publish-title" onKeyDown={(e) => e.key === "Escape" && setPublishOpen(false)}>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h2 id="publish-title" className="text-xl font-bold text-gray-900 dark:text-white">{article.published ? "Update your article" : "Ready to publish?"}</h2>
              <button type="button" onClick={() => setPublishOpen(false)} aria-label="Close" className="text-2xl leading-none text-gray-500 hover:text-gray-900 dark:hover:text-white">×</button>
            </div>
            <div className="flex gap-3 rounded-xl border border-gray-200 dark:border-zinc-800 p-3 mb-4">
              {coverUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={coverUrl} alt="" className="w-24 h-14 object-cover rounded-lg flex-none" />
              )}
              <div className="min-w-0">
                <p className="font-bold text-gray-900 dark:text-white truncate">{title || "Untitled"}</p>
                <p className="text-xs text-gray-500">{nlName ? `Newsletter: ${nlName}` : "Individual article"} · {readingMinutes(body)} min read</p>
              </div>
            </div>
            <label htmlFor="summary" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Short description (shown in feeds and notifications)</label>
            <textarea id="summary" value={summary} onChange={(e) => setSummary(e.target.value)} maxLength={300} rows={3} placeholder={excerpt(body, 140) || "What's this article about?"} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm mb-4" />
            {nlName && !article.published && (
              <label className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300 mb-4 cursor-pointer">
                <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} className="mt-0.5 w-4 h-4 accent-emerald-600" />
                Notify {nlName} subscribers
              </label>
            )}
            {!canPublish && <p className="text-sm text-amber-700 dark:text-amber-400 mb-3">Add a title (5+ characters) and write at least a few sentences before publishing.</p>}
            {msg && <p role="alert" className="text-sm text-red-600 mb-3">{msg}</p>}
            <div className="flex flex-wrap gap-3 justify-between items-center">
              <button type="button" onClick={removeDraft} className="text-sm font-semibold text-red-700 dark:text-red-400 hover:underline">
                {article.published ? "Delete article" : "Delete draft"}
              </button>
              <div className="flex gap-2">
                <button type="button" onClick={() => setPublishOpen(false)} className="px-4 py-2 rounded-full font-semibold border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-200">Keep editing</button>
                <button type="button" onClick={publish} disabled={!canPublish || busy === "publish"} className="px-5 py-2 rounded-full font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50">
                  {busy === "publish" ? "Publishing…" : article.published ? "Update" : "Publish"}
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Published articles are public and can be shared outside GRID. <Link href="/newsletters" className="underline">Back to newsletters</Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
