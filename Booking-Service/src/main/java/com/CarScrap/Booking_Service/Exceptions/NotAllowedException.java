package com.CarScrap.Booking_Service.Exceptions;

public class NotAllowedException extends RuntimeException{
    public NotAllowedException(String message){
        super(message);
    }
}
