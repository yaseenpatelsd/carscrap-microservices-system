package com.CarScrap.Booking_Service.Dto;

import com.CarScrap.Booking_Service.Enum.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResponseDto {
    private Long id;
    private String userName;
    private Long carDetailsId;
    private String staffUsername;
    private LocalDate dateOfAppointment;
    private Status status;
    private String userMobileNo;

}
