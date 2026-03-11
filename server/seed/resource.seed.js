import { connectDB } from "../db/connectDB.js";
import Resource from "../models/resource.model.js";

// Seed data for the Resources collection
const resources = [
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
    content:
      "Soil NPK values are the backbone of any fertilizer decision. Nitrogen (N) drives vegetative growth and leaf development. Phosphorus (P) supports root formation and flowering. Potassium (K) improves drought resistance and fruit quality. A basic soil test reveals deficiencies before they affect your crop. Optimal NPK ratios vary by crop — rice prefers N-heavy soils while legumes can fix their own nitrogen. Understanding these ratios allows you to apply fertilizer with precision, reducing cost and environmental impact.",
    author: "Dr. Chaminda Jayawardena",
    publishedAt: new Date("2024-03-10"),
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
    content:
      "Random Forest is an ensemble learning method that builds hundreds of decision trees during training and outputs the mode of their predictions. Each tree is trained on a random bootstrap sample of the dataset and uses a random subset of features at each split — this controlled randomness prevents overfitting. Our model ingests N, P, K, pH, temperature, humidity, and rainfall values. Feature importance analysis shows that pH and rainfall are the strongest predictors across most crop classes. The 99.32% test accuracy was validated on a held-out set of 440 samples drawn from diverse Sri Lankan agro-climatic zones.",
    author: "Kasun Perera",
    publishedAt: new Date("2024-04-02"),
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
    tags: ["rice", "disease", "leaf blight", "blast", "diagnosis"],
    imageUrl:
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80",
    excerpt:
      "Rice blast and bacterial leaf blight are the two most destructive rice diseases in Sri Lanka. Learn to spot them early and understand how our CNN detects them with 99.45% accuracy.",
    content:
      "Rice blast (Magnaporthe oryzae) presents as diamond-shaped lesions with grey centres and brown borders on leaves, nodes, and panicles. Bacterial Leaf Blight (Xanthomonas oryzae) starts as water-soaked margins that turn yellow then white. Early detection is critical — yield loss can exceed 70% in severe cases. Our CNN model was trained on 87,000 annotated leaf images. The model performs best in natural daylight; avoid photographing in shade. For accurate diagnosis, photograph the centre of the affected leaf at 15–20 cm distance.",
    author: "Nimali Fernando",
    publishedAt: new Date("2024-04-18"),
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
    tags: ["XGBoost", "gradient boosting", "fertilizer", "ML"],
    imageUrl:
      "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&q=80",
    excerpt:
      "XGBoost's gradient boosting approach makes it ideal for structured tabular data. We explain how our fertilizer model achieves 80% accuracy across 7 fertilizer classes.",
    content:
      "XGBoost (Extreme Gradient Boosting) builds trees sequentially — each new tree corrects the residual errors of the previous ensemble. Our fertilizer dataset includes soil N, P, K, pH, moisture, crop type, and temperature. Class imbalance was addressed using SMOTE oversampling. The final model uses 300 estimators with a learning rate of 0.05 and max depth of 6. SHAP value analysis revealed that soil moisture and current N level are the two strongest drivers of fertilizer class. The 79.01% cross-validation score was computed using stratified 5-fold CV to account for class distribution.",
    author: "Kasun Perera",
    publishedAt: new Date("2024-05-05"),
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
    tags: ["soil pH", "acidity", "crop selection", "liming"],
    imageUrl:
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80",
    excerpt:
      "Soil pH determines nutrient availability, microbial activity, and ultimately which crops will thrive. Most Sri Lankan crops prefer a pH of 5.5–7.0. Here's why.",
    content:
      "pH is measured on a 0–14 scale; below 7 is acidic, above 7 is alkaline. Most nutrients are maximally available between pH 6.0–7.0. In acidic soils (pH < 5.5), aluminium and manganese become toxic, while phosphorus locks up as iron and aluminium phosphates. Tea thrives at pH 4.5–5.5, but rice prefers 5.5–7.0. Liming with agricultural lime (calcium carbonate) raises pH over 2–3 growing seasons. Sulphur additions lower pH for crops like blueberries. Testing soil pH before planting is the single highest-ROI agronomic action a farmer can take.",
    author: "Dr. Chaminda Jayawardena",
    publishedAt: new Date("2024-05-20"),
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
    tags: ["OpenWeather", "API", "weather", "ML integration"],
    imageUrl:
      "https://images.unsplash.com/photo-1504608524841-42584120d693?w=800&q=80",
    excerpt:
      "Static ML models trained on historical data can drift when weather patterns change. Integrating the OpenWeather API allows our recommendations to adapt in real time.",
    content:
      "Our platform fetches temperature, humidity, and precipitation forecasts from the OpenWeather Current Weather API and feeds them directly into the crop recommendation and fertilizer suggestion models. This means a farmer in Kurunegala during an unexpected dry spell will receive drought-tolerant crop recommendations even if their soil conditions would normally support rice. We cache weather data for 30 minutes to respect API rate limits. GPS-based location detection ensures hyperlocal accuracy. Plans are underway to incorporate seasonal climate outlooks from the Department of Meteorology Sri Lanka.",
    author: "Lahiru Silva",
    publishedAt: new Date("2024-06-08"),
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
    tags: ["CNN", "deep learning", "plant disease", "architecture"],
    imageUrl:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    excerpt:
      "A technical walkthrough of the convolutional neural network that classifies 38 crop disease classes — including our data augmentation strategy, transfer learning approach, and training pipeline.",
    content:
      "We fine-tuned a MobileNetV2 backbone pre-trained on ImageNet, replacing the top layers with a Global Average Pooling layer, a Dropout(0.4) layer, and a Dense(38, softmax) output. Input images are resized to 224×224 pixels. Data augmentation (random horizontal flip, rotation ±20°, zoom 0–15%, brightness shift) was applied to combat the dataset imbalance across 38 disease classes. The model was trained for 25 epochs using Adam (lr=0.0001) with a ReduceLROnPlateau callback. Training accuracy reached 99.82% and validation accuracy 99.45% on the PlantVillage dataset subset filtered for Sri Lankan crops.",
    author: "Nimali Fernando",
    publishedAt: new Date("2024-06-25"),
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
    tags: ["organic", "farming", "compost", "sustainable"],
    imageUrl:
      "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=800&q=80",
    excerpt:
      "Organic certification takes 3 years, but you can start reducing chemical inputs today. This guide covers compost-making, green manuring, and biological pest control suited to Sri Lanka.",
    content:
      "The transition to organic farming requires replacing synthetic inputs with biological alternatives. Compost made from paddy straw, kitchen waste, and cattle manure restores soil organic matter and microbial diversity. Green manuring with Gliricidia or Tithonia adds nitrogen while improving soil structure. Neem oil (3 ml/L water) is effective against aphids, whiteflies, and mites. IPM (Integrated Pest Management) reduces chemical use by combining biological, cultural, and minimal chemical interventions. Organic certification in Sri Lanka is governed by the Department of Agriculture and typically takes 3 conversion years.",
    author: "Dr. Chaminda Jayawardena",
    publishedAt: new Date("2024-07-14"),
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
    tags: ["irrigation", "water", "drip", "AWD", "rice"],
    imageUrl:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80",
    excerpt:
      "Alternate Wetting and Drying (AWD) for rice can cut water use by 30% with no yield penalty. This guide explains AWD, drip irrigation, and how our weather insights support smarter irrigation scheduling.",
    content:
      "Rice cultivation accounts for approximately 80% of agricultural water use in Sri Lanka. Alternate Wetting and Drying (AWD) involves allowing the field to dry to 15 cm below surface before re-flooding. This reduces methane emissions, decreases pumping costs, and does not reduce yield when implemented correctly. A field water tube (perforated PVC pipe inserted 30 cm into the soil) allows farmers to monitor water depth easily. Drip irrigation for upland crops like tomatoes and chillies saves 40–60% water compared to furrow irrigation. Smart Agri's weather integration helps schedule irrigation by predicting upcoming rainfall.",
    author: "Lahiru Silva",
    publishedAt: new Date("2024-08-01"),
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
    tags: ["post-harvest", "storage", "grain", "loss reduction"],
    imageUrl:
      "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=800&q=80",
    excerpt:
      "Sri Lanka loses an estimated 30% of its rice harvest post-harvest. Proper drying, hermetic storage, and timely threshing can dramatically cut these losses.",
    content:
      "Post-harvest losses occur at every stage — field drying, threshing, transport, milling, and storage. Moisture content at harvest should be 20–22% for paddy; milling after drying to 14% preserves quality. Hermetic storage bags (e.g., GrainPro, PICS bags) create a CO2-enriched, oxygen-depleted environment that kills weevils without chemicals. Metal silos made from galvanised steel eliminate rodent and moisture ingress. Threshing within 24 hours of cutting reduces grain shattering. Consistent grain testing for moisture content using a digital moisture meter is the most important post-harvest practice.",
    author: "Dr. Chaminda Jayawardena",
    publishedAt: new Date("2024-08-22"),
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
    tags: ["crop rotation", "soil fertility", "legumes", "weed control"],
    imageUrl:
      "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800&q=80",
    excerpt:
      "A well-designed crop rotation reduces disease pressure, breaks pest cycles, and can add up to 40 kg N/ha through legume incorporation — all without synthetic inputs.",
    content:
      "Crop rotation is the practice of growing different crops in sequential seasons on the same land. A simple rice–cowpea rotation allows the legume to fix atmospheric nitrogen (40–60 kg N/ha), which becomes available to the following rice crop, reducing fertilizer needs significantly. Rotation also breaks the life cycles of soil-borne pathogens specific to a single crop family. Including a deep-rooted crop like sorghum helps break hardpan layers and brings subsoil nutrients to the surface. Smart Agri's crop recommendation tool can suggest rotation sequences based on your soil history and seasonal climate data.",
    author: "Dr. Chaminda Jayawardena",
    publishedAt: new Date("2024-09-10"),
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
    tags: ["climate change", "resilience", "adaptation", "Sri Lanka"],
    imageUrl:
      "https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=800&q=80",
    excerpt:
      "Rising temperatures, erratic monsoons, and sea-level intrusion are already affecting Sri Lankan farms. This deep dive covers adaptation strategies and climate-resilient crop varieties.",
    content:
      "Sri Lanka's average temperature has risen by 0.9°C since 1960, and climate models project a further 1–2°C increase by 2050. Rainfall patterns are shifting — the Maha season is becoming shorter and more intense while Yala rains are increasingly unreliable. Coastal agricultural lands in the Northern and Eastern provinces face saltwater intrusion. Climate-resilient strategies include shifting to drought-tolerant varieties like BG 379-2 rice, adopting agroforestry to moderate microclimate temperatures, and using AI-powered tools like Smart Agri Prediction to adjust crop choices in real time as weather patterns evolve.",
    author: "Nimali Fernando",
    publishedAt: new Date("2024-09-28"),
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
    tags: ["tutorial", "how-to", "crop recommendation", "platform"],
    imageUrl:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
    excerpt:
      "A beginner-friendly walkthrough of the Smart Agri crop recommendation tool — from entering your soil values to interpreting the top-6 crop results.",
    content:
      "Step 1: Register for a free account at saps.com. Step 2: Navigate to Services → Crop Recommendation. Step 3: Enter your soil's Nitrogen (kg/ha), Phosphorus (kg/ha), Potassium (kg/ha), and pH values — these come from a basic soil test kit available at any agri-supply store. Step 4: Enter temperature and humidity or allow the platform to auto-fill from your GPS location via OpenWeather. Step 5: Enter average annual rainfall for your zone. Step 6: Click 'Get Recommendation'. The model returns a ranked list of 6 crops with confidence scores. Click any crop for detailed cultivation tips.",
    author: "Sachini Jayawardena",
    publishedAt: new Date("2024-10-15"),
    featured: false,
    views: 4700,
  },
];

// Function to seed the database with the above resources
const seedResources = async () => {
  try {
    // Connect to the database
    await connectDB();

    // Clear existing resources before seeding
    await Resource.deleteMany();

    // Insert seed resources into the database
    await Resource.insertMany(resources);

    console.log("Resources seeded successfully!");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// Run the seed function
seedResources();
