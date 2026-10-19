package com.CarScrap.Booking_Service.Dto;

import com.CarScrap.Booking_Service.Enum.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChangeStatusDto {
    private Long appointmemtId;
    private Status status;
}
