# Import necessary libraries
from flask import Flask, request, jsonify
import pickle
import numpy as np
import tensorflow as tf
from PIL import Image
import io
import os
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# ===================================================================================================== #
# 1. Load crop recommendation model
with open('model/crop_model_complete.pkl', 'rb') as file:
    crop_package = pickle.load(file)

# Extract model, scaler, and crop dictionary
crop_model        = crop_package['model']
crop_scaler       = crop_package['scaler']
crop_dict_reverse = crop_package['crop_dict_reverse']

# ===================================================================================================== #
# 2. Load fertilizer recommendation model
with open('model/fertilizer_model_complete.pkl', 'rb') as file:
    fert_package = pickle.load(file)

# Extract model, encoders
fert_model          = fert_package['model']
soil_encoder        = fert_package['soil_encoder']
crop_encoder        = fert_package['crop_encoder']
fertilizer_encoder  = fert_package['fertilizer_encoder']

SOIL_TYPES = soil_encoder.classes_.tolist()
CROP_TYPES = crop_encoder.classes_.tolist()

# ===================================================================================================== #
# 3. Load disease detection model
disease_model = tf.keras.models.load_model('model/trained_final_best_model.keras')

# Define class names for disease detection
CLASS_NAMES = [
    'Apple___Apple_scab',
    'Apple___Black_rot',
    'Apple___Cedar_apple_rust',
    'Apple___healthy',
    'Blueberry___healthy',
    'Cherry_(including_sour)___Powdery_mildew',
    'Cherry_(including_sour)___healthy',
    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot',
    'Corn_(maize)___Common_rust_',
    'Corn_(maize)___Northern_Leaf_Blight',
    'Corn_(maize)___healthy',
    'Grape___Black_rot',
    'Grape___Esca_(Black_Measles)',
    'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
    'Grape___healthy',
    'Orange___Haunglongbing_(Citrus_greening)',
    'Peach___Bacterial_spot',
    'Peach___healthy',
    'Pepper,_bell___Bacterial_spot',
    'Pepper,_bell___healthy',
    'Potato___Early_blight',
    'Potato___Late_blight',
    'Potato___healthy',
    'Raspberry___healthy',
    'Soybean___healthy',
    'Squash___Powdery_mildew',
    'Strawberry___Leaf_scorch',
    'Strawberry___healthy',
    'Tomato___Bacterial_spot',
    'Tomato___Early_blight',
    'Tomato___Late_blight',
    'Tomato___Leaf_Mold',
    'Tomato___Septoria_leaf_spot',
    'Tomato___Spider_mites Two-spotted_spider_mite',
    'Tomato___Target_Spot',
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
    'Tomato___Tomato_mosaic_virus',
    'Tomato___healthy'
]

# Set confidence threshold for disease detection
CONFIDENCE_THRESHOLD = 50.0

# Utility function to format class names
def format_class_name(class_name):
    parts = class_name.split('___')
    if len(parts) == 2:
        plant   = parts[0].replace('_', ' ')
        disease = parts[1].replace('_', ' ')
        return f"{plant} - {disease}"
    return class_name.replace('_', ' ')

# ==================================================================================================== #
# Health check endpoint
@app.route('/', methods=['GET'])
def health_check():
    return jsonify({
        "status": "running",
        "message": "Smart Agri AI Service is running",
        "endpoints": {
            "crop_predict":        "POST /api/crop/predict",
            "fertilizer_predict":  "POST /api/fertilizer/predict",
            "disease_predict":     "POST /api/disease/predict",
            "soil_types":          "GET  /api/fertilizer/soil-types",
            "crop_types":          "GET  /api/fertilizer/crop-types"
        }
    })

