import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaLeaf,
  FaSeedling,
  FaThermometerHalf,
  FaTint,
  FaCloudRain,
  FaFlask,
  FaLocationArrow,
  FaInfoCircle,
  FaCheckCircle,
  FaTrophy,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { MdAgriculture, MdWaterDrop, MdAir } from "react-icons/md";
import { HiSparkles, HiArrowRight } from "react-icons/hi2";
import { WiHumidity, WiRaindrop } from "react-icons/wi";

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
  // POST /api/crop/predict → { success, recommendations[], recordId }
  predict: (body) =>
    cookieFetch("/crop/predict", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  // GET /api/user/profile → { success, user }  (prefill weather lat/lon)
  getProfile: () => cookieFetch("/user/profile"),

  // GET /api/weather?lat=&lon= → { success, weather }
  getWeather: (lat, lon) => cookieFetch(`/weather?lat=${lat}&lon=${lon}`),
};

/* Crop dataset */
const CROP_DATA = {
  Rice: {
    emoji: "🌾",
    season: "Kharif / Yala",
    duration: "90–120 days",
    idealTemp: "22–32°C",
    idealPh: "5.5–7.0",
    waterNeeds: "High",
    category: "Cereal",
    description:
      "A staple grain crop that thrives in warm, humid conditions with abundant water. Widely cultivated across Sri Lanka's wet zones and paddy regions.",
    tips: "Ensure flooded field conditions during vegetative stage. Drain 2 weeks before harvest.",
    imageUrl:
      "https://images.unsplash.com/photo-1536054247836-e40a84917b84?w=600&q=80",
    color: "from-amber-500 to-yellow-600",
    tagColor: "bg-amber-100 text-amber-700 border-amber-200",
  },
  Maize: {
    emoji: "🌽",
    season: "Kharif / Maha",
    duration: "80–95 days",
    idealTemp: "18–27°C",
    idealPh: "5.8–7.0",
    waterNeeds: "Medium",
    category: "Cereal",
    description:
      "A versatile cereal crop used for food, fodder, and industrial purposes. Adaptable to a wide range of soil types and climatic conditions.",
    tips: "Requires well-drained loamy soil. Apply split doses of nitrogen fertilizer for best yield.",
    imageUrl:
      "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&q=80",
    color: "from-yellow-500 to-orange-500",
    tagColor: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  Chickpea: {
    emoji: "🫘",
    season: "Rabi / Yala",
    duration: "90–100 days",
    idealTemp: "10–25°C",
    idealPh: "6.0–8.0",
    waterNeeds: "Low",
    category: "Pulse",
    description:
      "A drought-tolerant legume that fixes atmospheric nitrogen, improving soil fertility. Excellent for crop rotation systems.",
    tips: "Avoid waterlogging. Inoculate seeds with Rhizobium to enhance nitrogen fixation.",
    imageUrl:
      "https://images.unsplash.com/photo-1608500218807-3d6fc85a5a40?w=600&q=80",
    color: "from-amber-400 to-yellow-500",
    tagColor: "bg-amber-100 text-amber-700 border-amber-200",
  },
  "Kidney Beans": {
    emoji: "🫘",
    season: "Kharif",
    duration: "85–100 days",
    idealTemp: "15–25°C",
    idealPh: "6.0–7.5",
    waterNeeds: "Medium",
    category: "Pulse",
    description:
      "A nutrient-rich legume high in protein. Grows well in cool to warm climates and adds nitrogen to soil through root nodules.",
    tips: "Provide support staking for climbing varieties. Avoid excessive nitrogen at sowing stage.",
    imageUrl:
      "https://images.unsplash.com/photo-1585564559853-4d2d0acbad29?w=600&q=80",
    color: "from-red-500 to-rose-600",
    tagColor: "bg-red-100 text-red-700 border-red-200",
  },
  "Pigeon Peas": {
    emoji: "🌿",
    season: "Kharif",
    duration: "150–180 days",
    idealTemp: "18–30°C",
    idealPh: "5.5–7.0",
    waterNeeds: "Low–Medium",
    category: "Pulse",
    description:
      "A drought-resistant perennial legume that thrives in semi-arid conditions. Highly nutritious and commonly grown in intercropping systems.",
    tips: "Intercrop with maize or sorghum. Tap-rooted system makes it highly drought tolerant.",
    imageUrl:
      "https://images.unsplash.com/photo-1591922935781-a2f8a4d09f31?w=600&q=80",
    color: "from-green-500 to-teal-600",
    tagColor: "bg-green-100 text-green-700 border-green-200",
  },
  "Moth Beans": {
    emoji: "🌱",
    season: "Kharif",
    duration: "75–85 days",
    idealTemp: "25–35°C",
    idealPh: "6.0–8.0",
    waterNeeds: "Low",
    category: "Pulse",
    description:
      "One of the most drought-hardy legumes, ideal for arid and semi-arid regions. Improves soil structure and adds organic matter.",
    tips: "Best suited for sandy loam soils. Minimal irrigation required after establishment.",
    imageUrl:
      "https://images.unsplash.com/photo-1622042002773-a6f2913a6e84?w=600&q=80",
    color: "from-lime-500 to-green-600",
    tagColor: "bg-lime-100 text-lime-700 border-lime-200",
  },
  "Mung Bean": {
    emoji: "🫛",
    season: "Kharif / Rabi",
    duration: "60–75 days",
    idealTemp: "25–35°C",
    idealPh: "6.0–7.5",
    waterNeeds: "Low–Medium",
    category: "Pulse",
    description:
      "A short-duration, warm-season legume prized for its edible sprouts and seeds. Excellent for soil health and crop rotation.",
    tips: "Short duration allows it to fit between two main crops. Minimal irrigation after pod formation.",
    imageUrl:
      "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=600&q=80",
    color: "from-emerald-500 to-green-600",
    tagColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  "Black Gram": {
    emoji: "🌿",
    season: "Kharif / Rabi",
    duration: "70–90 days",
    idealTemp: "25–35°C",
    idealPh: "6.0–7.5",
    waterNeeds: "Medium",
    category: "Pulse",
    description:
      "A highly nutritious protein-rich pulse widely used in South Asian cuisine. Thrives in warm humid climates with moderate rainfall.",
    tips: "Avoid poorly drained soils. Moderate irrigation at flowering and pod filling stages is critical.",
    imageUrl:
      "https://images.unsplash.com/photo-1607532941433-304659e8198a?w=600&q=80",
    color: "from-stone-600 to-gray-700",
    tagColor: "bg-stone-100 text-stone-700 border-stone-200",
  },
  Lentil: {
    emoji: "🫘",
    season: "Rabi",
    duration: "80–110 days",
    idealTemp: "7–27°C",
    idealPh: "6.0–8.0",
    waterNeeds: "Low",
    category: "Pulse",
    description:
      "A cool-season legume packed with protein and fibre. Adapts to poor soils and low rainfall, making it ideal for marginal lands.",
    tips: "Sow in well-drained soils. Sensitive to waterlogging. Light rains at flowering enhance yield.",
    imageUrl:
      "https://images.unsplash.com/photo-1515543904379-3d757e5f5df3?w=600&q=80",
    color: "from-orange-400 to-amber-500",
    tagColor: "bg-orange-100 text-orange-700 border-orange-200",
  },
  Pomegranate: {
    emoji: "🍎",
    season: "Year-round",
    duration: "5–7 months (fruit)",
    idealTemp: "25–35°C",
    idealPh: "5.5–7.0",
    waterNeeds: "Low–Medium",
    category: "Fruit",
    description:
      "A drought-tolerant fruit tree bearing jewel-red fruits rich in antioxidants. Thrives in semi-arid tropical and subtropical climates.",
    tips: "Prune regularly for better aeration. Alternate bearing can be managed with proper thinning.",
    imageUrl:
      "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=600&q=80",
    color: "from-red-500 to-pink-600",
    tagColor: "bg-red-100 text-red-700 border-red-200",
  },
  Banana: {
    emoji: "🍌",
    season: "Year-round",
    duration: "9–12 months",
    idealTemp: "15–35°C",
    idealPh: "5.5–6.5",
    waterNeeds: "High",
    category: "Fruit",
    description:
      "A tropical perennial producing high-calorie fruits. Widely cultivated in Sri Lanka's wet and intermediate zones with year-round harvesting potential.",
    tips: "Requires frequent irrigation. Remove suckers to maintain single stem for commercial production.",
    imageUrl:
      "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&q=80",
    color: "from-yellow-400 to-amber-500",
    tagColor: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  Mango: {
    emoji: "🥭",
    season: "Summer / Yala",
    duration: "3–5 months (fruit)",
    idealTemp: "24–30°C",
    idealPh: "5.5–7.5",
    waterNeeds: "Low–Medium",
    category: "Fruit",
    description:
      "The king of fruits — a tropical tree crop producing sweet, aromatic fruits. Thrives in hot, dry weather during flowering and fruit development.",
    tips: "Avoid rain during flowering. Drought stress before flowering promotes better fruit set.",
    imageUrl:
      "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600&q=80",
    color: "from-orange-400 to-yellow-500",
    tagColor: "bg-orange-100 text-orange-700 border-orange-200",
  },
  Grapes: {
    emoji: "🍇",
    season: "Rabi / Dry season",
    duration: "120–150 days",
    idealTemp: "15–35°C",
    idealPh: "6.0–7.0",
    waterNeeds: "Medium",
    category: "Fruit",
    description:
      "A temperate to sub-tropical vine crop producing clusters of sweet berries. Requires a distinct dry period during ripening for best sugar development.",
    tips: "Train on trellis systems. Canopy management is critical for light penetration and disease control.",
    imageUrl:
      "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=600&q=80",
    color: "from-purple-500 to-violet-600",
    tagColor: "bg-purple-100 text-purple-700 border-purple-200",
  },
  Watermelon: {
    emoji: "🍉",
    season: "Summer / Yala",
    duration: "70–90 days",
    idealTemp: "22–30°C",
    idealPh: "6.0–7.0",
    waterNeeds: "Medium",
    category: "Fruit",
    description:
      "A warm-season vine crop producing large, sweet fruits over 90% water. Grows best in sandy loam soils with long sunny days.",
    tips: "Pollination is critical — maintain bee activity around flowering time. Avoid overhead irrigation.",
    imageUrl:
      "https://images.unsplash.com/photo-1563114773-84221bd62daa?w=600&q=80",
    color: "from-green-500 to-emerald-600",
    tagColor: "bg-green-100 text-green-700 border-green-200",
  },
  Muskmelon: {
    emoji: "🍈",
    season: "Summer",
    duration: "65–85 days",
    idealTemp: "20–32°C",
    idealPh: "6.0–7.0",
    waterNeeds: "Medium",
    category: "Fruit",
    description:
      "A sweet, aromatic melon cultivated in warm, sunny conditions. Performs best in well-drained sandy soils with low humidity during fruit maturation.",
    tips: "Reduce irrigation as fruits approach maturity to concentrate sugars. Use raised beds.",
    imageUrl:
      "https://images.unsplash.com/photo-1571166052181-9c57c47e8c6b?w=600&q=80",
    color: "from-yellow-400 to-orange-400",
    tagColor: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  Apple: {
    emoji: "🍎",
    season: "Spring / Summer",
    duration: "140–160 days",
    idealTemp: "21–24°C",
    idealPh: "5.5–6.5",
    waterNeeds: "Medium",
    category: "Fruit",
    description:
      "A temperate tree fruit requiring a distinct cold chilling period for bud break. Cultivated in cooler highland regions like Nuwara Eliya.",
    tips: "Requires 800–1200 chilling hours below 7°C. Annual pruning is essential for productivity.",
    imageUrl:
      "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&q=80",
    color: "from-red-400 to-rose-500",
    tagColor: "bg-red-100 text-red-700 border-red-200",
  },
  Orange: {
    emoji: "🍊",
    season: "Winter / Dry season",
    duration: "7–8 months",
    idealTemp: "15–30°C",
    idealPh: "6.0–7.5",
    waterNeeds: "Medium",
    category: "Fruit",
    description:
      "A citrus tree crop producing vitamin C-rich fruits. Prefers mild to warm temperatures with a distinct dry season to enhance fruit colour and sweetness.",
    tips: "Apply micronutrients (zinc, boron) regularly. Requires well-drained soil to prevent root rot.",
    imageUrl:
      "https://images.unsplash.com/photo-1557800634-7bf9e72b8048?w=600&q=80",
    color: "from-orange-400 to-amber-500",
    tagColor: "bg-orange-100 text-orange-700 border-orange-200",
  },
  Papaya: {
    emoji: "🍑",
    season: "Year-round",
    duration: "9–11 months",
    idealTemp: "22–26°C",
    idealPh: "6.0–6.5",
    waterNeeds: "Medium",
    category: "Fruit",
    description:
      "A fast-growing tropical tree bearing large, sweet fruits within a year. Highly productive and suited to Sri Lanka's warm lowland regions.",
    tips: "Extremely frost sensitive. Ensure excellent drainage — waterlogging within 24h can kill the plant.",
    imageUrl:
      "https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=600&q=80",
    color: "from-orange-400 to-yellow-500",
    tagColor: "bg-orange-100 text-orange-700 border-orange-200",
  },
  Coconut: {
    emoji: "🥥",
    season: "Year-round",
    duration: "Perennial (6–8 yr to bear)",
    idealTemp: "20–32°C",
    idealPh: "5.5–8.0",
    waterNeeds: "Medium–High",
    category: "Plantation",
    description:
      "A tall palm tree — the 'tree of life' — producing versatile nuts year-round. A cornerstone of Sri Lankan agriculture, industry, and cuisine.",
    tips: "Intercrops well with banana, pineapple, or vegetables. Apply potassium-rich fertilizer regularly.",
    imageUrl:
      "https://images.unsplash.com/photo-1570696516188-ade861b84a49?w=600&q=80",
    color: "from-teal-500 to-green-600",
    tagColor: "bg-teal-100 text-teal-700 border-teal-200",
  },
  Cotton: {
    emoji: "🌸",
    season: "Kharif",
    duration: "150–180 days",
    idealTemp: "20–30°C",
    idealPh: "7.0–8.0",
    waterNeeds: "Medium",
    category: "Cash Crop",
    description:
      "The most important natural textile fibre crop globally. Thrives in black cotton soils with moderate temperatures and a dry harvest period.",
    tips: "Requires dry weather during boll development and harvest. Monitor closely for bollworm infestation.",
    imageUrl:
      "https://images.unsplash.com/photo-1605600659873-d808a13e4d9a?w=600&q=80",
    color: "from-gray-300 to-slate-400",
    tagColor: "bg-gray-100 text-gray-600 border-gray-200",
  },
  Jute: {
    emoji: "🌿",
    season: "Kharif",
    duration: "100–120 days",
    idealTemp: "24–37°C",
    idealPh: "6.0–7.5",
    waterNeeds: "High",
    category: "Fibre Crop",
    description:
      "A tall annual fibre crop known as the 'golden fibre'. Thrives in alluvial flood plains with high humidity and abundant rainfall.",
    tips: "Retting in slow-moving water for 10–20 days after harvest is needed to extract fibre.",
    imageUrl:
      "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=600&q=80",
    color: "from-yellow-600 to-amber-700",
    tagColor: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  Coffee: {
    emoji: "☕",
    season: "Year-round (harvest: Dec–Mar)",
    duration: "Perennial (3 yr to bear)",
    idealTemp: "15–28°C",
    idealPh: "6.0–6.5",
    waterNeeds: "Medium",
    category: "Plantation",
    description:
      "A shade-loving plantation crop producing aromatic beans. Grows in Sri Lanka's mid and upcountry regions at 600–1800m elevation.",
    tips: "Shade trees reduce temperature stress. Selective hand-picking of ripe red cherries gives best quality.",
    imageUrl:
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80",
    color: "from-amber-700 to-brown-800",
    tagColor: "bg-amber-100 text-amber-800 border-amber-300",
  },
};

/* Field config */
const FIELDS = [
  {
    key: "N",
    label: "Nitrogen (N)",
    unit: "kg/ha",
    min: 0,
    max: 200,
    step: 1,
    icon: <FaFlask />,
    hint: "Typical range: 0–140 kg/ha",
    color: "from-blue-500 to-blue-600",
  },
  {
    key: "P",
    label: "Phosphorus (P)",
    unit: "kg/ha",
    min: 0,
    max: 200,
    step: 1,
    icon: <FaFlask />,
    hint: "Typical range: 0–145 kg/ha",
    color: "from-purple-500 to-purple-600",
  },
  {
    key: "K",
    label: "Potassium (K)",
    unit: "kg/ha",
    min: 0,
    max: 210,
    step: 1,
    icon: <FaFlask />,
    hint: "Typical range: 0–205 kg/ha",
    color: "from-violet-500 to-violet-600",
  },
  {
    key: "temperature",
    label: "Temperature",
    unit: "°C",
    min: 0,
    max: 50,
    step: 0.1,
    icon: <FaThermometerHalf />,
    hint: "Typical range: 8–44°C",
    color: "from-orange-500 to-red-500",
  },
  {
    key: "humidity",
    label: "Humidity",
    unit: "%",
    min: 0,
    max: 100,
    step: 0.1,
    icon: <WiHumidity />,
    hint: "Relative humidity: 14–100%",
    color: "from-cyan-500 to-sky-600",
  },
  {
    key: "ph",
    label: "Soil pH",
    unit: "pH",
    min: 0,
    max: 14,
    step: 0.1,
    icon: <FaTint />,
    hint: "Optimal crop range: 3.5–10",
    color: "from-teal-500 to-emerald-600",
  },
  {
    key: "rainfall",
    label: "Rainfall",
    unit: "mm",
    min: 0,
    max: 3000,
    step: 1,
    icon: <FaCloudRain />,
    hint: "Annual rainfall: 20–3000 mm",
    color: "from-sky-500 to-blue-600",
  },
];

const EMPTY_FORM = {
  N: "",
  P: "",
  K: "",
  temperature: "",
  humidity: "",
  ph: "",
  rainfall: "",
};

/* Confidence bar */
function ConfidenceBar({ value, color = "bg-green-500" }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 120);
    return () => clearTimeout(t);
  }, [value]);
  return (
    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
      <div
        className={`h-full ${color} rounded-full transition-all duration-700 ease-out`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

/* Crop card */
function CropCard({ rec, rank, isTop }) {
  const [expanded, setExpanded] = useState(false);
  const info = CROP_DATA[rec.crop] || null;
  const confidence = rec.confidence ?? 0;

  const confidenceColor =
    confidence >= 70
      ? "bg-green-500"
      : confidence >= 40
        ? "bg-yellow-500"
        : confidence >= 10
          ? "bg-orange-500"
          : "bg-gray-300";

  const textColor =
    confidence >= 70
      ? "text-green-600"
      : confidence >= 40
        ? "text-yellow-600"
        : confidence >= 10
          ? "text-orange-500"
          : "text-gray-400";

  return (
    <div
      className={`bg-white rounded-2xl border overflow-hidden transition-all duration-300
        ${isTop ? "border-green-300 shadow-xl ring-2 ring-green-200" : "border-gray-100 shadow-sm hover:shadow-md"}
        ${confidence === 0 ? "opacity-60" : ""}`}
      style={isTop ? { boxShadow: "0 8px 32px rgba(22,163,74,.18)" } : {}}
    >
      {/* Rank badge + image */}
      <div className="relative overflow-hidden h-36">
        {info?.imageUrl ? (
          <img
            src={info.imageUrl}
            alt={rec.crop}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.parentElement.classList.add("bg-gradient-to-br");
              e.target.style.display = "none";
            }}
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${info?.color || "from-gray-300 to-gray-400"} flex items-center justify-center text-5xl`}
          >
            {info?.emoji || "🌱"}
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />

        {/* Rank badge */}
        <div className="absolute top-3 left-3">
          {rank === 1 ? (
            <span className="flex items-center gap-1.5 bg-amber-400 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow">
              <FaTrophy className="text-[10px]" /> Top Pick
            </span>
          ) : (
            <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full border border-white/30">
              #{rank}
            </span>
          )}
        </div>

        {/* Category tag */}
        {info && (
          <div className="absolute top-3 right-3">
            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${info.tagColor} bg-white/90 backdrop-blur-sm`}
            >
              {info.category}
            </span>
          </div>
        )}

        {/* Crop name */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-extrabold text-base leading-tight drop-shadow">
            {rec.crop}
          </h3>
          {info && (
            <p className="text-white/70 text-xs">
              {info.emoji} {info.season}
            </p>
          )}
        </div>
      </div>

      {/* Confidence */}
      <div className="px-4 pt-3.5 pb-2">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold text-gray-500">Confidence</span>
          <span className={`text-sm font-extrabold ${textColor}`}>
            {confidence}%
          </span>
        </div>
        <ConfidenceBar value={confidence} color={confidenceColor} />
      </div>

      {/* Quick stats */}
      {info && (
        <div className="px-4 pb-3 grid grid-cols-3 gap-2">
          {[
            { label: "Temp", val: info.idealTemp },
            { label: "pH", val: info.idealPh },
            { label: "Water", val: info.waterNeeds },
          ].map(({ label, val }) => (
            <div
              key={label}
              className="bg-gray-50 rounded-xl px-2 py-1.5 text-center"
            >
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">
                {label}
              </p>
              <p className="text-[11px] font-bold text-[#073319] mt-0.5 leading-tight">
                {val}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Expandable details */}
      {info && confidence > 0 && (
        <>
          <button
            onClick={() => setExpanded((p) => !p)}
            className="w-full flex items-center justify-between px-4 py-2.5 border-t border-gray-50 text-xs font-bold text-gray-500 hover:text-green-700 hover:bg-green-50 transition-colors"
          >
            More Details
            {expanded ? (
              <FaChevronUp className="text-[10px]" />
            ) : (
              <FaChevronDown className="text-[10px]" />
            )}
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${expanded ? "max-h-72" : "max-h-0"}`}
          >
            <div className="px-4 pb-4 space-y-3">
              <p className="text-xs text-gray-600 leading-relaxed">
                {info.description}
              </p>
              <div className="bg-green-50 border border-green-100 rounded-xl px-3 py-2">
                <p className="text-[10px] font-extrabold text-green-700 uppercase tracking-wider mb-1">
                  💡 Farming Tip
                </p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {info.tips}
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {[{ label: "Duration", val: info.duration }].map(
                  ({ label, val }) => (
                    <span
                      key={label}
                      className="text-[10px] font-semibold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full"
                    >
                      ⏱ {label}: {val}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* Input field */
function InputField({ field, value, onChange, error }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1.5">
        <span className="text-green-500">{field.icon}</span>
        {field.label}
        <span className="text-gray-400 font-normal">({field.unit})</span>
      </label>
      <input
        type="number"
        min={field.min}
        max={field.max}
        step={field.step}
        value={value}
        onChange={(e) => onChange(field.key, e.target.value)}
        placeholder={`e.g. ${field.min + Math.round((field.max - field.min) / 2)}`}
        className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 hover:border-green-300 transition-all
          ${error ? "border-red-300 bg-red-50" : "border-gray-200"}`}
      />
      <p className="text-[10px] text-gray-400 mt-1">{field.hint}</p>
      {error && (
        <p className="text-xs text-red-500 font-semibold mt-0.5">{error}</p>
      )}
    </div>
  );
}
