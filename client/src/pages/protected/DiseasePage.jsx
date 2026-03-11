import { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FaLeaf,
  FaUpload,
  FaImage,
  FaTimes,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTrophy,
  FaChevronDown,
  FaChevronUp,
  FaCamera,
  FaInfoCircle,
  FaShieldAlt,
} from "react-icons/fa";
import { HiSparkles, HiArrowRight } from "react-icons/hi2";
import { MdBugReport, MdHealthAndSafety, MdWarning } from "react-icons/md";

/* API */
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = {
  // POST /api/disease/predict — field name: "file"
  predict: (file) => {
    const fd = new FormData();
    fd.append("file", file);
    return fetch(`${BASE_URL}/disease/predict`, {
      method: "POST",
      credentials: "include", // cookie JWT — NO Content-Type header (browser sets multipart boundary)
      body: fd,
    }).then(async (r) => {
      const data = await r.json();
      if (!r.ok) throw new Error(data.message || "Prediction failed");
      return data;
    });
  },
};

/* Disease dataset */
const DISEASE_DATA = {
  /* Apple */
  Apple___Apple_scab: {
    display: "Apple Scab",
    plant: "Apple",
    emoji: "🍎",
    severity: "High",
    color: "from-red-500 to-rose-700",
    tag: "bg-red-100 text-red-700 border-red-200",
    description:
      "Caused by the fungus Venturia inaequalis. Produces olive-green to brown scab-like lesions on leaves and fruit, leading to premature defoliation and fruit deformity.",
    symptoms: [
      "Olive-green or brown velvety spots on leaves",
      "Scab-like lesions on fruit surface",
      "Premature leaf drop",
      "Cracked, deformed fruit",
    ],
    treatment: [
      "Apply fungicides (captan, myclobutanil) at bud break",
      "Remove and destroy fallen leaves",
      "Prune to improve air circulation",
      "Choose resistant apple varieties",
    ],
    prevention: [
      "Plant resistant cultivars",
      "Apply dormant copper sprays",
      "Space trees for air circulation",
      "Avoid overhead irrigation",
    ],
  },
  Apple___Black_rot: {
    display: "Apple Black Rot",
    plant: "Apple",
    emoji: "🍎",
    severity: "High",
    color: "from-gray-700 to-slate-900",
    tag: "bg-gray-100 text-gray-700 border-gray-200",
    description:
      "Caused by Botryosphaeria obtusa. Causes dark cankers on branches, leaf spots with purple margins, and fruit rot turning entirely black.",
    symptoms: [
      "Purple spots with brown centers on leaves",
      "Black, shriveled fruit (mummified)",
      "Reddish-brown cankers on bark",
      "Frog-eye leaf spot pattern",
    ],
    treatment: [
      "Prune out infected branches 15cm below cankers",
      "Apply fungicide sprays during bloom",
      "Remove mummified fruit",
      "Improve orchard sanitation",
    ],
    prevention: [
      "Remove dead wood promptly",
      "Maintain tree vigour through fertilization",
      "Apply protective fungicides",
      "Control insect wounds",
    ],
  },
  Apple___Cedar_apple_rust: {
    display: "Cedar Apple Rust",
    plant: "Apple",
    emoji: "🍎",
    severity: "Medium",
    color: "from-orange-500 to-amber-700",
    tag: "bg-orange-100 text-orange-700 border-orange-200",
    description:
      "A fungal disease requiring two hosts (apple and eastern red cedar). Produces bright orange-yellow spots on apple leaves and fruit.",
    symptoms: [
      "Bright yellow-orange spots on upper leaf surface",
      "Tube-like structures on leaf undersides",
      "Orange lesions on fruit",
      "Premature defoliation in severe cases",
    ],
    treatment: [
      "Apply fungicides at pink bud stage through petal fall",
      "Remove nearby juniper/cedar hosts if possible",
      "Use resistant apple varieties",
      "Myclobutanil or mancozeb effective",
    ],
    prevention: [
      "Plant resistant cultivars",
      "Remove nearby cedars and junipers",
      "Apply preventive fungicides",
      "Monitor in spring",
    ],
  },
  Apple___healthy: {
    display: "Healthy Apple",
    plant: "Apple",
    emoji: "🍎",
    severity: "None",
    color: "from-green-500 to-emerald-700",
    tag: "bg-green-100 text-green-700 border-green-200",
    description:
      "The apple leaf shows no signs of disease. Continue standard orchard management practices.",
    symptoms: [
      "No visible disease symptoms",
      "Normal green leaf colour",
      "Healthy leaf structure",
    ],
    treatment: ["Continue regular maintenance", "Monitor periodically"],
    prevention: [
      "Regular scouting",
      "Preventive spray programme",
      "Balanced fertilisation",
    ],
  },

  /* Blueberry */
  Blueberry___healthy: {
    display: "Healthy Blueberry",
    plant: "Blueberry",
    emoji: "🫐",
    severity: "None",
    color: "from-blue-500 to-indigo-700",
    tag: "bg-blue-100 text-blue-700 border-blue-200",
    description:
      "Blueberry plant appears healthy. Maintain acidic soil conditions (pH 4.5–5.5) for optimal growth.",
    symptoms: ["No disease symptoms visible"],
    treatment: ["Maintain acidic soil pH", "Adequate mulching"],
    prevention: ["Test soil pH annually", "Apply sulfur if pH rises"],
  },

  /* Cherry */
  "Cherry_(including_sour)___Powdery_mildew": {
    display: "Cherry Powdery Mildew",
    plant: "Cherry",
    emoji: "🍒",
    severity: "Medium",
    color: "from-pink-500 to-rose-600",
    tag: "bg-pink-100 text-pink-700 border-pink-200",
    description:
      "Caused by Podosphaera clandestina. White powdery coating on young leaves and shoots — most severe during warm, dry weather with cool nights.",
    symptoms: [
      "White powdery coating on young leaves",
      "Leaf curling and distortion",
      "Stunted shoot growth",
      "Premature defoliation",
    ],
    treatment: [
      "Apply sulphur or potassium bicarbonate sprays",
      "Neem oil effective at early stages",
      "Systemic fungicides (myclobutanil) for severe cases",
      "Remove and destroy infected tissue",
    ],
    prevention: [
      "Choose resistant varieties",
      "Improve air circulation through pruning",
      "Avoid excessive nitrogen",
      "Avoid wetting foliage",
    ],
  },
  "Cherry_(including_sour)___healthy": {
    display: "Healthy Cherry",
    plant: "Cherry",
    emoji: "🍒",
    severity: "None",
    color: "from-red-400 to-rose-600",
    tag: "bg-red-100 text-red-700 border-red-200",
    description: "Cherry plant appears healthy with no signs of disease.",
    symptoms: ["No visible symptoms"],
    treatment: ["Standard maintenance practices"],
    prevention: ["Regular monitoring", "Balanced nutrition"],
  },

  /* Corn */
  "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot": {
    display: "Grey Leaf Spot",
    plant: "Corn (Maize)",
    emoji: "🌽",
    severity: "High",
    color: "from-gray-500 to-zinc-700",
    tag: "bg-gray-100 text-gray-600 border-gray-200",
    description:
      "Caused by Cercospora zeae-maydis. One of the most yield-limiting corn diseases — favoured by warm, humid conditions and reduces photosynthesis.",
    symptoms: [
      "Rectangular grey-tan lesions parallel to leaf veins",
      "Lesions bounded by leaf veins",
      "Premature blighting and drying",
      "Lower canopy affected first",
    ],
    treatment: [
      "Apply foliar fungicides (strobilurins, triazoles)",
      "Time application at tasselling",
      "Irrigate in morning to reduce leaf wetness",
    ],
    prevention: [
      "Plant resistant hybrids",
      "Rotate crops away from corn",
      "Till to reduce residue",
      "Avoid continuous corn cropping",
    ],
  },
  "Corn_(maize)___Common_rust_": {
    display: "Common Rust",
    plant: "Corn (Maize)",
    emoji: "🌽",
    severity: "Medium",
    color: "from-orange-600 to-red-700",
    tag: "bg-orange-100 text-orange-700 border-orange-200",
    description:
      "Caused by Puccinia sorghi. Produces cinnamon-brown pustules on both leaf surfaces — most damaging during cool, moist conditions.",
    symptoms: [
      "Cinnamon-brown oval pustules on both leaf surfaces",
      "Pustules rupture releasing powdery rust spores",
      "Yellow halos around pustules",
      "Severe infection causes premature dying",
    ],
    treatment: [
      "Apply fungicides (propiconazole, azoxystrobin) early",
      "Most effective before pustule rupture",
      "Scout fields regularly from V5",
    ],
    prevention: [
      "Plant resistant hybrids (most effective control)",
      "Early planting to escape peak rust season",
      "Monitor closely in cool humid conditions",
    ],
  },
  "Corn_(maize)___Northern_Leaf_Blight": {
    display: "Northern Leaf Blight",
    plant: "Corn (Maize)",
    emoji: "🌽",
    severity: "High",
    color: "from-yellow-600 to-amber-800",
    tag: "bg-yellow-100 text-yellow-700 border-yellow-200",
    description:
      "Caused by Exserohilum turcicum. Large grey-green to tan cigar-shaped lesions that can cause significant yield loss if upper leaves affected.",
    symptoms: [
      "Large cigar-shaped grey-green lesions (2.5–15 cm)",
      "Lesions turn tan/brown with wavy margins",
      "Dark green sooty appearance when sporulating",
      "Premature plant death in severe cases",
    ],
    treatment: [
      "Fungicide application at early tassel stage",
      "Strobilurin + triazole mixtures most effective",
      "Timely application critical",
    ],
    prevention: [
      "Plant resistant hybrids",
      "Crop rotation",
      "Deep ploughing to bury infected residue",
      "Avoid excess nitrogen",
    ],
  },
  "Corn_(maize)___healthy": {
    display: "Healthy Corn",
    plant: "Corn (Maize)",
    emoji: "🌽",
    severity: "None",
    color: "from-yellow-500 to-green-600",
    tag: "bg-yellow-100 text-yellow-700 border-yellow-200",
    description: "Corn plant is healthy with no disease present.",
    symptoms: ["No visible symptoms"],
    treatment: ["Continue standard agronomic practices"],
    prevention: ["Regular scouting", "Balanced NPK nutrition"],
  },

  /* Grape */
  Grape___Black_rot: {
    display: "Grape Black Rot",
    plant: "Grape",
    emoji: "🍇",
    severity: "High",
    color: "from-purple-700 to-violet-900",
    tag: "bg-purple-100 text-purple-800 border-purple-200",
    description:
      "Caused by Guignardia bidwellii. Can destroy entire crops — infected berries turn black and shrivel into hard mummies.",
    symptoms: [
      "Tan circular leaf lesions with dark borders",
      "Small black pycnidia inside lesions",
      "Berries turning brown then black and shriveling",
      "Reddish-brown stem lesions",
    ],
    treatment: [
      "Apply fungicides from bud break through veraison",
      "Captan, mancozeb, or myclobutanil effective",
      "Remove mummified berries",
      "Prune and destroy infected wood",
    ],
    prevention: [
      "Remove mummies before bud break",
      "Open vine canopy for air flow",
      "Apply dormant copper spray",
      "Scout weekly during season",
    ],
  },
  "Grape___Esca_(Black_Measles)": {
    display: "Esca (Black Measles)",
    plant: "Grape",
    emoji: "🍇",
    severity: "High",
    color: "from-red-700 to-rose-900",
    tag: "bg-red-100 text-red-800 border-red-200",
    description:
      "A complex fungal disease caused by wood-rotting fungi. One of the most destructive grapevine trunk diseases worldwide — no cure once established.",
    symptoms: [
      "Tiger-stripe pattern on leaves (yellow margins, green veins)",
      "Small dark spots on berries (measles symptom)",
      "Sudden vine collapse (apoplexy)",
      "Internal wood discolouration",
    ],
    treatment: [
      "Remove and destroy severely infected vines",
      "Paint pruning wounds with protective paste",
      "No curative chemical treatment available",
      "Trunk renewal surgery on valuable vines",
    ],
    prevention: [
      "Wound protection after pruning with fungicide paste",
      "Prune during dry periods",
      "Use clean certified planting material",
      "Minimize large pruning wounds",
    ],
  },
  "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)": {
    display: "Leaf Blight",
    plant: "Grape",
    emoji: "🍇",
    severity: "Medium",
    color: "from-amber-600 to-orange-800",
    tag: "bg-amber-100 text-amber-700 border-amber-200",
    description:
      "Caused by Isariopsis clavispora. Produces dark angular leaf spots leading to defoliation and reduced fruit quality.",
    symptoms: [
      "Dark brown angular spots on leaf surface",
      "Spots merge forming large necrotic areas",
      "Premature defoliation",
      "Reduced fruit quality and maturity",
    ],
    treatment: [
      "Apply copper-based fungicides or mancozeb",
      "Remove infected leaves",
      "Improve canopy ventilation",
    ],
    prevention: [
      "Open trellis system for air circulation",
      "Avoid overhead irrigation",
      "Apply preventive copper sprays",
    ],
  },
  Grape___healthy: {
    display: "Healthy Grape",
    plant: "Grape",
    emoji: "🍇",
    severity: "None",
    color: "from-purple-400 to-violet-600",
    tag: "bg-purple-100 text-purple-700 border-purple-200",
    description: "Grapevine is healthy with no disease symptoms detected.",
    symptoms: ["No symptoms visible"],
    treatment: ["Routine canopy management"],
    prevention: ["Regular scouting", "Dormant spray programme"],
  },

  /* Orange */
  "Orange___Haunglongbing_(Citrus_greening)": {
    display: "Citrus Greening (HLB)",
    plant: "Orange",
    emoji: "🍊",
    severity: "Critical",
    color: "from-orange-600 to-red-700",
    tag: "bg-orange-100 text-orange-800 border-orange-200",
    description:
      "Huanglongbing — the most destructive citrus disease globally with no cure. Caused by Candidatus Liberibacter asiaticus, spread by the Asian citrus psyllid.",
    symptoms: [
      "Asymmetric yellow blotching of leaves (blotchy mottle)",
      "Small, misshapen fruit that remains green",
      "Bitter, unusable fruit",
      "Premature fruit drop",
      "Tree decline and death",
    ],
    treatment: [
      "NO CURE — remove and destroy infected trees immediately",
      "Control psyllid vectors with insecticides",
      "Replant with certified disease-free material",
      "Thermotherapy may slow progression",
    ],
    prevention: [
      "Use certified disease-free nursery stock",
      "Control Asian citrus psyllid populations",
      "Inspect new plants before planting",
      "Quarantine new introductions",
    ],
  },

  /* Peach */
  Peach___Bacterial_spot: {
    display: "Peach Bacterial Spot",
    plant: "Peach",
    emoji: "🍑",
    severity: "High",
    color: "from-yellow-500 to-orange-600",
    tag: "bg-yellow-100 text-yellow-700 border-yellow-200",
    description:
      "Caused by Xanthomonas arboricola pv. pruni. Affects leaves, twigs, and fruit — one of the most serious diseases of stone fruits in humid climates.",
    symptoms: [
      "Water-soaked angular spots on leaves turning purple-brown",
      "Shot-hole appearance as lesions fall out",
      "Sunken, dark spots on fruit surface",
      "Defoliation in severe cases",
    ],
    treatment: [
      "Apply copper bactericides preventively",
      "Oxytetracycline sprays at leaf emergence",
      "Prune infected twigs during dry weather",
      "No highly effective curative treatment",
    ],
    prevention: [
      "Plant resistant varieties",
      "Copper sprays from dormancy through early season",
      "Avoid low-lying, frost-prone sites",
      "Maintain tree vigour",
    ],
  },
  Peach___healthy: {
    display: "Healthy Peach",
    plant: "Peach",
    emoji: "🍑",
    severity: "None",
    color: "from-orange-300 to-peach-500",
    tag: "bg-orange-100 text-orange-600 border-orange-200",
    description: "Peach tree appears healthy with no visible disease symptoms.",
    symptoms: ["No symptoms visible"],
    treatment: ["Continue standard stone fruit management"],
    prevention: ["Dormant copper sprays", "Thinning for air circulation"],
  },

  /* Pepper */
  "Pepper,_bell___Bacterial_spot": {
    display: "Bell Pepper Bacterial Spot",
    plant: "Bell Pepper",
    emoji: "🫑",
    severity: "High",
    color: "from-red-500 to-orange-600",
    tag: "bg-red-100 text-red-700 border-red-200",
    description:
      "Caused by Xanthomonas euvesicatoria. Causes significant yield loss — spreads rapidly in warm, wet conditions through water splash.",
    symptoms: [
      "Water-soaked spots becoming brown with yellow halos",
      "Irregular dark brown lesions on leaves",
      "Raised, scab-like spots on fruit",
      "Severe defoliation in wet seasons",
    ],
    treatment: [
      "Apply copper-based bactericides preventively",
      "Acibenzolar-S-methyl (resistance inducer)",
      "Avoid overhead irrigation",
      "Remove and destroy infected plant material",
    ],
    prevention: [
      "Use certified disease-free seed",
      "Seed treatment with hot water (50°C/25 min)",
      "Crop rotation (2–3 years)",
      "Resistant varieties where available",
    ],
  },
  "Pepper,_bell___healthy": {
    display: "Healthy Bell Pepper",
    plant: "Bell Pepper",
    emoji: "🫑",
    severity: "None",
    color: "from-green-400 to-emerald-600",
    tag: "bg-green-100 text-green-700 border-green-200",
    description: "Bell pepper plant is healthy and disease-free.",
    symptoms: ["No visible symptoms"],
    treatment: ["Standard vegetable crop management"],
    prevention: ["Crop rotation", "Disease-free seed"],
  },

  /* Potato */
  Potato___Early_blight: {
    display: "Potato Early Blight",
    plant: "Potato",
    emoji: "🥔",
    severity: "High",
    color: "from-amber-600 to-brown-700",
    tag: "bg-amber-100 text-amber-700 border-amber-200",
    description:
      "Caused by Alternaria solani. Produces characteristic target-board lesions — most common potato foliar disease causing significant defoliation and tuber blemishes.",
    symptoms: [
      "Dark brown target-board rings on older leaves",
      "Lesions with yellow chlorotic halos",
      "Premature defoliation starting from lower leaves",
      "Dark sunken lesions on tubers",
    ],
    treatment: [
      "Apply fungicides (chlorothalonil, mancozeb) at first symptom",
      "Azoxystrobin or boscalid for resistant strains",
      "Ensure adequate potassium nutrition",
      "Irrigation management to reduce leaf wetness",
    ],
    prevention: [
      "Use certified disease-free seed tubers",
      "Crop rotation (3+ years)",
      "Balanced NPK — avoid nitrogen deficiency",
      "Plant resistant varieties",
    ],
  },
  Potato___Late_blight: {
    display: "Potato Late Blight",
    plant: "Potato",
    emoji: "🥔",
    severity: "Critical",
    color: "from-gray-800 to-slate-900",
    tag: "bg-gray-100 text-gray-800 border-gray-300",
    description:
      "Caused by Phytophthora infestans — the pathogen that triggered the Irish Potato Famine. Can destroy entire crops within days under favourable conditions.",
    symptoms: [
      "Pale green to brown water-soaked lesions on leaves",
      "White cottony mold on leaf undersides",
      "Firm reddish-brown rot spreading through tubers",
      "Rapidly expanding lesions — field can collapse within days",
    ],
    treatment: [
      "Systemic fungicides (metalaxyl, cymoxanil) at FIRST sign",
      "Contact fungicides (mancozeb) preventively",
      "Remove and bury affected haulms immediately",
      "Harvest early if disease severe",
    ],
    prevention: [
      "Apply preventive fungicide programme",
      "Monitor Blight Watch forecasts",
      "Remove cull piles and volunteer plants",
      "Plant certified blight-resistant varieties",
    ],
  },
  Potato___healthy: {
    display: "Healthy Potato",
    plant: "Potato",
    emoji: "🥔",
    severity: "None",
    color: "from-yellow-400 to-amber-600",
    tag: "bg-yellow-100 text-yellow-700 border-yellow-200",
    description: "Potato plant is healthy with no disease symptoms detected.",
    symptoms: ["No visible symptoms"],
    treatment: ["Continue standard potato agronomy"],
    prevention: ["Certified seed tubers", "Preventive fungicide programme"],
  },

  /* Raspberry */
  Raspberry___healthy: {
    display: "Healthy Raspberry",
    plant: "Raspberry",
    emoji: "🫐",
    severity: "None",
    color: "from-red-400 to-pink-600",
    tag: "bg-red-100 text-red-600 border-red-200",
    description: "Raspberry plant is healthy. Maintain good cane management.",
    symptoms: ["No symptoms visible"],
    treatment: ["Annual cane removal post-harvest"],
    prevention: ["Open cane training", "Disease-free planting stock"],
  },

  /* Soybean */
  Soybean___healthy: {
    display: "Healthy Soybean",
    plant: "Soybean",
    emoji: "🫘",
    severity: "None",
    color: "from-green-500 to-teal-600",
    tag: "bg-green-100 text-green-700 border-green-200",
    description: "Soybean crop appears healthy with no disease present.",
    symptoms: ["No visible symptoms"],
    treatment: ["Standard legume crop management"],
    prevention: ["Crop rotation", "Rhizobium inoculation"],
  },

  /* Squash */
  Squash___Powdery_mildew: {
    display: "Squash Powdery Mildew",
    plant: "Squash",
    emoji: "🎃",
    severity: "Medium",
    color: "from-gray-400 to-zinc-600",
    tag: "bg-gray-100 text-gray-600 border-gray-200",
    description:
      "Caused by Podosphaera xanthii and Erysiphe cichoracearum. Produces distinctive white powdery coating — thrives in warm, dry days with humid nights.",
    symptoms: [
      "White powdery spots on upper leaf surface",
      "Yellowing of affected leaves",
      "Distorted leaf growth",
      "Premature senescence",
    ],
    treatment: [
      "Apply sulphur, potassium bicarbonate, or neem oil",
      "Systemic fungicides for severe cases",
      "Remove worst-affected leaves",
      "Improve air circulation",
    ],
    prevention: [
      "Space plants adequately",
      "Avoid overhead irrigation",
      "Plant resistant varieties",
      "Morning watering only",
    ],
  },

  /* Strawberry */
  Strawberry___Leaf_scorch: {
    display: "Strawberry Leaf Scorch",
    plant: "Strawberry",
    emoji: "🍓",
    severity: "Medium",
    color: "from-red-500 to-rose-700",
    tag: "bg-red-100 text-red-700 border-red-200",
    description:
      "Caused by Diplocarpon earlianum. Produces dark purple spots that coalesce, giving a scorched appearance — reduces yield through premature defoliation.",
    symptoms: [
      "Numerous small purple-red irregular spots on upper leaf",
      "Spots coalesce giving scorched look",
      "Leaf margins turn brown and dry",
      "Defoliation in severe cases",
    ],
    treatment: [
      "Remove infected leaves and runners",
      "Apply fungicides (captan, myclobutanil)",
      "Renovate bed after harvest — mow, thin, fertilise",
      "Irrigate by drip rather than overhead",
    ],
    prevention: [
      "Plant resistant varieties",
      "Avoid dense planting",
      "Drip irrigation",
      "Annual bed renovation",
    ],
  },
  Strawberry___healthy: {
    display: "Healthy Strawberry",
    plant: "Strawberry",
    emoji: "🍓",
    severity: "None",
    color: "from-green-400 to-emerald-600",
    tag: "bg-green-100 text-green-700 border-green-200",
    description: "Strawberry plant is healthy and disease-free.",
    symptoms: ["No symptoms visible"],
    treatment: ["Standard strawberry bed management"],
    prevention: ["Drip irrigation", "Good drainage"],
  },

  /* Tomato */
  Tomato___Bacterial_spot: {
    display: "Tomato Bacterial Spot",
    plant: "Tomato",
    emoji: "🍅",
    severity: "High",
    color: "from-red-600 to-rose-800",
    tag: "bg-red-100 text-red-700 border-red-200",
    description:
      "Caused by Xanthomonas species. A major tomato pathogen causing fruit spots, defoliation, and significant yield reduction in warm, wet conditions.",
    symptoms: [
      "Water-soaked spots becoming brown with yellow halo",
      "Shot-hole lesions on leaves",
      "Raised, scabby spots on green fruit",
      "Severe defoliation and sunscald exposure",
    ],
    treatment: [
      "Copper bactericides + mancozeb tank mix",
      "Apply at transplanting and every 7–10 days during wet weather",
      "Acibenzolar-S-methyl (SAR inducer)",
    ],
    prevention: [
      "Certified disease-free seed",
      "Hot water seed treatment",
      "Drip irrigation",
      "3-year crop rotation",
    ],
  },
  Tomato___Early_blight: {
    display: "Tomato Early Blight",
    plant: "Tomato",
    emoji: "🍅",
    severity: "High",
    color: "from-amber-600 to-orange-800",
    tag: "bg-amber-100 text-amber-700 border-amber-200",
    description:
      "Caused by Alternaria solani. Target-spot pattern on lower leaves — progressively moves up the canopy, causing defoliation and fruit loss.",
    symptoms: [
      "Dark brown concentric ring target spots on older leaves",
      "Yellow chlorotic halos around lesions",
      "Premature defoliation from base upward",
      "Sunken dark stem cankers at soil line",
    ],
    treatment: [
      "Apply fungicides (chlorothalonil, azoxystrobin)",
      "Begin sprays at first symptom, repeat every 7 days",
      "Maintain adequate potassium levels",
      "Remove severely infected lower leaves",
    ],
    prevention: [
      "Use disease-free transplants",
      "Mulch to prevent soil splash",
      "Stake and tie plants for air circulation",
      "Balanced fertilisation",
    ],
  },
  Tomato___Late_blight: {
    display: "Tomato Late Blight",
    plant: "Tomato",
    emoji: "🍅",
    severity: "Critical",
    color: "from-gray-700 to-zinc-900",
    tag: "bg-gray-100 text-gray-700 border-gray-300",
    description:
      "Caused by Phytophthora infestans. Extremely destructive — can wipe out entire crops within a week under cool, wet conditions.",
    symptoms: [
      "Pale green water-soaked lesions that turn brown",
      "White mold on undersides in humid conditions",
      "Firm dark brown stem lesions",
      "Rapidly collapsing foliage",
    ],
    treatment: [
      "Systemic fungicides (metalaxyl, propamocarb) immediately",
      "Mancozeb or chlorothalonil preventively",
      "Destroy affected plants urgently",
      "Do not compost infected material",
    ],
    prevention: [
      "Preventive fungicide spray programme",
      "Avoid overhead irrigation",
      "Ensure good air circulation",
      "Monitor weather forecasts for blight risk",
    ],
  },
  Tomato___Leaf_Mold: {
    display: "Tomato Leaf Mold",
    plant: "Tomato",
    emoji: "🍅",
    severity: "Medium",
    color: "from-green-700 to-teal-800",
    tag: "bg-green-100 text-green-800 border-green-200",
    description:
      "Caused by Passalora fulva (Cladosporium fulvum). Primarily a greenhouse disease producing distinctive olive-green mold on leaf undersides.",
    symptoms: [
      "Pale yellow spots on upper leaf surface",
      "Olive-green to brown velvety growth on leaf undersides",
      "Infected leaves curl and drop",
      "Rarely affects fruit directly",
    ],
    treatment: [
      "Reduce humidity to below 85%",
      "Improve greenhouse ventilation",
      "Apply fungicides (chlorothalonil, mancozeb)",
      "Remove infected leaves",
    ],
    prevention: [
      "Resistant varieties strongly recommended",
      "Maintain relative humidity below 85%",
      "Space plants for air flow",
      "Avoid wetting foliage",
    ],
  },
  Tomato___Septoria_leaf_spot: {
    display: "Septoria Leaf Spot",
    plant: "Tomato",
    emoji: "🍅",
    severity: "High",
    color: "from-yellow-600 to-amber-700",
    tag: "bg-yellow-100 text-yellow-700 border-yellow-200",
    description:
      "Caused by Septoria lycopersici. Small, circular spots with white centres — one of the most common and destructive tomato foliar diseases.",
    symptoms: [
      "Small circular spots with dark brown borders and grey-white centres",
      "Tiny dark pycnidia visible in lesion centres",
      "Rapid defoliation starting from lower leaves",
      "Fruit rarely infected but exposure causes sunscald",
    ],
    treatment: [
      "Apply fungicides (chlorothalonil, mancozeb) at first sign",
      "Copper-based fungicides also effective",
      "Remove and destroy lower infected leaves",
      "Drip irrigation to keep foliage dry",
    ],
    prevention: [
      "Rotate crops (2+ years)",
      "Mulch soil surface",
      "Stake plants for air circulation",
      "Avoid working in wet fields",
    ],
  },
  "Tomato___Spider_mites Two-spotted_spider_mite": {
    display: "Spider Mites",
    plant: "Tomato",
    emoji: "🍅",
    severity: "Medium",
    color: "from-red-400 to-orange-500",
    tag: "bg-red-100 text-red-600 border-red-200",
    description:
      "Caused by Tetranychus urticae (Two-spotted spider mite). Not a fungal disease but causes similar leaf damage — thrives in hot, dry conditions.",
    symptoms: [
      "Fine stippling (yellow dots) on upper leaf surface",
      "Bronze/russet discolouration of leaves",
      "Fine webbing on leaf undersides",
      "Leaf drop and plant death in severe infestations",
    ],
    treatment: [
      "Apply miticides (abamectin, bifenazate)",
      "Neem oil or insecticidal soap for low severity",
      "Spray leaf undersides thoroughly",
      "Introduce predatory mites (Phytoseiulus persimilis)",
    ],
    prevention: [
      "Monitor undersides of leaves regularly",
      "Maintain adequate irrigation — mites prefer drought stress",
      "Avoid broad-spectrum insecticides that kill natural enemies",
      "Reflective mulch to deter mites",
    ],
  },
  Tomato___Target_Spot: {
    display: "Tomato Target Spot",
    plant: "Tomato",
    emoji: "🍅",
    severity: "High",
    color: "from-orange-600 to-red-700",
    tag: "bg-orange-100 text-orange-700 border-orange-200",
    description:
      "Caused by Corynespora cassiicola. Produces target-like concentric ring lesions on leaves, stems, and fruit — favoured by high humidity and dense canopies.",
    symptoms: [
      "Circular brown lesions with concentric rings",
      "Yellow halos around lesions",
      "Stem lesions causing lodging",
      "Sunken brown spots on fruit",
    ],
    treatment: [
      "Apply azoxystrobin, chlorothalonil or mancozeb",
      "Begin at early fruiting stage",
      "Improve canopy management",
      "Stake and prune for air circulation",
    ],
    prevention: [
      "Avoid high plant density",
      "Use drip irrigation",
      "Prune lower leaves",
      "Resistant varieties where available",
    ],
  },
  Tomato___Tomato_Yellow_Leaf_Curl_Virus: {
    display: "Yellow Leaf Curl Virus",
    plant: "Tomato",
    emoji: "🍅",
    severity: "Critical",
    color: "from-yellow-500 to-orange-700",
    tag: "bg-yellow-100 text-yellow-800 border-yellow-300",
    description:
      "Tomato Yellow Leaf Curl Virus (TYLCV) — spread by whiteflies. One of the most devastating tomato virus diseases worldwide. No curative treatment.",
    symptoms: [
      "Severe upward curling and yellowing of leaves",
      "Stunted plant growth",
      "Small, distorted fruit",
      "Flower drop and poor fruit set",
      "Purple discolouration of leaf undersides",
    ],
    treatment: [
      "No curative treatment — remove infected plants",
      "Control whitefly vectors immediately with insecticides",
      "Use reflective mulch to repel whiteflies",
      "Insect-proof netting in protected cultivation",
    ],
    prevention: [
      "Plant TYLCV-resistant varieties (most important measure)",
      "Control whitefly with systemic insecticides at transplanting",
      "Remove weed hosts around the field",
      "Use insect-proof screen houses",
    ],
  },
  Tomato___Tomato_mosaic_virus: {
    display: "Tomato Mosaic Virus",
    plant: "Tomato",
    emoji: "🍅",
    severity: "High",
    color: "from-green-600 to-lime-700",
    tag: "bg-green-100 text-green-700 border-green-200",
    description:
      "Tomato Mosaic Virus (ToMV) — highly stable in soil and on tools. Spread by contact, infected seed, and contaminated equipment. No cure.",
    symptoms: [
      "Mosaic pattern of light and dark green on leaves",
      "Leaf distortion and curling",
      "Stunted growth",
      "Reduced and distorted fruit",
      "Internal browning of fruit (internal browning)",
    ],
    treatment: [
      "Remove and destroy infected plants immediately",
      "No chemical treatment available",
      "Disinfect all tools with 10% bleach solution",
      "Wash hands frequently when handling plants",
    ],
    prevention: [
      "Use certified virus-free seed or TMV-resistant varieties",
      "Avoid using tobacco near plants",
      "Disinfect tools between plants",
      "Wash hands before handling plants",
    ],
  },
  Tomato___healthy: {
    display: "Healthy Tomato",
    plant: "Tomato",
    emoji: "🍅",
    severity: "None",
    color: "from-green-500 to-emerald-700",
    tag: "bg-green-100 text-green-700 border-green-200",
    description:
      "Tomato plant is healthy with no signs of disease or pest damage.",
    symptoms: ["No visible symptoms"],
    treatment: ["Continue standard tomato crop management"],
    prevention: ["Regular scouting", "Preventive spray programme"],
  },
};

