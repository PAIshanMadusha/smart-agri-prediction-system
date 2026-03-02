// Import necessary libraries and components for the HeroSection
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaLeaf, FaArrowRight, FaPlay } from "react-icons/fa";
import Logo from "../../assets/leaf_favicon.png";
import Particle from "./Particle";
import AnimatedStat from "./AnimatedStat";
import FeatureCard from "./FeatureCard";
import { features } from "../../data/home/features";

// Main HeroSection component that combines a dynamic background, animated stats, and feature highlights to create an engaging introduction to the Smart Agri Prediction System
function HeroSection() {
  // State to control the visibility of animated elements for a staggered entrance effect
  const [visible, setVisible] = useState(false);

  // Trigger the visibility of animated elements after a short delay on component mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    // Main section with relative positioning to contain absolute-positioned background particles and content
    <section className="relative min-h-screen overflow-hidden flex flex-col">
      {/* Dynamic background with gradient and animated particles for a lively visual effect */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(135deg, #052e16 0%, #14532d 40%, #166534 70%, #16a34a 100%)",
        }}
      />

      {/* Render multiple Particle components with varying styles for a dynamic background effect */}
      {[...Array(14)].map((_, i) => (
        <Particle
          key={i}
          style={{
            width: `${8 + (i % 4) * 6}px`,
            height: `${8 + (i % 4) * 6}px`,
            top: `${10 + i * 7}%`,
            left: `${5 + i * 8}%`,
            animationDelay: `${i * 0.4}s`,
            animationDuration: `${3 + (i % 3)}s`,
          }}
        />
      ))}

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2 max-w-3xl">
              {/* Badge with icon and text, animated on load */}
              <div
                className={`inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-green-100 text-xs font-semibold px-4 py-2 rounded-full mb-6 transition-all duration-700 ${
                  visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                <FaLeaf className="text-green-300 text-sm" />
                AI-Powered Agricultural Intelligence
              </div>

              {/* Main Heading */}
              <h1
                className={`text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6 transition-all duration-700 ${
                  visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
              >
                Smarter Farming <br />
                <span className="text-green-300">Powered by AI</span>
              </h1>

              {/* Subheading */}
              <p
                className={`text-base sm:text-lg text-green-100/80 mb-8 leading-relaxed transition-all duration-700 ${
                  visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
              >
                Get intelligent crop recommendations, detect crop diseases, and
                receive optimized fertilizer suggestions using advanced machine
                learning models tailored for farmers.
              </p>

              {/* Call-to-Action Buttons */}
              <div className="flex flex-wrap gap-4 mb-8">
                <Link
                  to="/services"
                  className="group inline-flex items-center gap-2 bg-white text-green-700 font-bold px-6 py-3 rounded-xl hover:bg-green-50 transition-all"
                >
                  Explore Services
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/resources"
                  className="group inline-flex items-center gap-2 border-2 border-white/40 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-all"
                >
                  <FaPlay className="text-xs" />
                  Learn More
                </Link>
              </div>

              {/* Animated Stats for mobile view, hidden on larger screens */}
              <div className="flex gap-6 sm:hidden">
                {[
                  { value: "3", suffix: "+", label: "ML Models" },
                  { value: "99.82", suffix: "%", label: "Peak Accuracy" },
                  { value: "4", suffix: "+", label: "Smart Tools" },
                ].map(({ value, suffix, label }) => (
                  <div key={label} className="text-center">
                    <p className="text-2xl font-extrabold text-white">
                      <AnimatedStat value={value} suffix={suffix} />
                    </p>
                    <p className="text-xs text-green-200 font-medium">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual representation of the product with layered elements, animations, and key stats, shown on larger screens */}
            <div className="hidden lg:flex lg:w-1/2 justify-center">
              <div
                className="relative flex items-center justify-center w-64 h-64 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl"
                style={{
                  boxShadow:
                    "0 0 60px rgba(74, 222, 128, 0.15), 0 25px 50px rgba(0,0,0,0.3)",
                }}
              >
                <div
                  className="absolute inset-0 rounded-full border-2 border-dashed border-white/20"
                  style={{ animation: "spin 20s linear infinite" }}
                />

                <div
                  className="absolute inset-3 rounded-full border border-green-400/30"
                  style={{ animation: "pulse 3s ease-in-out infinite" }}
                />

                {/* Central logo with drop shadow and glowing effect, representing the core of the Smart Agri Prediction System */}
                <div
                  className="w-34 h-34 rounded-full bg-linear-to-br from-green-400 to-green-700 flex items-center justify-center text-white text-3xl shadow-lg relative z-10"
                  style={{
                    boxShadow:
                      "0 0 30px rgba(74, 222, 128, 0.4), 0 8px 24px rgba(0,0,0,0.3)",
                  }}
                >
                  <img
                    src={Logo}
                    alt="Smart Agri Logo"
                    className="w-30 h-30 object-contain drop-shadow-lg"
                  />
                </div>

                {/* Key stats positioned around the central logo, providing quick insights into the capabilities of the system, with a consistent design language and subtle animations for emphasis */}
                <div
                  className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white text-green-700 px-4 py-2 rounded-full shadow-lg text-center z-20 border border-green-100 group cursor-default"
                  style={{
                    boxShadow:
                      "0 4px 20px rgba(22, 163, 74, 0.25), 0 2px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  <p className="font-extrabold text-sm leading-tight tracking-tight">
                    3+
                  </p>
                  <p className="text-xs text-green-600 font-medium">
                    ML Models
                  </p>
                </div>

                <div
                  className="absolute bottom-4 -left-8 bg-white text-green-700 px-4 py-2 rounded-full shadow-lg text-center z-20 border border-green-100"
                  style={{
                    boxShadow:
                      "0 4px 20px rgba(22, 163, 74, 0.25), 0 2px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  <p className="font-extrabold text-sm leading-tight tracking-tight">
                    99.82%
                  </p>
                  <p className="text-xs text-green-600 font-medium">
                    Peak Accuracy
                  </p>
                </div>

                <div
                  className="absolute bottom-4 -right-8 bg-white text-green-700 px-4 py-2 rounded-full shadow-lg text-center z-20 border border-green-100"
                  style={{
                    boxShadow:
                      "0 4px 20px rgba(22, 163, 74, 0.25), 0 2px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  <p className="font-extrabold text-sm leading-tight tracking-tight">
                    4+
                  </p>
                  <p className="text-xs text-green-600 font-medium">
                    Smart Tools
                  </p>
                </div>
              </div>

              {/* Keyframe animations for spinning and pulsing effects on the background elements, defined within the component for encapsulation and ease of maintenance */}
              <style>{`
                @keyframes spin {
                  from { transform: rotate(0deg); }
                  to   { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          </div>
        </div>
      </div>

      {/* Feature highlights section with a semi-transparent background and a fade effect at the bottom to smoothly transition into the rest of the page content */}
      <div className="relative z-10 bg-black/20 pt-10 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((item) => (
              <FeatureCard key={item.label} {...item} visible={visible} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
