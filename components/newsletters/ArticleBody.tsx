import { renderArticle } from "@/lib/newsletters/format";

// Renders GRID Markdown safely (renderArticle escapes all HTML first).
export default function ArticleBody({ body, className = "" }: { body: string; className?: string }) {
  return (
    <div
      className={`text-[17px] leading-8 text-gray-800 dark:text-gray-200 break-words
        [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-gray-900 dark:[&_h2]:text-white [&_h2]:mt-8 [&_h2]:mb-3
        [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-gray-900 dark:[&_h3]:text-white [&_h3]:mt-6 [&_h3]:mb-2
        [&_p]:my-4 [&_a]:text-emerald-700 dark:[&_a]:text-emerald-400 [&_a]:underline
        [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-4 [&_li]:my-1
        [&_blockquote]:border-l-4 [&_blockquote]:border-emerald-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-6 [&_blockquote]:text-gray-700 dark:[&_blockquote]:text-gray-300
        [&_hr]:my-8 [&_hr]:border-gray-200 dark:[&_hr]:border-zinc-800
        [&_code]:bg-gray-100 dark:[&_code]:bg-zinc-800 [&_code]:px-1.5 [&_code]:rounded [&_code]:text-[15px]
        [&_figure]:my-6 [&_img]:rounded-xl [&_img]:w-full [&_figcaption]:text-sm [&_figcaption]:text-gray-500 [&_figcaption]:text-center [&_figcaption]:mt-2
        [&_iframe]:w-full [&_iframe]:rounded-xl [&_iframe]:border-0 ${className}`}
      dangerouslySetInnerHTML={{ __html: renderArticle(body) }}
    />
  );
}
