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
