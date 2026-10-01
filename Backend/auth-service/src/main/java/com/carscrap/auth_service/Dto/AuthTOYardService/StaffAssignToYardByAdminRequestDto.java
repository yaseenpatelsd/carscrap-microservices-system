package com.carscrap.auth_service.Dto.AuthTOYardService;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StaffAssignToYardByAdminRequestDto {
    @NotNull
    private Long staffId;
    @NotNull
    private Long yardId;
}
