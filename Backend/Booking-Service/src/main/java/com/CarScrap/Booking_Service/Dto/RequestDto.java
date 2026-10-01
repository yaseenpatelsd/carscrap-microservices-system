package com.CarScrap.Booking_Service.Dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RequestDto {
    @NotNull
    private Long carDetailId;
    @NotNull
    private Long yardId;
    @NotNull
    private LocalDate dateOfAppointment;
    @NotBlank
    private String mobileNo;
}
