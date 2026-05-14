package com.carscrap.auth_service.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminFlowResponseDto {
    private Long id;
    private String username;
    private String password;
    private String email;

    private String note;
}
