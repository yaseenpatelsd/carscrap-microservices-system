package com.CarScrap.Booking_Service.Exceptions.FeignError;

public class ResourceNotFoundException extends RuntimeException{
    public ResourceNotFoundException(String message){
        super(message);
    }
}
