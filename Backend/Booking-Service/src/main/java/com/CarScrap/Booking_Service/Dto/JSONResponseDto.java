package com.CarScrap.Booking_Service.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JSONResponseDto {
    private String message;
    private LocalDateTime stamp;
}
