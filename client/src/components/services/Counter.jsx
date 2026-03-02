import { useEffect, useRef, useState } from "react";
import { useInView } from "../../hooks/useInView";

// The Counter component animates a number counting up to a target value when it comes into view. It uses the useInView hook to detect when the component is visible on the screen and then starts the counting animation. The count is displayed with an optional suffix (defaulting to "%") for better presentation of statistics or metrics related to our services.
function Counter({ target, suffix = "%" }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView(0.3);
  const started = useRef(false);
  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const duration = 1600;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const t = setInterval(() => {
      current = Math.min(current + increment, target);
      setCount(parseFloat(current.toFixed(2)));
      if (current >= target) clearInterval(t);
    }, duration / steps);
    return () => clearInterval(t);
  }, [inView, target]);
  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default Counter;
