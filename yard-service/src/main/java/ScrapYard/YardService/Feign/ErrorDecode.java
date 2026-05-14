package ScrapYard.YardService.Feign;


import ScrapYard.YardService.Dto.GlobalResponseDto;
import ScrapYard.YardService.Exeptions.CarServiceException;
import ScrapYard.YardService.Exeptions.AuthServiceExceptions;
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

        GlobalResponseDto errorResponse = null;

        try {
            if (response.body() != null) {
                InputStream body = response.body().asInputStream();
                errorResponse = mapper.readValue(body, GlobalResponseDto.class);
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

        if (methodKey.contains("AuthFeign")) {
            return new AuthServiceExceptions(status, message);
        }

        // fallback
        return new RuntimeException("Feign error: " + message);
    }
}