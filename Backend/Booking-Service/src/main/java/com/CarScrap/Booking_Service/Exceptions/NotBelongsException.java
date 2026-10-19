package com.CarScrap.Booking_Service.Exceptions;

public class NotBelongsException extends RuntimeException{
    public NotBelongsException(String message){
        super(message);
    }
}
