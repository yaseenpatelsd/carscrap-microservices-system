package com.CarScrap.Booking_Service.Exceptions;

public class AppointmentDoesNotExistException extends RuntimeException{
    public AppointmentDoesNotExistException(String message){
        super(message);
    }
}
