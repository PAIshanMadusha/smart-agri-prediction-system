// UseState and useEffect hooks for managing state and side effects in the AnimatedStat component
import { useState, useEffect } from "react";

// AnimatedStat component that animates counting up to a target value, with support for a "Live" state
function AnimatedStat({ value, suffix = "" }) {
  const [display, setDisplay] = useState(value === "Live" ? "Live" : "0");

  // Animate counting up to the target value when it changes, unless it's "Live"
  useEffect(() => {
    if (value === "Live") {
      return;
    }

    // Parse the numeric part of the value for animation purposes
    const numericValue = parseFloat(value);
    const duration = 1800;
    const steps = 60;
    let current = 0;

    // Timer to update the displayed value at regular intervals until it reaches the target
    const timer = setInterval(() => {
      current += numericValue / steps;

      // If the current value has reached or exceeded the target, set it to the final value and clear the timer
      if (current >= numericValue) {
        setDisplay(value + suffix);
        clearInterval(timer);
      } else {
        setDisplay(current.toFixed(numericValue % 1 !== 0 ? 2 : 0) + suffix);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value, suffix]);

  return <span>{display}</span>;
}

export default AnimatedStat;
