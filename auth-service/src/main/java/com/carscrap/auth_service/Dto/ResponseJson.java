package com.carscrap.auth_service.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponseJson {
    private String message;
    private LocalDateTime timestamp;
}
