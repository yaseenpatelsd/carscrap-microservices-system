package com.carscrap.auth_service.Dto.Staff;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StaffGetByRoleResponseDto {
    private Long id;
    private String username;
    private String email;
}
