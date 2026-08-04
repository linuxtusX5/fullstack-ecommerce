"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Star, Pencil, Trash2, X, Check } from "lucide-react";

type Review = {
  id: string;
  rating: number;
  title?: string | null;
  body: string;
  createdAt: string;
  user: { name?: string | null; email: string };
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Sora:wght@300;400;500;600;700&display=swap');

.rv-root { font-family: 'Sora', sans-serif; margin-top: 56px; }

.rv-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 32px; flex-wrap: wrap; gap: 16px; }
.rv-title { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700; color: #0f172a; letter-spacing: -0.02em; }

/* Summary */
.rv-summary { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; margin-bottom: 32px; padding: 24px; background: #f8fafc; border-radius: 16px; border: 1px solid #f1f5f9; }
.rv-avg { font-size: 52px; font-weight: 700; color: #0f172a; letter-spacing: -0.04em; line-height: 1; }
.rv-avg-right { display: flex; flex-direction: column; gap: 4px; }
.rv-stars-row { display: flex; gap: 3px; }
.rv-avg-count { font-size: 13px; color: #94a3b8; }

/* Bars */
.rv-bars { flex: 1; min-width: 180px; display: flex; flex-direction: column; gap: 5px; }
.rv-bar-row { display: flex; align-items: center; gap: 8px; }
.rv-bar-label { font-size: 11px; font-weight: 600; color: #64748b; min-width: 8px; text-align: right; }
.rv-bar-track { flex: 1; height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden; }
.rv-bar-fill  { height: 100%; background: #f59e0b; border-radius: 3px; transition: width 0.6s ease; }
.rv-bar-count { font-size: 11px; color: #94a3b8; min-width: 20px; }

/* Write review btn */
.rv-write-btn {
  display: flex; align-items: center; gap: 6px;
  height: 40px; padding: 0 20px;
  background: #0f172a; color: #fff; border: none;
  border-radius: 10px; font-family: 'Sora', sans-serif;
  font-size: 13px; font-weight: 600; cursor: pointer;
  transition: all 0.2s;
}
.rv-write-btn:hover { background: #1e293b; transform: translateY(-1px); }

/* Form */
.rv-form { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; margin-bottom: 28px; }
.rv-form-title { font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 18px; }
.rv-star-pick { display: flex; gap: 6px; margin-bottom: 16px; }
.rv-star-pick-btn { background: none; border: none; cursor: pointer; padding: 2px; transition: transform 0.1s; }
.rv-star-pick-btn:hover { transform: scale(1.2); }
.rv-field { margin-bottom: 12px; }
.rv-label { font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #94a3b8; margin-bottom: 6px; display: block; }
.rv-input { width: 100%; height: 42px; padding: 0 12px; border: 1.5px solid #e2e8f0; border-radius: 9px; font-family: 'Sora', sans-serif; font-size: 13px; color: #0f172a; outline: none; transition: border-color 0.2s; box-sizing: border-box; }
.rv-input:focus { border-color: #0ea5e9; }
.rv-textarea { width: 100%; min-height: 90px; padding: 10px 12px; border: 1.5px solid #e2e8f0; border-radius: 9px; font-family: 'Sora', sans-serif; font-size: 13px; color: #0f172a; outline: none; resize: vertical; transition: border-color 0.2s; box-sizing: border-box; }
.rv-textarea:focus { border-color: #0ea5e9; }
.rv-form-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 16px; }
.rv-cancel-btn { height: 38px; padding: 0 18px; background: none; border: 1.5px solid #e2e8f0; border-radius: 9px; font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 500; color: #64748b; cursor: pointer; transition: all 0.2s; }
.rv-cancel-btn:hover { border-color: #cbd5e1; color: #0f172a; }
.rv-submit-btn { height: 38px; padding: 0 22px; background: #0ea5e9; color: #fff; border: none; border-radius: 9px; font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: background 0.2s; }
.rv-submit-btn:hover:not(:disabled) { background: #0284c7; }
.rv-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.rv-error { padding: 8px 12px; border-radius: 8px; background: #fef2f2; border: 1px solid #fee2e2; font-size: 12px; color: #ef4444; margin-bottom: 12px; }

/* Review cards */
.rv-list { display: flex; flex-direction: column; gap: 16px; }
.rv-card { background: #fff; border: 1px solid #f1f5f9; border-radius: 16px; padding: 20px; transition: box-shadow 0.2s; }
.rv-card:hover { box-shadow: 0 4px 16px rgba(15,23,42,0.06); }
.rv-card-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 10px; gap: 12px; }
.rv-card-left { display: flex; align-items: center; gap: 10px; }
.rv-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #0ea5e9, #8b5cf6); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: #fff; flex-shrink: 0; }
.rv-user-name { font-size: 13px; font-weight: 600; color: #0f172a; }
.rv-user-date { font-size: 11px; color: #94a3b8; margin-top: 1px; }
.rv-card-actions { display: flex; gap: 4px; }
.rv-action-btn { width: 28px; height: 28px; border-radius: 7px; border: 1px solid #f1f5f9; background: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #94a3b8; transition: all 0.15s; }
.rv-action-btn:hover { border-color: #e2e8f0; color: #0f172a; }
.rv-action-btn-danger:hover { border-color: #fee2e2; color: #ef4444; background: #fef2f2; }
.rv-card-stars { display: flex; gap: 2px; margin-bottom: 6px; }
.rv-card-title { font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
.rv-card-body { font-size: 13px; color: #64748b; line-height: 1.7; font-weight: 300; }

.rv-empty { text-align: center; padding: 48px 24px; color: #94a3b8; font-size: 14px; }
.rv-empty-icon { font-size: 32px; margin-bottom: 8px; }

.rv-login-prompt { text-align: center; padding: 20px; background: #f8fafc; border-radius: 12px; font-size: 13px; color: #64748b; margin-bottom: 24px; }
.rv-login-link { color: #0ea5e9; font-weight: 600; text-decoration: none; }
.rv-login-link:hover { text-decoration: underline; }

@keyframes rvFadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.rv-card { animation: rvFadeUp 0.3s ease both; }
`;

function Stars({
  rating,
  size = 16,
  interactive = false,
  onRate,
}: {
  rating: number;
  size?: number;
  interactive?: boolean;
  onRate?: (r: number) => void;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          className={interactive ? "rv-star-pick-btn" : ""}
          style={{
            background: "none",
            border: "none",
            padding: interactive ? 2 : 0,
            cursor: interactive ? "pointer" : "default",
          }}
          onClick={() => interactive && onRate?.(i)}
          onMouseEnter={() => interactive && setHover(i)}
          onMouseLeave={() => interactive && setHover(0)}
          type="button"
        >
          <Star
            size={size}
            fill={(hover || rating) >= i ? "#f59e0b" : "none"}
            color={(hover || rating) >= i ? "#f59e0b" : "#e2e8f0"}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ProductReviews({ productId }: { productId: string }) {
  const { data: session } = useSession();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [avg, setAvg] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Review | null>(null);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/products/${productId}/reviews`);
      const data = await res.json();
      setReviews(data.reviews ?? []);
      setAvg(data.avg ?? 0);
      setTotal(data.total ?? 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const openAdd = () => {
    setEditing(null);
    setRating(5);
    setTitle("");
    setBody("");
    setError("");
    setShowForm(true);
  };

  const openEdit = (r: Review) => {
    setEditing(r);
    setRating(r.rating);
    setTitle(r.title ?? "");
    setBody(r.body);
    setError("");
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) {
      setError("Please write a review.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, title, body }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      await fetchReviews();
      setShowForm(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Delete this review?")) return;
    setDeleting(reviewId);
    try {
      await fetch(`/api/products/${productId}/reviews/${reviewId}`, {
        method: "DELETE",
      });
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      setTotal((t) => t - 1);
    } finally {
      setDeleting(null);
    }
  };

  // Rating distribution
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  const myReview = session
    ? reviews.find((r) => r.user.email === session.user?.email)
    : null;

  return (
    <>
      <style>{CSS}</style>
      <div className="rv-root">
        <div className="rv-header">
          <h2 className="rv-title">Customer Reviews</h2>
          {session && !showForm && (
            <button className="rv-write-btn" onClick={openAdd}>
              <Star size={13} />{" "}
              {myReview ? "Edit your review" : "Write a review"}
            </button>
          )}
        </div>

        {/* Summary */}
        {total > 0 && (
          <div className="rv-summary">
            <div>
              <p className="rv-avg">{avg.toFixed(1)}</p>
            </div>
            <div className="rv-avg-right">
              <Stars rating={Math.round(avg)} size={18} />
              <p className="rv-avg-count">
                {total} review{total !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="rv-bars">
              {dist.map((d) => (
                <div key={d.star} className="rv-bar-row">
                  <span className="rv-bar-label">{d.star}</span>
                  <div className="rv-bar-track">
                    <div
                      className="rv-bar-fill"
                      style={{
                        width: total ? `${(d.count / total) * 100}%` : "0%",
                      }}
                    />
                  </div>
                  <span className="rv-bar-count">{d.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Login prompt */}
        {!session && (
          <div className="rv-login-prompt">
            <a href="/login" className="rv-login-link">
              Sign in
            </a>{" "}
            to write a review
          </div>
        )}

        {/* Review form */}
        {showForm && (
          <div className="rv-form">
            <p className="rv-form-title">
              {editing ? "Edit your review" : "Write a review"}
            </p>
            <form onSubmit={handleSubmit}>
              {error && <div className="rv-error">⚠ {error}</div>}
              <div className="rv-field">
                <label className="rv-label">Your rating</label>
                <Stars
                  rating={rating}
                  size={28}
                  interactive
                  onRate={setRating}
                />
              </div>
              <div className="rv-field">
                <label className="rv-label">Title (optional)</label>
                <input
                  className="rv-input"
                  placeholder="Summarize your experience"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="rv-field">
                <label className="rv-label">Review</label>
                <textarea
                  className="rv-textarea"
                  placeholder="What did you think of this product?"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  required
                />
              </div>
              <div className="rv-form-actions">
                <button
                  type="button"
                  className="rv-cancel-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rv-submit-btn"
                  disabled={saving}
                >
                  {saving ? (
                    "Saving…"
                  ) : (
                    <>
                      <Check size={13} /> Submit
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reviews list */}
        {loading ? (
          <div className="rv-empty">
            <div className="rv-empty-icon">⭐</div>Loading reviews…
          </div>
        ) : reviews.length === 0 ? (
          <div className="rv-empty">
            <div className="rv-empty-icon">💬</div>
            No reviews yet. Be the first to review this product!
          </div>
        ) : (
          <div className="rv-list">
            {reviews.map((review, i) => {
              const isOwner = session?.user?.email === review.user.email;
              const isAdmin = (session?.user as any)?.role === "ADMIN";
              return (
                <div
                  key={review.id}
                  className="rv-card"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="rv-card-top">
                    <div className="rv-card-left">
                      <div className="rv-avatar">
                        {(review.user.name ??
                          review.user.email)[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="rv-user-name">
                          {review.user.name ?? review.user.email.split("@")[0]}
                        </p>
                        <p className="rv-user-date">
                          {formatDate(review.createdAt)}
                        </p>
                      </div>
                    </div>
                    {(isOwner || isAdmin) && (
                      <div className="rv-card-actions">
                        {isOwner && (
                          <button
                            className="rv-action-btn"
                            onClick={() => openEdit(review)}
                            title="Edit"
                          >
                            <Pencil size={12} />
                          </button>
                        )}
                        <button
                          className="rv-action-btn rv-action-btn-danger"
                          onClick={() => handleDelete(review.id)}
                          disabled={deleting === review.id}
                          title="Delete"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                  <Stars rating={review.rating} size={14} />
                  {review.title && (
                    <p className="rv-card-title">{review.title}</p>
                  )}
                  <p className="rv-card-body">{review.body}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
