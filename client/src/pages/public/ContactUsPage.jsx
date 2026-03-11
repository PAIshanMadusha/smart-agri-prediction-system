import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaLeaf,
  FaMapLocationDot,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa6";
import {
  FaFacebookSquare,
  FaInstagramSquare,
  FaCheckCircle,
  FaPaperPlane,
  FaPhone,
} from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { HiSparkles } from "react-icons/hi2";
import { MdAccessTime, MdSupportAgent } from "react-icons/md";

/* Scroll reveal */
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setInView(true);
      },
      { threshold },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function Reveal({ children, delay = 0, direction = "up", className = "" }) {
  const [ref, inView] = useInView();
  const t = {
    up: "translateY(32px)",
    left: "translateX(-32px)",
    right: "translateX(32px)",
    none: "none",
  };
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : t[direction],
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function SectionPill({ text, dark = false }) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4 border
      ${dark ? "bg-white/10 text-green-200 border-white/20" : "bg-green-100 text-green-700 border-green-200"}`}
    >
      <FaLeaf /> {text}
    </span>
  );
}

/* Contact info cards data */
const contactCards = [
  {
    icon: <IoIosMail />,
    label: "Email Us",
    primary: "support@saps.com",
    secondary: "info@saps.com",
    note: "We reply within 24 hours",
    gradient: "from-emerald-500 to-green-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    accent: "text-emerald-600",
  },
  {
    icon: <FaPhone />,
    label: "Call Us",
    primary: "+(94)-34-567-8943",
    secondary: "+(94)-11-234-5678",
    note: "Mon–Fri · 8 AM – 6 PM",
    gradient: "from-teal-500 to-emerald-600",
    bg: "bg-teal-50",
    border: "border-teal-100",
    accent: "text-teal-600",
  },
  {
    icon: <FaMapLocationDot />,
    label: "Visit Us",
    primary: "11/A Horana Road",
    secondary: "Kalutara, Sri Lanka",
    note: "Open for walk-ins",
    gradient: "from-green-500 to-teal-600",
    bg: "bg-green-50",
    border: "border-green-100",
    accent: "text-green-600",
  },
];

const faqs = [
  {
    q: "Is Smart Agri Prediction free to use?",
    a: "Yes — all four AI services (Crop Recommendation, Disease Detection, Fertilizer Suggestion, and Weather Insights) are completely free for registered users.",
  },
  {
    q: "How accurate are the ML predictions?",
    a: "Our models achieve up to 99.82% training accuracy. The crop recommendation model scores 99.32% on test data, and the disease CNN reaches 99.45% validation accuracy.",
  },
  {
    q: "What data do I need to get a crop recommendation?",
    a: "You'll need soil N, P, K values, pH level, plus your location's average rainfall, temperature, and humidity. The platform also auto-fills weather data via GPS.",
  },
  {
    q: "Does the disease detection work with any crop?",
    a: "Currently it supports 38 disease classes across major Sri Lankan crops. We are continuously expanding the model's crop coverage.",
  },
  {
    q: "How do I report a bug or suggest a feature?",
    a: "Use the contact form on this page, email us directly, or open an issue on our GitHub repository. We actively monitor all channels.",
  },
];

const socialLinks = [
  {
    icon: <FaFacebookSquare />,
    label: "Facebook",
    href: "#",
    color: "hover:text-blue-600",
  },
  {
    icon: <FaInstagramSquare />,
    label: "Instagram",
    href: "#",
    color: "hover:text-pink-500",
  },
  {
    icon: <FaGithub />,
    label: "GitHub",
    href: "#",
    color: "hover:text-gray-900",
  },
  {
    icon: <FaLinkedin />,
    label: "LinkedIn",
    href: "#",
    color: "hover:text-blue-700",
  },
];

/* FAQ accordion item */
function FaqItem({ q, a, index }) {
  const [open, setOpen] = useState(false);
  return (
    <Reveal delay={index * 60}>
      <div
        className={`border rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer
          ${open ? "border-green-300 shadow-sm bg-green-50" : "border-gray-100 bg-white hover:border-green-200"}`}
        onClick={() => setOpen((p) => !p)}
      >
        <div className="flex items-center justify-between px-5 py-4 gap-4">
          <span className="text-sm font-semibold text-[#073319]">{q}</span>
          <span
            className={`text-green-600 text-lg flex-shrink-0 transition-transform duration-300 ${open ? "rotate-45" : ""}`}
          >
            +
          </span>
        </div>
        <div
          style={{
            maxHeight: open ? "200px" : "0",
            opacity: open ? 1 : 0,
            transition: "max-height 0.35s ease, opacity 0.3s ease",
          }}
          className="overflow-hidden"
        >
          <p className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">{a}</p>
        </div>
      </div>
    </Reveal>
  );
}
