package com.carscrap.auth_service.Dto.Staff;

import com.carscrap.auth_service.Enum.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StaffResponse {
    private Long id;
    private String username;
    private String password;
    private String email;
    private UserRole role;

}
