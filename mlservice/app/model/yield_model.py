"""
Yield Prediction Model
-----------------------
Placeholder implementation using a simple weighted regression based on
agronomic rules of thumb (soil pH suitability, temperature suitability,
rainfall suitability, fertilizer response curve).

To replace with a trained model:
  1. Train a scikit-learn/XGBoost regressor on historical yield data
     (features: crop, area, soil_ph, temperature, rainfall, fertilizer).
  2. Save with joblib: joblib.dump(model, "yield_model.pkl")
  3. Load it here and call model.predict([[...]]) instead of the
     rule-based logic below. Keep the same return dict shape.
"""

# Approximate optimal growing conditions per crop (simplified reference table)
CROP_PROFILES = {
    "wheat":  {"ph": (6.0, 7.5), "temp": (12, 25), "rainfall": (450, 650), "base_yield_t_ha": 3.2},
    "rice":   {"ph": (5.5, 7.0), "temp": (20, 35), "rainfall": (1000, 2000), "base_yield_t_ha": 4.5},
    "maize":  {"ph": (5.8, 7.0), "temp": (18, 27), "rainfall": (500, 800), "base_yield_t_ha": 5.5},
    "cotton": {"ph": (6.0, 8.0), "temp": (21, 30), "rainfall": (600, 1200), "base_yield_t_ha": 1.8},
    "sugarcane": {"ph": (6.0, 7.5), "temp": (21, 27), "rainfall": (1100, 1500), "base_yield_t_ha": 70.0},
}

DEFAULT_PROFILE = {"ph": (6.0, 7.0), "temp": (18, 28), "rainfall": (600, 1000), "base_yield_t_ha": 3.0}


def _suitability(value, low, high):
    """Returns a 0-1 suitability score based on how close value is to [low, high]."""
    if low <= value <= high:
        return 1.0
    span = high - low if high > low else 1
    distance = min(abs(value - low), abs(value - high))
    return max(0.0, 1 - (distance / span))


def predict_yield(data: dict) -> dict:
    crop = data["crop"].lower().strip()
    profile = CROP_PROFILES.get(crop, DEFAULT_PROFILE)

    ph_score = _suitability(data["soil_ph"], *profile["ph"])
    temp_score = _suitability(data["avg_temperature_c"], *profile["temp"])
    rain_score = _suitability(data["avg_rainfall_mm"], *profile["rainfall"])

    fertilizer = data.get("fertilizer_kg_per_hectare") or 50.0
    # Diminishing-returns fertilizer response, capped
    fert_multiplier = 1 + min(0.35, (fertilizer / 300.0))

    overall_suitability = (ph_score * 0.3 + temp_score * 0.35 + rain_score * 0.35)
    yield_per_hectare = profile["base_yield_t_ha"] * overall_suitability * fert_multiplier
    total_yield = yield_per_hectare * data["farm_area_hectares"]

    confidence = round(0.6 + 0.35 * overall_suitability, 2)  # 0.6 - 0.95 range

    notes = (
        f"Suitability breakdown — soil pH: {ph_score:.0%}, temperature: {temp_score:.0%}, "
        f"rainfall: {rain_score:.0%}. Fertilizer application contributed a "
        f"{(fert_multiplier - 1):.0%} yield boost."
    )

    return {
        "predicted_yield_tons": round(total_yield, 2),
        "yield_per_hectare": round(yield_per_hectare, 2),
        "confidence": confidence,
        "notes": notes,
    }
