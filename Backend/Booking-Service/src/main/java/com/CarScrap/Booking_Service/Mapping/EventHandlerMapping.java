package com.CarScrap.Booking_Service.Mapping;

import com.CarScrap.Booking_Service.Dto.EmailCommunication.BookingRequestDto;
import com.CarScrap.Booking_Service.EventBase.EmailEvent;

public class EventHandlerMapping {


        public static EmailEvent toEmailEvent(BookingRequestDto dto) {
            EmailEvent event = new EmailEvent();

            // user info
            event.setUsername(dto.getUsername());
            event.setEmail(dto.getEmail());

            // car details
            event.setName(dto.getName());
            event.setRegistrationYear(dto.getRegistrationYear());
            event.setVehicleType(dto.getVehicleType());
            event.setDateOfExpire(dto.getDateOfExpire());
            event.setFuelType(dto.getFuelType());
            event.setEstimatePrice(dto.getEstimatePrice());

            // booking details
            event.setBookingId(dto.getBookingId());
            event.setDateOfAppointment(dto.getDateOfAppointment());
            event.setStatus(dto.getStatus());

            return event;
        }
         public static BookingRequestDto toBookingRequestDto(EmailEvent dto) {
            BookingRequestDto event = new BookingRequestDto();

            // user info
            event.setUsername(dto.getUsername());
            event.setEmail(dto.getEmail());

            // car details
            event.setName(dto.getName());
            event.setRegistrationYear(dto.getRegistrationYear());
            event.setVehicleType(dto.getVehicleType());
            event.setDateOfExpire(dto.getDateOfExpire());
            event.setFuelType(dto.getFuelType());
            event.setEstimatePrice(dto.getEstimatePrice());

            // booking details
            event.setBookingId(dto.getBookingId());
            event.setDateOfAppointment(dto.getDateOfAppointment());
            event.setStatus(dto.getStatus());

            return event;
        }



}
