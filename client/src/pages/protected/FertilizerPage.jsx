import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaFlask,
  FaThermometerHalf,
  FaTint,
  FaLeaf,
  FaSeedling,
  FaCheckCircle,
  FaTrophy,
  FaInfoCircle,
  FaChevronDown,
  FaChevronUp,
  FaLocationArrow,
} from "react-icons/fa";
import { MdAgriculture, MdAir, MdWaterDrop } from "react-icons/md";
import { HiSparkles, HiArrowRight } from "react-icons/hi2";
import { WiHumidity } from "react-icons/wi";

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
  predict: (body) =>
    cookieFetch("/fertilizer/predict", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  getProfile: () => cookieFetch("/user/profile"),
  getWeather: (lat, lon) => cookieFetch(`/weather?lat=${lat}&lon=${lon}`),
};
