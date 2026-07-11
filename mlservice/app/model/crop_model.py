"""
Crop Recommendation Model
-----------------------------
Placeholder scoring engine matching soil NPK + pH + climate against crop
requirement profiles. Replace with a trained classifier (e.g. Random
Forest on the classic "Crop Recommendation Dataset" from Kaggle) for
production-grade accuracy.
"""

# Simplified ideal ranges: (N, P, K in kg/ha), pH, temp C, rainfall mm
CROP_REQUIREMENTS = {
    "rice":      {"n": (80, 120), "p": (40, 60), "k": (40, 60), "ph": (5.5, 7.0), "temp": (20, 35), "rainfall": (1000, 2000)},
    "wheat":     {"n": (100, 140), "p": (50, 70), "k": (40, 60), "ph": (6.0, 7.5), "temp": (12, 25), "rainfall": (450, 650)},
    "maize":     {"n": (120, 160), "p": (60, 80), "k": (40, 60), "ph": (5.8, 7.0), "temp": (18, 27), "rainfall": (500, 800)},
    "cotton":    {"n": (100, 140), "p": (40, 60), "k": (40, 60), "ph": (6.0, 8.0), "temp": (21, 30), "rainfall": (600, 1200)},
    "chickpea":  {"n": (20, 40),  "p": (40, 60), "k": (20, 40), "ph": (6.0, 7.5), "temp": (10, 25), "rainfall": (350, 650)},
    "sugarcane": {"n": (150, 200), "p": (60, 90), "k": (60, 90), "ph": (6.0, 7.5), "temp": (21, 27), "rainfall": (1100, 1500)},
    "groundnut": {"n": (20, 40),  "p": (40, 60), "k": (40, 60), "ph": (6.0, 7.0), "temp": (25, 30), "rainfall": (500, 1000)},
}


def _range_score(value, low, high):
    if low <= value <= high:
        return 1.0
    span = high - low if high > low else 1
    distance = min(abs(value - low), abs(value - high))
    return max(0.0, 1 - (distance / span))


def recommend_crop(data: dict) -> dict:
    scores = {}
    for crop, req in CROP_REQUIREMENTS.items():
        s = (
            _range_score(data["nitrogen"], *req["n"]) * 0.2
            + _range_score(data["phosphorus"], *req["p"]) * 0.15
            + _range_score(data["potassium"], *req["k"]) * 0.15
            + _range_score(data["soil_ph"], *req["ph"]) * 0.2
            + _range_score(data["avg_temperature_c"], *req["temp"]) * 0.15
            + _range_score(data["avg_rainfall_mm"], *req["rainfall"]) * 0.15
        )
        scores[crop] = round(s, 3)

    ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    top_crops = [c for c, _ in ranked[:3]]
    top_choice, top_score = ranked[0]

    reasoning = (
        f"Based on soil NPK levels, pH {data['soil_ph']}, average temperature "
        f"{data['avg_temperature_c']}°C and rainfall {data['avg_rainfall_mm']}mm, "
        f"'{top_choice}' matches your farm's conditions most closely "
        f"({top_score:.0%} suitability)."
    )

    return {
        "recommended_crops": top_crops,
        "top_choice": top_choice,
        "suitability_score": top_score,
        "reasoning": reasoning,
    }
