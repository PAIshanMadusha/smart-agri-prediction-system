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
