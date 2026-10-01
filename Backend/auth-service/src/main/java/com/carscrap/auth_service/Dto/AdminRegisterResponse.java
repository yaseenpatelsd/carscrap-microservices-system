package com.carscrap.auth_service.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminRegisterResponse {
    private String username;
    private String password;
    private String email;

}
