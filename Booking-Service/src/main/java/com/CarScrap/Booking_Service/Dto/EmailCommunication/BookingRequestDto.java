package com.CarScrap.Booking_Service.Dto.EmailCommunication;

import com.CarScrap.Booking_Service.Enum.FuelType;
import com.CarScrap.Booking_Service.Enum.Status;
import com.CarScrap.Booking_Service.Enum.VehicleType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingRequestDto {

    //username
    private String username;
    private String email;

    //cardetials
    private String name;
    private Integer registrationYear;
    private VehicleType vehicleType;
    private Long dateOfExpire;
    private FuelType fuelType;
    private BigDecimal estimatePrice;

    //booking
    private Long bookingId;
    private LocalDate dateOfAppointment;
    private Status status;
}
