//TODO: Split into smaller components for better maintainability (e.g. LoginForm, ForgotPasswordPanel, FeaturePill, etc.)
import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  FaLeaf,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaSeedling,
  FaMicroscope,
  FaFlask,
  FaCloudSun,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { IoIosMail } from "react-icons/io";
import { MdLock, MdArrowForward } from "react-icons/md";
import { useAuth } from "../../context/useAuth";

/* Auth service baseurl*/
const BASE_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

async function loginApi({ email, password }) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");
  return data;
}

async function forgotPasswordApi(email) {
  const res = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

/* Reset password panel*/
async function resetPasswordApi({ token, password }) {
  const res = await fetch(`${BASE_URL}/api/auth/reset-password/${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Reset failed");
  return data;
}

/* Feature pill data */
const features = [
  {
    icon: <FaSeedling />,
    text: "Crop Recommendation",
    color: "text-emerald-400",
  },
  { icon: <FaMicroscope />, text: "Disease Detection", color: "text-teal-400" },
  { icon: <FaFlask />, text: "Fertilizer Suggestion", color: "text-green-400" },
  { icon: <FaCloudSun />, text: "Weather Insights", color: "text-sky-400" },
];

/* Floating particle */
function Particle({ style }) {
  return (
    <div
      className="absolute rounded-full bg-white/5 pointer-events-none"
      style={style}
    />
  );
}

/* Forgot password panel */
function ForgotPasswordPanel({ onBack }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      await forgotPasswordApi(email);
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ animation: "slideIn 0.35s ease" }}>
      {sent ? (
        /* Success */
        <div className="text-center py-4">
          <div
            className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-5 shadow-lg"
            style={{ boxShadow: "0 0 30px rgba(74,222,128,0.3)" }}
          >
            <FaCheckCircle />
          </div>
          <h3 className="text-xl font-extrabold text-[#073319] mb-2">
            Check Your Email
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed mb-6 max-w-xs mx-auto">
            We've sent a password reset link to{" "}
            <strong className="text-[#073319]">{email}</strong>. The link
            expires in 30 minutes.
          </p>
          <button
            onClick={onBack}
            className="text-sm font-bold text-green-600 hover:text-green-800 transition-colors flex items-center gap-1.5 mx-auto"
          >
            ← Back to Login
          </button>
        </div>
      ) : (
        /* Form */
        <>
          <div className="mb-7">
            <h3 className="text-2xl font-extrabold text-[#073319] mb-1">
              Forgot Password?
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Enter your registered email and we'll send you a reset link.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold px-4 py-3 rounded-xl mb-5">
              <span className="text-base">⚠</span> {error}
            </div>
          )}

          {/* Email */}
          <div className="mb-5">
            <label className="block text-xs font-bold text-gray-600 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <IoIosMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="your@email.com"
                autoFocus
                className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 hover:border-green-300 transition-all"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3.5 rounded-xl text-sm transition-all duration-200 shadow-lg mb-4
              ${loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90 hover:-translate-y-0.5 hover:shadow-xl"}`}
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending…
              </>
            ) : (
              <>
                Send Reset Link <MdArrowForward />
              </>
            )}
          </button>

          <button
            onClick={onBack}
            className="w-full text-center text-sm text-gray-500 hover:text-green-700 transition-colors font-medium py-1"
          >
            ← Back to Login
          </button>
        </>
      )}
    </div>
  );
}

