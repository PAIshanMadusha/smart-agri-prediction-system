import FadeIn from "../common/FadeIn";
import SectionPill from "../services/SectionPill";
import { platformFeatures } from "../../data/services/platformFeatures";

// The PlatformFeaturesSection component highlights the key features of our Smart Agri AI platform, emphasizing its reliability, scalability, and user-friendly design.
function PlatformFeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-14">
          <FadeIn>
            <SectionPill text="Platform" />
          </FadeIn>
          <FadeIn delay={100}>
            <h2 className="text-3xl md:text-4xl font-extrabold">
              Built for Reliability
            </h2>
          </FadeIn>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {platformFeatures.map(({ icon, title, desc }, i) => (
            <FadeIn key={title} delay={i * 60}>
              <div className="flex items-start gap-4 bg-green-50 border border-green-100 rounded-2xl p-5 hover:border-green-300 hover:shadow-sm transition-all duration-200">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-sm shrink-0 shadow">
                  {icon}
                </div>
                <div>
                  <h4 className="font-bold text-[#073319] text-sm mb-1">
                    {title}
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PlatformFeaturesSection;
