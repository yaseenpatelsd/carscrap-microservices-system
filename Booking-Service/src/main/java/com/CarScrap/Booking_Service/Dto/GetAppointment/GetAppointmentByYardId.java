package com.CarScrap.Booking_Service.Dto.GetAppointment;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetAppointmentByYardId {
    @NotNull
    private Long yardId;
}
