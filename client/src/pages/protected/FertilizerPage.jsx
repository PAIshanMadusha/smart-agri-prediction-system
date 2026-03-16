//TODO: Split into smaller components for better maintainability (e.g. FertilizerCard, SoilTypeSelector, CropTypeSelector, NumField, etc.)
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaFlask,
  FaThermometerHalf,
  FaTint,
  FaLeaf,
  FaSeedling,
  FaCheckCircle,
  FaTrophy,
  FaInfoCircle,
  FaChevronDown,
  FaChevronUp,
  FaLocationArrow,
} from "react-icons/fa";
import { MdAgriculture, MdAir, MdWaterDrop } from "react-icons/md";
import { HiSparkles, HiArrowRight } from "react-icons/hi2";
import { WiHumidity } from "react-icons/wi";

/* API */
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const cookieFetch = (path, options = {}) =>
  fetch(`${BASE_URL}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  }).then(async (r) => {
    const data = await r.json();
    if (!r.ok) throw new Error(data.message || data.error || "Request failed");
    return data;
  });

const api = {
  predict: (body) =>
    cookieFetch("api/fertilizer/predict", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  getProfile: () => cookieFetch("api/user/profile"),
  getWeather: (lat, lon) => cookieFetch(`api/weather?lat=${lat}&lon=${lon}`),
};

/* Dataset */
const SOIL_TYPES = ["Loamy", "Clayey", "Red", "Sandy", "Black"];

const CROP_TYPES = [
  "Tomato",
  "Sugarcane",
  "Wheat",
  "Rice",
  "Groundnut",
  "Tobacco",
  "Potato",
  "Banana",
  "Cotton",
  "Barley",
  "Pulses",
  "Oil seeds",
  "Millets",
  "Ground Nuts",
  "Maize",
];

/* Fertilizer info dataset */
const FERTILIZER_DATA = {
  Urea: {
    formula: "CO(NH₂)₂",
    npk: "46-0-0",
    type: "Nitrogenous",
    color: "from-blue-500 to-blue-700",
    tagColor: "bg-blue-100 text-blue-700 border-blue-200",
    emoji: "🔵",
    nutrient: "Nitrogen",
    description:
      "The most widely used nitrogen fertilizer globally. Highly soluble and rapidly absorbed by plants. Best applied before irrigation or rainfall to prevent volatilization losses.",
    bestFor:
      "All crops requiring nitrogen boost — cereals, vegetables, legumes",
    applicationRate: "45–60 kg/ha (split doses)",
    timing: "Basal + top-dressing at tillering/vegetative stage",
    caution:
      "Avoid surface application under hot, dry conditions. Inhibits nitrification temporarily.",
    advantages: [
      "Highest nitrogen content (46%)",
      "Cost-effective",
      "Highly water-soluble",
      "Suitable for all crop types",
    ],
  },
  "NPK 17-17-17": {
    formula: "N-P₂O₅-K₂O",
    npk: "17-17-17",
    type: "Balanced NPK",
    color: "from-emerald-500 to-green-700",
    tagColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
    emoji: "🟢",
    nutrient: "N + P + K (Equal)",
    description:
      "A perfectly balanced granular fertilizer providing equal proportions of all three major nutrients. Ideal for general-purpose soil enrichment and starter applications.",
    bestFor: "Most crops requiring uniform macronutrient supply",
    applicationRate: "150–250 kg/ha at basal",
    timing: "Primarily at sowing/transplanting as basal dose",
    caution:
      "Monitor soil pH before application. May cause nutrient imbalance on soils already high in P or K.",
    advantages: [
      "Balanced macro nutrition",
      "Reduces multiple fertilizer use",
      "Good for nutrient-depleted soils",
      "Uniform granule distribution",
    ],
  },
  "NPK 19-19-19": {
    formula: "N-P₂O₅-K₂O",
    npk: "19-19-19",
    type: "Balanced NPK",
    color: "from-teal-500 to-emerald-700",
    tagColor: "bg-teal-100 text-teal-700 border-teal-200",
    emoji: "🟢",
    nutrient: "N + P + K (Higher)",
    description:
      "Higher-concentration balanced NPK suitable for fertigation and foliar applications. Fully water-soluble — excellent for drip irrigation systems.",
    bestFor: "High-value crops, greenhouse, and precision farming",
    applicationRate: "100–200 kg/ha via fertigation",
    timing: "Multiple split applications through crop cycle",
    caution:
      "Fully soluble — manage application rates carefully to avoid salt stress.",
    advantages: [
      "Water-soluble for fertigation",
      "High analysis grade",
      "Minimal residue",
      "Ideal for drip systems",
    ],
  },
  "NPK 10-26-26": {
    formula: "N-P₂O₅-K₂O",
    npk: "10-26-26",
    type: "P+K Dominant",
    color: "from-purple-500 to-violet-700",
    tagColor: "bg-purple-100 text-purple-700 border-purple-200",
    emoji: "🟣",
    nutrient: "Phosphorus + Potassium",
    description:
      "A fertilizer emphasising phosphorus and potassium for root development, flowering, and fruiting. Low nitrogen content makes it ideal for P and K deficient soils.",
    bestFor: "Root crops, fruit crops, flowering stages",
    applicationRate: "100–150 kg/ha at basal + pre-flowering",
    timing: "Basal application + reproductive stage top-dressing",
    caution:
      "Combine with nitrogen source for balanced nutrition early in crop cycle.",
    advantages: [
      "Boosts root establishment",
      "Improves fruit quality",
      "Enhances stress resistance",
      "Ideal for K-deficient soils",
    ],
  },
  SSP: {
    formula: "Ca(H₂PO₄)₂ · CaSO₄",
    npk: "0-16-0 + 12% S",
    type: "Phosphatic",
    color: "from-gray-500 to-slate-600",
    tagColor: "bg-gray-100 text-gray-700 border-gray-200",
    emoji: "⚪",
    nutrient: "Phosphorus + Sulphur",
    description:
      "Single Super Phosphate — the oldest and most economical phosphate fertilizer. Provides phosphorus and sulphur simultaneously, beneficial for oilseed crops.",
    bestFor: "Oilseeds, pulses, groundnut — sulphur-responsive crops",
    applicationRate: "200–400 kg/ha at basal",
    timing:
      "Incorporate into soil before sowing — not suitable for top-dressing",
    caution:
      "Low P concentration means higher application volumes needed. Store in dry conditions.",
    advantages: [
      "Provides sulphur too",
      "Highly cost-effective",
      "Improves oil content",
      "Broad soil compatibility",
    ],
  },
  DAP: {
    formula: "(NH₄)₂HPO₄",
    npk: "18-46-0",
    type: "Phosphatic",
    color: "from-rose-500 to-red-700",
    tagColor: "bg-rose-100 text-rose-700 border-rose-200",
    emoji: "🔴",
    nutrient: "Phosphorus + Nitrogen",
    description:
      "Di-Ammonium Phosphate — the world's most widely used phosphate fertilizer. Highly concentrated phosphorus source with a nitrogen supplement for early crop establishment.",
    bestFor: "All crops — especially at sowing stage for root development",
    applicationRate: "100–150 kg/ha at basal",
    timing: "Placed in seed rows at sowing for maximum root contact",
    caution:
      "Alkaline reaction — avoid placing in direct seed contact. Ammonia toxicity at high rates.",
    advantages: [
      "Highest P concentration",
      "Improves germination & rooting",
      "Globally proven performance",
      "Good soil mobility",
    ],
  },
  MOP: {
    formula: "KCl",
    npk: "0-0-60",
    type: "Potassic",
    color: "from-orange-500 to-amber-600",
    tagColor: "bg-orange-100 text-orange-700 border-orange-200",
    emoji: "🟠",
    nutrient: "Potassium",
    description:
      "Muriate of Potash — the most economical potassium fertilizer containing 60% K₂O. Improves crop quality, disease resistance, and water use efficiency.",
    bestFor:
      "Potassium-deficient soils, quality improvement in fruits & vegetables",
    applicationRate: "60–100 kg/ha K₂O",
    timing: "Basal application or split — avoid during drought",
    caution:
      "High chloride content — avoid for chloride-sensitive crops (potato, tobacco, fruits). Saline soils need caution.",
    advantages: [
      "Highest K concentration (60%)",
      "Cost-effective potassium",
      "Improves crop quality",
      "Wide crop compatibility",
    ],
  },
  "NPK 14-35-14": {
    formula: "N-P₂O₅-K₂O",
    npk: "14-35-14",
    type: "P-Dominant",
    color: "from-indigo-500 to-blue-700",
    tagColor: "bg-indigo-100 text-indigo-700 border-indigo-200",
    emoji: "🔷",
    nutrient: "Phosphorus-Rich",
    description:
      "A phosphorus-dominant NPK ideal for establishing strong root systems. The high P content combined with N and K makes it excellent for transplanting and early growth stages.",
    bestFor:
      "Transplanted crops, seedbed preparation, phosphorus-deficient soils",
    applicationRate: "100–200 kg/ha at basal",
    timing: "Apply at transplanting or sowing for root establishment",
    caution: "Soil test recommended before use to prevent P over-application.",
    advantages: [
      "Excellent for transplanting",
      "Strong root development",
      "Good starter fertilizer",
      "Balanced macro support",
    ],
  },
  "NPK 20-20-0": {
    formula: "N-P₂O₅-K₂O",
    npk: "20-20-0",
    type: "N+P Compound",
    color: "from-cyan-500 to-sky-700",
    tagColor: "bg-cyan-100 text-cyan-700 border-cyan-200",
    emoji: "🔵",
    nutrient: "Nitrogen + Phosphorus",
    description:
      "A dual-nutrient fertilizer rich in both nitrogen and phosphorus without potassium. Suited for early vegetative stages when K levels in soil are already adequate.",
    bestFor: "Crops on K-sufficient soils, early vegetative growth",
    applicationRate: "150–200 kg/ha at basal",
    timing: "Basal and early vegetative stage applications",
    caution: "Supplement with potassium source if soil K is deficient.",
    advantages: [
      "No unwanted K addition",
      "Dual macro nutrition",
      "Good for K-rich soils",
      "Versatile application",
    ],
  },
  "NPK 28-28-0": {
    formula: "N-P₂O₅-K₂O",
    npk: "28-28-0",
    type: "High N+P",
    color: "from-sky-500 to-blue-700",
    tagColor: "bg-sky-100 text-sky-700 border-sky-200",
    emoji: "💠",
    nutrient: "High N + High P",
    description:
      "Higher concentration N+P fertilizer for intensive crop systems. Delivers substantial nitrogen and phosphorus in a single application with no potassium.",
    bestFor: "High-yield intensive crops on potassium-adequate soils",
    applicationRate: "100–150 kg/ha at basal",
    timing: "Primarily at sowing for nutrient-intensive cropping systems",
    caution:
      "Monitor soil potassium — supplement with MOP if K deficiency is observed.",
    advantages: [
      "High nutrient concentration",
      "Fewer bags needed",
      "Efficient for intensive farming",
      "Good N:P ratio",
    ],
  },
};

/* Soil type descriptions */
const SOIL_INFO = {
  Loamy: {
    desc: "Balanced mixture of sand, silt, and clay. Excellent water retention and drainage. Most fertile soil type.",
    emoji: "🟫",
  },
  Clayey: {
    desc: "High clay content with fine particles. Good nutrient retention but poor drainage. Needs organic matter amendments.",
    emoji: "🟤",
  },
  Red: {
    desc: "Rich in iron oxides. Well-drained but low in nitrogen and phosphorus. Common in dry upland areas.",
    emoji: "🔴",
  },
  Sandy: {
    desc: "Low nutrient and water retention. Fast drainage — requires frequent fertilization and irrigation.",
    emoji: "🟡",
  },
  Black: {
    desc: "High clay content with excellent moisture retention. Rich in calcium, magnesium and potassium. Ideal for cotton.",
    emoji: "⚫",
  },
};

/* Fertilizer card */
function FertilizerCard({ rec, rank, isTop }) {
  const [expanded, setExpanded] = useState(false);
  const info = FERTILIZER_DATA[rec.fertilizer] || null;
  const confidence = parseFloat(rec.confidence ?? 0).toFixed(1);
  const confNum = parseFloat(confidence);

  const barColor =
    confNum >= 60
      ? "bg-green-500"
      : confNum >= 30
        ? "bg-yellow-500"
        : confNum >= 10
          ? "bg-orange-500"
          : "bg-gray-300";

  const textColor =
    confNum >= 60
      ? "text-green-600"
      : confNum >= 30
        ? "text-yellow-600"
        : confNum >= 10
          ? "text-orange-500"
          : "text-gray-400";

  const [barWidth, setBarWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setBarWidth(confNum), 150 + rank * 80);
    return () => clearTimeout(t);
  }, [confNum, rank]);

  return (
    <div
      className={`bg-white rounded-2xl border overflow-hidden transition-all duration-300
      ${isTop ? "border-green-300 shadow-xl ring-2 ring-green-200" : "border-gray-100 shadow-sm hover:shadow-md"}
      ${confNum < 1 ? "opacity-50" : ""}`}
      style={isTop ? { boxShadow: "0 8px 32px rgba(22,163,74,.18)" } : {}}
    >
      {/* Coloured header band */}
      <div
        className={`bg-gradient-to-r ${info?.color || "from-gray-400 to-gray-600"} p-5 relative overflow-hidden`}
      >
        <div className="absolute -right-4 -top-4 text-7xl opacity-15 select-none font-extrabold">
          {info?.emoji}
        </div>
        <div className="relative flex items-start justify-between">
          <div>
            {rank === 1 ? (
              <span className="inline-flex items-center gap-1.5 bg-white/25 backdrop-blur-sm text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-white/30 mb-2">
                <FaTrophy className="text-[9px] text-amber-300" /> Best Match
              </span>
            ) : (
              <span className="text-white/60 text-[10px] font-bold mb-2 block">
                #{rank}
              </span>
            )}
            <h3 className="text-white font-extrabold text-lg leading-tight">
              {rec.fertilizer}
            </h3>
            {info && (
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-white/70 text-xs font-mono">
                  {info.formula}
                </span>
                <span className="text-white/50 text-[10px]">·</span>
                <span className="text-white/70 text-xs">NPK {info.npk}</span>
              </div>
            )}
          </div>
          {info && (
            <span
              className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${info.tagColor} bg-white/90 backdrop-blur-sm flex-shrink-0`}
            >
              {info.type}
            </span>
          )}
        </div>
      </div>

      {/* Confidence */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold text-gray-500">
            Confidence Score
          </span>
          <span className={`text-sm font-extrabold ${textColor}`}>
            {confidence}%
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full ${barColor} rounded-full transition-all duration-700 ease-out`}
            style={{ width: `${barWidth}%` }}
          />
        </div>
      </div>

      {/* Primary nutrient */}
      {info && (
        <div className="px-5 pb-3">
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 mt-2">
            <FaFlask className="text-green-500 text-xs flex-shrink-0" />
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                Primary Nutrient
              </p>
              <p className="text-xs font-bold text-[#073319]">
                {info.nutrient}
              </p>
            </div>
            <div className="ml-auto">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider text-right">
                Rate
              </p>
              <p className="text-xs font-bold text-[#073319] text-right">
                {info.applicationRate?.split("(")[0].trim()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Expandable */}
      {info && confNum > 0 && (
        <>
          <button
            onClick={() => setExpanded((p) => !p)}
            className="w-full flex items-center justify-between px-5 py-2.5 border-t border-gray-50 text-xs font-bold text-gray-500 hover:text-green-700 hover:bg-green-50 transition-colors"
          >
            Full Details
            {expanded ? (
              <FaChevronUp className="text-[10px]" />
            ) : (
              <FaChevronDown className="text-[10px]" />
            )}
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${expanded ? "max-h-[400px]" : "max-h-0"}`}
          >
            <div className="px-5 pb-5 space-y-3">
              <p className="text-xs text-gray-600 leading-relaxed">
                {info.description}
              </p>

              <div className="grid grid-cols-1 gap-2">
                <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
                  <p className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider mb-1">
                    ⏱ Timing
                  </p>
                  <p className="text-xs text-gray-600">{info.timing}</p>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
                  <p className="text-[10px] font-extrabold text-blue-700 uppercase tracking-wider mb-1">
                    🌾 Best For
                  </p>
                  <p className="text-xs text-gray-600">{info.bestFor}</p>
                </div>
                <div className="bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                  <p className="text-[10px] font-extrabold text-red-600 uppercase tracking-wider mb-1">
                    ⚠ Caution
                  </p>
                  <p className="text-xs text-gray-600">{info.caution}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">
                  ✅ Advantages
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {info.advantages.map((a) => (
                    <span
                      key={a}
                      className="text-[10px] font-semibold bg-green-50 text-green-700 border border-green-100 px-2 py-1 rounded-full"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* Soil type selector */
function SoilTypeSelector({ value, onChange, error }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-600 mb-2">
        Soil Type <span className="text-red-400">*</span>
      </label>
      <div className="grid grid-cols-5 gap-2">
        {SOIL_TYPES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onChange("soil_type", s)}
            className={`flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl border-2 text-center transition-all duration-200 hover:-translate-y-0.5
              ${
                value === s
                  ? "border-green-500 bg-green-50 shadow-md scale-[1.02]"
                  : "border-gray-200 hover:border-green-300 hover:bg-green-50"
              }`}
          >
            <span className="text-xl">{SOIL_INFO[s]?.emoji}</span>
            <span
              className={`text-[10px] font-extrabold leading-tight ${value === s ? "text-green-700" : "text-gray-600"}`}
            >
              {s}
            </span>
          </button>
        ))}
      </div>
      {value && (
        <p className="text-[11px] text-gray-500 mt-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
          <span className="font-bold text-green-700">About {value} soil:</span>{" "}
          {SOIL_INFO[value]?.desc}
        </p>
      )}
      {error && (
        <p className="text-xs text-red-500 font-semibold mt-1">{error}</p>
      )}
    </div>
  );
}

