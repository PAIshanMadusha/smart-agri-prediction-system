import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FaLeaf,
  FaHeart,
  FaRegHeart,
  FaComment,
  FaTrash,
  FaImage,
  FaPaperPlane,
  FaSearch,
  FaFire,
  FaClock,
  FaUsers,
  FaEllipsisH,
} from "react-icons/fa";
import { HiSparkles, HiPlus } from "react-icons/hi2";
import { MdClose } from "react-icons/md";
import { useAuth } from "../../context/useAuth";

/* API */
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

const api = {
  // GET /api/post  → { success, posts[] }
  getPosts: () => apiFetch("/post"),

  // POST /api/post  → { success, message, post }
  createPost: (body) =>
    apiFetch("/post", { method: "POST", body: JSON.stringify(body) }),

  // DELETE /api/post/:id  → { success, message }
  deletePost: (id) => apiFetch(`/post/${id}`, { method: "DELETE" }),

  // PUT /api/post/:id/like  → { success, likes: number }
  toggleLike: (id) => apiFetch(`/post/${id}/like`, { method: "PUT" }),

  // POST /api/post/:id/comment  → { success, message, text }
  addComment: (id, text) =>
    apiFetch(`/post/${id}/comment`, {
      method: "POST",
      body: JSON.stringify({ text }),
    }),
};

/* Utils */
function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString("en-LK", {
    day: "numeric",
    month: "short",
  });
}

function initials(name = "") {
  return (
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?"
  );
}

