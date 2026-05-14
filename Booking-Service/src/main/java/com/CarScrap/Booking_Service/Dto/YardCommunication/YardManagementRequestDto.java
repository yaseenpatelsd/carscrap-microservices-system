package com.CarScrap.Booking_Service.Dto.YardCommunication;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class YardManagementRequestDto {
    @NotNull
    private Long yardId;
    private Long managementId;

}
