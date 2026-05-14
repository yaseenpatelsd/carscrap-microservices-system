package com.carscrap.auth_service.EventBase;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterEvent {
private String email;
private String otp;
}
