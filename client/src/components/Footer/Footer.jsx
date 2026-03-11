import { useState } from "react";
import { Link } from "react-router-dom";
import { FaMapLocationDot, FaGithub } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";
import { MdAddIcCall } from "react-icons/md";
import {
  FaFacebookSquare,
  FaInstagramSquare,
  FaLinkedin,
  FaLeaf,
  FaArrowRight,
  FaSeedling,
  FaMicroscope,
  FaFlask,
  FaCloudSun,
  FaCheckCircle,
  FaChevronDown,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";

/* Logo placeholder (swap with your real import) */
// import Logo from "../../assets/leaf_favicon.png";

const CURRENT_YEAR = new Date().getFullYear();

/* Navigation link groups */
const footerLinks = [
  {
    heading: "Platform",
    links: [
      { label: "Home", to: "/" },
      { label: "About Us", to: "/about" },
      { label: "Services", to: "/services" },
      { label: "Resources", to: "/resources" },
      { label: "Contact Us", to: "/contact" },
    ],
  },
  {
    heading: "AI Services",
    links: [
      {
        label: "Crop Recommendation",
        to: "/services/crop",
        icon: <FaSeedling />,
      },
      {
        label: "Disease Detection",
        to: "/services/disease",
        icon: <FaMicroscope />,
      },
      {
        label: "Fertilizer Suggestion",
        to: "/services/fertilizer",
        icon: <FaFlask />,
      },
      {
        label: "Weather Insights",
        to: "/services/weather",
        icon: <FaCloudSun />,
      },
    ],
  },
  {
    heading: "Learn",
    links: [
      { label: "Soil Science", to: "/resources?cat=Soil+Science" },
      { label: "Machine Learning", to: "/resources?cat=Machine+Learning" },
      { label: "Disease Management", to: "/resources?cat=Disease+Management" },
      { label: "Farming Practices", to: "/resources?cat=Farming+Practices" },
      { label: "Platform Guides", to: "/resources?cat=Platform+Guide" },
    ],
  },
];

const socialLinks = [
  {
    icon: <FaFacebookSquare />,
    label: "Facebook",
    href: "#",
    hoverColor: "hover:text-blue-400",
  },
  {
    icon: <FaInstagramSquare />,
    label: "Instagram",
    href: "#",
    hoverColor: "hover:text-pink-400",
  },
  {
    icon: <FaGithub />,
    label: "GitHub",
    href: "#",
    hoverColor: "hover:text-gray-300",
  },
  {
    icon: <FaLinkedin />,
    label: "LinkedIn",
    href: "#",
    hoverColor: "hover:text-blue-400",
  },
];

const stats = [
  { value: "99.82%", label: "Peak Accuracy" },
  { value: "4", label: "AI Tools" },
  { value: "13+", label: "Resources" },
  { value: "Free", label: "Always" },
];
