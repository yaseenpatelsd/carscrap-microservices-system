package com.CarScrap.Booking_Service.Exceptions;

public class CantCancelException extends RuntimeException{
    public CantCancelException(String message){
        super(message);
    }
}
