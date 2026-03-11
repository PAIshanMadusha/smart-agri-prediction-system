import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaLeaf,
  FaSeedling,
  FaFlask,
  FaBug,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUser,
  FaCheckCircle,
  FaArrowUp,
  FaShieldAlt,
} from "react-icons/fa";
import {
  MdAgriculture,
  MdBugReport,
  MdWaterDrop,
  MdThermostat,
  MdAir,
  MdCloud,
  MdSpeed,
} from "react-icons/md";
import { HiSparkles, HiArrowRight } from "react-icons/hi2";
import { WiHumidity, WiStrongWind, WiRaindrop } from "react-icons/wi";
import { useAuth } from "../../context/useAuth";
import { CropHistory, FertilizerHistory, DiseaseHistory } from "./HistoryPage";

/* API */
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const cookieFetch = (path) =>
  fetch(`${BASE_URL}${path}`, { credentials: "include" }).then(async (r) => {
    const data = await r.json();
    if (!r.ok) throw new Error(data.message || "Failed");
    return data;
  });

const api = {
  getProfile: () => cookieFetch("/user/profile"),
  getWeather: (lat, lon) => cookieFetch(`/weather?lat=${lat}&lon=${lon}`),
  cropHistory: () => cookieFetch("/crop/history"),
  fertilizerHistory: () => cookieFetch("/fertilizer/history"),
  diseaseHistory: () => cookieFetch("/disease/history"),
};