/* Crop type */
function CropTypeSelector({ value, onChange, error }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-600 mb-2">
        Crop Type <span className="text-red-400">*</span>
      </label>
      <div className="relative">
        <FaSeedling className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green-500 text-sm pointer-events-none" />
        <select
          value={value}
          onChange={(e) => onChange("crop_type", e.target.value)}
          className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 hover:border-green-300 transition-all bg-white appearance-none
            ${error ? "border-red-300 bg-red-50" : "border-gray-200"} ${!value ? "text-gray-400" : "text-[#073319]"}`}
        >
          <option value="">Select a crop…</option>
          {CROP_TYPES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <FaChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
      </div>
      {error && (
        <p className="text-xs text-red-500 font-semibold mt-1">{error}</p>
      )}
    </div>
  );
}

/* Numerical Field */
function NumField({
  fkey,
  label,
  unit,
  icon,
  min,
  max,
  step = 1,
  hint,
  value,
  onChange,
  error,
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1.5">
        <span className="text-green-500 text-sm">{icon}</span>
        {label} <span className="text-gray-400 font-normal">({unit})</span>
      </label>
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(fkey, e.target.value)}
        placeholder={`e.g. ${Math.round((min + max) / 2)}`}
        className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 hover:border-green-300 transition-all
          ${error ? "border-red-300 bg-red-50" : "border-gray-200"}`}
      />
      <p className="text-[10px] text-gray-400 mt-0.5">{hint}</p>
      {error && (
        <p className="text-xs text-red-500 font-semibold mt-0.5">{error}</p>
      )}
    </div>
  );
}

