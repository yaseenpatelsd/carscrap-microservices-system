package com.carscrap.auth_service.Dto.AuthTOYardService;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetStaffByIdsResponse {
        private Long id;
        private String username;
        private String email;

}
