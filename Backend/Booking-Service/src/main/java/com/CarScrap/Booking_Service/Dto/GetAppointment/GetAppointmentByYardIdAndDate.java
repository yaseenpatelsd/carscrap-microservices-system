package com.CarScrap.Booking_Service.Dto.GetAppointment;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetAppointmentByYardIdAndDate {
    @NotNull(message = "Yard Id is require to process this task")
    private Long yardId;

    private LocalDate start;
    private LocalDate ends;
}
