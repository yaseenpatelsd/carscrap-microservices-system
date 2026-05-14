package com.CarScrap.Booking_Service.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingDetailsResponseDto {

    private String carname;
    private String expireYear;
    private String yardName;
    private String city;
}
