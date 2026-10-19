package com.CarScrap.Booking_Service.Dto.YardCommunication;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.LinkedList;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StaffVerifyResponseDto {
    private Boolean valid;
    private Long adminId;
}
