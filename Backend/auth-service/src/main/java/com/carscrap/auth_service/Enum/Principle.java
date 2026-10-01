package com.carscrap.auth_service.Enum;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Principle {
    private Long id;
    private String username;
    private String role;
}
