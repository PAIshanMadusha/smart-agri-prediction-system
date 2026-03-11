import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FaSeedling,
  FaFlask,
  FaBug,
  FaChevronDown,
  FaChevronUp,
  FaLeaf,
  FaThermometerHalf,
  FaTint,
  FaCloudRain,
  FaCalendarAlt,
  FaTrash,
  FaEye,
} from "react-icons/fa";
import { MdAgriculture, MdBugReport, MdRefresh } from "react-icons/md";
import { HiArrowRight } from "react-icons/hi2";

/* API */
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const cookieFetch = (path) =>
  fetch(`${BASE_URL}${path}`, { credentials: "include" }).then(async (r) => {
    const data = await r.json();
    if (!r.ok) throw new Error(data.message || "Request failed");
    return data;
  });

const api = {
  cropHistory: () => cookieFetch("/crop/history"),
  fertilizerHistory: () => cookieFetch("/fertilizer/history"),
  diseaseHistory: () => cookieFetch("/disease/history"),
};
