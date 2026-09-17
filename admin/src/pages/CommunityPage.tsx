import { useEffect, useState } from 'react';
import { usePoiId } from '../layout/usePoiId';
import { deleteComment, deletePost, getComments, getCommunityPosts } from '../api/community';
import type { CommunityComment, CommunityPost } from '../api/types';

export function CommunityPage() {
  const poiId = usePoiId();
  const [posts, setPosts] = useState<CommunityPost[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [comments, setComments] = useState<CommunityComment[] | null>(null);

  function load() {
    getCommunityPosts(poiId)
      .then(setPosts)
      .catch(() => setError('Could not load community posts.'));
  }

  useEffect(load, [poiId]);

  async function toggleExpand(post: CommunityPost) {
    if (expandedId === post.id) {
      setExpandedId(null);
      setComments(null);
      return;
    }
    setExpandedId(post.id);
    setComments(null);
    try {
      setComments(await getComments(poiId, post.id));
    } catch {
      setError('Could not load replies.');
    }
  }

  async function handleDeletePost(id: string) {
    try {
      await deletePost(poiId, id);
      setPosts((current) => current?.filter((p) => p.id !== id) ?? null);
      if (expandedId === id) {
        setExpandedId(null);
        setComments(null);
      }
    } catch {
      setError('Could not remove that post.');
    }
  }

  async function handleDeleteComment(postId: string, commentId: string) {
    try {
      await deleteComment(poiId, postId, commentId);
      setComments((current) => current?.filter((c) => c.id !== commentId) ?? null);
      setPosts(
        (current) =>
          current?.map((p) =>
            p.id === postId ? { ...p, commentCount: p.commentCount - 1 } : p,
          ) ?? null,
      );
    } catch {
      setError('Could not remove that reply.');
    }
  }

  return (
    <div>
      <h2>Community</h2>
      <p className="muted">Moderate posts and replies. Anyone can post here from the app.</p>

      {error && <p className="error-text">{error}</p>}
      {posts === null && !error && <p className="muted">Loading…</p>}
      {posts?.length === 0 && <p className="muted">No posts yet.</p>}

      {posts?.map((post) => (
        <div key={post.id} className="card">
          <p>{post.message}</p>
          <p className="card-meta">
            — {post.authorName ?? 'Anonymous'} · {new Date(post.createdAt).toLocaleString()}
          </p>
          <div className="card-actions">
            <button type="button" className="btn" onClick={() => toggleExpand(post)}>
              {expandedId === post.id ? 'Hide replies' : `Replies (${post.commentCount})`}
            </button>
            <button type="button" className="btn btn-danger" onClick={() => handleDeletePost(post.id)}>
              Remove post
            </button>
          </div>

          {expandedId === post.id && (
            <div className="comment-list">
              {comments === null && <p className="muted">Loading replies…</p>}
              {comments?.length === 0 && <p className="muted">No replies.</p>}
              {comments?.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <div>
                    <p style={{ margin: 0 }}>{comment.message}</p>
                    <p className="card-meta">— {comment.authorName ?? 'Anonymous'}</p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleDeleteComment(post.id, comment.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
