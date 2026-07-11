# Farm Twin AI — ML Service

FastAPI microservice exposing the five prediction/recommendation models.

## Run locally

```bash
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Interactive API docs: http://localhost:8000/docs

## Structure

```
app/
├── main.py          FastAPI app + route definitions
├── schemas.py        Pydantic request/response models
└── models/
    ├── yield_model.py
    ├── disease_model.py
    ├── irrigation_model.py
    ├── profit_model.py
    └── crop_model.py
```

## Swapping in a trained model

Every file in `app/models/` currently uses an explainable, rule-based
approach so the service works with zero datasets. Each file's docstring
explains exactly what a trained-model replacement should look like — the
function signature (`dict in -> dict out`) stays the same, so no changes
are needed in `main.py`, `schemas.py`, or the Spring Boot backend.

Typical swap:
```python
import joblib
_model = joblib.load("yield_model.pkl")

def predict_yield(data: dict) -> dict:
    features = [[data["farm_area_hectares"], data["soil_ph"], ...]]
    prediction = _model.predict(features)[0]
    return {"predicted_yield_tons": prediction, ...}
```
