import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaLeaf,
  FaSearch,
  FaBookOpen,
  FaFlask,
  FaCloudSun,
  FaSeedling,
  FaMicroscope,
  FaArrowRight,
  FaClock,
  FaEye,
  FaTag,
  FaStar,
  FaFire,
} from "react-icons/fa";
import { HiSparkles, HiArrowTrendingUp } from "react-icons/hi2";
import {
  MdComputer,
  MdEco,
  MdWaterDrop,
  MdOutlineScience,
} from "react-icons/md";

/* Scroll reveal hook */
function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setInView(true);
      },
      { threshold },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function Reveal({ children, delay = 0, direction = "up", className = "" }) {
  const [ref, inView] = useInView();
  const t = {
    up: "translateY(30px)",
    left: "translateX(-30px)",
    right: "translateX(30px)",
    none: "none",
  };
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : t[direction],
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function SectionPill({ text, dark = false }) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4 border
      ${dark ? "bg-white/10 text-green-200 border-white/20" : "bg-green-100 text-green-700 border-green-200"}`}
    >
      <FaLeaf /> {text}
    </span>
  );
}

/* Mock data mirrors MongoDB schema */
const RESOURCES = [
  {
    slug: "understanding-soil-npk",
    title: "Understanding Soil NPK: The Foundation of Crop Health",
    category: "Soil Science",
    type: "Article",
    difficulty: "Beginner",
    readTime: "6 min read",
    tags: ["soil", "nutrients", "NPK", "fertilizer"],
    imageUrl:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
    excerpt:
      "Nitrogen, Phosphorus, and Potassium are the three macro-nutrients every plant needs. Learn how to test your soil and interpret NPK values for better yields.",
    author: "Dr. Chaminda Jayawardena",
    publishedAt: "2024-03-10",
    featured: true,
    views: 1420,
  },
  {
    slug: "random-forest-crop-recommendation",
    title: "How Random Forest Powers Our Crop Recommendation Engine",
    category: "Machine Learning",
    type: "Deep Dive",
    difficulty: "Intermediate",
    readTime: "9 min read",
    tags: ["random forest", "ML", "crop recommendation", "AI"],
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    excerpt:
      "A behind-the-scenes look at how an ensemble of 200 decision trees analyses 11 soil and climate inputs to recommend the 6 most suitable crops with 99.32% accuracy.",
    author: "Kasun Perera",
    publishedAt: "2024-04-02",
    featured: true,
    views: 2180,
  },
  {
    slug: "identifying-rice-leaf-diseases",
    title: "A Visual Guide to Identifying Rice Leaf Diseases",
    category: "Disease Management",
    type: "Guide",
    difficulty: "Beginner",
    readTime: "7 min read",
    tags: ["rice", "disease", "leaf blight", "blast"],
    imageUrl:
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80",
    excerpt:
      "Rice blast and bacterial leaf blight are the two most destructive rice diseases in Sri Lanka. Learn to spot them early and how our CNN detects them with 99.45% accuracy.",
    author: "Nimali Fernando",
    publishedAt: "2024-04-18",
    featured: false,
    views: 3350,
  },
  {
    slug: "xgboost-fertilizer-model",
    title: "XGBoost Explained: How We Recommend Fertilizers",
    category: "Machine Learning",
    type: "Deep Dive",
    difficulty: "Advanced",
    readTime: "11 min read",
    tags: ["XGBoost", "gradient boosting", "fertilizer"],
    imageUrl:
      "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&q=80",
    excerpt:
      "XGBoost's gradient boosting approach makes it ideal for structured tabular data. We explain how our fertilizer model achieves 80% accuracy across 7 fertilizer classes.",
    author: "Kasun Perera",
    publishedAt: "2024-05-05",
    featured: false,
    views: 1890,
  },
  {
    slug: "soil-ph-and-crop-selection",
    title: "Soil pH and Crop Selection: Why Acidity Matters",
    category: "Soil Science",
    type: "Article",
    difficulty: "Beginner",
    readTime: "5 min read",
    tags: ["soil pH", "acidity", "crop selection"],
    imageUrl:
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80",
    excerpt:
      "Soil pH determines nutrient availability, microbial activity, and ultimately which crops will thrive. Most Sri Lankan crops prefer a pH of 5.5–7.0.",
    author: "Dr. Chaminda Jayawardena",
    publishedAt: "2024-05-20",
    featured: false,
    views: 2640,
  },
  {
    slug: "weather-api-integration",
    title: "How Real-Time Weather Data Improves AI Crop Advice",
    category: "Technology",
    type: "Article",
    difficulty: "Intermediate",
    readTime: "6 min read",
    tags: ["OpenWeather", "API", "weather"],
    imageUrl:
      "https://images.unsplash.com/photo-1504608524841-42584120d693?w=800&q=80",
    excerpt:
      "Static ML models trained on historical data can drift when weather patterns change. Integrating the OpenWeather API allows our recommendations to adapt in real time.",
    author: "Lahiru Silva",
    publishedAt: "2024-06-08",
    featured: false,
    views: 1200,
  },
  {
    slug: "cnn-plant-disease-architecture",
    title: "Inside Our CNN: Architecture Behind 99.82% Training Accuracy",
    category: "Machine Learning",
    type: "Deep Dive",
    difficulty: "Advanced",
    readTime: "13 min read",
    tags: ["CNN", "deep learning", "plant disease"],
    imageUrl:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    excerpt:
      "A technical walkthrough of the CNN that classifies 38 crop disease classes — including our data augmentation strategy, transfer learning approach, and training pipeline.",
    author: "Nimali Fernando",
    publishedAt: "2024-06-25",
    featured: true,
    views: 4100,
  },
  {
    slug: "organic-farming-basics",
    title: "Transitioning to Organic Farming: A Practical Starter Guide",
    category: "Farming Practices",
    type: "Guide",
    difficulty: "Beginner",
    readTime: "8 min read",
    tags: ["organic", "farming", "compost"],
    imageUrl:
      "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=800&q=80",
    excerpt:
      "Organic certification takes 3 years, but you can start reducing chemical inputs today. Compost-making, green manuring, and biological pest control suited to Sri Lanka.",
    author: "Dr. Chaminda Jayawardena",
    publishedAt: "2024-07-14",
    featured: false,
    views: 3800,
  },
  {
    slug: "irrigation-water-management",
    title: "Smart Irrigation: Reducing Water Use Without Sacrificing Yield",
    category: "Water Management",
    type: "Guide",
    difficulty: "Intermediate",
    readTime: "7 min read",
    tags: ["irrigation", "water", "AWD", "rice"],
    imageUrl:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80",
    excerpt:
      "Alternate Wetting and Drying (AWD) for rice can cut water use by 30% with no yield penalty. How weather insights support smarter irrigation scheduling.",
    author: "Lahiru Silva",
    publishedAt: "2024-08-01",
    featured: false,
    views: 2290,
  },
  {
    slug: "post-harvest-loss-reduction",
    title: "Reducing Post-Harvest Losses: Storage & Handling Best Practices",
    category: "Farming Practices",
    type: "Article",
    difficulty: "Beginner",
    readTime: "6 min read",
    tags: ["post-harvest", "storage", "grain"],
    imageUrl:
      "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=800&q=80",
    excerpt:
      "Sri Lanka loses an estimated 30% of its rice harvest post-harvest. Proper drying, hermetic storage, and timely threshing can dramatically cut these losses.",
    author: "Dr. Chaminda Jayawardena",
    publishedAt: "2024-08-22",
    featured: false,
    views: 1750,
  },
  {
    slug: "crop-rotation-benefits",
    title: "Crop Rotation: How Alternating Crops Restores Soil Fertility",
    category: "Farming Practices",
    type: "Article",
    difficulty: "Beginner",
    readTime: "5 min read",
    tags: ["crop rotation", "soil fertility", "legumes"],
    imageUrl:
      "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800&q=80",
    excerpt:
      "A well-designed crop rotation reduces disease pressure, breaks pest cycles, and can add up to 40 kg N/ha through legume incorporation — without synthetic inputs.",
    author: "Dr. Chaminda Jayawardena",
    publishedAt: "2024-09-10",
    featured: false,
    views: 2110,
  },
  {
    slug: "climate-change-sri-lanka-agriculture",
    title: "Climate Change & Sri Lankan Agriculture: What Farmers Need to Know",
    category: "Climate & Environment",
    type: "Deep Dive",
    difficulty: "Intermediate",
    readTime: "10 min read",
    tags: ["climate change", "resilience", "Sri Lanka"],
    imageUrl:
      "https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=800&q=80",
    excerpt:
      "Rising temperatures, erratic monsoons, and sea-level intrusion are already affecting Sri Lankan farms. Adaptation strategies and climate-resilient crop varieties.",
    author: "Nimali Fernando",
    publishedAt: "2024-09-28",
    featured: true,
    views: 5200,
  },
  {
    slug: "using-smart-agri-crop-tool",
    title: "Step-by-Step: Getting Your First Crop Recommendation",
    category: "Platform Guide",
    type: "Tutorial",
    difficulty: "Beginner",
    readTime: "4 min read",
    tags: ["tutorial", "how-to", "crop recommendation"],
    imageUrl:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
    excerpt:
      "A beginner-friendly walkthrough of the Smart Agri crop recommendation tool — from entering your soil values to interpreting the top-6 crop results.",
    author: "Sachini Jayawardena",
    publishedAt: "2024-10-15",
    featured: false,
    views: 4700,
  },
];

const CATEGORIES = [
  { label: "All", value: "all", icon: <HiSparkles /> },
  { label: "Soil Science", value: "Soil Science", icon: <MdOutlineScience /> },
  {
    label: "Machine Learning",
    value: "Machine Learning",
    icon: <MdComputer />,
  },
  {
    label: "Disease Management",
    value: "Disease Management",
    icon: <FaMicroscope />,
  },
  {
    label: "Farming Practices",
    value: "Farming Practices",
    icon: <FaSeedling />,
  },
  {
    label: "Water Management",
    value: "Water Management",
    icon: <MdWaterDrop />,
  },
  {
    label: "Climate & Environment",
    value: "Climate & Environment",
    icon: <MdEco />,
  },
  { label: "Technology", value: "Technology", icon: <FaCloudSun /> },
  { label: "Platform Guide", value: "Platform Guide", icon: <FaBookOpen /> },
];

const TYPE_COLORS = {
  Article: "bg-blue-100 text-blue-700 border-blue-200",
  "Deep Dive": "bg-purple-100 text-purple-700 border-purple-200",
  Guide: "bg-green-100 text-green-700 border-green-200",
  Tutorial: "bg-amber-100 text-amber-700 border-amber-200",
};

const DIFF_COLORS = {
  Beginner: "bg-emerald-100 text-emerald-700",
  Intermediate: "bg-yellow-100 text-yellow-700",
  Advanced: "bg-red-100 text-red-700",
};

/* Resource card component */
function ResourceCard({ resource, index }) {
  const {
    title,
    category,
    type,
    difficulty,
    readTime,
    imageUrl,
    excerpt,
    author,
    views,
    tags,
    featured: isFeat,
    slug,
  } = resource;
  return (
    <Reveal delay={index * 55}>
      <div
        className={`group bg-white rounded-2xl border overflow-hidden hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 h-full flex flex-col
        ${isFeat ? "border-green-200 shadow-md" : "border-gray-100 shadow-sm"}`}
      >
        {/* Image */}
        <div className="relative overflow-hidden h-44 flex-shrink-0">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute top-3 left-3 flex gap-1.5">
            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-sm bg-white/90 ${TYPE_COLORS[type]}`}
            >
              {type}
            </span>
            {isFeat && (
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-400 text-white flex items-center gap-1">
                <FaStar className="text-[8px]" /> Featured
              </span>
            )}
          </div>
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-full">
            <FaEye className="text-[8px]" /> {views.toLocaleString()}
          </div>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-[10px] font-bold text-green-600 bg-green-50 border border-green-100 px-2.5 py-0.5 rounded-full truncate max-w-[130px]">
              {category}
            </span>
            <span
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex-shrink-0 ${DIFF_COLORS[difficulty]}`}
            >
              {difficulty}
            </span>
          </div>
          <h3 className="font-extrabold text-[#073319] text-sm leading-tight mb-2 group-hover:text-green-700 transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed mb-4 flex-1 line-clamp-3">
            {excerpt}
          </p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full border border-gray-200"
              >
                #{tag}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-gray-50">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                {author
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <span className="text-[11px] text-gray-500 font-medium truncate max-w-[90px]">
                {author.split(" ").slice(-1)[0]}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-gray-400 flex items-center gap-1">
                <FaClock className="text-[9px]" /> {readTime}
              </span>
              <Link
                to={`/resources/${slug}`}
                className="text-[11px] font-bold text-green-600 hover:text-green-800 flex items-center gap-1 transition-colors"
              >
                Read <FaArrowRight className="text-[8px]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
