import {
  FaBrain,
  FaDatabase,
  FaShieldAlt,
  FaBolt,
  FaMobileAlt,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";

// This file defines the key platform features of the Smart Agri Prediction System
export const platformFeatures = [
  {
    icon: <FaBolt />,
    title: "Instant Results",
    desc: "All model inferences are delivered in under 3 seconds.",
  },
  {
    icon: <FaShieldAlt />,
    title: "Reliable & Secure",
    desc: "Your farm data is private, encrypted, and never shared with third parties.",
  },
  {
    icon: <FaMobileAlt />,
    title: "Mobile Friendly",
    desc: "Fully responsive works seamlessly on all devices so you can check your farm on the go.",
  },
  {
    icon: <FaBrain />,
    title: "Continuously Learning",
    desc: "Models are periodically retrained using newly validated data.",
  },
  {
    icon: <FaDatabase />,
    title: "Data Transparency",
    desc: "Clearly understand which inputs influence each recommendation.",
  },
  {
    icon: <HiSparkles />,
    title: "All-in-One Platform",
    desc: "Four specialized AI-powered tools within a single, clean interface.",
  },
];
