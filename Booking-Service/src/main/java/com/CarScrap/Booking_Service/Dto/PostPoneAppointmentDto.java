package com.CarScrap.Booking_Service.Dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostPoneAppointmentDto {
    @NotNull
    private Long appointmentId;
    @NotNull
    private LocalDate date;
}
