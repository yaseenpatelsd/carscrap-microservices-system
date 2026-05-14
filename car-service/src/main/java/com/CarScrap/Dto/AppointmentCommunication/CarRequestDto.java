package com.CarScrap.Dto.AppointmentCommunication;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CarRequestDto {
    private Long carDetailId;
    private Long userId;
}