/* Login page */
function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    // Restore saved email if "remember me" was checked previously
    const saved = localStorage.getItem("saps_email");
    if (saved) {
      setForm((p) => ({ ...p, email: saved }));
      setRememberMe(true);
    }
    setTimeout(() => setMounted(true), 60);
  }, []);

  const validate = () => {
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email))
      return "Please enter a valid email address.";
    if (!form.password || form.password.length < 6)
      return "Password must be at least 6 characters.";
    return null;
  };

  const handleSubmit = async () => {
    setError("");
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    setLoading(true);
    try {
      const data = await loginApi(form);

      login(data.user);

      if (rememberMe) localStorage.setItem("saps_email", form.email);
      else localStorage.removeItem("saps_email");

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-[#f0fdf4]">
      {/* Left panel branding */}
      <div
        className="hidden lg:flex lg:w-[52%] relative flex-col justify-between overflow-hidden"
        style={{
          background:
            "linear-gradient(145deg, #052e16 0%, #14532d 45%, #16a34a 100%)",
        }}
      >
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        {/* Blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-green-400/15 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-emerald-300/10 blur-3xl" />

        {/* Floating particles */}
        {[...Array(10)].map((_, i) => (
          <Particle
            key={i}
            style={{
              width: `${6 + (i % 4) * 5}px`,
              height: `${6 + (i % 4) * 5}px`,
              top: `${8 + i * 9}%`,
              left: `${5 + i * 9}%`,
              animation: `pulse ${3 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full px-12 py-12">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group mb-auto">
            <div className="w-12 h-12 rounded-full bg-white/15 border border-white/25 flex items-center justify-center text-2xl shadow-lg backdrop-blur-sm group-hover:bg-white/25 transition-colors duration-300">
              🌿
            </div>
            <div>
              <p className="text-xl font-extrabold text-white leading-tight">
                Smart Agri
              </p>
              <p className="text-xs text-green-300 font-semibold tracking-wide">
                Prediction Platform
              </p>
            </div>
          </Link>

          {/* Hero text */}
          <div className="my-auto">
            <div
              className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-green-200 text-xs font-bold px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "none" : "translateY(16px)",
                transition: "all 0.6s ease 0.1s",
              }}
            >
              <HiSparkles className="text-green-300" /> AI-Powered Agriculture
            </div>
            <h1
              className="text-4xl xl:text-5xl font-extrabold text-white leading-[1.15] mb-5"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "none" : "translateY(20px)",
                transition: "all 0.6s ease 0.2s",
              }}
            >
              Welcome back to
              <br />
              <span className="text-green-300">Smarter Farming</span>
            </h1>
            <p
              className="text-green-100/65 text-base leading-relaxed mb-8 max-w-sm"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "none" : "translateY(20px)",
                transition: "all 0.6s ease 0.3s",
              }}
            >
              Sign in to access your personalised crop recommendations, disease
              alerts, fertilizer plans, and live weather insights.
            </p>

            {/* Feature pills */}
            <div
              className="flex flex-col gap-3"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "none" : "translateY(20px)",
                transition: "all 0.6s ease 0.4s",
              }}
            >
              {features.map(({ icon, text, color }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className={`text-lg ${color}`}>{icon}</div>
                  <span className="text-sm text-green-100/70 font-medium">
                    {text}
                  </span>
                  <div className="flex-1 h-px bg-white/10" />
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Bottom stat strip */}
          <div
            className="flex gap-6 pt-8 border-t border-white/10"
            style={{
              opacity: mounted ? 1 : 0,
              transition: "opacity 0.6s ease 0.55s",
            }}
          >
            {[
              { v: "99.82%", l: "Peak Accuracy" },
              { v: "4", l: "AI Tools" },
              { v: "Free", l: "Forever" },
            ].map(({ v, l }) => (
              <div key={l}>
                <p className="text-lg font-extrabold text-white">{v}</p>
                <p className="text-xs text-green-300/60">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel form*/}
      <div className="flex-1 flex flex-col justify-center items-center px-5 sm:px-10 py-12 relative">
        {/* Mobile logo */}
        <div className="lg:hidden mb-8">
          <Link to="/" className="flex items-center gap-3 justify-center">
            <div className="w-12 h-12 rounded-full bg-green-100 border border-green-200 flex items-center justify-center text-2xl shadow">
              🌿
            </div>
            <div>
              <p className="text-xl font-extrabold text-[#073319]">
                Smart Agri
              </p>
              <p className="text-xs text-green-600 font-semibold">
                Prediction Platform
              </p>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div
          className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 sm:p-10"
          style={{
            boxShadow:
              "0 20px 60px rgba(22,163,74,0.10), 0 4px 20px rgba(0,0,0,0.06)",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "none" : "translateY(24px)",
            transition: "all 0.6s ease 0.1s",
          }}
        >
          {showForgot ? (
            <ForgotPasswordPanel onBack={() => setShowForgot(false)} />
          ) : (
            <>
              {/* Header */}
              <div className="mb-8">
                <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full border border-green-200 mb-4">
                  <FaLeaf className="text-green-500" /> Member Access
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#073319]">
                  Sign In
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-green-600 font-bold hover:text-green-800 transition-colors"
                  >
                    Register free
                  </Link>
                </p>
              </div>

              {/* Error banner */}
              {error && (
                <div
                  className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold px-4 py-3 rounded-xl mb-6"
                  style={{ animation: "shake 0.4s ease" }}
                >
                  <span className="text-base mt-0.5">⚠</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Email field */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-600 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <IoIosMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => {
                      setForm((p) => ({ ...p, email: e.target.value }));
                      setError("");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder="your@email.com"
                    autoComplete="email"
                    className={`w-full pl-10 pr-4 py-3.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 hover:border-green-300 transition-all
                      ${error ? "border-red-300 bg-red-50" : "border-gray-200"}`}
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="mb-2">
                <label className="block text-xs font-bold text-gray-600 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <MdLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
                  <input
                    type={showPwd ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => {
                      setForm((p) => ({ ...p, password: e.target.value }));
                      setError("");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className={`w-full pl-10 pr-12 py-3.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 hover:border-green-300 transition-all
                      ${error ? "border-red-300 bg-red-50" : "border-gray-200"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((p) => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors text-sm p-1"
                    tabIndex={-1}
                  >
                    {showPwd ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Remember me + Forgot password */}
              <div className="flex items-center justify-between mb-6 mt-3">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div
                    onClick={() => setRememberMe((p) => !p)}
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 cursor-pointer
                      ${rememberMe ? "bg-green-600 border-green-600" : "border-gray-300 group-hover:border-green-400"}`}
                  >
                    {rememberMe && (
                      <span className="text-white text-[10px] font-extrabold">
                        ✓
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 font-medium select-none">
                    Remember me
                  </span>
                </label>
                <button
                  onClick={() => {
                    setShowForgot(true);
                    setError("");
                  }}
                  className="text-xs font-bold text-green-600 hover:text-green-800 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 rounded-xl text-sm transition-all duration-200 shadow-lg
                  ${loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90 hover:-translate-y-0.5 hover:shadow-xl"}`}
                style={
                  !loading
                    ? { boxShadow: "0 6px 24px rgba(22,163,74,0.35)" }
                    : {}
                }
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign In to Dashboard
                    <MdArrowForward className="text-base" />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-400 font-medium">
                  or continue with
                </span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* Social logins placeholder */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    label: "Google",
                    emoji: "🔵",
                    bg: "hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700",
                  },
                  {
                    label: "GitHub",
                    emoji: "⚫",
                    bg: "hover:border-gray-400 hover:bg-gray-50 hover:text-gray-800",
                  },
                ].map(({ label, emoji, bg }) => (
                  <button
                    key={label}
                    className={`flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-xs font-semibold text-gray-500 transition-all duration-200 ${bg}`}
                    onClick={() =>
                      alert(`${label} Future Integration Placeholder`)
                    }
                  >
                    <span>{emoji}</span> {label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-xs text-gray-400 hover:text-green-600 transition-colors font-medium flex items-center gap-1.5 justify-center"
          >
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%      { transform: translateX(-6px); }
          40%      { transform: translateX(6px); }
          60%      { transform: translateX(-4px); }
          80%      { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [form, setForm] = useState({ password: "", confirm: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 60);
  }, []);

  /* Password strength checker */
  const getStrength = (pwd) => {
    if (!pwd) return { score: 0, label: "", color: "" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 1) return { score, label: "Weak", color: "bg-red-400" };
    if (score <= 3) return { score, label: "Fair", color: "bg-yellow-400" };
    return { score, label: "Strong", color: "bg-green-500" };
  };

  const strength = getStrength(form.password);

  const validate = () => {
    if (!form.password || form.password.length < 8)
      return "Password must be at least 8 characters.";
    if (form.password !== form.confirm) return "Passwords do not match.";
    return null;
  };

  const handleSubmit = async () => {
    setError("");
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setLoading(true);
    try {
      await resetPasswordApi({ token, password: form.password });
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-[#f0fdf4]">
      {/* Left panel*/}
      <div
        className="hidden lg:flex lg:w-[52%] relative flex-col justify-between overflow-hidden"
        style={{
          background:
            "linear-gradient(145deg, #052e16 0%, #14532d 45%, #16a34a 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-green-400/15 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-emerald-300/10 blur-3xl" />

        <div className="relative z-10 flex flex-col h-full px-12 py-12">
          <Link to="/" className="flex items-center gap-3 group mb-auto">
            <div className="w-12 h-12 rounded-full bg-white/15 border border-white/25 flex items-center justify-center text-2xl shadow-lg backdrop-blur-sm group-hover:bg-white/25 transition-colors duration-300">
              🌿
            </div>
            <div>
              <p className="text-xl font-extrabold text-white leading-tight">
                Smart Agri
              </p>
              <p className="text-xs text-green-300 font-semibold tracking-wide">
                Prediction Platform
              </p>
            </div>
          </Link>

          <div className="my-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-green-200 text-xs font-bold px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
              <MdLock className="text-green-300" /> Secure Password Reset
            </div>
            <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-[1.15] mb-5">
              Create a New
              <br />
              <span className="text-green-300">Secure Password</span>
            </h1>
            <p className="text-green-100/65 text-base leading-relaxed max-w-sm">
              Choose a strong password with at least 8 characters, a mix of
              uppercase, numbers, and symbols.
            </p>

            {/* Tips */}
            <div className="mt-8 space-y-3">
              {[
                "At least 8 characters long",
                "Include uppercase & lowercase letters",
                "Add numbers and special characters",
                "Don't reuse previous passwords",
              ].map((tip) => (
                <div key={tip} className="flex items-center gap-3">
                  <FaCheckCircle className="text-green-400 text-sm flex-shrink-0" />
                  <span className="text-sm text-green-100/65">{tip}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-6 pt-8 border-t border-white/10">
            {[
              { v: "256-bit", l: "Encryption" },
              { v: "30 min", l: "Token Expiry" },
              { v: "Secure", l: "Storage" },
            ].map(({ v, l }) => (
              <div key={l}>
                <p className="text-lg font-extrabold text-white">{v}</p>
                <p className="text-xs text-green-300/60">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-5 sm:px-10 py-12 relative">
        {/* Mobile logo */}
        <div className="lg:hidden mb-8">
          <Link to="/" className="flex items-center gap-3 justify-center">
            <div className="w-12 h-12 rounded-full bg-green-100 border border-green-200 flex items-center justify-center text-2xl shadow">
              🌿
            </div>
            <div>
              <p className="text-xl font-extrabold text-[#073319]">
                Smart Agri
              </p>
              <p className="text-xs text-green-600 font-semibold">
                Prediction Platform
              </p>
            </div>
          </Link>
        </div>

        <div
          className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 sm:p-10"
          style={{
            boxShadow:
              "0 20px 60px rgba(22,163,74,0.10), 0 4px 20px rgba(0,0,0,0.06)",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "none" : "translateY(24px)",
            transition: "all 0.6s ease 0.1s",
          }}
        >
          {success ? (
            /* Success state */
            <div
              className="text-center py-4"
              style={{ animation: "slideIn 0.35s ease" }}
            >
              <div
                className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-5 shadow-lg"
                style={{ boxShadow: "0 0 30px rgba(74,222,128,0.3)" }}
              >
                <FaCheckCircle />
              </div>
              <h3 className="text-2xl font-extrabold text-[#073319] mb-2">
                Password Updated!
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-7 max-w-xs mx-auto">
                Your password has been successfully reset. You can now sign in
                with your new credentials.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3.5 rounded-xl text-sm hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200 shadow-lg"
                style={{ boxShadow: "0 6px 24px rgba(22,163,74,0.35)" }}
              >
                Go to Login <MdArrowForward />
              </button>
            </div>
          ) : (
            /* Form */
            <>
              <div className="mb-7">
                <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full border border-green-200 mb-4">
                  <MdLock className="text-green-500" /> Reset Password
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#073319]">
                  New Password
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  Enter and confirm your new password below.
                </p>
              </div>

              {/* Error banner */}
              {error && (
                <div
                  className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold px-4 py-3 rounded-xl mb-5"
                  style={{ animation: "shake 0.4s ease" }}
                >
                  <span className="text-base mt-0.5">⚠</span>
                  <span>{error}</span>
                </div>
              )}

              {/* New password */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-600 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <MdLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
                  <input
                    type={showPwd ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => {
                      setForm((p) => ({ ...p, password: e.target.value }));
                      setError("");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder="Min. 8 characters"
                    autoComplete="new-password"
                    className={`w-full pl-10 pr-12 py-3.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 hover:border-green-300 transition-all
                      ${error && !form.password ? "border-red-300 bg-red-50" : "border-gray-200"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((p) => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors text-sm p-1"
                    tabIndex={-1}
                  >
                    {showPwd ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                {/* Strength meter */}
                {form.password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            i <= strength.score ? strength.color : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p
                      className={`text-[11px] font-semibold ${
                        strength.label === "Strong"
                          ? "text-green-600"
                          : strength.label === "Fair"
                            ? "text-yellow-600"
                            : "text-red-500"
                      }`}
                    >
                      {strength.label} password
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-600 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <MdLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={form.confirm}
                    onChange={(e) => {
                      setForm((p) => ({ ...p, confirm: e.target.value }));
                      setError("");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    className={`w-full pl-10 pr-12 py-3.5 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all
                      ${
                        form.confirm && form.password !== form.confirm
                          ? "border-red-300 bg-red-50 focus:ring-red-300"
                          : form.confirm && form.password === form.confirm
                            ? "border-green-400 bg-green-50 focus:ring-green-400"
                            : "border-gray-200 hover:border-green-300 focus:ring-green-400 focus:border-green-400"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((p) => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors text-sm p-1"
                    tabIndex={-1}
                  >
                    {showConfirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  {/* Match indicator */}
                  {form.confirm && (
                    <div className="absolute right-10 top-1/2 -translate-y-1/2">
                      {form.password === form.confirm ? (
                        <FaCheckCircle className="text-green-500 text-sm" />
                      ) : (
                        <span className="text-red-400 text-sm font-bold">
                          ✕
                        </span>
                      )}
                    </div>
                  )}
                </div>
                {form.confirm && form.password !== form.confirm && (
                  <p className="text-xs text-red-500 font-semibold mt-1.5">
                    Passwords do not match
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 rounded-xl text-sm transition-all duration-200 shadow-lg
                  ${loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90 hover:-translate-y-0.5 hover:shadow-xl"}`}
                style={
                  !loading
                    ? { boxShadow: "0 6px 24px rgba(22,163,74,0.35)" }
                    : {}
                }
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Updating Password…
                  </>
                ) : (
                  <>
                    Reset Password <MdArrowForward className="text-base" />
                  </>
                )}
              </button>

              <div className="mt-4 text-center">
                <Link
                  to="/login"
                  className="text-xs text-gray-400 hover:text-green-600 transition-colors font-medium"
                >
                  ← Back to Login
                </Link>
              </div>
            </>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-xs text-gray-400 hover:text-green-600 transition-colors font-medium flex items-center gap-1.5 justify-center"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export { ResetPasswordPage };
export default LoginPage;
