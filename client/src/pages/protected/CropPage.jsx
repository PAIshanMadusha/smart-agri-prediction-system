import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaLeaf,
  FaSeedling,
  FaThermometerHalf,
  FaTint,
  FaCloudRain,
  FaFlask,
  FaLocationArrow,
  FaInfoCircle,
  FaCheckCircle,
  FaTrophy,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { MdAgriculture, MdWaterDrop, MdAir } from "react-icons/md";
import { HiSparkles, HiArrowRight } from "react-icons/hi2";
import { WiHumidity, WiRaindrop } from "react-icons/wi";

/* API */
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const cookieFetch = (path, options = {}) =>
  fetch(`${BASE_URL}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  }).then(async (r) => {
    const data = await r.json();
    if (!r.ok) throw new Error(data.message || data.error || "Request failed");
    return data;
  });

const api = {
  // POST /api/crop/predict → { success, recommendations[], recordId }
  predict: (body) =>
    cookieFetch("/crop/predict", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  // GET /api/user/profile → { success, user }  (prefill weather lat/lon)
  getProfile: () => cookieFetch("/user/profile"),

  // GET /api/weather?lat=&lon= → { success, weather }
  getWeather: (lat, lon) => cookieFetch(`/weather?lat=${lat}&lon=${lon}`),
};
