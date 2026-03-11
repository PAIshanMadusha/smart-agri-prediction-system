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
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const cookieFetch = (path) =>
  fetch(`${BASE_URL}${path}`, { credentials: "include" }).then(async (r) => {
    const data = await r.json();
    if (!r.ok) throw new Error(data.message || "Failed");
    return data;
  });

const api = {
  getProfile: () => cookieFetch("/user/profile"),
  getWeather: (lat, lon) => cookieFetch(`/weather?lat=${lat}&lon=${lon}`),
  cropHistory: () => cookieFetch("/crop/history"),
  fertilizerHistory: () => cookieFetch("/fertilizer/history"),
  diseaseHistory: () => cookieFetch("/disease/history"),
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
