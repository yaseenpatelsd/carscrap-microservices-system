package com.carscrap.auth_service.FeignInterface;


import com.carscrap.auth_service.Dto.ExceptionHandlingResponseDto;
import com.carscrap.auth_service.GlobalException.EmailServiceException;
import com.carscrap.auth_service.GlobalException.YardServiceException;
import com.fasterxml.jackson.databind.ObjectMapper;
import feign.Response;
import feign.codec.ErrorDecoder;
import org.springframework.stereotype.Component;

import java.io.InputStream;

@Component
public class ErrorDecode implements ErrorDecoder {

    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public Exception decode(String methodKey, Response response) {

        ExceptionHandlingResponseDto errorResponse = null;

        try {
            if (response.body() != null) {
                InputStream body = response.body().asInputStream();
                errorResponse = mapper.readValue(body, ExceptionHandlingResponseDto.class);
            }
        } catch (Exception e) {
            return new RuntimeException("Failed to parse error response");
        }

        String message = (errorResponse != null && errorResponse.getMessage() != null)
                ? errorResponse.getMessage()
                : "Unknown error";

        int status = response.status();

        // 🔥 Decide exception based on service (optional but powerful)
        if (methodKey.contains("EmailFeign")) {
            return new EmailServiceException(status, message);
        }

        if (methodKey.contains("YardFeign")) {
            return new YardServiceException(status, message);
        }

        // fallback
        return new RuntimeException("Feign error: " + message);
    }
}
