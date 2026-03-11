import { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FaLeaf,
  FaUpload,
  FaImage,
  FaTimes,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTrophy,
  FaChevronDown,
  FaChevronUp,
  FaCamera,
  FaInfoCircle,
  FaShieldAlt,
} from "react-icons/fa";
import { HiSparkles, HiArrowRight } from "react-icons/hi2";
import { MdBugReport, MdHealthAndSafety, MdWarning } from "react-icons/md";

/* API */
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = {
  // POST /api/disease/predict — field name: "file"
  predict: (file) => {
    const fd = new FormData();
    fd.append("file", file);
    return fetch(`${BASE_URL}/disease/predict`, {
      method: "POST",
      credentials: "include", // cookie JWT — NO Content-Type header (browser sets multipart boundary)
      body: fd,
    }).then(async (r) => {
      const data = await r.json();
      if (!r.ok) throw new Error(data.message || "Prediction failed");
      return data;
    });
  },
};
