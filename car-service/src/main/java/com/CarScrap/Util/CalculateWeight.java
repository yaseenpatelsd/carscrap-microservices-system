package com.CarScrap.Util;

import com.CarScrap.Entity.CarEntity;
import org.springframework.stereotype.Component;

@Component
public class CalculateWeight {

    public double calculateWeight(CarEntity car) {
        return car.getVehicleType().getAvgWeightKg();
    }
}
