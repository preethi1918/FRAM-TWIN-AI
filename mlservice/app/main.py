"""
Farm Twin AI - ML Microservice
--------------------------------
FastAPI service exposing prediction endpoints for the five core features:
  1. Yield Prediction
  2. Disease Risk Prediction
  3. Smart Irrigation Recommendation
  4. Profit Estimation
  5. Crop Recommendation

NOTE: The models in app/models/*.py are lightweight, explainable
placeholder implementations (rule-based + simple regression) so the
service runs out-of-the-box with zero external datasets. Swap in
trained scikit-learn / TensorFlow models by following the same
function signatures (see each model file's docstring).
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.models.yield_model import predict_yield
from app.models.disease_model import predict_disease_risk
from app.models.irrigation_model import recommend_irrigation
from app.models.profit_model import estimate_profit
from app.models.crop_model import recommend_crop

from app.schemas import (
    YieldRequest, YieldResponse,
    DiseaseRequest, DiseaseResponse,
    IrrigationRequest, IrrigationResponse,
    ProfitRequest, ProfitResponse,
    CropRequest, CropResponse,
)

app = FastAPI(
    title="Farm Twin AI - ML Service",
    description="Prediction and recommendation microservice for Farm Twin AI",
    version="1.0.0",
)

# Allow the Spring Boot backend (and local dev frontend) to call this service
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "farm-twin-ml-service"}


@app.post("/predict/yield", response_model=YieldResponse)
def yield_prediction(payload: YieldRequest):
    result = predict_yield(payload.dict())
    return result


@app.post("/predict/disease-risk", response_model=DiseaseResponse)
def disease_risk_prediction(payload: DiseaseRequest):
    result = predict_disease_risk(payload.dict())
    return result


@app.post("/recommend/irrigation", response_model=IrrigationResponse)
def irrigation_recommendation(payload: IrrigationRequest):
    result = recommend_irrigation(payload.dict())
    return result


@app.post("/estimate/profit", response_model=ProfitResponse)
def profit_estimation(payload: ProfitRequest):
    result = estimate_profit(payload.dict())
    return result


@app.post("/recommend/crop", response_model=CropResponse)
def crop_recommendation(payload: CropRequest):
    result = recommend_crop(payload.dict())
    return result
