import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FaSeedling,
  FaFlask,
  FaBug,
  FaChevronDown,
  FaChevronUp,
  FaLeaf,
  FaThermometerHalf,
  FaTint,
  FaCloudRain,
  FaCalendarAlt,
  FaTrash,
  FaEye,
} from "react-icons/fa";
import { MdAgriculture, MdBugReport, MdRefresh } from "react-icons/md";
import { HiArrowRight } from "react-icons/hi2";

/* API */
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const cookieFetch = (path) =>
  fetch(`${BASE_URL}${path}`, { credentials: "include" }).then(async (r) => {
    const data = await r.json();
    if (!r.ok) throw new Error(data.message || "Request failed");
    return data;
  });

const api = {
  cropHistory: () => cookieFetch("/crop/history"),
  fertilizerHistory: () => cookieFetch("/fertilizer/history"),
  diseaseHistory: () => cookieFetch("/disease/history"),
};

/* Utils */
function timeAgo(d) {
  if (!d) return "—";
  const diff = (Date.now() - new Date(d)) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(d).toLocaleDateString("en-LK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDisease(raw = "") {
  const [plant, disease] = raw.split("___");
  const p = plant?.replace(/[_(),]/g, " ").trim();
  const d = disease?.replace(/_/g, " ").trim();
  return d?.toLowerCase() === "healthy" ? `${p} — Healthy ✓` : `${p} — ${d}`;
}

const CROP_EMOJI = {
  Rice: "🌾",
  Maize: "🌽",
  Chickpea: "🫘",
  "Kidney Beans": "🫘",
  "Pigeon Peas": "🌿",
  "Moth Beans": "🌱",
  "Mung Bean": "🫛",
  "Black Gram": "🌿",
  Lentil: "🫘",
  Pomegranate: "🍎",
  Banana: "🍌",
  Mango: "🥭",
  Grapes: "🍇",
  Watermelon: "🍉",
  Muskmelon: "🍈",
  Apple: "🍎",
  Orange: "🍊",
  Papaya: "🍑",
  Coconut: "🥥",
  Cotton: "🌸",
  Jute: "🌿",
  Coffee: "☕",
};

const FERT_EMOJI = {
  Urea: "🔵",
  "NPK 17-17-17": "🟢",
  "NPK 19-19-19": "🟢",
  "NPK 10-26-26": "🟣",
  SSP: "⚪",
  DAP: "🔴",
  MOP: "🟠",
  "NPK 14-35-14": "🔷",
  "NPK 20-20-0": "🔵",
  "NPK 28-28-0": "💠",
};

const SEV_COLOR = {
  Critical: "text-red-700 bg-red-100 border-red-300",
  High: "text-red-600 bg-red-50 border-red-200",
  Medium: "text-orange-600 bg-orange-50 border-orange-200",
  Low: "text-yellow-600 bg-yellow-50 border-yellow-200",
  None: "text-green-600 bg-green-50 border-green-200",
};

/* Confidence bar */
function MiniBar({ value, color = "bg-green-500" }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full`}
          style={{ width: `${value}%`, transition: "width .6s ease" }}
        />
      </div>
      <span className="text-[10px] font-bold text-gray-500 w-8 text-right">
        {parseFloat(value).toFixed(0)}%
      </span>
    </div>
  );
}

/* Empty state */
function EmptyState({ emoji, message, linkTo, linkLabel }) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-green-50 border border-green-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3">
        {emoji}
      </div>
      <p className="text-sm font-semibold text-gray-500 mb-4">{message}</p>
      {linkTo && (
        <Link
          to={linkTo}
          className="inline-flex items-center gap-2 bg-green-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs hover:bg-green-700 transition-colors shadow"
        >
          {linkLabel} <HiArrowRight />
        </Link>
      )}
    </div>
  );
}

/* Section */
function Section({
  icon,
  title,
  count,
  color,
  children,
  linkTo,
  loading,
  onRefresh,
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div
        className={`flex items-center justify-between px-6 py-4 border-b border-gray-50 ${color}`}
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">{icon}</span>
          <h3 className="font-extrabold text-[#073319] text-sm">{title}</h3>
          {count !== undefined && (
            <span className="text-[11px] font-bold bg-white/60 text-green-700 px-2 py-0.5 rounded-full border border-green-200">
              {count} records
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="w-7 h-7 rounded-full hover:bg-white/50 flex items-center justify-center text-gray-500 hover:text-green-700 transition-colors"
          >
            <MdRefresh
              className={`text-base ${loading ? "animate-spin" : ""}`}
            />
          </button>
          {linkTo && (
            <Link
              to={linkTo}
              className="text-xs font-bold text-green-600 hover:text-green-800 transition-colors flex items-center gap-1"
            >
              Try Again <HiArrowRight className="text-[10px]" />
            </Link>
          )}
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}
