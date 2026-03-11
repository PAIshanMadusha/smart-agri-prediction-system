//TODO: Split into smaller components for better maintainability (e.g. ResourceCard, SectionPill, FilterBar, etc.)
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

/* Main page */
function ResourcesPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeDifficulty, setActiveDifficulty] = useState("all");
  const [activeType, setActiveType] = useState("all");
  const [visibleCount, setVisibleCount] = useState(9);

  // helpers used by the controls below
  const resetVisible = () => setVisibleCount(9);

  const filtered = RESOURCES.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      r.title.toLowerCase().includes(q) ||
      r.excerpt.toLowerCase().includes(q) ||
      r.tags.some((t) => t.toLowerCase().includes(q));
    const matchCat = activeCategory === "all" || r.category === activeCategory;
    const matchDiff =
      activeDifficulty === "all" || r.difficulty === activeDifficulty;
    const matchType = activeType === "all" || r.type === activeType;
    return matchSearch && matchCat && matchDiff && matchType;
  });

  const featured = RESOURCES.filter((r) => r.featured);
  const topViewed = [...RESOURCES]
    .sort((a, b) => b.views - a.views)
    .slice(0, 4);
  const visible = filtered.slice(0, visibleCount);

  return (
    <div className="bg-[#f0fdf4] text-[#073319] overflow-x-hidden">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#052e16] via-[#14532d] to-[#16a34a] text-white overflow-hidden py-24 md:py-32">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.4) 1px,transparent 1px)`,
            backgroundSize: "44px 44px",
          }}
        />
        <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-green-400/10 blur-3xl" />
        <div className="absolute bottom-0 -left-20 w-72 h-72 rounded-full bg-emerald-300/10 blur-3xl translate-y-1/2" />

        <div className="relative container mx-auto px-4 md:px-6 text-center">
          <Reveal>
            <SectionPill text="Resources" dark />
          </Reveal>
          <Reveal delay={100}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.1] mb-5">
              Learn, Grow & <span className="text-green-300">Farm Smarter</span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-green-100/75 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              {RESOURCES.length} expert-written articles, guides, deep dives,
              and tutorials covering soil science, AI agriculture, disease
              management, and more.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div className="relative max-w-lg mx-auto">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-sm" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  resetVisible();
                }}
                placeholder="Search articles, guides, topics…"
                className="w-full pl-11 pr-10 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/25 text-white placeholder-white/45 focus:outline-none focus:border-white/60 focus:bg-white/15 transition-all text-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </Reveal>
          <Reveal delay={380}>
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {[
                {
                  icon: <FaBookOpen />,
                  val: `${RESOURCES.length}`,
                  lbl: "Resources",
                },
                { icon: <FaTag />, val: "8", lbl: "Categories" },
                { icon: <FaFire />, val: "5.2K", lbl: "Top Views" },
                { icon: <HiArrowTrendingUp />, val: "Free", lbl: "Always" },
              ].map(({ icon, val, lbl }) => (
                <div
                  key={lbl}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-sm"
                >
                  <span className="text-green-300">{icon}</span>
                  <span className="font-bold">{val}</span>
                  <span className="text-green-100/60">{lbl}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Featured spotlight*/}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8">
            <Reveal>
              <SectionPill text="Featured" />
            </Reveal>
            <Reveal delay={80}>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#073319]">
                Editor's Picks
              </h2>
            </Reveal>
          </div>
          {/* Hero featured card */}
          <Reveal>
            <div className="group relative rounded-3xl overflow-hidden mb-6 shadow-lg hover:shadow-2xl transition-shadow duration-300 h-80 md:h-96 cursor-pointer">
              <img
                src={featured[0]?.imageUrl}
                alt={featured[0]?.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#052e16]/90 via-[#052e16]/55 to-transparent" />
              <div className="absolute inset-0 flex items-end p-8 md:p-12">
                <div className="max-w-xl">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className="text-xs font-bold bg-amber-400 text-white px-3 py-1 rounded-full flex items-center gap-1">
                      <FaStar className="text-[10px]" /> Featured
                    </span>
                    <span className="text-xs font-bold bg-white/20 text-white px-3 py-1 rounded-full backdrop-blur-sm">
                      {featured[0]?.category}
                    </span>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm ${DIFF_COLORS[featured[0]?.difficulty]}`}
                    >
                      {featured[0]?.difficulty}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-3xl font-extrabold text-white leading-tight mb-3">
                    {featured[0]?.title}
                  </h3>
                  <p className="text-white/70 text-sm mb-5 line-clamp-2">
                    {featured[0]?.excerpt}
                  </p>
                  <div className="flex items-center gap-4 flex-wrap">
                    <Link
                      to={`/resources/${featured[0]?.slug}`}
                      className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm shadow"
                    >
                      Read Article <FaArrowRight className="text-xs" />
                    </Link>
                    <span className="text-white/50 text-xs flex items-center gap-1.5">
                      <FaEye /> {featured[0]?.views?.toLocaleString()} views ·{" "}
                      {featured[0]?.readTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
          {/* Secondary featured row */}
          <div className="grid sm:grid-cols-3 gap-5">
            {featured.slice(1, 4).map((r, i) => (
              <ResourceCard key={r.slug} resource={r} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Most popular*/}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8">
            <Reveal>
              <SectionPill text="Trending" />
            </Reveal>
            <Reveal delay={80}>
              <h2 className="text-2xl font-extrabold text-[#073319]">
                Most Read
              </h2>
            </Reveal>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topViewed.map((r, i) => (
              <Reveal key={r.slug} delay={i * 60}>
                <Link
                  to={`/resources/${r.slug}`}
                  className="group flex items-start gap-3 bg-green-50 border border-green-100 rounded-2xl p-4 hover:border-green-300 hover:shadow-md transition-all duration-200"
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white text-xs font-extrabold flex items-center justify-center shadow">
                    #{i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#073319] group-hover:text-green-700 transition-colors line-clamp-2 leading-tight mb-1">
                      {r.title}
                    </p>
                    <p className="text-[11px] text-gray-400 flex items-center gap-1">
                      <FaEye className="text-[9px]" />{" "}
                      {r.views.toLocaleString()} · {r.readTime}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Full library with filter*/}
      <section id="library" className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <Reveal>
              <SectionPill text="All Resources" />
            </Reveal>
            <Reveal delay={80}>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#073319]">
                Browse the Full Library
              </h2>
            </Reveal>
          </div>

          {/* Filter bar */}
          <Reveal className="mb-8">
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-3">
              {/* Category scroll */}
              <div
                className="flex gap-2 overflow-x-auto pb-1"
                style={{ scrollbarWidth: "none" }}
              >
                {CATEGORIES.map(({ label, value, icon }) => (
                  <button
                    key={value}
                    onClick={() => {
                      setActiveCategory(value);
                      resetVisible();
                    }}
                    className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-200 flex-shrink-0
                      ${
                        activeCategory === value
                          ? "bg-green-600 text-white border-transparent shadow"
                          : "bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:text-green-700"
                      }`}
                  >
                    <span className="text-sm">{icon}</span> {label}
                  </button>
                ))}
              </div>
              {/* Difficulty Type */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-50 items-center">
                <span className="text-xs font-bold text-gray-400 mr-1">
                  Difficulty:
                </span>
                {["all", "Beginner", "Intermediate", "Advanced"].map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      setActiveDifficulty(d);
                      resetVisible();
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200
                      ${activeDifficulty === d ? "bg-green-600 text-white border-transparent" : "bg-white text-gray-500 border-gray-200 hover:border-green-300"}`}
                  >
                    {d === "all" ? "All Levels" : d}
                  </button>
                ))}
                <span className="text-xs font-bold text-gray-400 ml-3 mr-1">
                  Type:
                </span>
                {["all", "Article", "Guide", "Deep Dive", "Tutorial"].map(
                  (tp) => (
                    <button
                      key={tp}
                      onClick={() => {
                        setActiveType(tp);
                        resetVisible();
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200
                      ${activeType === tp ? "bg-green-600 text-white border-transparent" : "bg-white text-gray-500 border-gray-200 hover:border-green-300"}`}
                    >
                      {tp === "all" ? "All Types" : tp}
                    </button>
                  ),
                )}
              </div>
            </div>
          </Reveal>

          {/* Results count */}
          <Reveal className="mb-5">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-bold text-green-600">
                {Math.min(visibleCount, filtered.length)}
              </span>{" "}
              of{" "}
              <span className="font-bold text-[#073319]">
                {filtered.length}
              </span>{" "}
              resources
              {activeCategory !== "all" && (
                <span>
                  {" "}
                  in <em>{activeCategory}</em>
                </span>
              )}
            </p>
          </Reveal>

          {/* Grid */}
          {visible.length > 0 ? (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {visible.map((r, i) => (
                  <ResourceCard key={r.slug} resource={r} index={i} />
                ))}
              </div>
              {visibleCount < filtered.length && (
                <Reveal className="text-center mt-10">
                  <button
                    onClick={() => setVisibleCount((p) => p + 6)}
                    className="inline-flex items-center gap-2 border-2 border-green-600 text-green-700 font-bold px-8 py-3 rounded-xl hover:bg-green-600 hover:text-white transition-all duration-200 text-sm"
                  >
                    Load More <FaArrowRight className="text-xs" />
                  </button>
                </Reveal>
              )}
            </>
          ) : (
            <Reveal>
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                  🌿
                </div>
                <h3 className="font-bold text-[#073319] mb-2">
                  No resources found
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  Try adjusting your search or filters.
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setActiveCategory("all");
                    setActiveDifficulty("all");
                    setActiveType("all");
                    resetVisible();
                  }}
                  className="text-sm font-bold text-green-600 hover:text-green-800 underline"
                >
                  Clear all filters
                </button>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* Category overview*/}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <Reveal>
              <SectionPill text="Browse By Topic" />
            </Reveal>
            <Reveal delay={80}>
              <h2 className="text-3xl font-extrabold text-[#073319]">
                Explore Categories
              </h2>
            </Reveal>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CATEGORIES.filter((c) => c.value !== "all").map(
              ({ label, value, icon }, i) => {
                const count = RESOURCES.filter(
                  (r) => r.category === value,
                ).length;
                return (
                  <Reveal key={value} delay={i * 50}>
                    <button
                      onClick={() => {
                        setActiveCategory(value);
                        document
                          .getElementById("library")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="group w-full bg-green-50 border border-green-100 rounded-2xl p-5 text-center hover:bg-green-600 hover:border-transparent hover:shadow-lg transition-all duration-300"
                    >
                      <div className="text-2xl text-green-600 group-hover:text-white transition-colors mb-2 flex justify-center">
                        {icon}
                      </div>
                      <p className="text-xs font-bold text-[#073319] group-hover:text-white transition-colors mb-1">
                        {label}
                      </p>
                      <p className="text-[11px] text-gray-400 group-hover:text-green-200 transition-colors">
                        {count} article{count !== 1 ? "s" : ""}
                      </p>
                    </button>
                  </Reveal>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* News later*/}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <Reveal>
            <div
              className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#052e16] via-[#14532d] to-[#16a34a] text-white text-center py-14 px-6 md:px-12 shadow-2xl"
              style={{ boxShadow: "0 25px 60px rgba(22,163,74,0.28)" }}
            >
              <div
                className="absolute inset-0 opacity-5 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)`,
                  backgroundSize: "22px 22px",
                }}
              />
              <div className="relative">
                <HiSparkles className="text-green-300 text-3xl mx-auto mb-3" />
                <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
                  Stay Updated with New Resources
                </h2>
                <p className="text-green-100/70 text-sm mb-7 max-w-md mx-auto leading-relaxed">
                  New articles, guides, and research deep dives published
                  monthly. Register free to save favourites and get notified.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email…"
                    className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/25 text-white placeholder-white/40 focus:outline-none focus:border-white/60 text-sm backdrop-blur-sm"
                  />
                  <button className="bg-white text-green-700 font-bold px-6 py-3 rounded-xl hover:bg-green-50 transition-colors text-sm shadow whitespace-nowrap">
                    Notify Me
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <Reveal>
            <div className="grid md:grid-cols-2 gap-5">
              <Link
                to="/services"
                className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-green-600 to-emerald-700 text-white p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="absolute -right-6 -bottom-6 text-8xl opacity-10">
                  🌾
                </div>
                <FaSeedling className="text-2xl text-green-200 mb-3" />
                <h3 className="text-lg font-extrabold mb-2">
                  Try Our AI Services
                </h3>
                <p className="text-white/70 text-sm mb-4">
                  Put your learnings to work — get a crop recommendation, detect
                  disease, or optimise fertilizer in seconds.
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-white/20 px-3 py-1.5 rounded-full group-hover:bg-white/30 transition-colors">
                  Go to Services <FaArrowRight className="text-[10px]" />
                </span>
              </Link>
              <Link
                to="/contact"
                className="group relative rounded-2xl overflow-hidden bg-white border border-green-200 text-[#073319] p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="absolute -right-6 -bottom-6 text-8xl opacity-5">
                  💬
                </div>
                <FaFlask className="text-2xl text-green-500 mb-3" />
                <h3 className="text-lg font-extrabold mb-2">Suggest a Topic</h3>
                <p className="text-gray-500 text-sm mb-4">
                  Don't see an article you need? Contact our team we publish new
                  content based on farmer and researcher requests.
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full group-hover:bg-green-100 transition-colors">
                  Contact Us <FaArrowRight className="text-[10px]" />
                </span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

export default ResourcesPage;
