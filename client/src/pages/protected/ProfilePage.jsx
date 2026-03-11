//TODO: Split into smaller components for better maintainability (e.g. WeatherWidget, SectionCard, FieldRow, etc.)
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

/* Section card */
function SectionCard({ title, icon, children, action }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
        <div className="flex items-center gap-2.5">
          <span className="text-green-500 text-base">{icon}</span>
          <h3 className="font-extrabold text-[#073319] text-sm">{title}</h3>
        </div>
        {action}
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

/* Field row */
function FieldRow({ label, value, icon }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <span className="text-green-400 text-sm mt-0.5 flex-shrink-0">
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
          {label}
        </p>
        <p className="text-sm font-semibold text-[#073319] break-words">
          {value || (
            <span className="text-gray-300 font-normal italic">Not set</span>
          )}
        </p>
      </div>
    </div>
  );
}

/* Profile page */
export default function ProfilePage() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [locLoading, setLocLoading] = useState(false);

  /* Edit form state mirrors backend updateProfile accepted fields */
  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: {
      district: "",
      province: "",
      latitude: "",
      longitude: "",
    },
    farmSize: "",
    preferredCrops: [],
  });

  const [cropInput, setCropInput] = useState("");

  /* Fetch profile on mount */
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // GET /api/user/profile cookie sent automatically
      const data = await api.getProfile();
      setProfile(data.user);
      // Pre-fill form
      setForm({
        name: data.user.name || "",
        phone: data.user.phone || "",
        location: {
          district: data.user.location?.district || "",
          province: data.user.location?.province || "",
          latitude: data.user.location?.latitude ?? "",
          longitude: data.user.location?.longitude ?? "",
        },
        farmSize: data.user.farmSize ?? "",
        preferredCrops: data.user.preferredCrops || [],
      });
    } catch (err) {
      if (
        err.message.includes("401") ||
        err.message.toLowerCase().includes("token")
      ) {
        navigate("/login");
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  /* Get device location fill lat/lon */
  const handleGetLocation = () => {
    if (!navigator.geolocation) return;
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setForm((p) => ({
          ...p,
          location: {
            ...p.location,
            latitude: parseFloat(coords.latitude.toFixed(6)),
            longitude: parseFloat(coords.longitude.toFixed(6)),
          },
        }));
        setLocLoading(false);
      },
      () => setLocLoading(false),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  /* Save profile */
  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaveLoading(true);
    setSaveSuccess(false);
    try {
      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim() || undefined,
        location: {
          district: form.location.district || undefined,
          province: form.location.province || undefined,
          latitude:
            form.location.latitude !== ""
              ? Number(form.location.latitude)
              : undefined,
          longitude:
            form.location.longitude !== ""
              ? Number(form.location.longitude)
              : undefined,
        },
        farmSize: form.farmSize !== "" ? Number(form.farmSize) : 0,
        preferredCrops: form.preferredCrops,
      };
      // PUT /api/user/profile → { success, message, user }
      const data = await api.updateProfile(payload);
      setProfile(data.user);
      // Sync auth context name if changed
      if (setUser) setUser((p) => ({ ...p, name: data.user.name }));
      setSaveSuccess(true);
      setEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  /* Crop tag helpers */
  const addCrop = (crop) => {
    const c = crop.trim();
    if (!c || form.preferredCrops.includes(c)) return;
    setForm((p) => ({ ...p, preferredCrops: [...p.preferredCrops, c] }));
    setCropInput("");
  };
  const removeCrop = (c) =>
    setForm((p) => ({
      ...p,
      preferredCrops: p.preferredCrops.filter((x) => x !== c),
    }));

  /* Cancel edit */
  const cancelEdit = () => {
    if (!profile) return;
    setForm({
      name: profile.name || "",
      phone: profile.phone || "",
      location: {
        district: profile.location?.district || "",
        province: profile.location?.province || "",
        latitude: profile.location?.latitude ?? "",
        longitude: profile.location?.longitude ?? "",
      },
      farmSize: profile.farmSize ?? "",
      preferredCrops: profile.preferredCrops || [],
    });
    setEditing(false);
    setError("");
  };

  /* Loading state */
  if (loading)
    return (
      <div className="min-h-screen bg-[#f0fdf4] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-400 font-semibold">
            Loading profile…
          </p>
        </div>
      </div>
    );

  /* Error state */
  if (!profile && error)
    return (
      <div className="min-h-screen bg-[#f0fdf4] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">
            ⚠️
          </div>
          <h3 className="font-extrabold text-[#073319] mb-2">
            Could not load profile
          </h3>
          <p className="text-sm text-gray-500 mb-5">{error}</p>
          <button
            onClick={fetchProfile}
            className="inline-flex items-center gap-2 bg-green-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-green-700 transition-colors shadow"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  const lat = profile?.location?.latitude;
  const lon = profile?.location?.longitude;

  return (
    <div className="min-h-screen bg-[#f0fdf4] text-[#073319]">
      {/* Hero image */}
      <div className="relative bg-gradient-to-br from-[#052e16] via-[#14532d] to-[#16a34a] text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-green-400/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-72 h-36 rounded-full bg-emerald-300/10 blur-3xl pointer-events-none" />

        <div className="relative container mx-auto px-4 md:px-6 pt-10 pb-24 md:pb-28">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-green-200 text-xs font-bold px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
            <FaUser className="text-green-300" /> My Profile
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-1">
                {profile?.name}
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border capitalize ${ROLE_STYLE[profile?.role] || "bg-white/20 text-white border-white/30"}`}
                >
                  {profile?.role}
                </span>
                {profile?.isVerified && (
                  <span className="flex items-center gap-1 text-xs font-bold text-green-200">
                    <MdVerified className="text-base text-green-300" /> Verified
                  </span>
                )}
              </div>
            </div>

            {/* Edit / Save buttons */}
            <div className="flex gap-2.5">
              {editing ? (
                <>
                  <button
                    onClick={cancelEdit}
                    className="flex items-center gap-2 bg-white/10 border border-white/25 hover:bg-white/20 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all"
                  >
                    <FaTimes className="text-xs" /> Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saveLoading}
                    className={`flex items-center gap-2 bg-white text-green-700 font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow
                      ${saveLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-green-50 hover:-translate-y-0.5"}`}
                  >
                    {saveLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-green-300 border-t-green-700 rounded-full animate-spin" />{" "}
                        Saving…
                      </>
                    ) : (
                      <>
                        <FaSave className="text-xs" /> Save Changes
                      </>
                    )}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 bg-white/15 border border-white/25 hover:bg-white/25 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all backdrop-blur-sm"
                >
                  <FaEdit className="text-xs" /> Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Avatar */}
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative -mt-12 md:-mt-14 mb-6 flex items-end gap-5">
          <div
            className={`w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-gradient-to-br ${avatarGrad(profile?.name)} text-white text-3xl md:text-4xl font-extrabold flex items-center justify-center shadow-xl border-4 border-white flex-shrink-0`}
            style={{ boxShadow: "0 8px 32px rgba(22,163,74,.3)" }}
          >
            {initials(profile?.name)}
          </div>
          <div className="pb-2">
            <p className="text-xs text-gray-400 font-semibold">Member since</p>
            <p className="text-sm font-bold text-[#073319]">
              {fmtDate(profile?.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Content grid */}
      <div className="container mx-auto px-4 md:px-6 pb-16">
        {/* Success toast */}
        {saveSuccess && (
          <div
            className="flex items-center gap-3 bg-green-500 text-white text-sm font-bold px-5 py-3 rounded-2xl mb-6 shadow-lg"
            style={{
              animation: "slideIn .3s ease",
              boxShadow: "0 4px 20px rgba(22,163,74,.35)",
            }}
          >
            <FaCheckCircle /> Profile updated successfully!
          </div>
        )}

        {/* API error */}
        {error && editing && (
          <div
            className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold px-4 py-3 rounded-xl mb-5"
            style={{ animation: "shake .4s ease" }}
          >
            ⚠ {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6 items-start">
          {/* Left column*/}
          <div className="space-y-5">
            {/* Account Info (read-only) */}
            <SectionCard title="Account Info" icon={<FaShieldAlt />}>
              <FieldRow
                label="Email"
                value={profile?.email}
                icon={<MdEmail />}
              />
              <FieldRow
                label="Role"
                value={<span className="capitalize">{profile?.role}</span>}
                icon={<FaUser />}
              />
              <FieldRow
                label="Verified"
                value={profile?.isVerified ? "Yes ✓" : "Pending"}
                icon={<MdVerified />}
              />
              <FieldRow
                label="Last Login"
                value={fmtDate(profile?.lastLogin)}
                icon={<FaCalendarAlt />}
              />
              <FieldRow
                label="Member Since"
                value={fmtDate(profile?.createdAt)}
                icon={<HiSparkles />}
              />
            </SectionCard>

            {/* Weather widget only shows if lat/lon saved */}
            <WeatherWidget lat={lat} lon={lon} />

            {/* Location coords card */}
            {(lat || lon) && (
              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <p className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-green-500" /> Coordinates
                </p>
                <p className="text-xs font-semibold text-[#073319]">
                  Lat: {lat}
                </p>
                <p className="text-xs font-semibold text-[#073319]">
                  Lon: {lon}
                </p>
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="lg:col-span-2 space-y-5">
            {/* Personal Details */}
            <SectionCard title="Personal Details" icon={<FaUser />}>
              {editing ? (
                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5">
                      Full Name *
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, name: e.target.value }))
                        }
                        className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 hover:border-green-300 transition-all"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>
                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5">
                      Phone Number
                    </label>
                    <div className="relative">
                      <FaPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, phone: e.target.value }))
                        }
                        className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 hover:border-green-300 transition-all"
                        placeholder="+94 71 234 5678"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <FieldRow
                    label="Full Name"
                    value={profile?.name}
                    icon={<FaUser />}
                  />
                  <FieldRow
                    label="Phone"
                    value={profile?.phone}
                    icon={<FaPhone />}
                  />
                  <FieldRow
                    label="Email"
                    value={profile?.email}
                    icon={<MdEmail />}
                  />
                </>
              )}
            </SectionCard>

            {/* Location */}
            <SectionCard title="Location" icon={<FaMapMarkerAlt />}>
              {editing ? (
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* District */}
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5">
                        District
                      </label>
                      <select
                        value={form.location.district}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            location: {
                              ...p.location,
                              district: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3.5 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 hover:border-green-300 transition-all bg-white text-gray-700"
                      >
                        <option value="">Select district…</option>
                        {SL_DISTRICTS.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Province */}
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5">
                        Province
                      </label>
                      <select
                        value={form.location.province}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            location: {
                              ...p.location,
                              province: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3.5 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 hover:border-green-300 transition-all bg-white text-gray-700"
                      >
                        <option value="">Select province…</option>
                        {SL_PROVINCES.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Lat / Lon */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-gray-600">
                        GPS Coordinates
                      </label>
                      <button
                        type="button"
                        onClick={handleGetLocation}
                        disabled={locLoading}
                        className="flex items-center gap-1.5 text-xs font-bold text-green-600 hover:text-green-800 transition-colors disabled:opacity-60"
                      >
                        {locLoading ? (
                          <span className="w-3 h-3 border border-green-400/30 border-t-green-600 rounded-full animate-spin block" />
                        ) : (
                          <FaLocationArrow className="text-[10px]" />
                        )}
                        {locLoading ? "Detecting…" : "Use My Location"}
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-extrabold text-gray-400 pointer-events-none">
                          LAT
                        </span>
                        <input
                          type="number"
                          step="0.000001"
                          value={form.location.latitude}
                          onChange={(e) =>
                            setForm((p) => ({
                              ...p,
                              location: {
                                ...p.location,
                                latitude: e.target.value,
                              },
                            }))
                          }
                          className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all"
                          placeholder="7.8731"
                        />
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-extrabold text-gray-400 pointer-events-none">
                          LON
                        </span>
                        <input
                          type="number"
                          step="0.000001"
                          value={form.location.longitude}
                          onChange={(e) =>
                            setForm((p) => ({
                              ...p,
                              location: {
                                ...p.location,
                                longitude: e.target.value,
                              },
                            }))
                          }
                          className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all"
                          placeholder="80.7718"
                        />
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1.5">
                      Coordinates are used for live weather data. Click "Use My
                      Location" to auto-fill.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <FieldRow
                    label="District"
                    value={profile?.location?.district}
                    icon={<FaMapMarkerAlt />}
                  />
                  <FieldRow
                    label="Province"
                    value={profile?.location?.province}
                    icon={<FaMapMarkerAlt />}
                  />
                  <FieldRow
                    label="Latitude"
                    value={profile?.location?.latitude}
                    icon={<FaLocationArrow />}
                  />
                  <FieldRow
                    label="Longitude"
                    value={profile?.location?.longitude}
                    icon={<FaLocationArrow />}
                  />
                </>
              )}
            </SectionCard>

            {/* Farm Details */}
            <SectionCard title="Farm Details" icon={<FaLeaf />}>
              {editing ? (
                <div className="space-y-4">
                  {/* Farm size */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5">
                      Farm Size (acres)
                    </label>
                    <div className="relative">
                      <FaLeaf className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none" />
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={form.farmSize}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, farmSize: e.target.value }))
                        }
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 hover:border-green-300 transition-all"
                        placeholder="e.g. 2.5"
                      />
                    </div>
                  </div>

                  {/* Preferred crops */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5">
                      Preferred Crops
                    </label>

                    {/* Tag input */}
                    <div className="relative flex items-center gap-2 mb-2">
                      <div className="relative flex-1">
                        <FaSeedling className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
                        <input
                          type="text"
                          value={cropInput}
                          onChange={(e) => setCropInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === ",") {
                              e.preventDefault();
                              addCrop(cropInput);
                            }
                          }}
                          list="crop-suggestions"
                          placeholder="Type crop & press Enter…"
                          className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 hover:border-green-300 transition-all"
                        />
                        <datalist id="crop-suggestions">
                          {CROP_SUGGESTIONS.filter(
                            (c) => !form.preferredCrops.includes(c),
                          ).map((c) => (
                            <option key={c} value={c} />
                          ))}
                        </datalist>
                      </div>
                      <button
                        type="button"
                        onClick={() => addCrop(cropInput)}
                        className="w-10 h-10 bg-green-600 hover:bg-green-700 text-white rounded-xl flex items-center justify-center flex-shrink-0 transition-colors shadow"
                      >
                        <FaPlus className="text-xs" />
                      </button>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {form.preferredCrops.map((c) => (
                        <span
                          key={c}
                          className="flex items-center gap-1.5 bg-green-100 text-green-700 border border-green-200 text-xs font-bold px-3 py-1.5 rounded-full"
                        >
                          <FaSeedling className="text-[9px]" /> {c}
                          <button
                            onClick={() => removeCrop(c)}
                            className="text-green-500 hover:text-red-500 transition-colors ml-0.5"
                          >
                            <FaTimes className="text-[9px]" />
                          </button>
                        </span>
                      ))}
                      {form.preferredCrops.length === 0 && (
                        <p className="text-xs text-gray-300 italic">
                          No crops added yet
                        </p>
                      )}
                    </div>

                    {/* Quick-add suggestions */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {CROP_SUGGESTIONS.filter(
                        (c) => !form.preferredCrops.includes(c),
                      )
                        .slice(0, 8)
                        .map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => addCrop(c)}
                            className="text-[10px] font-semibold bg-gray-100 hover:bg-green-100 hover:text-green-700 text-gray-500 border border-gray-200 hover:border-green-200 px-2.5 py-1 rounded-full transition-all"
                          >
                            + {c}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <FieldRow
                    label="Farm Size"
                    value={
                      profile?.farmSize ? `${profile.farmSize} acres` : null
                    }
                    icon={<FaLeaf />}
                  />
                  <div className="py-2.5">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Preferred Crops
                    </p>
                    {profile?.preferredCrops?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {profile.preferredCrops.map((c) => (
                          <span
                            key={c}
                            className="flex items-center gap-1.5 bg-green-100 text-green-700 border border-green-200 text-xs font-bold px-3 py-1.5 rounded-full"
                          >
                            <FaSeedling className="text-[9px]" /> {c}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-300 italic">Not set</p>
                    )}
                  </div>
                </>
              )}
            </SectionCard>

            {/* Bottom edit actions (mobile-friendly) */}
            {editing && (
              <div className="flex gap-3 lg:hidden">
                <button
                  onClick={cancelEdit}
                  className="flex-1 border-2 border-gray-200 text-gray-600 font-bold py-3 rounded-xl text-sm hover:border-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saveLoading}
                  className={`flex-[2] flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3 rounded-xl text-sm transition-all shadow
                    ${saveLoading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90 hover:-translate-y-0.5 shadow-lg"}`}
                  style={
                    !saveLoading
                      ? { boxShadow: "0 4px 16px rgba(22,163,74,.3)" }
                      : {}
                  }
                >
                  {saveLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                      Saving…
                    </>
                  ) : (
                    <>
                      <FaSave className="text-xs" /> Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shake   { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-5px)} 40%{transform:translateX(5px)} 60%{transform:translateX(-3px)} 80%{transform:translateX(3px)} }
      `}</style>
    </div>
  );
}
