//TODO: Split into smaller components for better maintainability (e.g. WeatherCard, StatCard, QuickAction, ActivityItem, etc.)
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaLeaf,
  FaSeedling,
  FaFlask,
  FaBug,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUser,
  FaCheckCircle,
  FaArrowUp,
  FaShieldAlt,
} from "react-icons/fa";
import {
  MdAgriculture,
  MdBugReport,
  MdWaterDrop,
  MdThermostat,
  MdAir,
  MdCloud,
  MdSpeed,
} from "react-icons/md";
import { HiSparkles, HiArrowRight } from "react-icons/hi2";
import { WiHumidity, WiStrongWind, WiRaindrop } from "react-icons/wi";
import { useAuth } from "../../context/useAuth";
import { CropHistory, FertilizerHistory, DiseaseHistory } from "./HistoryPage";

/* API */
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const cookieFetch = (path) =>
  fetch(`${BASE_URL}${path}`, { credentials: "include" }).then(async (r) => {
    const data = await r.json();
    if (!r.ok) throw new Error(data.message || "Failed");
    return data;
  });

const api = {
  getProfile: () => cookieFetch("api/user/profile"),
  getWeather: (lat, lon) => cookieFetch(`api/weather?lat=${lat}&lon=${lon}`),
  cropHistory: () => cookieFetch("api/crop/history"),
  fertilizerHistory: () => cookieFetch("api/fertilizer/history"),
  diseaseHistory: () => cookieFetch("api/disease/history"),
};

