package com.CarScrap.Booking_Service.Exceptions;

public class StaffDoesNotExist extends RuntimeException{
    public StaffDoesNotExist(String message){
        super(message);
    }
}
