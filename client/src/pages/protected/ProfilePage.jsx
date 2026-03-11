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
