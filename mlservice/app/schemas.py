from pydantic import BaseModel, Field
from typing import List, Optional


# ---------- Yield Prediction ----------
class YieldRequest(BaseModel):
    crop: str = Field(..., example="wheat")
    farm_area_hectares: float = Field(..., gt=0, example=2.5)
    soil_ph: float = Field(..., ge=0, le=14, example=6.5)
    avg_temperature_c: float = Field(..., example=27.0)
    avg_rainfall_mm: float = Field(..., example=850.0)
    fertilizer_kg_per_hectare: Optional[float] = Field(default=50.0)


class YieldResponse(BaseModel):
    predicted_yield_tons: float
    yield_per_hectare: float
    confidence: float
    notes: str


# ---------- Disease Risk ----------
class DiseaseRequest(BaseModel):
    crop: str
    humidity_percent: float = Field(..., ge=0, le=100)
    temperature_c: float
    leaf_wetness_hours: float = Field(default=0, ge=0, le=24)
    recent_rainfall_mm: float = Field(default=0)


class DiseaseResponse(BaseModel):
    risk_level: str  # Low / Medium / High / Critical
    risk_score: float
    likely_diseases: List[str]
    recommendation: str


# ---------- Irrigation ----------
class IrrigationRequest(BaseModel):
    crop: str
    soil_moisture_percent: float = Field(..., ge=0, le=100)
    temperature_c: float
    forecast_rain_mm_next_48h: float = Field(default=0)
    farm_area_hectares: float = Field(..., gt=0)


class IrrigationResponse(BaseModel):
    should_irrigate: bool
    recommended_water_liters: float
    optimal_time: str
    water_savings_percent: float
    reasoning: str


# ---------- Profit Estimation ----------
class ProfitRequest(BaseModel):
    crop: str
    farm_area_hectares: float = Field(..., gt=0)
    expected_yield_tons: float = Field(..., gt=0)
    market_price_per_ton: float = Field(..., gt=0)
    input_cost_total: float = Field(..., ge=0)


class ProfitResponse(BaseModel):
    gross_revenue: float
    total_cost: float
    net_profit: float
    profit_margin_percent: float
    breakeven_yield_tons: float


# ---------- Crop Recommendation ----------
class CropRequest(BaseModel):
    soil_ph: float = Field(..., ge=0, le=14)
    nitrogen: float = Field(..., ge=0)
    phosphorus: float = Field(..., ge=0)
    potassium: float = Field(..., ge=0)
    avg_temperature_c: float
    avg_rainfall_mm: float
    region: Optional[str] = None


class CropResponse(BaseModel):
    recommended_crops: List[str]
    top_choice: str
    suitability_score: float
    reasoning: str
