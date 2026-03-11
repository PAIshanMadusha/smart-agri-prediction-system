import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaLeaf,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaSeedling,
  FaEdit,
  FaSave,
  FaTimes,
  FaCheckCircle,
  FaShieldAlt,
  FaCalendarAlt,
  FaPlus,
  FaTrash,
  FaLocationArrow,
} from "react-icons/fa";
import {
  MdEmail,
  MdVerified,
  MdCloud,
  MdWaterDrop,
  MdAir,
  MdThermostat,
  MdSpeed,
} from "react-icons/md";
import { HiSparkles } from "react-icons/hi2";
import { WiHumidity, WiStrongWind } from "react-icons/wi";
import { useAuth } from "../../context/useAuth";

/* API */
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const cookieFetch = (path, options = {}) =>
  fetch(`${BASE_URL}${path}`, {
    credentials: "include", // ← sends the httpOnly JWT cookie
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  }).then(async (r) => {
    const data = await r.json();
    if (!r.ok) throw new Error(data.message || "Request failed");
    return data;
  });

const api = {
  // GET  /api/user/profile → { success, user }
  getProfile: () => cookieFetch("/user/profile"),

  // PUT  /api/user/profile → { success, message, user }
  // accepts: { name, phone, location, farmSize, preferredCrops }
  updateProfile: (body) =>
    cookieFetch("/user/profile", { method: "PUT", body: JSON.stringify(body) }),

  // GET  /api/weather?lat=&lon= → { success, weather: {...} }
  getWeather: (lat, lon) => cookieFetch(`/weather?lat=${lat}&lon=${lon}`),
};

/* Helpers */
const GRADIENTS = [
  "from-emerald-500 to-green-700",
  "from-teal-500 to-emerald-700",
  "from-green-500 to-teal-700",
  "from-sky-500 to-cyan-700",
  "from-violet-500 to-purple-700",
  "from-orange-500 to-amber-700",
];
function avatarGrad(name = "") {
  const idx =
    [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % GRADIENTS.length;
  return GRADIENTS[idx];
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
function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-LK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* Role colours */
const ROLE_STYLE = {
  farmer: "bg-emerald-100 text-emerald-700 border-emerald-200",
  researcher: "bg-teal-100    text-teal-700    border-teal-200",
  learner: "bg-green-100   text-green-700   border-green-200",
  visitor: "bg-sky-100     text-sky-700     border-sky-200",
  admin: "bg-red-100     text-red-700     border-red-200",
};

/* Sri Lanka districts */
const SL_DISTRICTS = [
  "Ampara",
  "Anuradhapura",
  "Badulla",
  "Batticaloa",
  "Colombo",
  "Galle",
  "Gampaha",
  "Hambantota",
  "Jaffna",
  "Kalutara",
  "Kandy",
  "Kegalle",
  "Kilinochchi",
  "Kurunegala",
  "Mannar",
  "Matale",
  "Matara",
  "Monaragala",
  "Mullaitivu",
  "Nuwara Eliya",
  "Polonnaruwa",
  "Puttalam",
  "Ratnapura",
  "Trincomalee",
  "Vavuniya",
];

const SL_PROVINCES = [
  "Central",
  "Eastern",
  "North Central",
  "Northern",
  "North Western",
  "Sabaragamuwa",
  "Southern",
  "Uva",
  "Western",
];

const CROP_SUGGESTIONS = [
  "Rice",
  "Maize",
  "Wheat",
  "Tea",
  "Rubber",
  "Coconut",
  "Pepper",
  "Cinnamon",
  "Cardamom",
  "Cloves",
  "Ginger",
  "Turmeric",
  "Chilli",
  "Tomato",
  "Onion",
  "Potato",
  "Cassava",
  "Sweet Potato",
  "Banana",
  "Mango",
  "Pineapple",
  "Papaya",
  "Jackfruit",
  "Sugarcane",
  "Soybean",
  "Groundnut",
  "Cowpea",
];

/* Weather widget */
function WeatherWidget({ lat, lon }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!lat || !lon) return;
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const d = await api.getWeather(lat, lon);
        if (isMounted) {
          setWeather(d.weather);
          setLoading(false);
        }
      } catch (e) {
        if (isMounted) {
          setError(e.message);
          setLoading(false);
        }
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [lat, lon]);

  if (!lat || !lon) return null;

  return (
    <div
      className="bg-gradient-to-br from-sky-500 to-blue-700 text-white rounded-2xl p-5 shadow-lg overflow-hidden relative"
      style={{ boxShadow: "0 8px 32px rgba(14,165,233,.25)" }}
    >
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute bottom-0 -left-4 w-16 h-16 rounded-full bg-white/5 pointer-events-none" />

      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <MdCloud className="text-xl text-sky-200" />
          <span className="text-xs font-extrabold text-sky-200 uppercase tracking-widest">
            Live Weather
          </span>
        </div>

        {loading && (
          <div className="flex items-center gap-2 py-4">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span className="text-xs text-white/70">Fetching weather…</span>
          </div>
        )}

        {error && (
          <p className="text-xs text-red-200 bg-red-500/20 rounded-lg px-3 py-2">
            ⚠ {error}
          </p>
        )}

        {weather && !loading && (
          <>
            <div className="flex items-end justify-between mb-4">
              <div>
                <p className="text-4xl font-extrabold leading-none">
                  {weather.temperature}°C
                </p>
                <p className="text-sm text-sky-200 mt-1 capitalize">
                  {weather.description}
                </p>
                <p className="text-xs text-sky-300/70 mt-0.5 flex items-center gap-1">
                  <FaMapMarkerAlt className="text-[10px]" /> {weather.city}
                </p>
              </div>
              <p className="text-sky-200/70 text-xs">
                Feels {weather.feelsLike}°C
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  icon: <WiHumidity className="text-lg" />,
                  label: "Humidity",
                  val: `${weather.humidity}%`,
                },
                {
                  icon: <WiStrongWind className="text-lg" />,
                  label: "Wind",
                  val: `${weather.windSpeed} m/s`,
                },
                {
                  icon: <MdSpeed className="text-base" />,
                  label: "Pressure",
                  val: `${weather.pressure} hPa`,
                },
                {
                  icon: <MdWaterDrop className="text-base" />,
                  label: "Rainfall",
                  val: `${weather.rainfallLastHour} mm`,
                },
              ].map(({ icon, label, val }) => (
                <div
                  key={label}
                  className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center gap-2"
                >
                  <span className="text-sky-200">{icon}</span>
                  <div>
                    <p className="text-[10px] text-sky-300/70">{label}</p>
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