# ==================================================================================================== #
# Crop recommendation endpoint
@app.route('/api/crop/predict', methods=['POST'])
def crop_predict():
    try:
        data = request.json
        if not data:
            return jsonify({"success": False, "error": "Invalid JSON body!"}), 400

        # Validate required fields
        required = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
        missing  = [field for field in required if field not in data]
        if missing:
            return jsonify({
                "success": False,
                "error": f"Missing fields: {', '.join(missing)}"
            }), 400

        # Prepare features for prediction
        features = np.array([[
            float(data['N']),
            float(data['P']),
            float(data['K']),
            float(data['temperature']),
            float(data['humidity']),
            float(data['ph']),
            float(data['rainfall'])
        ]])

        # Make prediction
        scaled          = crop_scaler.transform(features)
        probabilities   = crop_model.predict_proba(scaled)[0]
        top_indices     = np.argsort(probabilities)[::-1][:6]

        # Prepare recommendations
        recommendations = []
        for idx in top_indices:
            crop_num  = crop_model.classes_[idx]
            crop_name = crop_dict_reverse[crop_num]
            confidence = probabilities[idx] * 100
            recommendations.append({
                "crop":       crop_name.capitalize(),
                "confidence": round(float(confidence), 2)
            })

        return jsonify({
            "success":         True,
            "recommendations": recommendations
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# ==================================================================================================== #
# Fertilizer recommendation endpoint
@app.route('/api/fertilizer/predict', methods=['POST'])
def fertilizer_predict():
    try:
        data = request.json
        if not data:
            return jsonify({"success": False, "error": "Invalid JSON body!"}), 400

        # Validate required fields
        required = ['temperature', 'humidity', 'moisture', 'nitrogen',
                    'potassium', 'phosphorous', 'soil_type', 'crop_type']
        missing  = [field for field in required if field not in data]
        if missing:
            return jsonify({
                "success": False,
                "error": f"Missing fields: {', '.join(missing)}"
            }), 400

        if data['soil_type'] not in SOIL_TYPES:
            return jsonify({
                "success": False,
                "error": f"Invalid soil type. Valid options: {SOIL_TYPES}"
            }), 400

        if data['crop_type'] not in CROP_TYPES:
            return jsonify({
                "success": False,
                "error": f"Invalid crop type. Valid options: {CROP_TYPES}"
            }), 400

        soil_encoded = soil_encoder.transform([data['soil_type']])[0]
        crop_encoded = crop_encoder.transform([data['crop_type']])[0]

        # Prepare features for prediction
        features = np.array([[
            float(data['temperature']),
            float(data['humidity']),
            float(data['moisture']),
            float(data['nitrogen']),
            float(data['potassium']),
            float(data['phosphorous']),
            soil_encoded,
            crop_encoded
        ]])

        # Make prediction
        probabilities = fert_model.predict_proba(features)[0]
        top_indices   = np.argsort(probabilities)[::-1][:3]

        # Prepare recommendations
        recommendations = []
        for idx in top_indices:
            fert_name  = fertilizer_encoder.inverse_transform([idx])[0]
            confidence = probabilities[idx] * 100
            recommendations.append({
                "fertilizer": fert_name,
                "confidence": round(float(confidence), 2)
            })

        return jsonify({
            "success":         True,
            "recommendations": recommendations
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# Get valid soil types
@app.route('/api/fertilizer/soil-types', methods=['GET'])
def get_soil_types():
    return jsonify({
        "success":    True,
        "soil_types": SOIL_TYPES
    })

# Get valid crop types
@app.route('/api/fertilizer/crop-types', methods=['GET'])
def get_crop_types():
    return jsonify({
        "success":    True,
        "crop_types": CROP_TYPES
    })

# ==================================================================================================== #
# Disease prediction endpoint
@app.route('/api/disease/predict', methods=['POST'])
def disease_predict():
    try:
        if 'file' not in request.files:
            return jsonify({"success": False, "error": "No file uploaded"}), 400

        # Get the uploaded file
        file = request.files['file']

        # Validate file
        if file.filename == '':
            return jsonify({"success": False, "error": "No file selected"}), 400

        # Read and preprocess the image
        image = Image.open(io.BytesIO(file.read())).resize((128, 128))
        image = np.array(image)

        # Handle grayscale and RGBA images
        if len(image.shape) == 2:
            image = np.stack([image] * 3, axis=-1)
        elif image.shape[-1] == 4:
            image = image[:, :, :3]

        # Normalize pixel values
        image = np.expand_dims(image, axis=0)

        # Make prediction
        predictions   = disease_model.predict(image, verbose=0)[0]
        top_5_indices = np.argsort(predictions)[::-1][:5]

        # Prepare top predictions
        top_predictions = []
        for idx in top_5_indices:
            top_predictions.append({
                "disease":    CLASS_NAMES[idx],
                "formatted":  format_class_name(CLASS_NAMES[idx]),
                "confidence": round(float(predictions[idx] * 100), 2)
            })

        # Check confidence of the best prediction
        best = top_predictions[0]
        is_low_confidence = best['confidence'] < CONFIDENCE_THRESHOLD

        # If confidence is low, return a specific message
        if is_low_confidence:
            return jsonify({
                "success":          False,
                "error":            "low_confidence",
                "message":          "Unable to identify crop disease. Please upload a clear image of a crop leaf.",
                "confidence":       best['confidence'],
                "is_low_confidence": True,
                "suggestion":       "Make sure the image clearly shows a crop leaf"
            })

        # If confidence is sufficient, return the best prediction
        return jsonify({
            "success":          True,
            "prediction":       best['disease'],
            "formatted":        best['formatted'],
            "confidence":       best['confidence'],
            "is_low_confidence": False,
            "top_predictions":  top_predictions
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# ==================================================================================================== #
# Run the Flask app
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port, debug=True)