package com.farmtwin.model;

public class YieldRequest {

    private String crop;
    private double farmArea;
    private double soilPH;
    private double avgTemperature;
    private double avgRainfall;
    private double fertilizer;

    public String getCrop() {
        return crop;
    }

    public void setCrop(String crop) {
        this.crop = crop;
    }

    public double getFarmArea() {
        return farmArea;
    }

    public void setFarmArea(double farmArea) {
        this.farmArea = farmArea;
    }

    public double getSoilPH() {
        return soilPH;
    }

    public void setSoilPH(double soilPH) {
        this.soilPH = soilPH;
    }

    public double getAvgTemperature() {
        return avgTemperature;
    }

    public void setAvgTemperature(double avgTemperature) {
        this.avgTemperature = avgTemperature;
    }

    public double getAvgRainfall() {
        return avgRainfall;
    }

    public void setAvgRainfall(double avgRainfall) {
        this.avgRainfall = avgRainfall;
    }

    public double getFertilizer() {
        return fertilizer;
    }

    public void setFertilizer(double fertilizer) {
        this.fertilizer = fertilizer;
    }
}
