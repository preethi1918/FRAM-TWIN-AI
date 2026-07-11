"""
Disease Risk Prediction Model
-------------------------------
Placeholder rule-based classifier using known epidemiological triggers:
high humidity + leaf wetness + moderate temperature = fungal disease risk.

To replace with a trained model: train an image-based CNN (for leaf photos)
or a tabular classifier (for sensor data) on labeled disease-outbreak data,
and swap the scoring logic below for model.predict_proba(...).
"""

DISEASE_LIBRARY = {
    "wheat": ["Rust", "Powdery Mildew", "Blight"],
    "rice": ["Blast", "Bacterial Leaf Blight", "Sheath Blight"],
    "maize": ["Leaf Blight", "Rust", "Downy Mildew"],
    "cotton": ["Bacterial Blight", "Root Rot"],
    "sugarcane": ["Red Rot", "Smut"],
}


def predict_disease_risk(data: dict) -> dict:
    crop = data["crop"].lower().strip()
    humidity = data["humidity_percent"]
    temp = data["temperature_c"]
    leaf_wetness = data.get("leaf_wetness_hours", 0)
    rainfall = data.get("recent_rainfall_mm", 0)

    score = 0.0
    score += max(0, (humidity - 60) / 40) * 0.4         # humidity above 60% raises risk
    score += max(0, (leaf_wetness - 4) / 20) * 0.3       # prolonged leaf wetness raises risk
    score += (1 - abs(temp - 24) / 24) * 0.2             # fungal-favorable temp near 24C
    score += min(1.0, rainfall / 50) * 0.1               # recent heavy rain raises risk
    score = max(0.0, min(1.0, score))

    if score < 0.25:
        level = "Low"
    elif score < 0.5:
        level = "Medium"
    elif score < 0.75:
        level = "High"
    else:
        level = "Critical"

    diseases = DISEASE_LIBRARY.get(crop, ["Generic Fungal Infection", "Bacterial Spot"])
    likely = diseases[:2] if score >= 0.5 else diseases[:1]

    if level in ("High", "Critical"):
        recommendation = (
            "Conditions favor fungal/bacterial outbreak. Inspect crops within 24 hours, "
            "consider preventive fungicide application, and improve field drainage/airflow."
        )
    elif level == "Medium":
        recommendation = "Monitor closely over the next few days and reduce overhead irrigation."
    else:
        recommendation = "Conditions are currently unfavorable for disease spread. Routine monitoring is sufficient."

    return {
        "risk_level": level,
        "risk_score": round(score, 2),
        "likely_diseases": likely,
        "recommendation": recommendation,
    }
