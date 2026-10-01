package com.CarScrap.Booking_Service.Exceptions;

public class StaffAlreadyAssignToAppointmentExcepttion extends RuntimeException{
    public StaffAlreadyAssignToAppointmentExcepttion(String message){
        super(message);
    }
}
