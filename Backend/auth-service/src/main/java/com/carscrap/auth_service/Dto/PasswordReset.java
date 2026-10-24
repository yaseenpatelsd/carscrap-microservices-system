package com.carscrap.auth_service.Dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PasswordReset {
    @NotBlank
    private String username;
    @NotBlank
    @Size(min = 6,max = 6)
    private String otp;
    @NotBlank
    private String password;
}
