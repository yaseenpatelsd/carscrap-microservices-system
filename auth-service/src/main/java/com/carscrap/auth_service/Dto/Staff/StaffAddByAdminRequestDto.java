package com.carscrap.auth_service.Dto.Staff;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StaffAddByAdminRequestDto {
    @NotBlank
    private String username;
    @NotBlank
    private String password;
    @NotBlank
    private String email;
}
