package com.CarScrap.Dto.AppointmentCommunication;

import com.CarScrap.Enum.FuelType;
import com.CarScrap.Enum.VehicleType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CarResposeDto {

    private String name;
    private Integer registrationYear;
    private VehicleType vehicleType;
    private Long dateOfExpire;
    private FuelType fuelType;
    private BigDecimal estimatePrice;
    private Boolean isValid;
    private String city;

}