const NUM_FIELDS = [
  {
    fkey: "temperature",
    label: "Temperature",
    unit: "°C",
    icon: <FaThermometerHalf />,
    min: 0,
    max: 50,
    step: 0.1,
    hint: "Ambient temp: 0–50°C",
    weather: true,
  },
  {
    fkey: "humidity",
    label: "Humidity",
    unit: "%",
    icon: <WiHumidity />,
    min: 0,
    max: 100,
    step: 0.1,
    hint: "Relative humidity",
    weather: true,
  },
  {
    fkey: "moisture",
    label: "Soil Moisture",
    unit: "%",
    icon: <MdWaterDrop />,
    min: 0,
    max: 100,
    step: 0.1,
    hint: "Soil moisture content",
    weather: false,
  },
  {
    fkey: "nitrogen",
    label: "Nitrogen",
    unit: "kg/ha",
    icon: <FaFlask />,
    min: 0,
    max: 200,
    step: 1,
    hint: "Soil nitrogen level",
    weather: false,
  },
  {
    fkey: "potassium",
    label: "Potassium",
    unit: "kg/ha",
    icon: <FaFlask />,
    min: 0,
    max: 210,
    step: 1,
    hint: "Soil potassium level",
    weather: false,
  },
  {
    fkey: "phosphorous",
    label: "Phosphorous",
    unit: "kg/ha",
    icon: <FaFlask />,
    min: 0,
    max: 200,
    step: 1,
    hint: "Soil phosphorous level",
    weather: false,
  },
];

