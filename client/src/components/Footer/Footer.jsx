//TODO: Split into smaller components for better maintainability (e.g. NewsletterSignup, SocialIcons, ContactInfo, etc.)
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

/* Accordion item for mobile */
function MobileAccordion({ heading, links }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between py-4 text-sm font-bold text-white"
      >
        {heading}
        <FaChevronDown
          className={`text-green-400 text-xs transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        style={{
          maxHeight: open ? `${links.length * 44}px` : "0",
          opacity: open ? 1 : 0,
          overflow: "hidden",
          transition: "max-height 0.35s ease, opacity 0.3s ease",
        }}
      >
        <ul className="pb-4 space-y-2">
          {links.map(({ label, to, icon }) => (
            <li key={label}>
              <Link
                to={to}
                className="flex items-center gap-2 text-sm text-green-200/70 hover:text-green-300 transition-colors duration-200 py-1"
              >
                {icon && <span className="text-green-400 text-xs">{icon}</span>}
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* Footer */
function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email && /\S+@\S+\.\S+/.test(email)) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-[#052e16] to-[#021a0c] text-white">
      {/* Decorative top wave */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-60" />

      {/* Subtle background texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />
      {/* Ambient glow blobs */}
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-green-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -left-20 w-72 h-72 rounded-full bg-emerald-500/8 blur-3xl pointer-events-none" />

      {/* Newsletter strip*/}
      <div className="relative border-b border-white/10">
        <div className="container mx-auto px-4 md:px-6 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Left copy */}
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-1">
                <HiSparkles className="text-green-400 text-lg" />
                <span className="text-xs font-bold text-green-400 uppercase tracking-widest">
                  Stay Informed
                </span>
              </div>
              <h3 className="text-lg md:text-xl font-extrabold text-white">
                Get the latest agri-AI insights
              </h3>
              <p className="text-green-100/50 text-xs mt-1">
                New resources & feature updates — no spam, unsubscribe anytime.
              </p>
            </div>

            {/* Right email input */}
            <div className="w-full md:w-auto">
              {subscribed ? (
                <div className="flex items-center gap-2 bg-green-800/50 border border-green-600/40 px-5 py-3 rounded-xl">
                  <FaCheckCircle className="text-green-400" />
                  <span className="text-sm font-semibold text-green-200">
                    You're subscribed!
                  </span>
                </div>
              ) : (
                <div className="flex gap-2 w-full md:w-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                    placeholder="your@email.com"
                    className="flex-1 md:w-64 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/35 focus:outline-none focus:border-green-400 focus:bg-white/15 transition-all text-sm backdrop-blur-sm"
                  />
                  <button
                    onClick={handleSubscribe}
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold px-5 py-3 rounded-xl transition-colors duration-200 text-sm whitespace-nowrap shadow-lg"
                  >
                    Subscribe <FaArrowRight className="text-xs" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main footer body*/}
      <div className="relative container mx-auto px-4 md:px-6 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-4">
            {/* Logo */}
            <Link to="/" className="inline-flex items-center gap-3 group mb-5">
              <div className="w-12 h-12 rounded-full bg-green-600/30 border border-green-500/40 flex items-center justify-center text-2xl shadow-lg group-hover:bg-green-600/50 transition-colors duration-300">
                🌿
              </div>
              <div>
                <p className="text-lg font-extrabold text-white leading-tight group-hover:text-green-300 transition-colors duration-200">
                  Smart Agri
                </p>
                <p className="text-xs text-green-400 font-semibold tracking-wide">
                  Prediction Platform
                </p>
              </div>
            </Link>

            <p className="text-sm text-green-100/55 leading-relaxed mb-6 max-w-xs">
              AI-powered agricultural intelligence for Sri Lankan farmers —
              combining Random Forest, CNN, and XGBoost models to deliver crop,
              disease, and fertilizer insights in real time.
            </p>

            {/* Stats mini row */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {stats.map(({ value, label }) => (
                <div
                  key={label}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-center hover:bg-white/10 transition-colors duration-200"
                >
                  <p className="text-base font-extrabold text-green-300 leading-tight">
                    {value}
                  </p>
                  <p className="text-[10px] text-green-100/50 font-medium mt-0.5">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            {/* Social icons */}
            <div>
              <p className="text-xs font-bold text-green-400/80 uppercase tracking-widest mb-3">
                Follow Us
              </p>
              <div className="flex gap-3">
                {socialLinks.map(({ icon, label, href, hoverColor }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={`w-9 h-9 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center text-green-100/60 text-lg ${hoverColor} hover:border-white/25 hover:bg-white/15 transition-all duration-200`}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Nav columns (desktop) */}
          <div className="lg:col-span-8 hidden md:grid md:grid-cols-3 gap-8">
            {footerLinks.map(({ heading, links }) => (
              <div key={heading}>
                <h4 className="text-xs font-extrabold text-green-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                  <span className="w-4 h-0.5 bg-green-500 rounded-full" />
                  {heading}
                </h4>
                <ul className="space-y-2.5">
                  {links.map(({ label, to, icon }) => (
                    <li key={label}>
                      <Link
                        to={to}
                        className="group flex items-center gap-2 text-sm text-green-100/55 hover:text-green-300 transition-colors duration-200"
                      >
                        {icon ? (
                          <span className="text-green-500 text-xs group-hover:text-green-300 transition-colors">
                            {icon}
                          </span>
                        ) : (
                          <span className="w-1 h-1 rounded-full bg-green-600 group-hover:bg-green-400 transition-colors flex-shrink-0" />
                        )}
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Nav columns (mobile accordion) */}
          <div className="md:hidden lg:col-span-8">
            {footerLinks.map((group) => (
              <MobileAccordion key={group.heading} {...group} />
            ))}
          </div>
        </div>
      </div>

      {/* Contact bar */}
      <div className="relative border-t border-white/10">
        <div className="container mx-auto px-4 md:px-6 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
            {[
              {
                icon: <FaMapLocationDot className="text-green-400" />,
                label: "Location",
                value: "11/A Horana, Kalutara, Sri Lanka",
              },
              {
                icon: <IoIosMail className="text-green-400" />,
                label: "Email",
                value: "support@saps.com",
              },
              {
                icon: <MdAddIcCall className="text-green-400" />,
                label: "Phone",
                value: "+(94)-34-567-8943",
              },
            ].map(({ icon, label, value }) => (
              <div
                key={label}
                className="flex items-center gap-3 justify-center sm:justify-start"
              >
                <div className="w-8 h-8 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center text-base flex-shrink-0">
                  {icon}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-green-400/70 uppercase tracking-wide">
                    {label}
                  </p>
                  <p className="text-xs text-green-100/65 font-medium">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar*/}
      <div className="relative border-t border-white/8 bg-black/20">
        <div className="container mx-auto px-4 md:px-6 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            {/* Copyright */}
            <div className="flex items-center gap-2 text-xs text-green-100/40">
              <FaLeaf className="text-green-600 text-xs" />
              <span>
                © {CURRENT_YEAR} Smart Agri Prediction. All rights reserved.
              </span>
            </div>

            {/* Center made with love */}
            <div className="flex items-center gap-1.5 text-xs text-green-100/30">
              <span>Built with</span>
              <span className="text-red-400 animate-pulse">♥</span>
              <span>for Sri Lankan farmers</span>
            </div>

            {/* Legal links */}
            <div className="flex items-center gap-4 text-xs text-green-100/40">
              <Link
                to="/privacy"
                className="hover:text-green-300 transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <span className="opacity-30">·</span>
              <Link
                to="/terms"
                className="hover:text-green-300 transition-colors duration-200"
              >
                Terms of Use
              </Link>
              <span className="opacity-30">·</span>
              <Link
                to="/sitemap"
                className="hover:text-green-300 transition-colors duration-200"
              >
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Back to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 z-50 w-11 h-11 bg-green-600 hover:bg-green-500 text-white rounded-full shadow-lg hover:shadow-green-500/40 transition-all duration-200 flex items-center justify-center text-sm hover:-translate-y-0.5"
        aria-label="Back to top"
        style={{ boxShadow: "0 4px 20px rgba(22,163,74,0.4)" }}
      >
        ↑
      </button>
    </footer>
  );
}

export default Footer;
