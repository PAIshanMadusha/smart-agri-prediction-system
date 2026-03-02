import { FaChevronRight, FaCheckCircle } from "react-icons/fa";
import FadeIn from "../common/FadeIn";

// This component introduces the company and its mission with a visually appealing design, using a gradient background and clear typography to capture attention.
function WhoWeAre() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <FadeIn>
              <span className="inline-flex items-center gap-2 text-green-600 text-xs font-bold uppercase tracking-widest mb-3">
                <FaChevronRight className="text-green-400" /> Who We Are
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-5">
                Bridging AI Research <br className="hidden md:block" />
                and Real-World Farming
              </h2>
              <p className="text-gray-600 leading-relaxed mb-5">
                SAPS was created to transform complex machine learning research
                into practical tools that farmers can use every day. We focus on
                usability, clarity, and real-world impact.
              </p>
            </FadeIn>

            <FadeIn delay={100}>
              <ul className="space-y-3">
                {[
                  "Models trained on agricultural datasets",
                  "Integrated real-time weather insights",
                  "Designed for mobile-first access",
                  "Built for clarity and ease of use",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-gray-700"
                  >
                    <FaCheckCircle className="text-green-500 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </FadeIn>
          </div>

          <div className="space-y-5">
            <FadeIn>
              <div className="bg-linear-to-br from-[#052e16] to-[#14532d] text-white rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-bold text-green-300 mb-2">
                  Our Mission
                </h3>
                <p className="text-green-100/80 text-sm leading-relaxed">
                  To make intelligent agricultural decision-making accessible,
                  affordable, and understandable for every farmer.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={100}>
              <div className="bg-linear-to-br from-[#052e16] to-[#14532d] text-white rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-bold text-green-300 mb-2">
                  Our Vision
                </h3>
                <p className="text-green-100/80 text-sm leading-relaxed">
                  A future where farmers rely on clear, data-backed insights
                  instead of guesswork improving productivity and
                  sustainability.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhoWeAre;
