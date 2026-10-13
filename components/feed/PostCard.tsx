import PostActions from "./PostActions";
import CommentThread from "./CommentThread";

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
    createdAt?: string;
  }>;
  fmtTime: (iso: string) => string;
};

export default function PostCard({ post, author, liked, comments, fmtTime }: PostCardProps) {
  const name = author?.name || "Someone";
  const initials = name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

  const threadComments = comments.map((c) => ({
    id: c.id,
    body: c.body,
    authorName: c.authorName,
    authorAvatar: c.authorAvatar,
    createdAt: c.createdAt || post.created_at,
  }));

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
            <p className="text-xs text-gray-500" title={post.created_at}>{fmtTime(post.created_at)}</p>
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
          initialComments={post.comment_count}
          initialShares={post.share_count}
        />
      </div>

      {threadComments.length > 0 ? (
        <CommentThread comments={threadComments} />
      ) : null}
    </article>
  );
}
