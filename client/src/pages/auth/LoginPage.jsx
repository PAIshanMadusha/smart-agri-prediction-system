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
