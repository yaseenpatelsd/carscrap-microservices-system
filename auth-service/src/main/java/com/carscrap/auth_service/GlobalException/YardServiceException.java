package com.carscrap.auth_service.GlobalException;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class YardServiceException extends RuntimeException {
    private int status;
    private String message;
}
