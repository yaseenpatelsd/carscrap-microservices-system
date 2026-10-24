package com.CarScrap.Booking_Service.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class GetAppointmentFromDateAToBRequestForAdminDto {
    private LocalDate start;
    private LocalDate ends;
}
