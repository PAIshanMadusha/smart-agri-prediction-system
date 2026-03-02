// FeatureCard component for displaying key features and stats in the HeroSection
function FeatureCard({
  icon,
  label,
  stat,
  statLabel,
  desc,
  color,
  delay,
  visible,
}) {
  return (
    // Card container with hover effects, transition animations, and dynamic styling based on props
    <div
      className={`group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 
      hover:bg-white/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer
      ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{
        transitionDelay: delay,
        transitionDuration: "600ms",
      }}
    >
      <div
        className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-br ${color} text-white text-lg mb-3 shadow-lg`}
      >
        {icon}
      </div>
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-2xl font-extrabold text-white">{stat}</span>
        <span className="text-xs text-green-200 font-medium">{statLabel}</span>
      </div>

      <h3 className="text-white font-bold text-sm mb-1">{label}</h3>
      <p className="text-green-200/70 text-xs leading-relaxed">{desc}</p>
    </div>
  );
}

export default FeatureCard;