/* Utils */
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
function avatarGrad(name = "") {
  const GRADS = [
    "from-emerald-500 to-green-700",
    "from-teal-500 to-emerald-700",
    "from-green-500 to-teal-700",
    "from-sky-500 to-cyan-700",
    "from-violet-500 to-purple-700",
    "from-orange-500 to-amber-700",
  ];
  const idx = [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % GRADS.length;
  return GRADS[idx];
}
function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-LK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
function timeAgo(d) {
  if (!d) return "—";
  const diff = (Date.now() - new Date(d)) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

/* Weather card */
function WeatherCard({ lat, lon }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!lat || !lon) return;
    let cancelled = false;
    (async () => {
      // defer the state update so it's not synchronous within the effect
      await Promise.resolve();
      if (cancelled) return;
      setLoading(true);
      try {
        const d = await api.getWeather(lat, lon);
        if (!cancelled) setWeather(d.weather);
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [lat, lon]);

  if (!lat || !lon) {
    return (
      <div
        className="bg-gradient-to-br from-sky-400 to-blue-600 text-white rounded-2xl p-5 shadow-lg flex flex-col items-center justify-center min-h-[160px] text-center"
        style={{ boxShadow: "0 8px 32px rgba(14,165,233,.2)" }}
      >
        <MdCloud className="text-4xl text-white/40 mb-2" />
        <p className="text-xs font-semibold text-white/60 max-w-[150px]">
          Add your location in Profile to see live weather
        </p>
        <Link
          to="/profile"
          className="mt-3 text-xs font-bold bg-white/20 hover:bg-white/30 border border-white/25 px-3 py-1.5 rounded-full transition-colors"
        >
          Set Location →
        </Link>
      </div>
    );
  }

  return (
    <div
      className="bg-gradient-to-br from-sky-500 to-blue-700 text-white rounded-2xl p-5 shadow-lg overflow-hidden relative"
      style={{ boxShadow: "0 8px 32px rgba(14,165,233,.25)" }}
    >
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-16 h-16 rounded-full bg-white/5 pointer-events-none translate-x-4 translate-y-4" />

      <div className="relative">
        <div className="flex items-center gap-1.5 mb-3">
          <MdCloud className="text-sky-200 text-base" />
          <span className="text-[10px] font-extrabold text-sky-200 uppercase tracking-widest">
            Live Weather
          </span>
        </div>

        {loading && (
          <div className="flex items-center gap-2 py-3">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span className="text-xs text-white/60">Fetching…</span>
          </div>
        )}
        {error && (
          <p className="text-xs text-red-200 bg-red-500/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {weather && !loading && (
          <>
            <div className="flex items-end justify-between mb-3">
              <div>
                <p className="text-4xl font-extrabold leading-none">
                  {weather.temperature}°<span className="text-2xl">C</span>
                </p>
                <p className="text-sm text-sky-200 mt-1 capitalize">
                  {weather.description}
                </p>
                <p className="text-xs text-sky-300/70 mt-0.5 flex items-center gap-1">
                  <FaMapMarkerAlt className="text-[9px]" />
                  {weather.city}
                </p>
              </div>
              <p className="text-sky-200/70 text-xs pb-1">
                Feels {weather.feelsLike}°C
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  icon: <WiHumidity className="text-base" />,
                  label: "Humidity",
                  val: `${weather.humidity}%`,
                },
                {
                  icon: <WiStrongWind className="text-base" />,
                  label: "Wind",
                  val: `${weather.windSpeed} m/s`,
                },
                {
                  icon: <MdSpeed className="text-sm" />,
                  label: "Pressure",
                  val: `${weather.pressure} hPa`,
                },
                {
                  icon: <WiRaindrop className="text-base" />,
                  label: "Rain",
                  val: `${weather.rainfallLastHour}mm`,
                },
              ].map(({ icon, label, val }) => (
                <div
                  key={label}
                  className="bg-white/10 backdrop-blur-sm rounded-xl px-2.5 py-2 flex items-center gap-2"
                >
                  <span className="text-sky-200 flex-shrink-0">{icon}</span>
                  <div>
                    <p className="text-[9px] text-sky-300/70">{label}</p>
                    <p className="text-xs font-bold">{val}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* Stat card */
function StatCard({ icon, label, value, sub, color, delay = 0 }) {
  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow duration-300"
      style={{ animation: `fadeSlide .5s ease ${delay}ms both` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-sm text-white text-lg`}
        >
          {icon}
        </div>
        <FaArrowUp className="text-green-400 text-xs mt-1" />
      </div>
      <p className="text-3xl font-extrabold text-[#073319] mb-0.5">{value}</p>
      <p className="text-xs font-bold text-gray-500">{label}</p>
      {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

/* Quick action card */
function QuickAction({ emoji, title, desc, to, color, delay = 0 }) {
  return (
    <Link
      to={to}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col gap-3 relative overflow-hidden"
      style={{ animation: `fadeSlide .5s ease ${delay}ms both` }}
    >
      <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-10 bg-gradient-to-br from-green-400 to-emerald-600 group-hover:opacity-20 transition-opacity" />
      <div
        className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl shadow-md`}
      >
        {emoji}
      </div>
      <div>
        <h4 className="text-sm font-extrabold text-[#073319] mb-0.5">
          {title}
        </h4>
        <p className="text-[11px] text-gray-500 leading-relaxed">{desc}</p>
      </div>
      <div className="flex items-center gap-1 text-xs font-bold text-green-600 group-hover:text-green-800 transition-colors mt-auto">
        Try Now{" "}
        <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}

/* Recent activity card */
function ActivityItem({ emoji, title, sub, time, color }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <div
        className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-base flex-shrink-0 shadow-sm`}
      >
        {emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-[#073319] truncate">{title}</p>
        <p className="text-[11px] text-gray-400 truncate">{sub}</p>
      </div>
      <p className="text-[10px] text-gray-400 flex-shrink-0">{time}</p>
    </div>
  );
}

/* Dashboard card */
export default function DashboardPage() {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [counts, setCounts] = useState({ crop: 0, fertilizer: 0, disease: 0 });
  const [recent, setRecent] = useState([]);
  const [statsLoad, setStatsLoad] = useState(true);
  const [activeHistory, setActiveHistory] = useState("crop");

  /* Greet by time */
  const hour = new Date().getHours();
  const greet =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  /* Fetch profile + weather + counts */
  useEffect(() => {
    api
      .getProfile()
      .then((d) => setProfile(d.user))
      .catch(() => {});

    Promise.all([
      api.cropHistory(),
      api.fertilizerHistory(),
      api.diseaseHistory(),
    ])
      .then(([c, f, d]) => {
        const cropRecs = c.records || [];
        const fertRecs = f.records || [];
        const diseaseRecs = d.records || [];

        setCounts({
          crop: cropRecs.length,
          fertilizer: fertRecs.length,
          disease: diseaseRecs.length,
        });

        // Build unified recent activity (latest 6)
        const all = [
          ...cropRecs.map((r) => ({
            type: "crop",
            emoji: "🌾",
            time: r.createdAt,
            title: r.recommendedCrops?.[0]?.crop || "Crop recommendation",
            sub: `${r.recommendedCrops?.[0]?.confidence}% confidence · N:${r.soilData?.nitrogen} P:${r.soilData?.phosphorus} K:${r.soilData?.potassium}`,
            color: "from-green-400 to-emerald-600",
          })),
          ...fertRecs.map((r) => ({
            type: "fertilizer",
            emoji: "🧪",
            time: r.createdAt,
            title:
              r.recommendedFertilizers?.[0]?.fertilizer ||
              "Fertilizer suggestion",
            sub: `${r.cropType} · ${r.soilType} soil · ${parseFloat(r.recommendedFertilizers?.[0]?.confidence || 0).toFixed(1)}%`,
            color: "from-amber-400 to-orange-500",
          })),
          ...diseaseRecs.map((r) => {
            const parts = r.predictedDisease?.split("___") || [];
            const display = parts[1]?.replace(/_/g, " ") || r.predictedDisease;
            return {
              type: "disease",
              emoji: "🔬",
              time: r.createdAt,
              title: display || "Disease detection",
              sub: `${parseFloat(r.confidenceScore).toFixed(1)}% confidence${r.isLowConfidence ? " · ⚠ Low confidence" : ""}`,
              color: "from-red-400 to-rose-600",
            };
          }),
        ]
          .sort((a, b) => new Date(b.time) - new Date(a.time))
          .slice(0, 6);

        setRecent(all);
        setStatsLoad(false);
      })
      .catch(() => setStatsLoad(false));
  }, []);

  const user = profile || authUser;
  const lat = profile?.location?.latitude;
  const lon = profile?.location?.longitude;
  const totalAnalyses = counts.crop + counts.fertilizer + counts.disease;

  const HISTORY_TABS = [
    { key: "crop", label: "Crop", emoji: "🌾" },
    { key: "fertilizer", label: "Fertilizer", emoji: "🧪" },
    { key: "disease", label: "Disease", emoji: "🔬" },
  ];

  return (
    <div className="min-h-screen bg-[#f0fdf4] text-[#073319]">
      {/* Hero welcome banner */}
      <section className="relative bg-gradient-to-br from-[#052e16] via-[#14532d] to-[#16a34a] text-white overflow-hidden pt-10 pb-20 md:pb-24">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-green-400/10 blur-3xl pointer-events-none" />
        <div
          className="absolute bottom-0 left-0 w-full h-12 bg-[#f0fdf4]"
          style={{
            borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
            transform: "scaleX(1.5)",
          }}
        />

        <div className="relative container mx-auto px-4 md:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div>
              <p className="text-green-300/70 text-sm font-semibold mb-1">
                {greet},
              </p>
              <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-2">
                {user?.name || "Farmer"} 👋
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs font-bold bg-white/15 border border-white/20 text-green-100 px-3 py-1.5 rounded-full capitalize backdrop-blur-sm">
                  {user?.role || "farmer"}
                </span>
                {user?.isVerified && (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-green-200">
                    <FaCheckCircle className="text-green-300 text-sm" />{" "}
                    Verified Account
                  </span>
                )}
                {(user?.location?.district || user?.location?.province) && (
                  <span className="flex items-center gap-1.5 text-xs text-green-200/70">
                    <FaMapMarkerAlt className="text-[10px]" />
                    {[user.location.district, user.location.province]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                )}
              </div>
            </div>

            {/* Avatar */}
            <div
              className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${avatarGrad(user?.name || "")} text-white text-2xl md:text-3xl font-extrabold flex items-center justify-center shadow-2xl border-4 border-white/20 flex-shrink-0`}
              style={{ boxShadow: "0 8px 32px rgba(0,0,0,.2)" }}
            >
              {initials(user?.name || "")}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 -mt-10 pb-16 space-y-8">
        {/* stat card */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statsLoad ? (
            [...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse h-[120px]"
              >
                <div className="w-11 h-11 bg-gray-200 rounded-xl mb-3" />
                <div className="h-5 bg-gray-200 rounded w-1/2 mb-1.5" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            ))
          ) : (
            <>
              <StatCard
                icon={<MdAgriculture />}
                label="Crop Analyses"
                value={counts.crop}
                sub="AI recommendations"
                color="from-green-500 to-emerald-700"
                delay={0}
              />
              <StatCard
                icon={<FaFlask />}
                label="Fertilizer Checks"
                value={counts.fertilizer}
                sub="Soil-based suggestions"
                color="from-amber-500 to-orange-600"
                delay={80}
              />
              <StatCard
                icon={<MdBugReport />}
                label="Disease Scans"
                value={counts.disease}
                sub="Leaf image analyses"
                color="from-red-500 to-rose-700"
                delay={160}
              />
              <StatCard
                icon={<HiSparkles />}
                label="Total Analyses"
                value={totalAnalyses}
                sub="AI-powered insights"
                color="from-violet-500 to-purple-700"
                delay={240}
              />
            </>
          )}
        </div>

        {/* Column middle row */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-base font-extrabold text-[#073319] mb-4 flex items-center gap-2">
              <HiSparkles className="text-green-500" /> AI Tools
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <QuickAction
                emoji="🌾"
                title="Crop Recommendation"
                desc="Get AI crop advice from your soil NPK and weather data."
                to="/ai-services/crop"
                color="from-green-100 to-emerald-200"
                delay={0}
              />
              <QuickAction
                emoji="🧪"
                title="Fertilizer Suggestion"
                desc="Find the best fertilizer for your soil type and crop."
                to="/ai-services/fertilizer"
                color="from-amber-100 to-yellow-200"
                delay={80}
              />
              <QuickAction
                emoji="🔬"
                title="Disease Detection"
                desc="Upload a leaf photo for instant AI disease diagnosis."
                to="/ai-services/disease"
                color="from-red-100 to-rose-200"
                delay={160}
              />
            </div>

            {/* Profile & Community links */}
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <Link
                to="/profile"
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-4"
                style={{ animation: "fadeSlide .5s ease 240ms both" }}
              >
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${avatarGrad(user?.name || "")} flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0`}
                >
                  {initials(user?.name || "")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-extrabold text-[#073319]">
                    My Profile
                  </p>
                  <p className="text-[11px] text-gray-400 truncate">
                    {user?.email || "Update your details"}
                  </p>
                </div>
                <HiArrowRight className="text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                to="/community"
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-4"
                style={{ animation: "fadeSlide .5s ease 320ms both" }}
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-500 to-green-600 flex items-center justify-center text-white text-xl flex-shrink-0">
                  🌍
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-extrabold text-[#073319]">
                    Community
                  </p>
                  <p className="text-[11px] text-gray-400">
                    Share with fellow farmers
                  </p>
                </div>
                <HiArrowRight className="text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>

          {/* Weather Profile Summary */}
          <div className="space-y-4">
            <WeatherCard lat={lat} lon={lon} />

            {/* Profile summary card */}
            <div
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
              style={{ animation: "fadeSlide .5s ease 400ms both" }}
            >
              <p className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <FaUser className="text-green-500 text-sm" /> Profile Summary
              </p>
              <div className="space-y-2.5">
                {[
                  {
                    label: "Role",
                    val: user?.role,
                    icon: <FaShieldAlt className="text-green-500 text-xs" />,
                  },
                  {
                    label: "Farm Size",
                    val: user?.farmSize ? `${user.farmSize} acres` : null,
                    icon: <MdAgriculture className="text-amber-500 text-sm" />,
                  },
                  {
                    label: "Member",
                    val: fmtDate(user?.createdAt),
                    icon: <FaCalendarAlt className="text-blue-500 text-xs" />,
                  },
                ].map(
                  ({ label, val, icon }) =>
                    val && (
                      <div key={label} className="flex items-center gap-2.5">
                        {icon}
                        <div className="flex-1 flex items-center justify-between">
                          <span className="text-xs text-gray-500">{label}</span>
                          <span className="text-xs font-bold text-[#073319] capitalize">
                            {val}
                          </span>
                        </div>
                      </div>
                    ),
                )}
                {/* Preferred crops */}
                {user?.preferredCrops?.length > 0 && (
                  <div>
                    <p className="text-[10px] text-gray-400 mb-1.5">
                      Preferred Crops
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {user.preferredCrops.slice(0, 4).map((c) => (
                        <span
                          key={c}
                          className="text-[10px] font-bold bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 rounded-full"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <Link
                to="/profile"
                className="flex items-center gap-1.5 text-xs font-bold text-green-600 hover:text-green-800 mt-4 transition-colors"
              >
                Edit Profile <HiArrowRight className="text-[10px]" />
              </Link>
            </div>
          </div>
        </div>

        {/* Recent activity*/}
        {recent.length > 0 && (
          <div
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            style={{ animation: "fadeSlide .5s ease 450ms both" }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50 bg-gradient-to-r from-green-50 to-emerald-50">
              <h3 className="font-extrabold text-[#073319] text-sm flex items-center gap-2">
                <FaCalendarAlt className="text-green-500" /> Recent Activity
              </h3>
              <Link
                to="/history"
                className="text-xs font-bold text-green-600 hover:text-green-800 flex items-center gap-1"
              >
                View All <HiArrowRight className="text-[10px]" />
              </Link>
            </div>
            <div className="px-6 py-2">
              {recent.map((a, i) => (
                <ActivityItem key={i} {...a} time={timeAgo(a.time)} />
              ))}
            </div>
          </div>
        )}

        {/* History tabs section */}
        <div style={{ animation: "fadeSlide .5s ease 500ms both" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-extrabold text-[#073319] flex items-center gap-2">
              <FaCalendarAlt className="text-green-500" /> Analysis History
            </h2>
            <Link
              to="/history"
              className="text-xs font-bold text-green-600 hover:text-green-800 flex items-center gap-1"
            >
              Full History <HiArrowRight className="text-[10px]" />
            </Link>
          </div>

          {/* Tab strip */}
          <div className="flex gap-1.5 mb-5 flex-wrap">
            {HISTORY_TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveHistory(t.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200
                  ${activeHistory === t.key ? "bg-green-600 text-white shadow-md" : "bg-white border border-gray-200 text-gray-500 hover:border-green-300 hover:text-green-700"}`}
              >
                {t.emoji} {t.label}
              </button>
            ))}
          </div>

          {/* Render active history component with limit=3 for dashboard preview */}
          {activeHistory === "crop" && <CropHistory limit={3} />}
          {activeHistory === "fertilizer" && <FertilizerHistory limit={3} />}
          {activeHistory === "disease" && <DiseaseHistory limit={3} />}
        </div>
      </div>

      <style>{`
        @keyframes fadeSlide { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes expandIn  { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}
