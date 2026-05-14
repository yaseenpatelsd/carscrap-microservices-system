package com.carscrap.auth_service.Dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PasswordResetOtpRequestDto {
    @NotBlank
   private String otp;
    @NotBlank
    @Email
   private String email;
}
