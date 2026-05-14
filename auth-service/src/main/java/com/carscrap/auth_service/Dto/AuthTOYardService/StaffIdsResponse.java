package com.carscrap.auth_service.Dto.AuthTOYardService;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StaffIdsResponse {
    private List<Long> id;
}
