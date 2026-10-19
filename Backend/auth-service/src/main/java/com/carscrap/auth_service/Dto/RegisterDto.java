package com.carscrap.auth_service.Dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterDto {
    @NotBlank(message = "Username required")
    @Size(min = 4 ,max = 15,message ="username should be at least 4 digit" )
    private String username;
    @NotBlank(message = "password  required")
    @Size(min = 8 ,max = 60,message ="Password should be at least 8 digit and under 60 digits" )
    private String password;
    @NotBlank(message = "Email required for register")
    @Email(message = "Invalid email")
    private String email;
}
