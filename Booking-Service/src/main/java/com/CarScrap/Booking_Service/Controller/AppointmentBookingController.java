package com.CarScrap.Booking_Service.Controller;

import com.CarScrap.Booking_Service.Dto.*;
import com.CarScrap.Booking_Service.Dto.GetAppointment.GetAppointmentByDateByUser;
import com.CarScrap.Booking_Service.Dto.GetAppointment.GetAppointmentByStatus;
import com.CarScrap.Booking_Service.Dto.GetAppointment.GetAppointmentDto;
import com.CarScrap.Booking_Service.Enum.Principal;
import com.CarScrap.Booking_Service.Service.AppointmentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/appointment")
public class AppointmentBookingController {

    private final AppointmentService appointmentService;

    public AppointmentBookingController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping("/booking")
    public ResponseEntity<ResponseDto> appointmentBooking(@AuthenticationPrincipal Principal principal, @RequestBody RequestDto dto){
        ResponseDto dto1=appointmentService.createAppointment(principal,dto);
        log.info("APPOINTMENT_BOOK_SUCCESSFULLY | AppointmentId={} | userId={} | dateOfAppointment={}",
                dto1.getId(),
                principal.getId(),
                dto1.getDateOfAppointment()
                );
        return ResponseEntity.ok(dto1);
    }

    @PostMapping("/booking/cancel")
    public ResponseEntity<ResponseDto> bookingCancelByUser(@AuthenticationPrincipal Principal principal, @RequestBody UserAppointmentCancel dto){
        ResponseDto dto1=appointmentService.cancelAppointment(principal,dto);
        log.info("APPOINTMENT_CANCEL | AppointmentId={} | userId={} ",
                dto1.getId(),
                principal.getId()
        );
        return ResponseEntity.ok(dto1);
    }

    @PostMapping("/postpone")
    public ResponseEntity<ResponseDto> bookingPostponeByUser(@AuthenticationPrincipal Principal principal, @RequestBody PostPoneAppointmentDto dto){
        ResponseDto responseDto=appointmentService.postponeAppointment(principal, dto);
        log.info("APPOINTMENT_POSTPONE | AppointmentId={} | userId={} | newDateOfAppointment={}",
                responseDto.getId(),
                principal.getId(),
               responseDto.getDateOfAppointment()
        );
        return ResponseEntity.ok(responseDto);
    }

    @PostMapping("/get")
    public ResponseEntity<ResponseDto> getAppointmentByUser(@AuthenticationPrincipal Principal principal, @RequestBody GetAppointmentDto dto){
        ResponseDto responseDto=appointmentService.getAppointmentForUser(principal,dto);
        return ResponseEntity.ok(responseDto);
    }

    @GetMapping("/all")
    public ResponseEntity<List<ResponseDto>> getAppointmentByUser(@AuthenticationPrincipal Principal principal){
        List<ResponseDto> responseDto=appointmentService.getAllAppointment(principal);
        return ResponseEntity.ok(responseDto);
    }


    @PostMapping("/all/status")
    public ResponseEntity<List<ResponseDto>> getAppointmentAllByStatus(@AuthenticationPrincipal Principal principal, @RequestBody GetAppointmentByStatus dto){
        List<ResponseDto> responseDto=appointmentService.getAppointmentByStatus(principal,dto);
        return ResponseEntity.ok(responseDto);
    }

    @PostMapping("/all/date")
    public ResponseEntity<List<ResponseDto>> getApppointmentByDate(@AuthenticationPrincipal Principal principal, @RequestBody GetAppointmentByDateByUser dateByUser){
        List<ResponseDto> responseDtos=appointmentService.userGetAppointmentByDate(principal,dateByUser);
        return ResponseEntity.ok(responseDtos);
    }


   @PostMapping("/get/appointment/details")
    public ResponseEntity<BookingDetailsResponseDto> getAppointmentDetails(@AuthenticationPrincipal Principal principal, @RequestBody BookingDetailsRequestDto dto){
        BookingDetailsResponseDto responseDtos=appointmentService.getBookingDetails(principal,dto);
        return ResponseEntity.ok(responseDtos);
    }

}
