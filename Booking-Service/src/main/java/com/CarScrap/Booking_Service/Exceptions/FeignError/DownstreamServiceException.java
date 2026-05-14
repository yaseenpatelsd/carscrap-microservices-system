package com.CarScrap.Booking_Service.Exceptions.FeignError;

public class DownstreamServiceException extends RuntimeException{
    public DownstreamServiceException(String message){
        super(message);
    }
}
