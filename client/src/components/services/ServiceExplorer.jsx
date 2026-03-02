import { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaStar, FaWifi } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import FadeIn from "../common/FadeIn";
import SectionPill from "../services/SectionPill";
import Counter from "../services/Counter";
import { services } from "../../data/services/services";

// The ServiceExplorer component provides an interactive interface for users to explore the different AI services we offer. It features a tabbed layout where users can click on each service to see detailed information, including how it works, key features, and performance metrics. This component is designed to engage users and help them understand the unique benefits of each service in a visually appealing way.
function ServiceExplorer() {
  const [activeTab, setActiveTab] = useState("crop");
  const active = services.find((s) => s.id === activeTab);
  return (
    <section className="py-20 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <FadeIn>
            <SectionPill text="Explore Services" />
          </FadeIn>
          <FadeIn delay={100}>
            <h2 className="text-3xl md:text-4xl font-extrabold">
              How Each Service Works
            </h2>
          </FadeIn>
        </div>

        <FadeIn className="flex flex-wrap justify-center gap-3 mb-10">
          {services.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveTab(s.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold border transition-all duration-200
                  ${
                    activeTab === s.id
                      ? `bg-linear-to-r ${s.gradient} text-white border-transparent shadow-lg scale-105`
                      : "bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:text-green-700"
                  }`}
            >
              <span className="text-base">{s.emoji}</span> {s.title}
            </button>
          ))}
        </FadeIn>

        {active && (
          <div
            key={active.id}
            className="grid lg:grid-cols-2 gap-8 items-start"
            style={{ animation: "fadeSlide 0.4s ease" }}
          >
            <div
              className={`rounded-3xl bg-linear-to-br ${active.lightGradient} border ${active.border} p-8`}
            >
              <div className="flex items-start justify-between mb-5">
                <div
                  className={`w-14 h-14 rounded-2xl bg-linear-to-br ${active.gradient} flex items-center justify-center text-white text-2xl shadow-lg`}
                >
                  {active.icon}
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1.5 rounded-full ${active.accentBg} ${active.accent} border ${active.border}`}
                >
                  {active.badge}
                </span>
              </div>

              <p
                className={`text-xs font-bold uppercase tracking-widest ${active.accent} mb-1`}
              >
                {active.subtitle}
              </p>
              <h3 className="text-2xl font-extrabold text-[#073319] mb-3">
                {active.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                {active.description}
              </p>

              {active.accuracy ? (
                <div
                  className={`inline-flex items-center gap-3 bg-linear-to-r ${active.gradient} text-white px-5 py-3 rounded-2xl shadow`}
                >
                  <div>
                    <p className="text-xl font-extrabold leading-tight">
                      <Counter target={active.accuracy} />
                    </p>
                    <p className="text-xs opacity-80">{active.accuracyLabel}</p>
                  </div>
                  <FaStar className="text-yellow-300 text-xl" />
                </div>
              ) : (
                <div
                  className={`inline-flex items-center gap-3 bg-linear-to-r ${active.gradient} text-white px-5 py-3 rounded-2xl shadow`}
                >
                  <FaWifi className="text-xl" />
                  <div>
                    <p className="text-xl font-extrabold leading-tight">Live</p>
                    <p className="text-xs opacity-80">Real-time Data</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h4 className="font-bold text-[#073319] mb-4 flex items-center gap-2">
                  <HiSparkles className={active.accent} /> How It Works
                </h4>
                <ol className="space-y-3">
                  {active.howItWorks.map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span
                        className={`shrink-0 w-6 h-6 rounded-full bg-linear-to-br ${active.gradient} text-white text-xs font-bold flex items-center justify-center mt-0.5`}
                      >
                        {i + 1}
                      </span>
                      <span className="text-sm text-gray-700">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {active.features.map(({ icon, text }, i) => (
                  <div
                    key={i}
                    className={`bg-white border ${active.border} rounded-xl p-4 flex items-center gap-3`}
                  >
                    <span className={`text-lg ${active.accent}`}>{icon}</span>
                    <span className="text-xs font-semibold text-gray-700">
                      {text}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                to={`/services/${active.id}`}
                className={`inline-flex items-center gap-2 bg-linear-to-r ${active.gradient} text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200 shadow-lg text-sm`}
              >
                Try {active.title} <FaArrowRight className="text-xs" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default ServiceExplorer;
