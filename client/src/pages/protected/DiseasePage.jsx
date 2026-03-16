//TODO: Split into smaller components for better maintainability (e.g. DiseaseInfoCard, SymptomList, TreatmentList, PreventionList, etc.)
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
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = {
  // POST /api/disease/predict
  predict: (file) => {
    const fd = new FormData();
    fd.append("file", file);
    return fetch(`${BASE_URL}api/disease/predict`, {
      method: "POST",
      credentials: "include",
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

/* Disease panel */
function DiseaseResult({ data, imagePreview }) {
  const [expanded, setExpanded] = useState(false);
  const { prediction, confidence, top_predictions, isLowConfidence, recordId } =
    data;

  const info = DISEASE_DATA[prediction] || null;
  const sev = SEVERITY_CONFIG[info?.severity || "Medium"];
  const confNum = parseFloat(confidence);

  const confColor =
    confNum >= 80
      ? "text-green-600"
      : confNum >= 50
        ? "text-yellow-600"
        : confNum >= 20
          ? "text-orange-500"
          : "text-red-500";

  return (
    <div className="space-y-5" style={{ animation: "fadeSlide .5s ease" }}>
      {/* Low confidence warning */}
      {isLowConfidence && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-4 py-3 rounded-xl">
          <FaExclamationTriangle className="flex-shrink-0 mt-0.5 text-amber-500" />
          <span>
            Low confidence result (&lt;50%). The prediction may not be accurate
            — consider consulting an agronomist or uploading a clearer image.
          </span>
        </div>
      )}

      {/* Main result card */}
      <div
        className={`bg-gradient-to-r ${info?.color || "from-gray-500 to-gray-700"} text-white rounded-2xl overflow-hidden shadow-xl`}
        style={{ boxShadow: "0 8px 32px rgba(0,0,0,.2)" }}
      >
        <div className="flex flex-col sm:flex-row">
          {/* Uploaded image */}
          {imagePreview && (
            <div className="sm:w-44 h-44 flex-shrink-0 overflow-hidden">
              <img
                src={imagePreview}
                alt="analysed leaf"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1 p-5">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-1">
                  Detection Result
                </p>
                <h2 className="text-xl font-extrabold leading-tight">
                  {info?.display || formatDiseaseName(prediction)}
                </h2>
                <p className="text-white/70 text-xs mt-0.5">
                  {info?.plant} {info?.emoji}
                </p>
              </div>
              <div
                className={`flex items-center gap-1.5 text-xs font-extrabold px-3 py-1.5 rounded-full border ${sev.bg} ${sev.color} flex-shrink-0`}
              >
                {sev.icon} {sev.label}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3">
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-white/60">Confidence</span>
                  <span className={`text-sm font-extrabold ${confColor}`}>
                    {confNum.toFixed(1)}%
                  </span>
                </div>
                <ConfBar value={confNum} />
              </div>
            </div>

            {recordId && (
              <p className="text-white/30 text-[10px] font-mono mt-2">
                Record ID: {recordId.slice(-12)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Info cards */}
      {info && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Description */}
          <div className="px-5 py-4 border-b border-gray-50">
            <p className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <FaInfoCircle className="text-green-500" /> About This Disease
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              {info.description}
            </p>
          </div>

          {/* Symptoms */}
          <div className="px-5 py-4 border-b border-gray-50">
            <p className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <MdBugReport className="text-red-500 text-base" /> Symptoms
            </p>
            <ul className="space-y-1.5">
              {info.symptoms.map((s) => (
                <li
                  key={s}
                  className="flex items-start gap-2.5 text-xs text-gray-600"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Expandable treatment & prevention */}
          <button
            onClick={() => setExpanded((p) => !p)}
            className="w-full flex items-center justify-between px-5 py-3 text-xs font-bold text-gray-500 hover:text-green-700 hover:bg-green-50 transition-colors"
          >
            Treatment & Prevention Guide
            {expanded ? (
              <FaChevronUp className="text-[10px]" />
            ) : (
              <FaChevronDown className="text-[10px]" />
            )}
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${expanded ? "max-h-[500px]" : "max-h-0"}`}
          >
            <div className="px-5 pb-5 grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-extrabold text-red-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <MdHealthAndSafety /> Treatment
                </p>
                <ul className="space-y-2">
                  {info.treatment.map((t) => (
                    <li
                      key={t}
                      className="flex items-start gap-2 text-xs text-gray-600"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 flex-shrink-0" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-extrabold text-green-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FaShieldAlt className="text-sm" /> Prevention
                </p>
                <ul className="space-y-2">
                  {info.prevention.map((p) => (
                    <li
                      key={p}
                      className="flex items-start gap-2 text-xs text-gray-600"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top predictions */}
      {top_predictions?.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <FaTrophy className="text-amber-500" /> All Predictions
          </p>
          <div className="space-y-3">
            {top_predictions.map((p, i) => {
              const pInfo = DISEASE_DATA[p.disease];
              const pConf = parseFloat(p.confidence);
              return (
                <div
                  key={p._id || p.disease}
                  className="flex items-center gap-3"
                >
                  <span
                    className={`w-5 text-center text-xs font-extrabold ${i === 0 ? "text-amber-500" : "text-gray-400"}`}
                  >
                    {i === 0 ? "🥇" : `#${i + 1}`}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-xs font-bold text-[#073319] truncate">
                        {pInfo?.display || formatDiseaseName(p.disease)}
                      </p>
                      <span
                        className={`text-xs font-extrabold ml-2 flex-shrink-0
                        ${pConf >= 80 ? "text-green-600" : pConf >= 40 ? "text-yellow-600" : "text-gray-400"}`}
                      >
                        {pConf.toFixed(1)}%
                      </span>
                    </div>
                    <ConfBar value={pConf} delay={i * 100} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* Main page */
export default function DiseaseDetectionPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [apiError, setApiError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);
  const resultRef = useRef(null);

  const handleFile = useCallback((f) => {
    if (!f || !f.type.startsWith("image/")) {
      setApiError("Please upload a valid image file (JPG, PNG, WebP).");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setApiError("Image must be smaller than 10 MB.");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
    setApiError("");
  }, []);

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files?.[0];
      if (f) handleFile(f);
    },
    [handleFile],
  );

  const handleSubmit = async () => {
    if (!file) {
      setApiError("Please upload a leaf image first.");
      return;
    }
    setLoading(true);
    setApiError("");
    setResult(null);
    try {
      // POST /api/disease/predict — field: "file" — no Content-Type header (multipart)
      const data = await api.predict(file);
      setResult(data);
      setTimeout(
        () =>
          resultRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          }),
        120,
      );
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setApiError("");
  };

  /* Supported plants */
  const PLANTS = [
    { name: "Apple", emoji: "🍎" },
    { name: "Corn", emoji: "🌽" },
    { name: "Grape", emoji: "🍇" },
    { name: "Tomato", emoji: "🍅" },
    { name: "Potato", emoji: "🥔" },
    { name: "Peach", emoji: "🍑" },
    { name: "Cherry", emoji: "🍒" },
    { name: "Strawberry", emoji: "🍓" },
    { name: "Orange", emoji: "🍊" },
    { name: "Pepper", emoji: "🫑" },
    { name: "Squash", emoji: "🎃" },
    { name: "Soybean", emoji: "🫘" },
  ];

  return (
    <div className="min-h-screen bg-[#f0fdf4] text-[#073319]">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#052e16] via-[#14532d] to-[#16a34a] text-white overflow-hidden py-14 md:py-20">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-green-400/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-16 w-72 h-72 rounded-full bg-emerald-300/10 blur-3xl pointer-events-none translate-y-1/2" />

        <div className="relative container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-green-200 text-xs font-bold px-4 py-1.5 rounded-full mb-5 backdrop-blur-sm">
                <HiSparkles className="text-green-300" /> CNN Deep Learning ·
                99.45% Val Accuracy
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-4">
                Crop Disease
                <br />
                <span className="text-green-300">Detection by Image</span>
              </h1>
              <p className="text-green-100/70 text-sm md:text-base leading-relaxed">
                Upload a photo of a diseased leaf and our CNN model will
                identify the disease with confidence scoring and treatment
                recommendations.
              </p>
              <div className="flex flex-wrap gap-2.5 mt-5">
                {[
                  { icon: "🧠", text: "CNN Model" },
                  { icon: "🌿", text: "38 Disease Classes" },
                  { icon: "📸", text: "Image Upload" },
                  { icon: "💊", text: "Treatment Guide" },
                ].map(({ icon, text }) => (
                  <span
                    key={text}
                    className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/15 text-xs font-semibold text-green-100 px-3 py-1.5 rounded-full"
                  >
                    {icon} {text}
                  </span>
                ))}
              </div>
            </div>

            {/* Supported plants grid */}
            <div className="hidden lg:grid grid-cols-4 gap-2 w-64">
              {PLANTS.map(({ name, emoji }) => (
                <div
                  key={name}
                  className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-2 text-center hover:bg-white/20 transition-colors"
                >
                  <span className="text-2xl block">{emoji}</span>
                  <span className="text-[9px] font-bold text-green-200/70 mt-0.5 block">
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 py-10">
        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* UPLOAD PANEL */}
          <div className="lg:col-span-2 space-y-5">
            {/* Upload zone */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-50 bg-gradient-to-r from-teal-50 to-green-50">
                <FaCamera className="text-teal-500" />
                <h3 className="font-extrabold text-[#073319] text-sm">
                  Upload Leaf Image
                </h3>
              </div>
              <div className="p-5">
                {/* Drag & Drop Zone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={onDrop}
                  onClick={() => !preview && inputRef.current?.click()}
                  className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden
                    ${dragOver ? "border-green-500 bg-green-50 scale-[1.01]" : preview ? "border-green-300" : "border-gray-300 hover:border-green-400 hover:bg-green-50/50"}`}
                  style={{ minHeight: "260px" }}
                >
                  {preview ? (
                    <>
                      <img
                        src={preview}
                        alt="leaf preview"
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-4">
                        <div className="flex items-center justify-between w-full">
                          <p className="text-white text-xs font-bold truncate max-w-[160px]">
                            {file?.name}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReset();
                            }}
                            className="w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center flex-shrink-0 transition-colors shadow"
                          >
                            <FaTimes className="text-[10px]" />
                          </button>
                        </div>
                      </div>
                      <div className="absolute top-3 left-3 bg-green-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow">
                        ✓ Ready to Analyse
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 gap-3 p-6 text-center">
                      <div className="w-16 h-16 bg-green-100 border border-green-200 rounded-2xl flex items-center justify-center text-3xl mb-1">
                        🍃
                      </div>
                      <p className="text-sm font-bold text-[#073319]">
                        {dragOver
                          ? "Drop the image here…"
                          : "Drag & drop a leaf image"}
                      </p>
                      <p className="text-xs text-gray-400">
                        or click to browse your files
                      </p>
                      <div className="flex gap-2 mt-1">
                        {["JPG", "PNG", "WebP"].map((f) => (
                          <span
                            key={f}
                            className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full border border-gray-200"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                      <p className="text-[10px] text-gray-400">Max 10 MB</p>
                    </div>
                  )}
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFile(f);
                    }}
                  />
                </div>

                {/* Change image button */}
                {preview && (
                  <button
                    onClick={() => inputRef.current?.click()}
                    className="w-full mt-3 flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl text-sm hover:border-green-300 hover:text-green-700 hover:bg-green-50 transition-all"
                  >
                    <FaImage className="text-xs" /> Change Image
                  </button>
                )}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <FaInfoCircle className="text-teal-500" /> Tips for Best Results
              </p>
              <ul className="space-y-2.5">
                {[
                  "Take a close-up photo of the affected leaf",
                  "Use good natural lighting — avoid dark or blurry images",
                  "Capture a single leaf clearly filling the frame",
                  "Include both upper and underside symptoms if visible",
                  "Early-stage symptoms give better accuracy than very advanced disease",
                ].map((t, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-xs text-gray-600"
                  >
                    <span className="w-4 h-4 rounded-full bg-teal-100 text-teal-600 text-[9px] font-extrabold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Error */}
            {apiError && (
              <div
                className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold px-4 py-3 rounded-xl"
                style={{ animation: "shake .4s ease" }}
              >
                ⚠ {apiError}
              </div>
            )}

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={loading || !file}
              className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 rounded-xl text-sm transition-all shadow-lg
                ${loading || !file ? "opacity-60 cursor-not-allowed" : "hover:opacity-90 hover:-translate-y-0.5 hover:shadow-xl"}`}
              style={
                !loading && file
                  ? { boxShadow: "0 6px 24px rgba(22,163,74,.35)" }
                  : {}
              }
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                  Analysing Image…
                </>
              ) : (
                <>
                  <MdBugReport className="text-base" /> Detect Disease
                </>
              )}
            </button>

            <p className="text-xs text-gray-400 text-center flex items-center gap-1.5 justify-center">
              <FaInfoCircle className="text-[10px]" /> Results are saved to your
              detection history
            </p>
          </div>

          {/* Result */}
          <div className="lg:col-span-3" ref={resultRef}>
            {/* Idle */}
            {!result && !loading && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center min-h-[480px] flex flex-col items-center justify-center">
                <div className="w-24 h-24 bg-gradient-to-br from-teal-100 to-green-100 border border-teal-200 rounded-3xl flex items-center justify-center text-5xl mx-auto mb-5">
                  🔬
                </div>
                <h3 className="font-extrabold text-[#073319] text-xl mb-2">
                  Awaiting Leaf Image
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-8">
                  Upload a clear photo of a diseased leaf. Our CNN model will
                  identify the disease, show confidence scores, and provide
                  treatment guidance.
                </p>

                {/* Supported plants showcase */}
                <div className="w-full max-w-sm">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                    Supported Plants
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {PLANTS.map(({ name, emoji }) => (
                      <div
                        key={name}
                        className="bg-green-50 border border-green-100 rounded-xl p-2 text-center"
                      >
                        <span className="text-xl block">{emoji}</span>
                        <span className="text-[9px] font-bold text-green-700 mt-0.5 block">
                          {name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center min-h-[300px] flex flex-col items-center justify-center">
                <div className="relative w-20 h-20 mx-auto mb-5">
                  <div className="w-20 h-20 border-4 border-green-100 border-t-green-600 rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center text-2xl">
                    🔬
                  </div>
                </div>
                <h3 className="font-extrabold text-[#073319] text-lg mb-2">
                  Analysing Leaf Image…
                </h3>
                <p className="text-gray-400 text-sm">
                  Uploading to Cloudinary and running CNN model
                </p>
                <div className="flex gap-1.5 mt-5">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Results */}
            {result && !loading && (
              <DiseaseResult data={result} imagePreview={preview} />
            )}

            {/* Reset / Try again */}
            {result && !loading && (
              <div className="flex flex-col sm:flex-row gap-3 mt-5">
                <button
                  onClick={handleReset}
                  className="flex-1 border-2 border-green-200 text-green-700 font-bold py-3 rounded-xl text-sm hover:bg-green-50 transition-all"
                >
                  Analyse Another Image
                </button>
                <Link
                  to="/dashboard"
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3 rounded-xl text-sm hover:opacity-90 transition-all shadow"
                  style={{ boxShadow: "0 4px 16px rgba(22,163,74,.3)" }}
                >
                  View History <HiArrowRight />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
        @keyframes fadeSlide { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shake     { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-5px)} 40%{transform:translateX(5px)} 60%{transform:translateX(-3px)} 80%{transform:translateX(3px)} }
      `}</style>
    </div>
  );
}
