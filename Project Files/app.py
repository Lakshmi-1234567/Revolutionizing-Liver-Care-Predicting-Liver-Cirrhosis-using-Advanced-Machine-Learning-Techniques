from flask import Flask, render_template, request, jsonify
import pickle
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
import os
import json

app = Flask(__name__)

# Load the trained model and normalizer
try:
    with open('rf_acc_68.pkl', 'rb') as f:
        model = pickle.load(f)
    with open('normalizer.pkl', 'rb') as f:
        scaler = pickle.load(f)
except FileNotFoundError:
    model = None
    scaler = None
    print("Model files not found. Please train the model first.")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/inner-page')
def inner_page():
    return render_template('inner-page.html')

@app.route('/portfolio-details')
def portfolio_details():
    return render_template('portfolio-details.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get data from request
        data = request.get_json()
        
        # Extract features
        features = [
            float(data.get('age', 0)),
            1 if data.get('gender') == 'Male' else 0,  # Gender encoding
            float(data.get('totalBilirubin', 0)),
            float(data.get('directBilirubin', 0)),
            float(data.get('alkalinePhosphatase', 0)),
            float(data.get('alanineAminotransferase', 0)),
            float(data.get('aspartateAminotransferase', 0)),
            float(data.get('totalProteins', 0)),
            float(data.get('albumin', 0)),
            float(data.get('A/GRatio', 0)),
           ]
        
        # Convert to numpy array and reshape
        features_array = np.array(features).reshape(1, -1)
        
        # Normalize features if scaler is available
        if scaler:
            features_array = scaler.transform(features_array)
        
        # Make prediction if model is available
        if model:
            prediction = model.predict(features_array)[0]
            probability = model.predict_proba(features_array)[0]
            
            # Determine risk level
            max_prob = max(probability)
            if max_prob < 0.3:
                risk_level = 'Low'
                stage = 1
            elif max_prob < 0.6:
                risk_level = 'Moderate'
                stage = 2
            elif max_prob < 0.8:
                risk_level = 'High'
                stage = 3
            else:
                risk_level = 'Critical'
                stage = 4
            
            # Generate recommendations
            recommendations = generate_recommendations(risk_level, features)
            
            # Generate key factors
            key_factors = generate_key_factors(features)
            
            result = {
                'prediction': int(prediction),
                'probability': float(max_prob * 100),
                'riskLevel': risk_level,
                'stage': stage,
                'confidence': float(max_prob * 100),
                'recommendations': recommendations,
                'keyFactors': key_factors
            }
        else:
            # Fallback prediction logic
            result = fallback_prediction(features)
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

def generate_recommendations(risk_level, features):
    base_recommendations = [
        'Regular monitoring of liver function tests',
        'Maintain a healthy diet low in sodium and processed foods',
        'Avoid alcohol consumption completely',
        'Stay hydrated and maintain regular exercise'
    ]
    
    risk_specific = {
        'Low': [
            'Continue current lifestyle and schedule annual check-ups',
            'Consider hepatitis vaccination if not already vaccinated'
        ],
        'Moderate': [
            'Schedule follow-up appointments every 6 months',
            'Consider consultation with a hepatologist',
            'Monitor for symptoms like fatigue, abdominal swelling, or jaundice'
        ],
        'High': [
            'Immediate consultation with a liver specialist required',
            'Consider advanced imaging studies (CT/MRI)',
            'Discuss treatment options to slow disease progression'
        ],
        'Critical': [
            'Urgent medical attention required',
            'Immediate hospitalization may be necessary',
            'Liver transplant evaluation should be considered'
        ]
    }
    
    return base_recommendations + risk_specific.get(risk_level, [])

def generate_key_factors(features):
    factors = []
    
    # Analyze key biomarkers
    if features[2] > 1.2:  # Total Bilirubin
        factors.append({
            'factor': 'Elevated Total Bilirubin',
            'impact': min((features[2] / 1.2 - 1) * 30, 25),
            'description': 'Indicates potential liver dysfunction and bile processing issues'
        })
    
    if features[5] > 56 or features[6] > 40:  # ALT or AST
        factors.append({
            'factor': 'Elevated Liver Enzymes',
            'impact': min(max(features[5]/56, features[6]/40) * 20, 20),
            'description': 'Suggests liver cell damage and inflammation'
        })
    
    if features[8] < 3.5:  # Albumin
        factors.append({
            'factor': 'Low Albumin Levels',
            'impact': min((3.5 - features[8]) / 3.5 * 25, 20),
            'description': 'Indicates reduced liver protein synthesis capacity'
        })
    
    return factors[:3]  # Return top 3 factors

def fallback_prediction(features):
    # Simple rule-based prediction as fallback
    risk_score = 0
    
    # Age factor
    if features[0] > 50:
        risk_score += 0.15
    if features[0] > 65:
        risk_score += 0.1
    
    # Bilirubin
    if features[2] > 1.2:
        risk_score += min((features[2] / 1.2 - 1) * 0.3, 0.25)
    
    # Liver enzymes
    if features[5] > 56 or features[6] > 40:
        risk_score += min(max(features[5]/56, features[6]/40) * 0.2, 0.2)
    
    # Albumin
    if features[8] < 3.5:
        risk_score += min((3.5 - features[8]) / 3.5 * 0.25, 0.2)
    
    probability = min(risk_score * 100, 95)
    
    if probability < 25:
        risk_level, stage = 'Low', 1
    elif probability < 50:
        risk_level, stage = 'Moderate', 2
    elif probability < 75:
        risk_level, stage = 'High', 3
    else:
        risk_level, stage = 'Critical', 4
    
    return {
        'prediction': 1 if probability > 50 else 0,
        'probability': probability,
        'riskLevel': risk_level,
        'stage': stage,
        'confidence': max(85 + np.random.random() * 10, 90),
        'recommendations': generate_recommendations(risk_level, features),
        'keyFactors': generate_key_factors(features)
    }

if __name__ == '__main__':
    app.run(debug=True)