// Deterministic colour per user name
const GRADIENTS = [
  "from-emerald-500 to-green-700",
  "from-teal-500 to-emerald-700",
  "from-green-500 to-teal-700",
  "from-sky-500 to-cyan-700",
  "from-violet-500 to-purple-700",
  "from-orange-500 to-amber-700",
  "from-rose-500 to-pink-700",
  "from-cyan-500 to-blue-700",
];
function avatarGrad(name = "") {
  const idx =
    [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % GRADIENTS.length;
  return GRADIENTS[idx];
}

/* Avatar component */
function Avatar({ name, size = "md" }) {
  const s = {
    sm: "w-7 h-7 text-[10px]",
    md: "w-10 h-10 text-xs",
    lg: "w-12 h-12 text-sm",
  }[size];
  return (
    <div
      className={`${s} rounded-full bg-gradient-to-br ${avatarGrad(name)} text-white font-extrabold flex items-center justify-center shadow-sm flex-shrink-0`}
    >
      {initials(name)}
    </div>
  );
}

/* Create post model */
function CreatePostModal({ user, onClose, onCreated }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewOk, setPreviewOk] = useState(false);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const canSubmit = form.title.trim() && form.description.trim();

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError("");
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        ...(form.imageUrl.trim() ? { imageUrl: form.imageUrl.trim() } : {}),
      };
      // POST /api/post → { success, message, post }
      const data = await api.createPost(payload);
      onCreated(data.post); // data.post is the raw mongoose doc (user = ObjectId string)
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{
        background: "rgba(5,46,22,0.6)",
        backdropFilter: "blur(6px)",
        animation: "bkgIn .2s ease",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full sm:max-w-lg bg-white sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden"
        style={{ animation: "slideUp .3s cubic-bezier(.16,1,.3,1)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center gap-3">
            <Avatar name={user?.name} size="md" />
            <div>
              <p className="text-sm font-extrabold text-[#073319]">
                {user?.name}
              </p>
              <p className="text-[11px] text-green-600 font-semibold capitalize">
                {user?.role || "member"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
          >
            <MdClose />
          </button>
        </div>

        {/* Form */}
        <div className="px-5 py-4 space-y-3">
          {error && (
            <div
              className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold px-4 py-2.5 rounded-xl"
              style={{ animation: "shake .4s ease" }}
            >
              ⚠ {error}
            </div>
          )}

          {/* Title */}
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            placeholder="Post title…"
            maxLength={120}
            className="w-full text-[15px] font-bold text-[#073319] placeholder-gray-300 border-0 border-b-2 border-gray-100 focus:border-green-400 outline-none pb-2 bg-transparent transition-colors"
          />

          {/* Description */}
          <div className="relative">
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              placeholder="Share your experience, question, or insight with the community…"
              maxLength={1000}
              rows={5}
              className="w-full text-sm text-gray-700 placeholder-gray-300 border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 resize-none transition-all"
            />
            <span
              className={`absolute bottom-3 right-3 text-[10px] font-semibold ${form.description.length > 900 ? "text-red-400" : "text-gray-300"}`}
            >
              {form.description.length}/1000
            </span>
          </div>

          {/* Image URL */}
          <div className="relative">
            <FaImage className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
            <input
              type="url"
              value={form.imageUrl}
              onChange={(e) => {
                setForm((p) => ({ ...p, imageUrl: e.target.value }));
                setPreviewOk(false);
              }}
              placeholder="Image URL (optional)"
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all text-gray-600"
            />
          </div>

          {/* Image preview */}
          {form.imageUrl && (
            <div className="relative rounded-xl overflow-hidden bg-gray-100 h-36 border border-gray-200">
              <img
                src={form.imageUrl}
                alt="preview"
                className="w-full h-full object-cover"
                onLoad={() => setPreviewOk(true)}
                onError={() => setPreviewOk(false)}
              />
              {!previewOk && (
                <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">
                  Image preview unavailable
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border-2 border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl text-sm hover:border-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !canSubmit}
            className={`flex-[2] flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-2.5 rounded-xl text-sm transition-all
              ${loading || !canSubmit ? "opacity-60 cursor-not-allowed" : "hover:opacity-90 hover:-translate-y-0.5 shadow-lg"}`}
            style={
              !loading && canSubmit
                ? { boxShadow: "0 4px 16px rgba(22,163,74,.3)" }
                : {}
            }
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                Posting…
              </>
            ) : (
              <>
                <FaPaperPlane className="text-xs" /> Share Post
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* Comment section */
function CommentSection({ postId, initialComments, user }) {
  const [comments, setComments] = useState(initialComments);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const listEndRef = useRef(null);

  const handleSubmit = async () => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setLoading(true);
    try {
      // POST /api/post/:id/comment → { success, message, text }
      await api.addComment(postId, trimmed);
      // Build optimistic comment — backend only returns { text }, not full populated object
      const optimistic = {
        _id: `local-${Date.now()}`,
        user: { _id: user?._id, name: user?.name },
        text: trimmed,
        createdAt: new Date().toISOString(),
      };
      setComments((p) => [...p, optimistic]);
      setText("");
      setTimeout(
        () => listEndRef.current?.scrollIntoView({ behavior: "smooth" }),
        50,
      );
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-t border-gray-100 px-5 pb-4 pt-3 bg-gray-50/50">
      {/* Comment list */}
      {comments.length > 0 && (
        <div
          className="space-y-2.5 mb-3 max-h-52 overflow-y-auto pr-1"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#bbf7d0 transparent",
          }}
        >
          {comments.map((c) => (
            <div key={c._id} className="flex gap-2.5 items-start">
              <Avatar name={c.user?.name} size="sm" />
              <div className="flex-1 bg-white rounded-xl border border-gray-100 px-3 py-2 shadow-sm min-w-0">
                <p className="text-[11px] font-extrabold text-green-700 mb-0.5">
                  {c.user?.name || "Member"}
                </p>
                <p className="text-xs text-gray-600 leading-relaxed break-words">
                  {c.text}
                </p>
                <p className="text-[10px] text-gray-400 mt-1">
                  {timeAgo(c.createdAt)}
                </p>
              </div>
            </div>
          ))}
          <div ref={listEndRef} />
        </div>
      )}

      {/* Input row */}
      <div className="flex gap-2 items-center">
        <Avatar name={user?.name} size="sm" />
        <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3.5 py-2 focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-100 transition-all">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && !e.shiftKey && handleSubmit()
            }
            placeholder="Write a comment…"
            maxLength={300}
            className="flex-1 text-xs bg-transparent outline-none text-gray-700 placeholder-gray-400"
          />
          <button
            onClick={handleSubmit}
            disabled={loading || !text.trim()}
            className={`flex-shrink-0 transition-colors ${text.trim() ? "text-green-600 hover:text-green-800" : "text-gray-300 cursor-not-allowed"}`}
          >
            {loading ? (
              <span className="w-3 h-3 border border-green-400/30 border-t-green-500 rounded-full animate-spin block" />
            ) : (
              <FaPaperPlane className="text-xs" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Wrapper to pass user into PostCard cleanly
function PostCardWithUser({ post, currentUserId, onDelete, currentUser }) {
  const [liked, setLiked] = useState(() => post.likes?.includes(currentUserId));
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const commentCount = post.comments?.length || 0;

  const isOwner =
    post.user?._id === currentUserId ||
    post.user?._id?.toString() === currentUserId?.toString() ||
    post.user === currentUserId;

  useEffect(() => {
    const fn = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setShowMenu(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const handleLike = async () => {
    if (likeLoading) return;
    setLikeLoading(true);
    const prev = { liked, likeCount };
    setLiked(!liked);
    setLikeCount((n) => (liked ? n - 1 : n + 1));
    try {
      const data = await api.toggleLike(post._id);
      // data.likes = authoritative count from your toggleLike controller
      setLikeCount(data.likes);
    } catch {
      setLiked(prev.liked);
      setLikeCount(prev.likeCount);
    } finally {
      setLikeLoading(false);
    }
  };

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
      style={{ animation: "fadeSlide .4s ease" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between px-5 pt-4 pb-3">
        <div className="flex items-center gap-3">
          <Avatar name={post.user?.name} size="md" />
          <div>
            <p className="text-sm font-extrabold text-[#073319] leading-tight">
              {post.user?.name || "Unknown"}
            </p>
            <p className="text-[11px] text-gray-400 flex items-center gap-1">
              {timeAgo(post.createdAt)}
              {post.user?.email && (
                <span className="text-gray-300">· {post.user.email}</span>
              )}
            </p>
          </div>
        </div>

        {isOwner && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu((p) => !p)}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors"
            >
              <FaEllipsisH className="text-xs" />
            </button>
            {showMenu && (
              <div
                className="absolute right-0 top-9 bg-white border border-gray-100 rounded-xl shadow-xl z-20 overflow-hidden"
                style={{ minWidth: "140px", animation: "fadeIn .15s ease" }}
              >
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onDelete(post._id);
                  }}
                  className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors font-semibold"
                >
                  <FaTrash className="text-xs" /> Delete Post
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-5 pb-3">
        <h3 className="text-[15px] font-extrabold text-[#073319] mb-1.5 leading-snug">
          {post.title}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line line-clamp-4">
          {post.description}
        </p>
      </div>

      {/* Image */}
      {post.imageUrl && (
        <div className="mx-5 mb-3 rounded-xl overflow-hidden bg-gray-100 max-h-64">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500"
            onError={(e) => {
              e.target.closest("div").style.display = "none";
            }}
          />
        </div>
      )}

      {/* Action bar */}
      <div className="flex items-center gap-5 px-5 py-3 border-t border-gray-50">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-sm font-bold transition-all duration-200 group
            ${liked ? "text-red-500" : "text-gray-400 hover:text-red-400"}`}
        >
          {liked ? (
            <FaHeart className="text-base group-hover:scale-110 transition-transform" />
          ) : (
            <FaRegHeart className="text-base group-hover:scale-110 transition-transform" />
          )}
          <span>{likeCount}</span>
        </button>

        <button
          onClick={() => setShowComments((p) => !p)}
          className={`flex items-center gap-1.5 text-sm font-bold transition-colors duration-200
            ${showComments ? "text-green-600" : "text-gray-400 hover:text-green-500"}`}
        >
          <FaComment className="text-base" />
          <span>{commentCount}</span>
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <CommentSection
          postId={post._id}
          initialComments={post.comments || []}
          user={currentUser}
        />
      )}
    </div>
  );
}
