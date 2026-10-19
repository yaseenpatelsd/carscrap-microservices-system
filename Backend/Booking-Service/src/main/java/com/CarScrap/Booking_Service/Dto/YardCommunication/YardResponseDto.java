package com.CarScrap.Booking_Service.Dto.YardCommunication;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class YardResponseDto {
    private Boolean isValid;
    private String yardName;
    private Long adminId;
}
