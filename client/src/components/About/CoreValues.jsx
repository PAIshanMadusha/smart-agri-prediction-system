import { values } from "../../data/about/values";
import FadeIn from "../common/FadeIn";

// This component displays the core values of the company, using a grid layout to present each value with its corresponding icon, title, and description. It emphasizes our commitment to farmer-centered design, data-driven decisions, sustainable impact, and accuracy & trust.
function CoreValues() {
  return (
    <section className="py-20 container mx-auto px-4 md:px-8 max-w-6xl">
      <FadeIn className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-extrabold">Our Core Values</h2>
      </FadeIn>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {values.map(({ icon, title, desc }) => (
          <div
            key={title}
            className="bg-white rounded-2xl p-6 border border-green-100 shadow-sm hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-600 text-xl mb-4">
              {icon}
            </div>
            <h3 className="font-bold mb-2">{title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CoreValues;
