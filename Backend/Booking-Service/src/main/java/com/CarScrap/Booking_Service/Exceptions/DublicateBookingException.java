package com.CarScrap.Booking_Service.Exceptions;

public class DublicateBookingException extends RuntimeException{
    public DublicateBookingException(String message){
        super(message);
    }
}
