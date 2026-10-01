package com.CarScrap.Booking_Service.Dto;

import com.CarScrap.Booking_Service.Enum.Status;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChangeStatusByManagement {
    @NotNull
    private Long appointmentId;
    @NotEmpty
    private Status status;
}

