package com.CarScrap.Booking_Service.Exceptions;

public class CarDetailsNotFound extends RuntimeException{
    public CarDetailsNotFound(String message){
        super(message);
    }
}
