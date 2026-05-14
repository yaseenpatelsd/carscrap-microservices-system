package com.CarScrap.Booking_Service.Exceptions.FeignError;

public class UnauthorizedException extends RuntimeException{
    public UnauthorizedException(String message){
        super(message);
    }
}
