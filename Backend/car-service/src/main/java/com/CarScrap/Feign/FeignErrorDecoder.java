package com.CarScrap.Feign;

import com.CarScrap.Exception.CarServiceExeption;
import feign.Response;
import feign.codec.ErrorDecoder;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

public class FeignErrorDecoder implements ErrorDecoder {
    @Override
    public Exception decode(String methodKey, Response response) {

        String message = "Unknown error";

        try (InputStream body = response.body().asInputStream()) {
            message = new String(body.readAllBytes(), StandardCharsets.UTF_8);
        } catch (IOException ignored) {}

        return new CarServiceExeption(response.status(), message);
    }
}
