import { FaCheckCircle } from "react-icons/fa";
import FadeIn from "../common/FadeIn";
import SectionPill from "../services/SectionPill";
import { comparisonRows } from "../../data/services/comparisonRows";

// The ComparisonSection component provides a clear and concise comparison between traditional farming methods and our Smart Agri AI solutions. It highlights the key features and benefits of using AI in agriculture, making it easier for potential users to understand the advantages of our services.
function ComparisonSection() {
  return (
    <section className="py-20 md:py-16">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="text-center mb-10">
          <FadeIn>
            <SectionPill text="Why Choose Us" />
          </FadeIn>
          <FadeIn delay={100}>
            <h2 className="text-3xl md:text-4xl font-extrabold">
              Traditional vs{" "}
              <span className="text-green-600">Smart Agri AI</span>
            </h2>
          </FadeIn>
        </div>

        <FadeIn>
          <div className="rounded-3xl overflow-hidden border border-gray-200 shadow-lg bg-white">
            <div className="grid grid-cols-3 bg-linear-to-r from-[#052e16] to-[#16a34a] text-white">
              <div className="p-4 text-sm font-bold border-r border-white/10">
                Feature
              </div>
              <div className="p-4 text-sm font-bold text-center border-r border-white/10 opacity-60">
                Traditional
              </div>
              <div className="p-4 text-sm font-bold text-center text-green-200">
                Smart Agri AI
              </div>
            </div>

            {comparisonRows.map(({ feature, traditional, smart }, i) => (
              <div
                key={feature}
                className={`grid grid-cols-3 border-b border-gray-100 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-green-50/40"}`}
              >
                <div className="p-4 text-sm font-semibold text-[#073319] border-r border-gray-100">
                  {feature}
                </div>
                <div className="p-4 text-sm text-gray-400 text-center border-r border-gray-100">
                  {traditional}
                </div>
                <div className="p-4 text-sm text-green-700 font-semibold text-center flex items-center justify-center gap-1.5">
                  <FaCheckCircle className="text-green-500 shrink-0" /> {smart}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

export default ComparisonSection;
