import { FaQuoteLeft } from "react-icons/fa";
import FadeIn from "./FadeIn";

// This component displays a testimonial from a key team member, using a visually appealing design with a gradient background, quote styling, and an avatar to highlight the personal impact of our work. It serves to humanize our mission and connect with users on an emotional level by sharing a powerful statement about our commitment to empowering farmers through technology.
function Testimonial() {
  return (
    <section className="py-20 container mx-auto px-4 md:px-8 max-w-4xl">
      <FadeIn>
        <div className="relative bg-linear-to-br from-[#052e16] to-[#14532d] text-white rounded-3xl p-10 md:p-14 text-center overflow-hidden shadow-2xl">
          <div className="absolute top-6 left-8 text-green-400/30 text-2xl leading-none select-none">
            <FaQuoteLeft />
          </div>
          <div className="relative z-10">
            <p className="text-xl md:text-2xl font-light text-green-50 leading-relaxed italic mb-8 max-w-2xl mx-auto">
              "We don't just build models. We build tools that let a farmer in
              Kalutara make the same data-driven decisions as an agronomist with
              decades of experience."
            </p>
            <div className="inline-flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white font-bold text-sm">
                AP
              </div>
              <div className="text-left">
                <p className="text-white font-semibold text-sm">
                  Ishan Madhusha
                </p>
                <p className="text-green-300 text-xs">Lead ML Engineer, SAPS</p>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}

export default Testimonial;
