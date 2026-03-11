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
