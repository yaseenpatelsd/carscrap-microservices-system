package com.CarScrap.Enum;


public enum VehicleType {
    HATCHBACK(800),
    SEDAN(1100),
    SUV(1500);

    private final double avgWeightKg;

    VehicleType(double avgWeightKg){
        this.avgWeightKg=avgWeightKg;
    }

    public double getAvgWeightKg(){
        return avgWeightKg;
    }
}
