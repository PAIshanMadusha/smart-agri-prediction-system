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
