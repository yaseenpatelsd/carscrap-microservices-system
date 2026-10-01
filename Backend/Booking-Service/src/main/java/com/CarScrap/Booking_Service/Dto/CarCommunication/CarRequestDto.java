package com.CarScrap.Booking_Service.Dto.CarCommunication;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CarRequestDto {
    @NotNull
    private Long carDetailId;
    private Long userId;
}
