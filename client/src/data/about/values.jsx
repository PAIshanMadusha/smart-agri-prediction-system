import { FaSeedling, FaBrain, FaLeaf, FaAward } from "react-icons/fa";

// This file defines the core values of the company, which are used in the About page to communicate our principles and commitments to our users and stakeholders. Each value includes an icon, a title, and a description that highlights our focus on farmer-centered design, data-driven decisions, sustainable impact, and accuracy & trust.
export const values = [
  {
    icon: <FaSeedling />,
    title: "Farmer Centered Design",
    desc: "Every feature is designed to solve real challenges faced by Sri Lankan farmers in the field.",
  },
  {
    icon: <FaBrain />,
    title: "Data-Driven Decisions",
    desc: "Our models are trained, validated, and continuously improved using agricultural data.",
  },
  {
    icon: <FaLeaf />,
    title: "Sustainable Impact",
    desc: "We focus on long-term soil health, efficient resource usage, and responsible farming practices.",
  },
  {
    icon: <FaAward />,
    title: "Accuracy & Trust",
    desc: "We prioritize reliability, transparency, and measurable performance in every release.",
  },
];
