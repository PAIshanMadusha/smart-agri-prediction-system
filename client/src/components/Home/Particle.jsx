// Particle component for decorative background elements in the HeroSection
function Particle({ style }) {
  return (
    <div
      className="absolute rounded-full bg-white/10 animate-pulse"
      style={style}
    />
  );
}

export default Particle;
