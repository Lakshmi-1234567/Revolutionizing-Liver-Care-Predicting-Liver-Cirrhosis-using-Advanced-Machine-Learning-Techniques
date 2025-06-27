# API Documentation - Liver Cirrhosis Prediction System

## Overview

This document provides comprehensive documentation for the Liver Cirrhosis Prediction System API. The API enables healthcare applications to integrate liver cirrhosis risk assessment capabilities.

## Base URL

```
http://localhost:5000
```

## Authentication

Currently, the API does not require authentication. In production environments, implement appropriate authentication mechanisms.

## Endpoints

### 1. Health Check

**GET** `/`

Returns the main application page.

**Response:**
- **Status Code:** 200 OK
- **Content-Type:** text/html

---

### 2. Prediction

**POST** `/predict`

Generates liver cirrhosis risk prediction based on patient laboratory values.

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "age": 45,
  "gender": "Male",
  "totalBilirubin": 1.2,
  "directBilirubin": 0.3,
  "alkalinePhosphatase": 120,
  "alanineAminotransferase": 35,
  "aspartateAminotransferase": 28,
  "totalProteins": 7.2,
  "albumin": 4.1,
  "albuminGlobulinRatio": 1.6
}
```

**Request Parameters:**

| Parameter | Type | Required | Description | Range |
|-----------|------|----------|-------------|-------|
| age | number | Yes | Patient age in years | 18-100 |
| gender | string | Yes | Patient gender | "Male" or "Female" |
| totalBilirubin | number | Yes | Total bilirubin level (mg/dL) | 0.1-20.0 |
| directBilirubin | number | Yes | Direct bilirubin level (mg/dL) | 0.1-10.0 |
| alkalinePhosphatase | number | Yes | Alkaline phosphatase level (U/L) | 20-500 |
| alanineAminotransferase | number | Yes | ALT level (U/L) | 5-200 |
| aspartateAminotransferase | number | Yes | AST level (U/L) | 5-200 |
| totalProteins | number | Yes | Total protein level (g/dL) | 4.0-10.0 |
| albumin | number | Yes | Albumin level (g/dL) | 2.0-6.0 |
| albuminGlobulinRatio | number | Yes | Albumin/Globulin ratio | 0.5-3.0 |

**Success Response:**

**Status Code:** 200 OK

```json
{
  "prediction": 0,
  "probability": 23.5,
  "riskLevel": "Low",
  "stage": 1,
  "confidence": 92.3,
  "recommendations": [
    "Regular monitoring of liver function tests",
    "Maintain a healthy diet low in sodium and processed foods",
    "Avoid alcohol consumption completely",
    "Stay hydrated and maintain regular exercise",
    "Continue current lifestyle and schedule annual check-ups",
    "Consider hepatitis vaccination if not already vaccinated"
  ],
  "keyFactors": [
    {
      "factor": "Elevated Total Bilirubin",
      "impact": 15.2,
      "description": "Indicates potential liver dysfunction and bile processing issues"
    }
  ]
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| prediction | integer | Binary prediction (0: No cirrhosis, 1: Cirrhosis) |
| probability | number | Cirrhosis probability percentage (0-100) |
| riskLevel | string | Risk classification ("Low", "Moderate", "High", "Critical") |
| stage | integer | Disease stage (1-4) |
| confidence | number | Model confidence percentage (0-100) |
| recommendations | array | Clinical recommendations based on risk level |
| keyFactors | array | Most influential risk factors |

**Key Factors Object:**

| Field | Type | Description |
|-------|------|-------------|
| factor | string | Name of the risk factor |
| impact | number | Impact percentage on prediction |
| description | string | Clinical explanation of the factor |

**Error Response:**

**Status Code:** 400 Bad Request

```json
{
  "error": "Invalid input data. Please check all required fields."
}
```

**Status Code:** 500 Internal Server Error

```json
{
  "error": "Internal server error occurred during prediction."
}
```

---

### 3. About Page

**GET** `/inner-page`

Returns the about page with detailed information about the system.

**Response:**
- **Status Code:** 200 OK
- **Content-Type:** text/html

---

### 4. Dashboard

**GET** `/portfolio-details`

Returns the analytics dashboard page.

**Response:**
- **Status Code:** 200 OK
- **Content-Type:** text/html

## Risk Level Classification

The system classifies patients into four risk levels:

| Risk Level | Probability Range | Stage | Description |
|------------|------------------|-------|-------------|
| Low | 0-25% | 1 | Minimal risk, routine monitoring |
| Moderate | 25-50% | 2 | Moderate risk, increased monitoring |
| High | 50-75% | 3 | High risk, specialist consultation |
| Critical | 75-100% | 4 | Critical risk, urgent medical attention |

## Clinical Recommendations

Recommendations are generated based on risk level and key factors:

### Base Recommendations (All Patients)
- Regular monitoring of liver function tests
- Maintain a healthy diet low in sodium and processed foods
- Avoid alcohol consumption completely
- Stay hydrated and maintain regular exercise

### Risk-Specific Recommendations

**Low Risk:**
- Continue current lifestyle and schedule annual check-ups
- Consider hepatitis vaccination if not already vaccinated

**Moderate Risk:**
- Schedule follow-up appointments every 6 months
- Consider consultation with a hepatologist
- Monitor for symptoms like fatigue, abdominal swelling, or jaundice

**High Risk:**
- Immediate consultation with a liver specialist required
- Consider advanced imaging studies (CT/MRI)
- Discuss treatment options to slow disease progression

**Critical Risk:**
- Urgent medical attention required
- Immediate hospitalization may be necessary
- Liver transplant evaluation should be considered

## Error Handling

The API uses standard HTTP status codes:

- **200 OK:** Request successful
- **400 Bad Request:** Invalid input data
- **404 Not Found:** Endpoint not found
- **405 Method Not Allowed:** HTTP method not supported
- **500 Internal Server Error:** Server error

## Rate Limiting

Currently, no rate limiting is implemented. For production use, consider implementing rate limiting to prevent abuse.

## Example Usage

### Python Example

```python
import requests
import json

# API endpoint
url = "http://localhost:5000/predict"

# Patient data
patient_data = {
    "age": 45,
    "gender": "Male",
    "totalBilirubin": 1.2,
    "directBilirubin": 0.3,
    "alkalinePhosphatase": 120,
    "alanineAminotransferase": 35,
    "aspartateAminotransferase": 28,
    "totalProteins": 7.2,
    "albumin": 4.1,
    "albuminGlobulinRatio": 1.6
}

# Make request
response = requests.post(url, json=patient_data)

# Process response
if response.status_code == 200:
    result = response.json()
    print(f"Risk Level: {result['riskLevel']}")
    print(f"Probability: {result['probability']:.1f}%")
    print(f"Confidence: {result['confidence']:.1f}%")
else:
    print(f"Error: {response.json()['error']}")
```

### JavaScript Example

```javascript
// Patient data
const patientData = {
    age: 45,
    gender: "Male",
    totalBilirubin: 1.2,
    directBilirubin: 0.3,
    alkalinePhosphatase: 120,
    alanineAminotransferase: 35,
    aspartateAminotransferase: 28,
    totalProteins: 7.2,
    albumin: 4.1,
    albuminGlobulinRatio: 1.6
};

// Make request
fetch('/predict', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(patientData)
})
.then(response => response.json())
.then(data => {
    console.log('Risk Level:', data.riskLevel);
    console.log('Probability:', data.probability + '%');
    console.log('Confidence:', data.confidence + '%');
})
.catch(error => {
    console.error('Error:', error);
});
```

### cURL Example

```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "age": 45,
    "gender": "Male",
    "totalBilirubin": 1.2,
    "directBilirubin": 0.3,
    "alkalinePhosphatase": 120,
    "alanineAminotransferase": 35,
    "aspartateAminotransferase": 28,
    "totalProteins": 7.2,
    "albumin": 4.1,
    "albuminGlobulinRatio": 1.6
  }'
```

## Testing

### Unit Tests

Test individual API endpoints:

```python
import unittest
import json
from app import app

class TestAPI(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_predict_endpoint(self):
        # Test data
        test_data = {
            "age": 45,
            "gender": "Male",
            "totalBilirubin": 1.2,
            "directBilirubin": 0.3,
            "alkalinePhosphatase": 120,
            "alanineAminotransferase": 35,
            "aspartateAminotransferase": 28,
            "totalProteins": 7.2,
            "albumin": 4.1,
            "albuminGlobulinRatio": 1.6
        }
        
        response = self.app.post('/predict',
                               data=json.dumps(test_data),
                               content_type='application/json')
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('prediction', data)
        self.assertIn('probability', data)
        self.assertIn('riskLevel', data)

if __name__ == '__main__':
    unittest.main()
```

## Security Considerations

1. **Input Validation:** All inputs are validated for type and range
2. **Error Handling:** Sensitive information is not exposed in error messages
3. **HTTPS:** Use HTTPS in production environments
4. **Authentication:** Implement authentication for production use
5. **Rate Limiting:** Consider implementing rate limiting
6. **Logging:** Log all API requests for monitoring and debugging

## Changelog

### Version 1.0.0
- Initial API release
- Basic prediction endpoint
- Error handling implementation
- Documentation creation

## Support

For API support and questions:
- Email: support@livercare-ai.com
- Documentation: [API Docs URL]
- GitHub Issues: [Repository URL]/issues

## 🧪 Testing

- **Manual Testing**: Verified form input and results through browser
- **API Testing**: Used Postman and curl to validate the `/predict` endpoint
- **Edge Cases**: Tested with missing/abnormal values to ensure robustness
