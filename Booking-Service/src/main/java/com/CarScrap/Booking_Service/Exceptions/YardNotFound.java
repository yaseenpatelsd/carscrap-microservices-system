package com.CarScrap.Booking_Service.Exceptions;

public class YardNotFound extends RuntimeException{
    public YardNotFound (String message){
        super(message);
    }
}
