package com.CarScrap.Booking_Service.Mapping;

import com.CarScrap.Booking_Service.Dto.EmailCommunication.StatusUpdateDto;
import com.CarScrap.Booking_Service.Dto.EmailCommunication.PostPoneAppointmentDto;
import com.CarScrap.Booking_Service.EventBase.PostPoneEmailHandler;

public class PostponeEmailHandlingMapping {

    public static PostPoneEmailHandler mapToPostponeEmailHandler(PostPoneAppointmentDto dto){
        if (dto == null) return null;

        PostPoneEmailHandler handler = new PostPoneEmailHandler();

        handler.setAppointmentId(dto.getAppointmentId());
        handler.setUsername(dto.getUsername());
        handler.setEmail(dto.getEmail());
        handler.setCarName(dto.getCarName());
        handler.setRegistrationYear(dto.getRegistrationYear());
        handler.setFuelType(dto.getFuelType());
        handler.setDateOfExpire(dto.getDateOfExpire());
        handler.setVehicleType(dto.getVehicleType());
        handler.setEstimatePrice(dto.getEstimatePrice());
        handler.setStatus(dto.getStatus());

        return handler;
    }

    public static PostPoneAppointmentDto mapToStatusUpdateDto(PostPoneEmailHandler handler){
        if (handler == null) return null;

        PostPoneAppointmentDto dto = new PostPoneAppointmentDto();

        dto.setAppointmentId(handler.getAppointmentId());
        dto.setUsername(handler.getUsername());
        dto.setEmail(handler.getEmail());
        dto.setCarName(handler.getCarName());
        dto.setRegistrationYear(handler.getRegistrationYear());
        dto.setFuelType(handler.getFuelType());
        dto.setDateOfExpire(handler.getDateOfExpire());
        dto.setVehicleType(handler.getVehicleType());
        dto.setEstimatePrice(handler.getEstimatePrice());
        dto.setStatus(handler.getStatus());

        return dto;
    }
}
