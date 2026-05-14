package com.carscrap.auth_service.Dto.Staff;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StaffIdResponseDto {
    private List<Long> id;
}
