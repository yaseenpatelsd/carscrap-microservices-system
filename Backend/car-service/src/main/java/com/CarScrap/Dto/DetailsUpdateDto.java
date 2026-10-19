package com.CarScrap.Dto;

import com.CarScrap.Enum.City;
import com.CarScrap.Enum.FuelType;
import com.CarScrap.Enum.VehicleType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DetailsUpdateDto {
    @NotNull
    private Long id;

    private String name;
    @Min(1950)
    @Max(2030)

    private Integer registrationYear;

    private VehicleType vehicleType;

    private FuelType fuelType;

    private City city;
}
