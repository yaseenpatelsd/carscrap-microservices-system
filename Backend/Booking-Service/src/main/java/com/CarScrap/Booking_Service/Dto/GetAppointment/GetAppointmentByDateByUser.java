package com.CarScrap.Booking_Service.Dto.GetAppointment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetAppointmentByDateByUser {
    private LocalDate date;
}
