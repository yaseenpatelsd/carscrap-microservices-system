package com.CarScrap.Booking_Service.Exceptions.FeignError;

public class ForbiddenException extends RuntimeException{
    public ForbiddenException(String message){
        super(message);
    }
}
