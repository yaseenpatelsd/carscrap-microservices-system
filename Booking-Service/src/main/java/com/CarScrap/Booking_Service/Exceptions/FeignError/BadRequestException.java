package com.CarScrap.Booking_Service.Exceptions.FeignError;

public class BadRequestException extends RuntimeException{
    public BadRequestException(String message){
        super(message);
    }
}