const EMPTY_FORM = {
  temperature: "",
  humidity: "",
  moisture: "",
  nitrogen: "",
  potassium: "",
  phosphorous: "",
  soil_type: "",
  crop_type: "",
};

/* Main page */
export default function FertilizerRecommendationPage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [results, setResults] = useState(null);
  const [recordId, setRecordId] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherCity, setWeatherCity] = useState("");
  const [profileLoaded, setProfileLoaded] = useState(false);
  const resultsRef = useRef(null);

  /* Auto-fill temperature + humidity from profile weather */
  useEffect(() => {
    api
      .getProfile()
      .then(async ({ user }) => {
        const lat = user?.location?.latitude;
        const lon = user?.location?.longitude;
        if (!lat || !lon) return;
        setWeatherLoading(true);
        try {
          const { weather } = await api.getWeather(lat, lon);
          setForm((p) => ({
            ...p,
            temperature: weather.temperature ?? p.temperature,
            humidity: weather.humidity ?? p.humidity,
          }));
          setWeatherCity(weather.city || "");
          setProfileLoaded(true);
        } catch {
          /* silent */
        } finally {
          setWeatherLoading(false);
        }
      })
      .catch(() => {});
  }, []);

  const setField = (key, val) => {
    setForm((p) => ({ ...p, [key]: val }));
    setFieldErrors((p) => ({ ...p, [key]: undefined }));
    setApiError("");
  };

  const validate = () => {
    const errs = {};
    NUM_FIELDS.forEach(({ fkey, label, min, max }) => {
      const v = parseFloat(form[fkey]);
      if (form[fkey] === "" || isNaN(v)) errs[fkey] = `${label} is required.`;
      else if (v < min || v > max) errs[fkey] = `Must be ${min}–${max}.`;
    });
    if (!form.soil_type) errs.soil_type = "Please select a soil type.";
    if (!form.crop_type) errs.crop_type = "Please select a crop type.";
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }
    setLoading(true);
    setApiError("");
    setResults(null);
    try {
      const payload = {
        ...Object.fromEntries(
          NUM_FIELDS.map(({ fkey }) => [fkey, parseFloat(form[fkey])]),
        ),
        soil_type: form.soil_type,
        crop_type: form.crop_type,
      };
      const data = await api.predict(payload);
      setResults(data.recommendations);
      setRecordId(data.recordId);
      setTimeout(
        () =>
          resultsRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          }),
        120,
      );
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm(EMPTY_FORM);
    setResults(null);
    setRecordId(null);
    setApiError("");
    setFieldErrors({});
  };

  const topResult = results?.[0];
  const topInfo = topResult ? FERTILIZER_DATA[topResult.fertilizer] : null;

  return (
    <div className="min-h-screen bg-[#f0fdf4] text-[#073319]">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#052e16] via-[#14532d] to-[#16a34a] text-white overflow-hidden py-14 md:py-20">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-green-400/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-16 w-72 h-72 rounded-full bg-emerald-300/10 blur-3xl pointer-events-none translate-y-1/2" />

        <div className="relative container mx-auto px-4 md:px-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-green-200 text-xs font-bold px-4 py-1.5 rounded-full mb-5 backdrop-blur-sm">
              <HiSparkles className="text-green-300" /> AI-Powered · XGBoost
              Model · 10 Fertilizer Types
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              Fertilizer Suggestion
              <br />
              <span className="text-green-300">for Your Soil & Crop</span>
            </h1>
            <p className="text-green-100/70 text-sm md:text-base leading-relaxed max-w-lg">
              Provide your soil nutrient levels, environmental data, soil type
              and crop type to receive AI-ranked fertilizer recommendations with
              full application guidance.
            </p>
            <div className="flex flex-wrap gap-2.5 mt-6">
              {[
                { icon: "🧪", text: "10 Fertilizer Types" },
                { icon: "🌱", text: "15 Supported Crops" },
                { icon: "🪨", text: "5 Soil Types" },
                { icon: "⚡", text: "XGBoost Powered" },
              ].map(({ icon, text }) => (
                <span
                  key={text}
                  className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/15 text-xs font-semibold text-green-100 px-3 py-1.5 rounded-full"
                >
                  {icon} {text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 py-10">
        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Input form */}
          <div className="lg:col-span-2 space-y-5">
            {/* Weather prefill notice */}
            {(weatherLoading || profileLoaded) && (
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-xs font-semibold
                ${weatherLoading ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-green-50 border-green-200 text-green-700"}`}
                style={{ animation: "fadeIn .3s ease" }}
              >
                {weatherLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin flex-shrink-0" />{" "}
                    Fetching live weather…
                  </>
                ) : (
                  <>
                    <FaCheckCircle className="text-green-500 flex-shrink-0" />{" "}
                    Temperature & humidity from live weather
                    {weatherCity ? ` in ${weatherCity}` : ""}. Verify before
                    submitting.
                  </>
                )}
              </div>
            )}

            {/* Environmental */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-50 bg-gradient-to-r from-sky-50 to-cyan-50">
                <MdAir className="text-sky-500 text-base" />
                <h3 className="font-extrabold text-[#073319] text-sm">
                  Environmental Conditions
                </h3>
                {profileLoaded && (
                  <span className="ml-auto text-[10px] font-bold text-green-600 flex items-center gap-1">
                    <FaLocationArrow className="text-[8px]" /> Auto-filled
                  </span>
                )}
              </div>
              <div className="px-6 py-5 space-y-4">
                {NUM_FIELDS.filter((f) => f.weather).map((f) => (
                  <NumField
                    key={f.fkey}
                    {...f}
                    value={form[f.fkey]}
                    onChange={setField}
                    error={fieldErrors[f.fkey]}
                  />
                ))}
                {/* Moisture here */}
                <NumField
                  {...NUM_FIELDS[2]}
                  value={form.moisture}
                  onChange={setField}
                  error={fieldErrors.moisture}
                />
              </div>
            </div>

            {/* Soil Nutrients */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-50 bg-gradient-to-r from-amber-50 to-yellow-50">
                <FaFlask className="text-amber-500" />
                <h3 className="font-extrabold text-[#073319] text-sm">
                  Soil Nutrients
                </h3>
                <span className="text-[10px] text-gray-400 font-medium ml-auto">
                  kg/ha
                </span>
              </div>
              <div className="px-6 py-5 space-y-4">
                {NUM_FIELDS.filter(
                  (f) => !f.weather && f.fkey !== "moisture",
                ).map((f) => (
                  <NumField
                    key={f.fkey}
                    {...f}
                    value={form[f.fkey]}
                    onChange={setField}
                    error={fieldErrors[f.fkey]}
                  />
                ))}
              </div>
            </div>

            {/* Soil Type */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-50 bg-gradient-to-r from-amber-50 to-orange-50">
                <span className="text-base">🪨</span>
                <h3 className="font-extrabold text-[#073319] text-sm">
                  Soil & Crop Type
                </h3>
              </div>
              <div className="px-6 py-5 space-y-5">
                <SoilTypeSelector
                  value={form.soil_type}
                  onChange={setField}
                  error={fieldErrors.soil_type}
                />
                <CropTypeSelector
                  value={form.crop_type}
                  onChange={setField}
                  error={fieldErrors.crop_type}
                />
              </div>
            </div>

            {/* API Error */}
            {apiError && (
              <div
                className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold px-4 py-3 rounded-xl"
                style={{ animation: "shake .4s ease" }}
              >
                ⚠ {apiError}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              {results && (
                <button
                  onClick={handleReset}
                  className="flex-1 border-2 border-gray-200 text-gray-600 font-bold py-3.5 rounded-xl text-sm hover:border-gray-300 hover:bg-gray-50 transition-all"
                >
                  Reset
                </button>
              )}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`${results ? "flex-[2]" : "w-full"} flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg
                  ${loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90 hover:-translate-y-0.5 hover:shadow-xl"}`}
                style={
                  !loading
                    ? { boxShadow: "0 6px 24px rgba(22,163,74,.35)" }
                    : {}
                }
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                    Analysing…
                  </>
                ) : (
                  <>
                    <FaFlask className="text-sm" /> Get Fertilizer Suggestions
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center flex items-center gap-1.5 justify-center">
              <FaInfoCircle className="text-[10px]" /> Results are saved to your
              recommendation history
            </p>
          </div>

          {/* Result */}
          <div className="lg:col-span-3" ref={resultsRef}>
            {/* Idle */}
            {!results && !loading && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center min-h-[420px] flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-yellow-100 border border-amber-200 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-5">
                  🧪
                </div>
                <h3 className="font-extrabold text-[#073319] text-lg mb-2">
                  Ready to Recommend
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-7">
                  Enter your soil data, select your soil type and crop, then hit{" "}
                  <strong>Get Fertilizer Suggestions</strong>.
                </p>
                <div className="grid grid-cols-2 gap-2.5 w-full max-w-xs">
                  {["Urea 🔵", "DAP 🔴", "MOP 🟠", "NPK 17-17-17 🟢"].map(
                    (f) => (
                      <div
                        key={f}
                        className="bg-green-50 border border-green-100 rounded-xl px-3 py-2 text-xs font-semibold text-green-700 text-center"
                      >
                        {f}
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse"
                  >
                    <div
                      className={`h-20 bg-gradient-to-r from-gray-200 to-gray-300`}
                    />
                    <div className="p-4 space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                      <div className="h-2.5 bg-gray-100 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Results */}
            {results && !loading && (
              <div style={{ animation: "fadeSlide .5s ease" }}>
                {/* Top banner */}
                <div
                  className={`bg-gradient-to-r ${topInfo?.color || "from-green-500 to-emerald-700"} text-white rounded-2xl p-5 mb-5 shadow-lg overflow-hidden relative`}
                  style={{ boxShadow: "0 8px 32px rgba(22,163,74,.25)" }}
                >
                  <div className="absolute -right-4 -top-4 text-8xl opacity-10 select-none font-mono">
                    {topInfo?.emoji}
                  </div>
                  <div className="relative">
                    <p className="text-xs font-bold text-white/70 uppercase tracking-widest mb-1">
                      Best Fertilizer Match
                    </p>
                    <h2 className="text-2xl font-extrabold mb-0.5">
                      {topResult?.fertilizer}
                    </h2>
                    {topInfo && (
                      <p className="text-white/70 text-xs font-mono mb-2">
                        Formula: {topInfo.formula} &nbsp;·&nbsp; NPK:{" "}
                        {topInfo.npk}
                      </p>
                    )}
                    <p className="text-white/75 text-sm mb-3 max-w-md">
                      {topInfo?.description?.slice(0, 100)}…
                    </p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="bg-white/20 backdrop-blur-sm border border-white/25 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                        🎯 {parseFloat(topResult?.confidence).toFixed(1)}%
                        Confidence
                      </span>
                      <span className="bg-white/15 text-white/80 text-xs font-bold px-3 py-1.5 rounded-full border border-white/20 capitalize">
                        {form.crop_type} · {form.soil_type} Soil
                      </span>
                      {recordId && (
                        <span className="text-white/40 text-[10px] font-mono">
                          ID: {recordId.slice(-8)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Input recap */}
                <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4 mb-5 shadow-sm">
                  <p className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <FaFlask className="text-green-500" /> Input Summary
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-2">
                    {NUM_FIELDS.map((f) => (
                      <div
                        key={f.fkey}
                        className="text-center bg-gray-50 rounded-xl px-2 py-2"
                      >
                        <p className="text-[9px] font-bold text-gray-400 uppercase">
                          {f.fkey}
                        </p>
                        <p className="text-xs font-extrabold text-[#073319] mt-0.5">
                          {form[f.fkey]}
                        </p>
                        <p className="text-[9px] text-gray-400">{f.unit}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <span className="flex items-center gap-1.5 text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100 px-3 py-1.5 rounded-full">
                      🪨 {form.soil_type} Soil
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-bold bg-green-50 text-green-700 border border-green-100 px-3 py-1.5 rounded-full">
                      🌾 {form.crop_type}
                    </span>
                  </div>
                </div>

                {/* Fertilizer cards */}
                <div className="space-y-4">
                  {results.map((rec, i) => (
                    <FertilizerCard
                      key={rec.fertilizer}
                      rec={rec}
                      rank={i + 1}
                      isTop={i === 0}
                    />
                  ))}
                </div>

                {/* Footer actions */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button
                    onClick={handleReset}
                    className="flex-1 border-2 border-green-200 text-green-700 font-bold py-3 rounded-xl text-sm hover:bg-green-50 transition-all"
                  >
                    Try Different Values
                  </button>
                  <Link
                    to="/dashboard"
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3 rounded-xl text-sm hover:opacity-90 transition-all shadow"
                    style={{ boxShadow: "0 4px 16px rgba(22,163,74,.3)" }}
                  >
                    View History in Dashboard <HiArrowRight />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn    { from{opacity:0}                             to{opacity:1}              }
        @keyframes fadeSlide { from{opacity:0;transform:translateY(12px)}  to{opacity:1;transform:translateY(0)} }
        @keyframes shake     { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-5px)} 40%{transform:translateX(5px)} 60%{transform:translateX(-3px)} 80%{transform:translateX(3px)} }
      `}</style>
    </div>
  );
}
