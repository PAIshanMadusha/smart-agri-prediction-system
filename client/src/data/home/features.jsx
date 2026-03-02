import { FaSeedling, FaMicroscope, FaFlask, FaCloudSun } from "react-icons/fa";

// Data for the features displayed in the HeroSection, including icons, labels, stats, descriptions, and gradient colors
export const features = [
  {
    icon: <FaSeedling />,
    label: "Crop Recommendation",
    stat: "99.32%",
    statLabel: "Test Accuracy",
    desc: "ML model recommending optimal crops based on soil and weather data",
    color: "from-emerald-500 to-green-600",
  },
  {
    icon: <FaMicroscope />,
    label: "Disease Detection",
    stat: "99.82%",
    statLabel: "Train Accuracy",
    desc: "Deep learning model identifying crop diseases from leaf images",
    color: "from-teal-500 to-emerald-600",
  },
  {
    icon: <FaFlask />,
    label: "Fertilizer Suggestion",
    stat: "80.00%",
    statLabel: "Model Accuracy",
    desc: "ML model suggesting optimal fertilizers based on soil and crop data",
    color: "from-green-500 to-teal-600",
  },
  {
    icon: <FaCloudSun />,
    label: "Weather Insights",
    stat: "Live",
    statLabel: "OpenWeather API",
    desc: "Real-time weather data integration for informed farming decisions",
    color: "from-sky-500 to-cyan-600",
  },
];
