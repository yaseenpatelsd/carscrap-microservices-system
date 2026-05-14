package com.carscrap.auth_service.Dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LogInDto {
    @NotBlank(message = "Username required")
    private String username;
    @NotBlank(message = "Password required")
    private String password;
}
