import Link from "next/link";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import PostActions from "./PostActions";

export type PostCardProps = {
  post: {
    id: string;
    body: string;
    created_at: string;
    like_count: number;
    comment_count: number;
    share_count: number;
    author_id: string;
    image_url?: string | null;
    audio_url?: string | null;
  };
  author: {
    name: string;
    username: string | null;
    avatar: string | null;
  } | null;
  liked: boolean;
  comments: Array<{
    id: string;
    body: string;
    authorName: string;
    authorAvatar: string | null;
  }>;
  fmtTime: (iso: string) => string;
};

export default function PostCard({ post, author, liked, comments, fmtTime }: PostCardProps) {
  const name = author?.name || "Someone";
  const initials = name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

  return (
    <article data-testid="post-card" className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          {author?.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={author.avatar}
              alt={name}
              className="w-10 h-10 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-700 shrink-0">
              {initials}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">{name}</p>
            <p className="text-xs text-gray-500">{fmtTime(post.created_at)}</p>
          </div>
        </div>

        <p className="text-sm text-gray-900 whitespace-pre-wrap">{post.body}</p>

        {post.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.image_url}
            alt=""
            className="mt-3 rounded-xl w-full max-h-96 object-cover"
          />
        ) : null}

        <PostActions
          postId={post.id}
          initialLiked={liked}
          initialLikes={post.like_count}
          comments={post.comment_count}
          shares={post.share_count}
        />
      </div>

      {comments.length > 0 ? (
        <div className="bg-gray-50 border-t border-gray-100 px-4 py-3 space-y-2">
          {comments.slice(0, 3).map((c) => (
            <div key={c.id} className="flex items-start gap-2">
              {c.authorAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.authorAvatar}
                  alt={c.authorName}
                  className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-300 shrink-0 mt-0.5" />
              )}
              <p className="text-xs text-gray-700">
                <span className="font-medium">{c.authorName}</span> {c.body}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </article>
  );
}
