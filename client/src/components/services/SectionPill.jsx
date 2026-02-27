import { FaLeaf } from "react-icons/fa";

// The SectionPill component is a reusable UI element that displays a small, stylized pill-shaped badge with an optional leaf icon. It is used throughout the Services page to highlight section titles and important information, providing a consistent and visually appealing design that reinforces our brand identity in the agricultural technology space.
function SectionPill({ text, dark = false }) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4 border
      ${
        dark
          ? "bg-white/10 text-green-200 border-white/20"
          : "bg-green-100 text-green-700 border-green-200"
      }`}
    >
      <FaLeaf /> {text}
    </span>
  );
}

export default SectionPill;
