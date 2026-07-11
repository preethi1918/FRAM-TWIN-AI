"""
Profit Estimation Model
--------------------------
Straightforward financial calculation. This one doesn't need ML — it's
deterministic arithmetic — but is kept in the same models/ pattern for
consistency and so it can later incorporate price-forecasting ML models
(e.g. predicting market_price_per_ton from historical commodity data).
"""


def estimate_profit(data: dict) -> dict:
    yield_tons = data["expected_yield_tons"]
    price = data["market_price_per_ton"]
    cost = data["input_cost_total"]

    gross_revenue = yield_tons * price
    net_profit = gross_revenue - cost
    margin = (net_profit / gross_revenue * 100) if gross_revenue > 0 else 0.0
    breakeven_yield = (cost / price) if price > 0 else 0.0

    return {
        "gross_revenue": round(gross_revenue, 2),
        "total_cost": round(cost, 2),
        "net_profit": round(net_profit, 2),
        "profit_margin_percent": round(margin, 2),
        "breakeven_yield_tons": round(breakeven_yield, 2),
    }
