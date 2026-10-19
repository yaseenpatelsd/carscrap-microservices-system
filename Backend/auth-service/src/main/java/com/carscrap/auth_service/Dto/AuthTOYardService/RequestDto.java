package com.carscrap.auth_service.Dto.AuthTOYardService;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RequestDto {
    @NotNull(message = "StaffID required to process this api")

    private Long adminId;
}
