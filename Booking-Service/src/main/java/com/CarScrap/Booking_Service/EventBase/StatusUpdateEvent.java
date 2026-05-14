package com.CarScrap.Booking_Service.EventBase;

import com.CarScrap.Booking_Service.Enum.FuelType;
import com.CarScrap.Booking_Service.Enum.Status;
import com.CarScrap.Booking_Service.Enum.VehicleType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class StatusUpdateEvent {
    private Long appointmentId;
    private String email;
    private String username;


    private String carName;
    private Integer registrationYear;
    private VehicleType vehicleType;
    private Long dateOfExpire;
    private FuelType fuelType;
    private BigDecimal estimatePrice;
    private Status status;
}
