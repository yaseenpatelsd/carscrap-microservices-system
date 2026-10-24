package com.CarScrap.Dto;

import com.CarScrap.Enum.City;
import com.CarScrap.Enum.FuelType;
import com.CarScrap.Enum.VehicleType;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class RequestDto {

    @NotBlank
    private String name;
   @Min(1950)
   @Max(2030)
    @NotNull
    private Integer registrationYear;
    @NotNull
    private String vehicleType;
    @NotNull
    private String fuelType;
    @NotNull
    private String city;
}
