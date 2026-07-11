package com.farmtwin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

/**
 * Request DTOs for the five Farm Twin AI features.
 * Grouped in one file for brevity — split into individual files as the API grows.
 */
public class Requests {

    public record YieldRequest(
            @NotBlank String crop,
            @Positive double farmAreaHectares,
            double soilPh,
            double avgTemperatureC,
            double avgRainfallMm,
            Double fertilizerKgPerHectare
    ) {}

    public record DiseaseRequest(
            @NotBlank String crop,
            double humidityPercent,
            double temperatureC,
            Double leafWetnessHours,
            Double recentRainfallMm
    ) {}

    public record IrrigationRequest(
            @NotBlank String crop,
            double soilMoisturePercent,
            double temperatureC,
            Double forecastRainMmNext48h,
            @Positive double farmAreaHectares
    ) {}

    public record ProfitRequest(
            @NotBlank String crop,
            @Positive double farmAreaHectares,
            @Positive double expectedYieldTons,
            @Positive double marketPricePerTon,
            @PositiveOrZero double inputCostTotal
    ) {}

    public record CropRequest(
            double soilPh,
            @PositiveOrZero double nitrogen,
            @PositiveOrZero double phosphorus,
            @PositiveOrZero double potassium,
            double avgTemperatureC,
            double avgRainfallMm,
            String region
    ) {}
}
