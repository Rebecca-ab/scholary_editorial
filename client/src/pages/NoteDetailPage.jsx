import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const SERVER = 'http://localhost:5000';

export default function NoteDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [note, setNote]                   = useState(null);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [userRating, setUserRating]       = useState(0);
  const [hoverRating, setHoverRating]     = useState(0);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [ratingError, setRatingError]     = useState(null);
  const [ratingSuccess, setRatingSuccess] = useState(false);
  const [commentBody, setCommentBody]     = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError]   = useState(null);
  const [comments, setComments]           = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function fetchNote() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/notes/${id}`);
        if (cancelled) return;
        setNote(res.data);
        setComments(res.data.comments || []);
      } catch (err) {
        if (cancelled) return;
        setError(err.response?.status === 404 ? 'Note not found' : 'Failed to load note');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchNote();
    return () => { cancelled = true; };
  }, [id]);

  async function handleRate(star) {
    if (!isAuthenticated) { navigate('/auth'); return; }
    setRatingLoading(true);
    setRatingError(null);
    setRatingSuccess(false);
    try {
      const res = await api.post(`/notes/${id}/ratings`, { score: star });
      setUserRating(star);
      setRatingSuccess(true);
      setNote((prev) => ({ ...prev, avgRating: res.data.avgRating }));
      setTimeout(() => setRatingSuccess(false), 3000);
    } catch {
      setRatingError('Could not submit rating. Try again.');
    } finally {
      setRatingLoading(false);
    }
  }

  async function handleAddComment() {
    if (!commentBody.trim()) return;
    setCommentLoading(true);
    setCommentError(null);
    try {
      const res = await api.post(`/notes/${id}/comments`, { body: commentBody });
      setComments((prev) => [res.data, ...prev]);
      setCommentBody('');
    } catch {
      setCommentError('Could not post comment. Try again.');
    } finally {
      setCommentLoading(false);
    }
  }

  async function handleDeleteComment(commentId) {
    try {
      await api.delete(`/notes/${id}/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error('Delete comment failed:', err);
    }
  }

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-12 h-12 border-4 rounded-full border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="material-symbols-outlined text-error" style={{ fontSize: '64px' }}>
          error_outline
        </span>
        <p className="mt-4 text-xl font-bold font-manrope text-on-surface">{error}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 underline text-primary font-manrope"
        >
          ← Back to Browse
        </button>
      </div>
    );
  }

  const filePath = note?.filePath?.replace(/\\/g, '/').replace(/^src\//, '');
  const isImage = note?.fileType?.startsWith('image/');
  const isPdf   = note?.fileType === 'application/pdf';

  return (
    <div className="w-full">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm font-manrope text-on-surface-variant">
        <button onClick={() => navigate('/')} className="transition-colors hover:text-primary">
          Discovery Feed
        </button>
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chevron_right</span>
        <span className="font-bold truncate text-on-surface">{note.title}</span>
      </div>

      {/* Title + meta */}
      <h1 className="mb-3 text-3xl font-extrabold tracking-tight font-manrope text-on-surface">
        {note.title}
      </h1>
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <span className="px-3 py-1 text-xs font-bold tracking-widest uppercase rounded-full bg-primary-fixed text-primary font-manrope">
          {note.course?.code}
        </span>
        <span className="text-xs tracking-widest uppercase font-manrope text-on-surface-variant">
          {note.course?.department}
        </span>
        {note.pageCount && (
          <>
            <span className="inline-block w-1 h-1 rounded-full bg-outline-variant" />
            <span className="text-xs font-manrope text-on-surface-variant">
              {note.pageCount} pages
            </span>
          </>
        )}
        <span className="inline-block w-1 h-1 rounded-full bg-outline-variant" />
        <span className="text-xs font-manrope text-on-surface-variant">
          {new Date(note.createdAt).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
          })}
        </span>
      </div>

      {/* Two-column layout */}
      <div className="lg:grid lg:grid-cols-3 lg:gap-8">

        {/* ── LEFT COLUMN ── */}
        <div className="lg:col-span-2">

          {/* File Preview */}
          <div className="mb-6 overflow-hidden shadow-sm bg-surface-container-lowest rounded-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/20">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">description</span>
                <span className="text-sm font-bold font-manrope text-on-surface">File Preview</span>
              </div>
              <span className="px-2 py-1 bg-surface-container-high rounded font-manrope text-[10px] font-bold uppercase">
                {note.fileType?.split('/')[1] || 'file'}
              </span>
            </div>

            {isImage ? (
              <img
                src={`${SERVER}/${filePath}`}
                alt={note.title}
                className="w-full max-h-[500px] object-contain p-4"
              />
            ) : isPdf ? (
              <iframe
                src={`${SERVER}/${filePath}`}
                className="w-full h-[500px]"
                title={note.title}
              />
            ) : (
              <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
                <span
                  className="mb-4 material-symbols-outlined text-on-surface-variant/30"
                  style={{ fontSize: '80px' }}
                >
                  description
                </span>
                <p className="mb-2 font-bold font-manrope text-on-surface">
                  Preview not available
                </p>
                <p className="text-sm font-body text-on-surface-variant">
                  This file type cannot be previewed in the browser.
                  Download the file to view it.
                </p>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="p-6 mb-6 shadow-sm bg-surface-container-lowest rounded-2xl">
            <h3 className="mb-3 font-bold font-manrope text-on-surface">About these notes</h3>
            <p className="leading-relaxed font-body text-on-surface-variant">{note.description}</p>
          </div>

          {/* Comments */}
          <div>
            <h3 className="flex items-center gap-3 mb-6 text-lg font-bold font-manrope text-on-surface">
              Discussion
              <span className="px-2 py-0.5 bg-surface-container-high rounded-full font-manrope text-xs font-bold">
                {comments.length}
              </span>
            </h3>

            {/* Add comment */}
            {isAuthenticated ? (
              <div className="p-5 mb-6 shadow-sm bg-surface-container-lowest rounded-2xl">
                <textarea
                  rows={3}
                  placeholder="Share your thoughts on these notes..."
                  value={commentBody}
                  onChange={(e) => setCommentBody(e.target.value)}
                  maxLength={500}
                  className="w-full mb-3 text-sm bg-transparent outline-none resize-none font-body text-on-surface placeholder:text-slate-400"
                />
                <div className="flex items-center justify-between pt-3 border-t border-outline-variant/20">
                  <span className="text-xs font-manrope text-on-surface-variant">
                    {commentBody.length}/500
                  </span>
                  {commentError && (
                    <span className="text-xs text-error font-manrope">{commentError}</span>
                  )}
                  <button
                    onClick={handleAddComment}
                    disabled={!commentBody.trim() || commentLoading}
                    className="px-5 py-2 text-xs font-bold text-white rounded-full bg-primary font-manrope disabled:opacity-40 hover:opacity-90"
                  >
                    {commentLoading ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-5 mb-6 text-center bg-surface-container-low rounded-2xl">
                <p className="mb-3 text-sm font-body text-on-surface-variant">
                  Sign in to join the discussion
                </p>
                <button
                  onClick={() => navigate('/auth')}
                  className="px-6 py-2 text-xs font-bold text-white rounded-full bg-primary font-manrope"
                >
                  Sign In
                </button>
              </div>
            )}

            {/* Comments list */}
            {comments.length === 0 ? (
              <p className="py-8 italic text-center font-body text-on-surface-variant">
                No comments yet. Be the first to share your thoughts.
              </p>
            ) : (
              <div>
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4 py-5 border-b border-outline-variant/20 last:border-0">
                    <div className="flex items-center justify-center flex-shrink-0 text-sm font-bold rounded-full w-9 h-9 bg-surface-container-high font-manrope text-primary">
                      {comment.user?.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold font-manrope text-on-surface">
                            {comment.user?.name}
                          </span>
                          {comment.user?.university && (
                            <span className="font-manrope text-[10px] text-on-surface-variant uppercase tracking-wide">
                              {comment.user.university}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-manrope text-[10px] text-on-surface-variant">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                          {isAuthenticated && user?.id === comment.user?.id && (
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="transition-colors material-symbols-outlined text-on-surface-variant hover:text-error"
                              style={{ fontSize: '18px' }}
                            >
                              delete
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed font-body text-on-surface-variant">
                        {comment.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="flex flex-col gap-4 mt-8 lg:col-span-1 lg:mt-0">

          {/* Author card */}
          <div className="p-6 shadow-sm bg-surface-container-lowest rounded-2xl">
            <h4 className="mb-4 text-xs tracking-widest uppercase font-manrope text-on-surface-variant">
              Contributor
            </h4>
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center flex-shrink-0 text-xl font-bold rounded-full w-14 h-14 bg-primary-fixed font-manrope text-primary">
                {note.user?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-bold font-manrope text-on-surface">{note.user?.name}</p>
                {note.user?.university && (
                  <p className="mt-1 text-xs tracking-wide uppercase font-manrope text-on-surface-variant">
                    {note.user.university}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Rating card */}
          <div className="p-6 shadow-sm bg-surface-container-lowest rounded-2xl">
            <h4 className="mb-4 text-xs tracking-widest uppercase font-manrope text-on-surface-variant">
              Rate these Notes
            </h4>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-4xl font-extrabold font-manrope text-primary">
                {note.avgRating?.toFixed(1) || '0.0'}
              </span>
              <span className="text-sm font-manrope text-on-surface-variant">/ 5.0</span>
            </div>
            <p className="mb-4 text-xs font-manrope text-on-surface-variant">
              {note.ratings?.length || 0} ratings
            </p>

            {isAuthenticated ? (
              <>
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => handleRate(star)}
                      disabled={ratingLoading}
                      className="transition-transform hover:scale-110 disabled:opacity-50"
                    >
                      <span
                        className="text-3xl material-symbols-outlined"
                        style={{
                          fontVariationSettings:
                            (hoverRating || userRating) >= star ? "'FILL' 1" : "'FILL' 0",
                          color: (hoverRating || userRating) >= star ? '#f59e0b' : '#c0c8cc',
                        }}
                      >
                        star
                      </span>
                    </button>
                  ))}
                </div>
                {ratingSuccess && (
                  <p className="mt-2 text-xs text-green-600 font-manrope">Rating submitted!</p>
                )}
                {ratingError && (
                  <p className="mt-2 text-xs text-error font-manrope">{ratingError}</p>
                )}
              </>
            ) : (
              <p className="text-sm italic font-body text-on-surface-variant">
                Sign in to rate these notes
              </p>
            )}
          </div>

          {/* Download card */}
          <div className="p-6 shadow-sm bg-primary rounded-2xl">
            <h4 className="mb-2 text-xs tracking-widest uppercase font-manrope text-white/70">
              Download
            </h4>
            <p className="mb-4 text-2xl font-bold text-white font-manrope">
              {note.totalDownloads} downloads
            </p>
            <a
              href={`${SERVER}/api/notes/${note.id}/download`}
              download
              className="flex items-center justify-center w-full gap-3 py-3 text-sm font-bold transition-colors bg-white rounded-full text-primary font-manrope hover:bg-primary-fixed"
            >
              <span className="text-lg material-symbols-outlined">download</span>
              Download File
            </a>
          </div>

          {/* Course card */}
          <div className="p-6 shadow-sm bg-surface-container-lowest rounded-2xl">
            <h4 className="mb-3 text-xs tracking-widest uppercase font-manrope text-on-surface-variant">
              Course
            </h4>
            <p className="mb-1 font-bold font-manrope text-on-surface">{note.course?.name}</p>
            <p className="text-xs tracking-widest uppercase font-manrope text-on-surface-variant">
              {note.course?.code}
            </p>
            <button
              onClick={() => navigate('/?course=' + note.course?.id)}
              className="mt-4 text-xs font-bold underline text-primary font-manrope underline-offset-4"
            >
              Browse course notes →
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
