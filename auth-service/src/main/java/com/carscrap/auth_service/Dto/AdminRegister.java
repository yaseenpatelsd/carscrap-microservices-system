package com.carscrap.auth_service.Dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminRegister {
    @NotBlank
    private String username;
    @NotBlank
    private String password;
    @NotBlank
    @Email
    private String email;
}
