package com.CarScrap.Booking_Service.Dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserAppointmentCancel {
    @NotNull
    private Long id;
    private String reason;

}
