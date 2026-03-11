import { useEffect, useState } from "react";
import type { AuthUser } from "../../domain/entities/AuthUser";
import type { MovieComment } from "../../domain/entities/MovieComment";
import { container } from "../../infrastructure/container";

interface Props {
  movieId: string;
}

function formatCommentDate(createdAtMs: number) {
  return new Date(createdAtMs).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MovieCommentsSection({ movieId }: Props) {
  const [comments, setComments] = useState<MovieComment[]>([]);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [commentText, setCommentText] = useState("");
  const [loadingComments, setLoadingComments] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

  useEffect(() => {
    setCurrentUser(container.getCurrentUser.execute());

    const unsubscribe = container.observeAuthState.execute((user) => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      setLoadingComments(true);

      try {
        const commentsThread =
          await container.getMovieComments.execute(movieId);
        setComments(commentsThread);
      } finally {
        setLoadingComments(false);
      }
    };

    fetchComments();
  }, [movieId]);

  const handleCreateComment = async () => {
    if (!currentUser) {
      setCommentError("Please log in to write a comment.");
      return;
    }

    const normalizedText = commentText.trim();

    if (!normalizedText) {
      setCommentError("Comment cannot be empty.");
      return;
    }

    setCommentError(null);
    setSubmittingComment(true);

    try {
      const createdComment = await container.addMovieComment.execute(
        movieId,
        currentUser.uid,
        currentUser.email ?? "Unknown user",
        normalizedText,
      );

      setComments((previousComments) => [...previousComments, createdComment]);
      setCommentText("");
    } catch (createError) {
      const message =
        createError instanceof Error
          ? createError.message
          : "Failed to publish comment.";
      setCommentError(message);
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <div className="glass-card mt-5 rounded-3xl border border-white/60 p-6 sm:p-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="display-title text-3xl font-bold text-slate-900">
            Comments
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {comments.length} {comments.length === 1 ? "comment" : "comments"}{" "}
            in this thread
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {loadingComments ? (
          <p className="text-sm text-slate-600">Loading comments...</p>
        ) : comments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-amber-300 bg-amber-50/60 p-4 text-sm text-slate-700">
            No comments yet. Be the first to start the discussion.
          </div>
        ) : (
          comments.map((comment) => (
            <article
              key={comment.id}
              className="rounded-2xl bg-white/85 p-4 shadow-sm ring-1 ring-slate-100"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-800">
                  {comment.userEmail}
                </p>
                <p className="text-xs text-slate-500">
                  {formatCommentDate(comment.createdAtMs)}
                </p>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                {comment.text}
              </p>
            </article>
          ))
        )}
      </div>

      <div className="mt-6 rounded-2xl bg-white/85 p-4 shadow-sm ring-1 ring-slate-100">
        {!currentUser ? (
          <p className="text-sm text-slate-600">
            Please log in to write a comment.
          </p>
        ) : (
          <>
            <label
              className="block text-sm font-medium text-slate-700"
              htmlFor="new-comment"
            >
              Add a comment
            </label>
            <textarea
              id="new-comment"
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              rows={4}
              placeholder="Share your thoughts about this movie..."
              className="mt-2 w-full rounded-xl border border-amber-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-700"
            />
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={handleCreateComment}
                disabled={submittingComment}
                className="inline-flex rounded-full bg-teal-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submittingComment ? "Publishing..." : "Publish comment"}
              </button>
            </div>
          </>
        )}

        {commentError ? (
          <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
            {commentError}
          </p>
        ) : null}
      </div>
    </div>
  );
}
