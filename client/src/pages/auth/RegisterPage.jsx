import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaLeaf,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaSeedling,
  FaMicroscope,
  FaFlask,
  FaCloudSun,
  FaUser,
  FaUserTie,
  FaSearch,
  FaGlobeAsia,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { IoIosMail } from "react-icons/io";
import { MdLock, MdArrowForward, MdPeople } from "react-icons/md";

/* API */
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function registerApi(payload) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Registration failed");
  return data; // { success, message, newUser }
}

async function verifyEmailApi(token) {
  const res = await fetch(`${BASE_URL}/auth/verify-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Verification failed");
  return data;
}

/* Role Config */
const roles = [
  {
    value: "farmer",
    label: "Farmer",
    desc: "Access crop, disease & fertilizer AI tools",
    icon: <FaSeedling className="text-xl" />,
    gradient: "from-emerald-500 to-green-600",
    light: "bg-emerald-50 border-emerald-200 text-emerald-700",
    selected:
      "bg-gradient-to-br from-emerald-500 to-green-600 text-white border-transparent",
  },
  {
    value: "researcher",
    label: "Researcher",
    desc: "Deep model insights and dataset exploration",
    icon: <FaMicroscope className="text-xl" />,
    gradient: "from-teal-500 to-emerald-600",
    light: "bg-teal-50 border-teal-200 text-teal-700",
    selected:
      "bg-gradient-to-br from-teal-500 to-emerald-600 text-white border-transparent",
  },
  {
    value: "learner",
    label: "Learner",
    desc: "Educational resources and guided tutorials",
    icon: <FaSearch className="text-xl" />,
    gradient: "from-green-500 to-teal-600",
    light: "bg-green-50 border-green-200 text-green-700",
    selected:
      "bg-gradient-to-br from-green-500 to-teal-600 text-white border-transparent",
  },
  {
    value: "visitor",
    label: "Visitor",
    desc: "Browse the platform and explore features",
    icon: <FaGlobeAsia className="text-xl" />,
    gradient: "from-sky-500 to-cyan-600",
    light: "bg-sky-50 border-sky-200 text-sky-700",
    selected:
      "bg-gradient-to-br from-sky-500 to-cyan-600 text-white border-transparent",
  },
];

/* Password meter */
function getStrength(pwd) {
  if (!pwd) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pwd.length >= 6) score++;
  if (pwd.length >= 10) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 1) return { score, label: "Weak", color: "bg-red-400" };
  if (score <= 3) return { score, label: "Fair", color: "bg-yellow-400" };
  return { score, label: "Strong", color: "bg-green-500" };
}

/* Floating particle */
function Particle({ style }) {
  return (
    <div
      className="absolute rounded-full bg-white/5 pointer-events-none"
      style={style}
    />
  );
}

/* Email verification page */
export function VerifyEmailPage() {
  const navigate = useNavigate();
  const [codes, setCodes] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef([]);

  useEffect(() => {
    setTimeout(() => setMounted(true), 60);
  }, []);

  /* Countdown timer for resend */
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => setResendCooldown((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  const handleCodeChange = (index, value) => {
    const sanitized = value.replace(/\D/g, "").slice(-1); // digits only, 1 char
    const next = [...codes];
    next[index] = sanitized;
    setCodes(next);
    setError("");
    // Auto-advance
    if (sanitized && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !codes[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0)
      inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5)
      inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const next = [...codes];
    pasted.split("").forEach((ch, i) => {
      if (i < 6) next[i] = ch;
    });
    setCodes(next);
    const lastFilled = Math.min(pasted.length, 5);
    inputRefs.current[lastFilled]?.focus();
  };

  const handleVerify = async () => {
    const token = codes.join("");
    if (token.length < 6) {
      setError("Please enter all 6 digits.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await verifyEmailApi(token);
      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 2800);
    } catch (err) {
      setError(err.message);
      // Shake and clear
      setCodes(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const email = sessionStorage.getItem("saps_pending_email") || "your email";

  return (
    <div className="min-h-screen flex overflow-hidden bg-[#f0fdf4]">
      {/* Left panel */}
      <div
        className="hidden lg:flex lg:w-[52%] relative flex-col overflow-hidden"
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
        {[...Array(8)].map((_, i) => (
          <Particle
            key={i}
            style={{
              width: `${8 + (i % 3) * 6}px`,
              height: `${8 + (i % 3) * 6}px`,
              top: `${10 + i * 11}%`,
              left: `${8 + i * 11}%`,
              animation: `pulse ${3 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}

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
              <IoIosMail className="text-green-300" /> Email Verification
            </div>
            <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-[1.15] mb-5">
              One Last Step
              <br />
              <span className="text-green-300">to Get Started</span>
            </h1>
            <p className="text-green-100/65 text-base leading-relaxed max-w-sm mb-8">
              We've sent a 6-digit code to your email. Enter it to verify your
              account and unlock all AI tools.
            </p>
            <div className="space-y-3">
              {[
                "Check your email inbox",
                "Enter the 6-digit code",
                "Account verified instantly",
                "Start using AI tools",
              ].map((tip, i) => (
                <div key={tip} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/30 border border-green-400/40 text-green-300 text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </div>
                  <span className="text-sm text-green-100/65">{tip}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-6 pt-8 border-t border-white/10">
            {[
              { v: "6-digit", l: "Secure Code" },
              { v: "24 hrs", l: "Code Expiry" },
              { v: "Instant", l: "Activation" },
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
      <div className="flex-1 flex flex-col justify-center items-center px-5 sm:px-10 py-12">
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
            <div
              className="text-center py-4"
              style={{ animation: "slideIn 0.4s ease" }}
            >
              <div
                className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-5 shadow-lg"
                style={{ boxShadow: "0 0 40px rgba(74,222,128,0.35)" }}
              >
                <FaCheckCircle />
              </div>
              <h3 className="text-2xl font-extrabold text-[#073319] mb-2">
                Email Verified!
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                Your account is now active.
              </p>
              <p className="text-xs text-green-600 font-semibold mb-6 animate-pulse">
                Redirecting to dashboard…
              </p>
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
                  style={{
                    width: "100%",
                    animation: "grow 2.8s linear forwards",
                  }}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full border border-green-200 mb-4">
                  <IoIosMail className="text-green-500" /> Verify Email
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#073319] mb-2">
                  Enter Your Code
                </h2>
                <p className="text-sm text-gray-400 leading-relaxed">
                  We sent a 6-digit code to{" "}
                  <span className="font-semibold text-green-600 break-all">
                    {email}
                  </span>
                </p>
              </div>

              {error && (
                <div
                  className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold px-4 py-3 rounded-xl mb-5"
                  style={{ animation: "shake 0.4s ease" }}
                >
                  <span className="text-base mt-0.5">⚠</span>
                  <span>{error}</span>
                </div>
              )}

              {/* 6-digit OTP inputs */}
              <div
                className="flex gap-2 sm:gap-3 justify-center mb-6"
                onPaste={handlePaste}
              >
                {codes.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputRefs.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className={`w-11 h-14 sm:w-12 sm:h-16 text-center text-xl font-extrabold border-2 rounded-xl outline-none transition-all duration-200
                      ${digit ? "border-green-500 bg-green-50 text-green-700 shadow-sm" : "border-gray-200 text-gray-800"}
                      focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:bg-green-50`}
                  />
                ))}
              </div>

              <button
                onClick={handleVerify}
                disabled={loading || codes.join("").length < 6}
                className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 rounded-xl text-sm transition-all duration-200 shadow-lg mb-5
                  ${loading || codes.join("").length < 6 ? "opacity-60 cursor-not-allowed" : "hover:opacity-90 hover:-translate-y-0.5 hover:shadow-xl"}`}
                style={
                  !(loading || codes.join("").length < 6)
                    ? { boxShadow: "0 6px 24px rgba(22,163,74,0.35)" }
                    : {}
                }
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verifying…
                  </>
                ) : (
                  <>
                    Verify Email <MdArrowForward />
                  </>
                )}
              </button>

              <div className="text-center">
                <p className="text-xs text-gray-400 mb-2">
                  Didn't receive the code?
                </p>
                {resendCooldown > 0 ? (
                  <p className="text-xs text-gray-400 font-semibold">
                    Resend in{" "}
                    <span className="text-green-600">{resendCooldown}s</span>
                  </p>
                ) : (
                  <button
                    onClick={() => setResendCooldown(60)}
                    className="text-xs font-bold text-green-600 hover:text-green-800 transition-colors"
                  >
                    Resend Code
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        <div className="mt-6">
          <Link
            to="/login"
            className="text-xs text-gray-400 hover:text-green-600 transition-colors font-medium flex items-center gap-1.5 justify-center"
          >
            ← Back to Login
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes slideIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
        @keyframes grow { from{width:0} to{width:100%} }
      `}</style>
    </div>
  );
}
