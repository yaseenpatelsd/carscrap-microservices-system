package com.carscrap.auth_service.Dto.AuthTOYardService;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponseDto {

    private Boolean valid;
    private String username;
}
