import { useInView } from "../../hooks/about/useInView";

// This component provides a fade-in animation effect for its children elements when they come into view. It uses the Intersection Observer API to detect when the component is visible in the viewport and applies a smooth transition to fade in the content, enhancing the user experience with subtle animations as they scroll through the page.
export default function FadeIn({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView();

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
