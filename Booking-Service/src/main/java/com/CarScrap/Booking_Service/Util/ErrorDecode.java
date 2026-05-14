package com.CarScrap.Booking_Service.Util;

import com.CarScrap.Booking_Service.Dto.GEResponse;
import com.CarScrap.Booking_Service.Exceptions.CarServiceException;
import com.CarScrap.Booking_Service.Exceptions.YardServiceException;
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

        GEResponse errorResponse = null;

        try {
            if (response.body() != null) {
                InputStream body = response.body().asInputStream();
                errorResponse = mapper.readValue(body, GEResponse.class);
            }
        } catch (Exception e) {
            return new RuntimeException("Failed to parse error response");
        }

        String message = (errorResponse != null && errorResponse.getMessage() != null)
                ? errorResponse.getMessage()
                : "Unknown error";

        int status = response.status();

        // 🔥 Decide exception based on service (optional but powerful)
        if (methodKey.contains("CarFeign")) {
            return new CarServiceException(status, message);
        }

        if (methodKey.contains("YardFeign")) {
            return new YardServiceException(status, message);
        }

        // fallback
        return new RuntimeException("Feign error: " + message);
    }
}