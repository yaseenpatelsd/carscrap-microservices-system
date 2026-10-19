package com.CarScrap.Booking_Service.Mapping;

import com.CarScrap.Booking_Service.Dto.RequestDto;
import com.CarScrap.Booking_Service.Dto.ResponseDto;
import com.CarScrap.Booking_Service.Entity.AppointmentBookingEntity;
import com.CarScrap.Booking_Service.Enum.Principal;

public class AppointmentBookingMapping {
    public static AppointmentBookingEntity toEntity(RequestDto dto){
        if (dto==null)return null;


        AppointmentBookingEntity entity=new AppointmentBookingEntity();
        entity.setCarDetailId(dto.getCarDetailId());
        entity.setYardId(dto.getYardId());
        entity.setDateOfAppointment(dto.getDateOfAppointment());
        entity.setUserMobileNo(dto.getMobileNo());

        return entity;
    }

    public static ResponseDto toResponse(AppointmentBookingEntity entity){
        if (entity==null)return  null;


        ResponseDto responseDto=new ResponseDto();
        responseDto.setId(entity.getId());
        responseDto.setCarDetailsId(entity.getCarDetailId());
        responseDto.setUserName(entity.getUsername());
        responseDto.setStaffUsername(entity.getStaffUsername());
        responseDto.setDateOfAppointment(entity.getDateOfAppointment());
        responseDto.setStatus(entity.getStatus());
        responseDto.setUserMobileNo(entity.getUserMobileNo());

        return responseDto;
    }
}
