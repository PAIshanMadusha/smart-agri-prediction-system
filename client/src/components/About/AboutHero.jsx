import { Link } from "react-router-dom";
import { FaLeaf, FaPlay } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import FadeIn from "../common/FadeIn";

// This component is the hero section for the About page, introducing the company and its mission with a visually appealing design.
function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-[#052e16] via-[#14532d] to-[#166534] text-white pt-16 pb-24 md:pt-20 md:pb-28">
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

      <div className="relative container mx-auto px-4 md:px-8 max-w-5xl text-center">
        <FadeIn>
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-green-200 text-xs font-semibold px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
            <FaLeaf className="text-green-300" />
            About Smart Agri Prediction
          </div>
        </FadeIn>
        <FadeIn delay={100}>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            Technology That <br />
            <span className="text-green-300">Empowers Farmers</span>
          </h1>
        </FadeIn>
        <FadeIn delay={200}>
          <p className="text-green-100/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            We are engineers and data scientists building accessible AI tools
            that help farmers make informed, confident agricultural decisions.
          </p>
        </FadeIn>
        <FadeIn delay={300}>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 bg-white text-green-700 font-bold px-6 py-3 rounded-xl hover:bg-green-50 transition-all shadow-lg hover:-translate-y-0.5 text-sm"
            >
              Our Services <FaArrowRightLong />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-all text-sm"
            >
              <FaPlay className="text-xs" />
              Contact Us
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

export default AboutHero;
