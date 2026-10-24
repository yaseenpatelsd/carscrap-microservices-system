package com.CarScrap.Booking_Service.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ManagementAppointmentCancelDto {
    private Long id;
    private String reason;
}
