package com.CarScrap.Booking_Service.Exceptions;

public class EmailNotFoundException extends RuntimeException{
    public EmailNotFoundException(String message){
        super(message);
    }
}
