package com.CarScrap.Dto;

import com.CarScrap.Enum.City;
import com.CarScrap.Enum.FuelType;
import com.CarScrap.Enum.VehicleType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponseDto {

    private Long id;
    private String name;
    private Integer registrationYear;
    private VehicleType vehicleType;
    private Long dateOfExpire;
    private FuelType fuelType;
    private City city;
    private BigDecimal estimatePrice;
    private Boolean eligible=true;

}
