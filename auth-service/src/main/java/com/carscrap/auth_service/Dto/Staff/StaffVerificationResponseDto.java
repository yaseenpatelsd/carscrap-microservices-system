package com.carscrap.auth_service.Dto.Staff;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StaffVerificationResponseDto {
    private Boolean valid;
    private String username;

}
