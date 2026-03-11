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