/* Severity config */
const SEVERITY_CONFIG = {
  None: {
    color: "text-green-600",
    bg: "bg-green-50  border-green-200",
    icon: <FaCheckCircle />,
    label: "Healthy",
  },
  Low: {
    color: "text-yellow-600",
    bg: "bg-yellow-50 border-yellow-200",
    icon: <FaInfoCircle />,
    label: "Low Risk",
  },
  Medium: {
    color: "text-orange-600",
    bg: "bg-orange-50 border-orange-200",
    icon: <FaExclamationTriangle />,
    label: "Moderate",
  },
  High: {
    color: "text-red-600",
    bg: "bg-red-50    border-red-200",
    icon: <MdWarning />,
    label: "High Risk",
  },
  Critical: {
    color: "text-red-800",
    bg: "bg-red-100   border-red-400",
    icon: <MdBugReport />,
    label: "Critical",
  },
};

/* Format disease name: "Potato___Early_blight" → "Potato — Early Blight" */
function formatDiseaseName(raw) {
  if (!raw) return "Unknown";
  const parts = raw.split("___");
  const plant = parts[0]?.replace(/[_()]/g, " ").trim() || "";
  const disease = parts[1]?.replace(/_/g, " ").trim() || "";
  return disease.toLowerCase() === "healthy"
    ? `${plant} — Healthy ✓`
    : `${plant} — ${disease}`;
}

/* Confidence bar */
function ConfBar({ value, delay = 0 }) {
  const [w, setW] = useState(0);
  useState(() => {
    const t = setTimeout(() => setW(value), 200 + delay);
    return () => clearTimeout(t);
  });
  const color =
    value >= 80
      ? "bg-green-500"
      : value >= 50
        ? "bg-yellow-500"
        : value >= 20
          ? "bg-orange-500"
          : "bg-gray-300";
  return (
    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
      <div
        className={`h-full ${color} rounded-full transition-all duration-700 ease-out`}
        style={{ width: `${w}%` }}
      />
    </div>
  );
}
