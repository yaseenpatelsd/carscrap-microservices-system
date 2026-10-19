package com.CarScrap.Booking_Service.Dto.AuthComminication;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StaffResponseDto {
    private Boolean valid;
    private String username;
}
