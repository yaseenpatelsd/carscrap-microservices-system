package com.CarScrap.Booking_Service.Dto.GetAppointment;

import com.CarScrap.Booking_Service.Enum.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetAppointmentByStatus {
    private Status status;
}
