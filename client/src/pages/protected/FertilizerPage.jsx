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
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
    cookieFetch("/fertilizer/predict", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  getProfile: () => cookieFetch("/user/profile"),
  getWeather: (lat, lon) => cookieFetch(`/weather?lat=${lat}&lon=${lon}`),
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
