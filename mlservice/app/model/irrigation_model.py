"""
Smart Irrigation Recommendation Model
----------------------------------------
Placeholder logic combining soil moisture deficit, evapotranspiration proxy
(temperature-driven), and forecast rainfall to decide whether/how much to
irrigate. Replace with a proper ET0 (Penman-Monteith) + soil-water-balance
model fed by real IoT sensor and weather-API data for production use.
"""

CROP_WATER_NEED_MM_PER_DAY = {
    "wheat": 4.5,
    "rice": 8.0,
    "maize": 5.5,
    "cotton": 6.0,
    "sugarcane": 7.5,
}

DEFAULT_WATER_NEED = 5.0
LITERS_PER_MM_PER_HECTARE = 10000  # 1mm over 1 hectare = 10,000 liters


def recommend_irrigation(data: dict) -> dict:
    crop = data["crop"].lower().strip()
    moisture = data["soil_moisture_percent"]
    temp = data["temperature_c"]
    forecast_rain = data.get("forecast_rain_mm_next_48h", 0)
    area = data["farm_area_hectares"]

    daily_need_mm = CROP_WATER_NEED_MM_PER_DAY.get(crop, DEFAULT_WATER_NEED)
    # Higher temperature increases evapotranspiration
    temp_adjustment = 1 + max(0, (temp - 25) / 50)
    adjusted_need_mm = daily_need_mm * temp_adjustment

    moisture_deficit = max(0, 60 - moisture)  # target ~60% soil moisture

    # Skip irrigation if significant rain is forecast
    if forecast_rain >= adjusted_need_mm * 5:
        should_irrigate = False
        water_mm = 0
        reasoning = (
            f"Forecast rainfall of {forecast_rain}mm over the next 48h exceeds crop water "
            "needs. Irrigation withheld to avoid waterlogging and save water."
        )
        savings = 100.0
    elif moisture >= 65:
        should_irrigate = False
        water_mm = 0
        reasoning = f"Soil moisture ({moisture}%) is already at healthy levels. No irrigation needed today."
        savings = 100.0
    else:
        should_irrigate = True
        # Reduce recommended water proportionally to expected rainfall
        rain_offset_mm = min(adjusted_need_mm, forecast_rain / 2)
        water_mm = max(0, (adjusted_need_mm * (moisture_deficit / 60)) - rain_offset_mm)
        reasoning = (
            f"Soil moisture is {moisture}% (target ~60%). Adjusted crop water demand is "
            f"{adjusted_need_mm:.1f}mm/day at {temp}°C. Forecast rain offset "
            f"{rain_offset_mm:.1f}mm from the recommended amount."
        )
        # Compare against naive fixed-schedule irrigation (assume 8mm/day flat baseline)
        naive_baseline_mm = 8.0
        savings = round(max(0, (1 - water_mm / naive_baseline_mm)) * 100, 1)

    water_liters = round(water_mm * LITERS_PER_MM_PER_HECTARE * area, 1)
    optimal_time = "Early morning (5–7 AM)" if should_irrigate else "N/A"

    return {
        "should_irrigate": should_irrigate,
        "recommended_water_liters": water_liters,
        "optimal_time": optimal_time,
        "water_savings_percent": savings,
        "reasoning": reasoning,
    }
