import { Link } from "react-router-dom";
import { FaLeaf } from "react-icons/fa";
import FadeIn from "../common/FadeIn";
import { FaArrowRightLong, FaPlay } from "react-icons/fa6";

// The ServicesCTA component serves as a compelling call-to-action at the end of the Services page, encouraging visitors to take the next step in engaging with our Smart Agri AI platform.
function ServicesCTA() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <FadeIn>
          <div
            className="relative rounded-3xl overflow-hidden bg-linear-to-br from-[#052e16] via-[#14532d] to-[#16a34a] text-white text-center py-16 px-6 md:px-12"
            style={{ boxShadow: "0 25px 60px rgba(22,163,74,0.25)" }}
          >
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)`,
                backgroundSize: "24px 24px",
              }}
            />
            <div className="relative">
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-green-200 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-5">
                <FaLeaf /> Join the Agri Revolution
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
                Ready to Put AI <br className="hidden sm:block" />
                to Work on Your Farm?
              </h2>
              <p className="text-green-100/70 max-w-lg mx-auto mb-8 text-sm leading-relaxed">
                All four services are available free of charge. Create your
                account and get your first crop recommendation in under 60
                seconds.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 bg-white text-green-700 font-bold px-6 py-3 rounded-xl hover:bg-green-50 transition-all shadow-lg hover:-translate-y-0.5 text-sm"
                >
                  Create Free Account <FaArrowRightLong />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-all text-sm"
                >
                  <FaPlay className="text-xs" />
                  Talk to Us
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

export default ServicesCTA;
