//TODO: Split into smaller components for better maintainability (e.g. HistorySection, HistoryItem, ConfidenceBar, EmptyState, etc.)
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
const BASE_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

const cookieFetch = (path) =>
  fetch(`${BASE_URL}${path}`, { credentials: "include" }).then(async (r) => {
    const data = await r.json();
    if (!r.ok) throw new Error(data.message || "Request failed");
    return data;
  });

const api = {
  cropHistory: () => cookieFetch("/api/crop/history"),
  fertilizerHistory: () => cookieFetch("/api/fertilizer/history"),
  diseaseHistory: () => cookieFetch("/api/disease/history"),
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

/* Crop history */
function CropHistoryItem({ record }) {
  const [open, setOpen] = useState(false);
  const top = record.recommendedCrops?.[0];
  const emoji = CROP_EMOJI[top?.crop] || "🌱";

  return (
    <div className="border-b border-gray-50 last:border-0">
      <div
        className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/60 transition-colors cursor-pointer"
        onClick={() => setOpen((p) => !p)}
      >
        {/* Emoji */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 border border-green-200 flex items-center justify-center text-xl flex-shrink-0">
          {emoji}
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-sm font-extrabold text-[#073319] truncate">
              {top?.crop || "Unknown"}
            </p>
            <span className="text-[10px] font-bold bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 rounded-full flex-shrink-0">
              {top?.confidence}% match
            </span>
          </div>
          <p className="text-[11px] text-gray-400">
            N:{record.soilData?.nitrogen} · P:{record.soilData?.phosphorus} · K:
            {record.soilData?.potassium} · pH:{record.soilData?.ph}
          </p>
        </div>

        {/* Date + toggle */}
        <div className="text-right flex-shrink-0">
          <p className="text-[11px] text-gray-400 flex items-center gap-1 justify-end">
            <FaCalendarAlt className="text-[9px]" /> {timeAgo(record.createdAt)}
          </p>
          <span className="text-gray-400 mt-1 block">
            {open ? (
              <FaChevronUp className="text-[10px] ml-auto" />
            ) : (
              <FaChevronDown className="text-[10px] ml-auto" />
            )}
          </span>
        </div>
      </div>

      {/* Expanded */}
      {open && (
        <div
          className="px-6 pb-4 bg-gray-50/40 border-t border-gray-100"
          style={{ animation: "expandIn .2s ease" }}
        >
          <div className="grid sm:grid-cols-2 gap-4 mt-3">
            {/* Input data */}
            <div>
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">
                Soil & Weather Inputs
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  ["Nitrogen", record.soilData?.nitrogen, "kg/ha"],
                  ["Phosphorus", record.soilData?.phosphorus, "kg/ha"],
                  ["Potassium", record.soilData?.potassium, "kg/ha"],
                  ["pH", record.soilData?.ph, ""],
                  ["Temperature", record.weatherData?.temperature, "°C"],
                  ["Humidity", record.weatherData?.humidity, "%"],
                  ["Rainfall", record.weatherData?.rainfall, "mm"],
                ].map(([l, v, u]) => (
                  <div
                    key={l}
                    className="bg-white rounded-lg px-2.5 py-1.5 border border-gray-100"
                  >
                    <p className="text-[9px] text-gray-400 uppercase font-bold">
                      {l}
                    </p>
                    <p className="text-xs font-extrabold text-[#073319]">
                      {v ?? "—"}
                      {u}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            {/* All recommendations */}
            <div>
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">
                All Recommendations
              </p>
              <div className="space-y-2">
                {record.recommendedCrops?.slice(0, 5).map((c, i) => (
                  <div key={c._id}>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold text-[#073319] flex items-center gap-1.5">
                        {i === 0 && "🥇"} {CROP_EMOJI[c.crop] || "🌱"} {c.crop}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {c.confidence}%
                      </span>
                    </div>
                    <MiniBar
                      value={c.confidence}
                      color={
                        c.confidence >= 60
                          ? "bg-green-500"
                          : c.confidence >= 30
                            ? "bg-yellow-500"
                            : "bg-gray-300"
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function CropHistory({ limit }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetch = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const d = await api.cropHistory();
      setRecords(d.records || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const shown = limit ? records.slice(0, limit) : records;

  return (
    <Section
      icon="🌾"
      title="Crop Recommendation History"
      count={records.length}
      color="bg-gradient-to-r from-green-50 to-emerald-50"
      linkTo="/ai-services/crop"
      linkLabel="New Prediction"
      loading={loading}
      onRefresh={fetch}
    >
      {loading ? (
        <div className="p-6 space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-gray-200 flex-shrink-0" />
              <div className="flex-1 space-y-1.5 py-0.5">
                <div className="h-3 bg-gray-200 rounded w-1/3" />
                <div className="h-2.5 bg-gray-100 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="px-6 py-4 text-xs text-red-500 font-semibold">
          ⚠ {error}
        </div>
      ) : shown.length === 0 ? (
        <EmptyState
          emoji="🌾"
          message="No crop recommendations yet."
          linkTo="/ai-services/crop"
          linkLabel="Get First Recommendation"
        />
      ) : (
        <>
          {shown.map((r) => (
            <CropHistoryItem key={r._id} record={r} />
          ))}
          {limit && records.length > limit && (
            <div className="px-6 py-3 border-t border-gray-50 text-center">
              <Link
                to="/history"
                className="text-xs font-bold text-green-600 hover:text-green-800 flex items-center justify-center gap-1"
              >
                View all {records.length} records{" "}
                <HiArrowRight className="text-[10px]" />
              </Link>
            </div>
          )}
        </>
      )}
    </Section>
  );
}

/* Fertilizer history */
function FertHistoryItem({ record }) {
  const [open, setOpen] = useState(false);
  const top = record.recommendedFertilizers?.[0];
  const emoji = FERT_EMOJI[top?.fertilizer] || "🧪";

  return (
    <div className="border-b border-gray-50 last:border-0">
      <div
        className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/60 transition-colors cursor-pointer"
        onClick={() => setOpen((p) => !p)}
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-yellow-100 border border-amber-200 flex items-center justify-center text-xl flex-shrink-0">
          {emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-sm font-extrabold text-[#073319] truncate">
              {top?.fertilizer || "Unknown"}
            </p>
            <span className="text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full flex-shrink-0">
              {parseFloat(top?.confidence).toFixed(1)}%
            </span>
          </div>
          <p className="text-[11px] text-gray-400">
            {record.cropType} · {record.soilType} Soil
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-[11px] text-gray-400 flex items-center gap-1 justify-end">
            <FaCalendarAlt className="text-[9px]" /> {timeAgo(record.createdAt)}
          </p>
          <span className="text-gray-400 mt-1 block">
            {open ? (
              <FaChevronUp className="text-[10px] ml-auto" />
            ) : (
              <FaChevronDown className="text-[10px] ml-auto" />
            )}
          </span>
        </div>
      </div>

      {open && (
        <div
          className="px-6 pb-4 bg-gray-50/40 border-t border-gray-100"
          style={{ animation: "expandIn .2s ease" }}
        >
          <div className="grid sm:grid-cols-2 gap-4 mt-3">
            <div>
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">
                Soil Inputs
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  ["Nitrogen", record.soilData?.nitrogen, "kg/ha"],
                  ["Phosphorus", record.soilData?.phosphorus, "kg/ha"],
                  ["Potassium", record.soilData?.potassium, "kg/ha"],
                  ["Moisture", record.soilData?.moisture, "%"],
                  ["Temperature", record.soilData?.temperature, "°C"],
                  ["Humidity", record.soilData?.humidity, "%"],
                ].map(([l, v, u]) => (
                  <div
                    key={l}
                    className="bg-white rounded-lg px-2.5 py-1.5 border border-gray-100"
                  >
                    <p className="text-[9px] text-gray-400 uppercase font-bold">
                      {l}
                    </p>
                    <p className="text-xs font-extrabold text-[#073319]">
                      {v ?? "—"}
                      {u}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">
                Fertilizer Rankings
              </p>
              <div className="space-y-2">
                {record.recommendedFertilizers?.map((f, i) => (
                  <div key={f._id}>
                    <div className="flex justify-between mb-0.5">
                      <span className="text-xs font-bold text-[#073319]">
                        {i === 0 && "🥇 "}
                        {FERT_EMOJI[f.fertilizer] || "🧪"} {f.fertilizer}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {parseFloat(f.confidence).toFixed(1)}%
                      </span>
                    </div>
                    <MiniBar
                      value={parseFloat(f.confidence)}
                      color={
                        f.confidence >= 60
                          ? "bg-amber-500"
                          : f.confidence >= 30
                            ? "bg-yellow-500"
                            : "bg-gray-300"
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function FertilizerHistory({ limit }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetch = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const d = await api.fertilizerHistory();
      setRecords(d.records || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);
  const shown = limit ? records.slice(0, limit) : records;

  return (
    <Section
      icon="🧪"
      title="Fertilizer Suggestion History"
      count={records.length}
      color="bg-gradient-to-r from-amber-50 to-yellow-50"
      linkTo="/ai-services/fertilizer"
      linkLabel="New Suggestion"
      loading={loading}
      onRefresh={fetch}
    >
      {loading ? (
        <div className="p-6 space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-gray-200 flex-shrink-0" />
              <div className="flex-1 space-y-1.5 py-0.5">
                <div className="h-3 bg-gray-200 rounded w-1/3" />
                <div className="h-2.5 bg-gray-100 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="px-6 py-4 text-xs text-red-500 font-semibold">
          ⚠ {error}
        </div>
      ) : shown.length === 0 ? (
        <EmptyState
          emoji="🧪"
          message="No fertilizer suggestions yet."
          linkTo="/ai-services/fertilizer"
          linkLabel="Get First Suggestion"
        />
      ) : (
        <>
          {shown.map((r) => (
            <FertHistoryItem key={r._id} record={r} />
          ))}
          {limit && records.length > limit && (
            <div className="px-6 py-3 border-t border-gray-50 text-center">
              <Link
                to="/history"
                className="text-xs font-bold text-green-600 hover:text-green-800 flex items-center justify-center gap-1"
              >
                View all {records.length} records{" "}
                <HiArrowRight className="text-[10px]" />
              </Link>
            </div>
          )}
        </>
      )}
    </Section>
  );
}

/* Disease history */
function DiseaseHistoryItem({ record }) {
  const [open, setOpen] = useState(false);
  const conf = parseFloat(record.confidenceScore);

  const severity = record.predictedDisease?.toLowerCase().includes("healthy")
    ? "None"
    : conf >= 90
      ? "High"
      : conf >= 60
        ? "Medium"
        : "Low";

  const sevClass = SEV_COLOR[severity] || SEV_COLOR.Medium;

  return (
    <div className="border-b border-gray-50 last:border-0">
      <div
        className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/60 transition-colors cursor-pointer"
        onClick={() => setOpen((p) => !p)}
      >
        {/* Leaf image thumbnail */}
        <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
          {record.imageUrl ? (
            <img
              src={record.imageUrl}
              alt="leaf"
              className="w-full h-full object-cover"
              onError={(e) => (e.target.style.display = "none")}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xl">
              🍃
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <p className="text-sm font-extrabold text-[#073319] truncate">
              {formatDisease(record.predictedDisease)}
            </p>
            {record.isLowConfidence && (
              <span className="text-[9px] font-bold bg-amber-100 text-amber-600 border border-amber-200 px-1.5 py-0.5 rounded-full flex-shrink-0">
                Low confidence
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${sevClass} flex-shrink-0`}
            >
              {severity}
            </span>
            <span className="text-[11px] text-gray-400">
              {conf.toFixed(1)}% confidence
            </span>
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <p className="text-[11px] text-gray-400 flex items-center gap-1 justify-end">
            <FaCalendarAlt className="text-[9px]" /> {timeAgo(record.createdAt)}
          </p>
          <span className="text-gray-400 mt-1 block">
            {open ? (
              <FaChevronUp className="text-[10px] ml-auto" />
            ) : (
              <FaChevronDown className="text-[10px] ml-auto" />
            )}
          </span>
        </div>
      </div>

      {open && (
        <div
          className="px-6 pb-4 bg-gray-50/40 border-t border-gray-100"
          style={{ animation: "expandIn .2s ease" }}
        >
          <div className="flex flex-col sm:flex-row gap-4 mt-3">
            {/* Image */}
            {record.imageUrl && (
              <div className="sm:w-36 flex-shrink-0">
                <img
                  src={record.imageUrl}
                  alt="leaf"
                  className="w-full h-28 sm:h-36 object-cover rounded-xl border border-gray-200"
                />
              </div>
            )}
            {/* Top predictions */}
            <div className="flex-1">
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">
                Top Predictions
              </p>
              <div className="space-y-2">
                {record.topPredictions?.slice(0, 5).map((p, i) => {
                  const pConf = parseFloat(p.confidence);
                  return (
                    <div key={p._id}>
                      <div className="flex justify-between mb-0.5">
                        <span className="text-xs font-bold text-[#073319] truncate max-w-[200px]">
                          {i === 0 && "🥇 "}
                          {formatDisease(p.disease)}
                        </span>
                        <span className="text-[10px] text-gray-500 ml-2 flex-shrink-0">
                          {pConf.toFixed(1)}%
                        </span>
                      </div>
                      <MiniBar
                        value={pConf}
                        color={
                          pConf >= 80
                            ? "bg-green-500"
                            : pConf >= 40
                              ? "bg-yellow-500"
                              : "bg-gray-300"
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function DiseaseHistory({ limit }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetch = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const d = await api.diseaseHistory();
      setRecords(d.records || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);
  const shown = limit ? records.slice(0, limit) : records;

  return (
    <Section
      icon="🔬"
      title="Disease Detection History"
      count={records.length}
      color="bg-gradient-to-r from-red-50 to-rose-50"
      linkTo="/ai-services/disease"
      linkLabel="New Detection"
      loading={loading}
      onRefresh={fetch}
    >
      {loading ? (
        <div className="p-6 space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-gray-200 flex-shrink-0" />
              <div className="flex-1 space-y-1.5 py-0.5">
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-2.5 bg-gray-100 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="px-6 py-4 text-xs text-red-500 font-semibold">
          ⚠ {error}
        </div>
      ) : shown.length === 0 ? (
        <EmptyState
          emoji="🔬"
          message="No disease detections yet."
          linkTo="/ai-services/disease"
          linkLabel="Scan First Leaf"
        />
      ) : (
        <>
          {shown.map((r) => (
            <DiseaseHistoryItem key={r._id} record={r} />
          ))}
          {limit && records.length > limit && (
            <div className="px-6 py-3 border-t border-gray-50 text-center">
              <Link
                to="/history"
                className="text-xs font-bold text-green-600 hover:text-green-800 flex items-center justify-center gap-1"
              >
                View all {records.length} records{" "}
                <HiArrowRight className="text-[10px]" />
              </Link>
            </div>
          )}
        </>
      )}
    </Section>
  );
}

/* History page */
export default function HistoryPage() {
  const [tab, setTab] = useState("crop");

  const TABS = [
    { key: "crop", label: "Crop", emoji: "🌾", Component: CropHistory },
    {
      key: "fertilizer",
      label: "Fertilizer",
      emoji: "🧪",
      Component: FertilizerHistory,
    },
    {
      key: "disease",
      label: "Disease",
      emoji: "🔬",
      Component: DiseaseHistory,
    },
  ];

  const Active = TABS.find((t) => t.key === tab)?.Component;

  return (
    <div className="min-h-screen bg-[#f0fdf4] text-[#073319]">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#052e16] via-[#14532d] to-[#16a34a] text-white overflow-hidden py-12 md:py-16">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-green-400/10 blur-3xl pointer-events-none" />
        <div className="relative container mx-auto px-4 md:px-6">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-green-200 text-xs font-bold px-4 py-1.5 rounded-full mb-4 backdrop-blur-sm">
            <FaCalendarAlt /> AI Analysis History
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">
            Your Prediction History
          </h1>
          <p className="text-green-100/70 text-sm">
            All crop, fertilizer, and disease predictions saved from your
            analyses.
          </p>
        </div>
      </section>

      {/* Tab bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 py-2">
          <div className="flex gap-1">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200
                  ${tab === t.key ? "bg-green-600 text-white shadow-md" : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"}`}
              >
                <span>{t.emoji}</span> {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8">
        {Active && <Active />}
      </div>

      <style>{`
        @keyframes expandIn { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}
