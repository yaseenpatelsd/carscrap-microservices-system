package com.CarScrap.Booking_Service.FeignCommunication;


import com.CarScrap.Booking_Service.Exceptions.FeignError.BadRequestException;
import com.CarScrap.Booking_Service.Exceptions.FeignError.DownstreamServiceException;
import com.CarScrap.Booking_Service.Exceptions.FeignError.ResourceNotFoundException;
import com.CarScrap.Booking_Service.Exceptions.FeignError.UnauthorizedException;
import feign.Response;
import feign.codec.ErrorDecoder;
import jakarta.ws.rs.ForbiddenException;

public class CustomErrorDecoder implements ErrorDecoder {

    @Override
    public Exception decode(String methodKey, Response response) {

        int status = response.status();

        switch (status) {
            case 400:
                return new BadRequestException("Bad request from downstream service");

            case 401:
                return new UnauthorizedException("Unauthorized access to service");

            case 403:
                return new ForbiddenException("Forbidden from downstream service");

            case 404:
                return new ResourceNotFoundException("Resource not found in service");

            case 500:
                return new DownstreamServiceException("Internal error in downstream service");

            default:
                return new DownstreamServiceException("Unexpected error: " + status);
        }
    }
}