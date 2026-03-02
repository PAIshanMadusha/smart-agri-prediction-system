import FadeIn from "../common/FadeIn";
import SectionPill from "./SectionPill";
import { services } from "../../data/services/services";

// The ServicesHero component serves as the introductory section of the Services page, providing a visually striking and informative overview of our AI tools for agriculture.
function ServicesHero() {
  return (
    <section className="relative bg-linear-to-br from-[#052e16] via-[#14532d] to-[#16a34a] text-white overflow-hidden py-24 md:py-32">
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.4) 1px,transparent 1px)`,
          backgroundSize: "44px 44px",
        }}
      />
      <div className="absolute -top-32 -right-32 w-125 h-125 rounded-full bg-green-400/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-emerald-300/10 blur-3xl translate-y-1/2 -translate-x-1/4" />

      <div className="relative container mx-auto px-4 md:px-6 text-center">
        <FadeIn>
          <SectionPill text="Our Services" dark />
        </FadeIn>
        <FadeIn delay={100}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.1] mb-6">
            AI Tools Built for{" "}
            <span className="text-green-300">Every Farmer</span>
          </h1>
        </FadeIn>
        <FadeIn delay={200}>
          <p className="text-green-100/75 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            From crop health monitoring to yield prediction, our AI tools
            empower farmers with actionable insights for smarter, more
            sustainable agriculture.
          </p>
        </FadeIn>
        <FadeIn delay={300}>
          <div className="flex flex-wrap justify-center gap-3">
            {services.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-sm font-semibold text-white hover:bg-white/20 transition-colors cursor-default"
              >
                <span>{s.emoji}</span> {s.title}
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

export default ServicesHero;
