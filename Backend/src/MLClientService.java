package com.farmtwin.service;

import com.farmtwin.dto.Requests.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

/**
 * Proxies validated requests from Farm Twin's REST controllers to the
 * Python FastAPI ML microservice, translating Java camelCase fields to
 * the snake_case keys expected by the ML service's Pydantic schemas.
 */
@Service
public class MLClientService {

    private final WebClient webClient;

    @Autowired
    public MLClientService(WebClient mlServiceWebClient) {
        this.webClient = mlServiceWebClient;
    }

    public Mono<Map> predictYield(YieldRequest req) {
        Map<String, Object> body = new HashMap<>();
        body.put("crop", req.crop());
        body.put("farm_area_hectares", req.farmAreaHectares());
        body.put("soil_ph", req.soilPh());
        body.put("avg_temperature_c", req.avgTemperatureC());
        body.put("avg_rainfall_mm", req.avgRainfallMm());
        body.put("fertilizer_kg_per_hectare", req.fertilizerKgPerHectare());
        return post("/predict/yield", body);
    }

    public Mono<Map> predictDiseaseRisk(DiseaseRequest req) {
        Map<String, Object> body = new HashMap<>();
        body.put("crop", req.crop());
        body.put("humidity_percent", req.humidityPercent());
        body.put("temperature_c", req.temperatureC());
        body.put("leaf_wetness_hours", req.leafWetnessHours() != null ? req.leafWetnessHours() : 0);
        body.put("recent_rainfall_mm", req.recentRainfallMm() != null ? req.recentRainfallMm() : 0);
        return post("/predict/disease-risk", body);
    }

    public Mono<Map> recommendIrrigation(IrrigationRequest req) {
        Map<String, Object> body = new HashMap<>();
        body.put("crop", req.crop());
        body.put("soil_moisture_percent", req.soilMoisturePercent());
        body.put("temperature_c", req.temperatureC());
        body.put("forecast_rain_mm_next_48h", req.forecastRainMmNext48h() != null ? req.forecastRainMmNext48h() : 0);
        body.put("farm_area_hectares", req.farmAreaHectares());
        return post("/recommend/irrigation", body);
    }

    public Mono<Map> estimateProfit(ProfitRequest req) {
        Map<String, Object> body = new HashMap<>();
        body.put("crop", req.crop());
        body.put("farm_area_hectares", req.farmAreaHectares());
        body.put("expected_yield_tons", req.expectedYieldTons());
        body.put("market_price_per_ton", req.marketPricePerTon());
        body.put("input_cost_total", req.inputCostTotal());
        return post("/estimate/profit", body);
    }

    public Mono<Map> recommendCrop(CropRequest req) {
        Map<String, Object> body = new HashMap<>();
        body.put("soil_ph", req.soilPh());
        body.put("nitrogen", req.nitrogen());
        body.put("phosphorus", req.phosphorus());
        body.put("potassium", req.potassium());
        body.put("avg_temperature_c", req.avgTemperatureC());
        body.put("avg_rainfall_mm", req.avgRainfallMm());
        body.put("region", req.region());
        return post("/recommend/crop", body);
    }

    private Mono<Map> post(String path, Map<String, Object> body) {
        return webClient.post()
                .uri(path)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(Map.class);
    }
}
