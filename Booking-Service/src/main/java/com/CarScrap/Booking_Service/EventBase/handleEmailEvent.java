package com.CarScrap.Booking_Service.EventBase;

import com.CarScrap.Booking_Service.Dto.EmailCommunication.BookingRequestDto;
import com.CarScrap.Booking_Service.Dto.EmailCommunication.CancelRequestDto;
import com.CarScrap.Booking_Service.Dto.EmailCommunication.PostPoneAppointmentDto;
import com.CarScrap.Booking_Service.Dto.EmailCommunication.StatusUpdateDto;
import com.CarScrap.Booking_Service.Enum.FuelType;
import com.CarScrap.Booking_Service.Enum.Status;
import com.CarScrap.Booking_Service.Enum.VehicleType;
import com.CarScrap.Booking_Service.Exceptions.FeignError.BadRequestException;
import com.CarScrap.Booking_Service.Exceptions.FeignError.DownstreamServiceException;
import com.CarScrap.Booking_Service.FeignCommunication.EmailFeign;
import com.CarScrap.Booking_Service.Mapping.EventHandlerMapping;
import com.CarScrap.Booking_Service.Mapping.PostponeEmailHandlingMapping;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class handleEmailEvent {
    private final EmailFeign emailFeign;


    public handleEmailEvent(EmailFeign emailFeign) {
        this.emailFeign = emailFeign;
    }

    @Async
    @EventListener
    public void EmailEvent(EmailEvent event){

        BookingRequestDto bookingRequestDto= EventHandlerMapping.toBookingRequestDto(event);

        emailFeign.BookingRequestDto(bookingRequestDto);
    }


    @Async
    @EventListener
    public void PostPoneEmailEvent(PostPoneEmailHandler emailHandler){
        try {
            PostPoneAppointmentDto statusUpdateDto = PostponeEmailHandlingMapping.mapToStatusUpdateDto(emailHandler);

            emailFeign.postponeUpdate(statusUpdateDto);
        } catch (Exception e) {
        e.printStackTrace();
    }
    }
    @Async
    @EventListener
    public void CancelPostEvent(CancelEmailSenderEvent event){
        try {
            CancelRequestDto cancelRequestDto = new CancelRequestDto(event.getAppointmentId(),
                    event.getEmail(),
                    event.getUsername(),
                    event.getCarName(),
                    event.getRegistrationYear(),
                    event.getVehicleType(),
                    event.getDateOfExpire(),
                    event.getFuelType(),
                    event.getEstimatePrice(), event.getStatus(),
                    event.getReason()
            );
            emailFeign.cancelRequestDto(cancelRequestDto);
        }catch (Exception e){
            throw new BadRequestException("CAN'T REACH SEARVICE");
        }
    }

    @Async
    @EventListener
    public void CancelAppointmentbyManagementEvent(CancelAppointmentByManagementEvent event){
        try {
            CancelRequestDto cancelRequestDto = new CancelRequestDto(event.getAppointmentId(),
                    event.getEmail(),
                    event.getUsername(),
                    event.getCarName(),
                    event.getRegistrationYear(),
                    event.getVehicleType(),
                    event.getDateOfExpire(),
                    event.getFuelType(),
                    event.getEstimatePrice(), event.getStatus(),
                    event.getReason()
            );
            emailFeign.cancelRequestDto(cancelRequestDto);
        }catch (Exception e){
            throw new BadRequestException("CAN'T REACH SEARVICE");
        }
    }

    @Async
    @EventListener
    public void StatusUpdateEmailEvent(StatusUpdateEvent event){
        StatusUpdateDto statusUpdateDto = new StatusUpdateDto(
                event.getAppointmentId(),
                event.getEmail(),
                event.getUsername(),
                event.getCarName(),
                event.getRegistrationYear(),
                event.getVehicleType(),
                event.getDateOfExpire(),
                event.getFuelType(),
                event.getEstimatePrice(),
                event.getStatus()
        );

        try {
            emailFeign.statusUpdateDto(statusUpdateDto);
        }catch (Exception ex){
            throw new DownstreamServiceException("Something went wrong!");
        }
    }
}
