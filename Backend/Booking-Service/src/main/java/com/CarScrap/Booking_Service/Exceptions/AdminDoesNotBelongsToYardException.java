package com.CarScrap.Booking_Service.Exceptions;

public class AdminDoesNotBelongsToYardException extends RuntimeException{
    public AdminDoesNotBelongsToYardException(String message){
        super(message);
    }
}
