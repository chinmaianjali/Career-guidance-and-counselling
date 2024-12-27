from flask import Flask, request, jsonify
from flask_cors import CORS  
import requests
import base64
import os
import subprocess

app = Flask(_name_)
CORS(app)

API_KEY = '0bf5625104874f5992c72f927dafd4d8'
API_URL = 'https://api.clarifai.com/v2/models/general-image-recognition/outputs'

def encode_image_to_base64(image_path):
    """Encode an image file to base64."""
    with open(image_path, 'rb') as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def predict_image(base64_image):
    """Send an image to Clarifai for prediction using HTTP API."""
    headers = {
        'Authorization': f'Key {API_KEY}',
        'Content-Type': 'application/json'
    } 
    data = {
        "inputs": [
            {
                "data": {
                    "image": {
                        "base64": base64_image
                    }
                }
            }
        ]
    }
    
    try:
        response = requests.post(API_URL, headers=headers, json=data)
        response.raise_for_status()

        result = response.json()
        first_concept = result['outputs'][0]['data']['concepts'][0]
        concept_name = first_concept['name']
        confidence = round(first_concept['value'], 2)

        return {"concept": concept_name, "confidence": confidence}

    except requests.exceptions.RequestException as e:
        return {"error": str(e)}

def get_description_from_gemini(concept_name):
    """Call the Node.js script to get a description from Gemini API."""
    try:
        result = subprocess.run(
            ['node', 'gemini-api.js', concept_name],
            capture_output=True,
            text=True
        )
        

        if result.returncode == 0:
            description = result.stdout.strip()
            print(f"Description fetched: {description}") 
            return description
        else:
            error_msg = f"Error in Gemini API script: {result.stderr.strip()}"
            print(error_msg)
            return "Failed to fetch description from Gemini API."

    except Exception as e:
        error_msg = f"Error while calling Gemini API: {str(e)}"
        print(error_msg)
        return error_msg

@app.route('/predict', methods=['POST'])
def predict():
    print("Received prediction request")
    if 'image' not in request.files:
        print("No image provided")
        return jsonify({"error": "No image provided"}), 400

    image = request.files['image']

    temp_image_path = "temp_image.jpg"
    image.save(temp_image_path)
    print("Image saved successfully")

    base64_image = encode_image_to_base64(temp_image_path)
    prediction = predict_image(base64_image)

    if 'error' in prediction:
        print("Error in prediction:", prediction)
        return jsonify(prediction)

    concept_name = prediction['concept']
    print(f"Concept identified: {concept_name}")
    description = get_description_from_gemini(concept_name)
    os.remove(temp_image_path)

    return jsonify({
        "concept": concept_name,
        "confidence": prediction['confidence'],
        "description": description
    })

if _name_ == '_main_':
    app.run(port=5001, debug=True)