import { FaChevronRight } from "react-icons/fa";
import FadeIn from "../common/FadeIn";
import { milestones } from "../../data/about/milestones";

// This component displays a timeline of the company's milestones and achievements, providing a visual narrative of our journey from inception to the present. Each milestone includes a year, title, and description, arranged in an alternating layout for better readability and engagement.
function Timeline() {
  return (
    <section className="py-10 container mx-auto px-4 md:px-8 max-w-4xl">
      <FadeIn className="text-center mb-14">
        <span className="inline-flex items-center gap-2 text-green-600 text-xs font-bold uppercase tracking-widest mb-3">
          <FaChevronRight className="text-green-400" /> Our Journey
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#073319]">
          How We Got Here
        </h2>
      </FadeIn>

      <div className="relative">
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-linear-to-b from-green-400 to-green-200 md:-translate-x-px" />

        <div className="space-y-10">
          {milestones.map(({ year, title, desc }, i) => (
            <FadeIn key={year} delay={i * 100}>
              <div
                className={`relative flex items-start gap-6 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} flex-row`}
              >
                <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-md md:-translate-x-1.5 mt-1.5 z-10" />

                <div
                  className={`ml-12 md:ml-0 w-full md:w-[calc(50%-2rem)] ${i % 2 === 0 ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"}`}
                >
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-green-100 hover:shadow-md transition-shadow">
                    <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full mb-2">
                      {year}
                    </span>
                    <h3 className="font-bold text-[#073319] mb-1">{title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Timeline;
