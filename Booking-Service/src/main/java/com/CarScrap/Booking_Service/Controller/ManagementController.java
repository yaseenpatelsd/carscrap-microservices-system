package com.CarScrap.Booking_Service.Controller;

import com.CarScrap.Booking_Service.Dto.*;
import com.CarScrap.Booking_Service.Dto.GetAppointment.GetAppointmentByYardId;
import com.CarScrap.Booking_Service.Dto.GetAppointment.GetAppointmentByYardIdAndDate;
import com.CarScrap.Booking_Service.Enum.Principal;
import com.CarScrap.Booking_Service.Service.AppointmentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/management/booking")
public class ManagementController {

    private final AppointmentService appointmentService;
    public ManagementController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    @PostMapping("/cancel")
    public ResponseEntity<JSONResponseDto> cancelAppointmentByManagement(@AuthenticationPrincipal Principal principal, @RequestBody ManagementAppointmentCancelDto dto){
        JSONResponseDto responseDto=appointmentService.cancelByManagement(principal, dto);
        log.info("APPOINTMENT_CANCEL | appointmentId={} |role={} | id={} ",
                dto.getId(),
                principal.getRole(),
                principal.getId()
        );
        return ResponseEntity.ok(responseDto);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','STAFF')")
    @PostMapping("/get/list/appointment")
    public ResponseEntity<List<ResponseDto>> getAppointmentByDate(@AuthenticationPrincipal Principal principal,@RequestBody GetAppointmentByYardIdAndDate date){
        List<ResponseDto> responseDtos=appointmentService.GetAppointmentByDate(principal,date);
        return ResponseEntity.ok(responseDtos);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','STAFF')")
    @PostMapping("/get/appointment")
    public ResponseEntity<List<ResponseDto>> getAllAppointment(@AuthenticationPrincipal Principal principal,@RequestBody GetAppointmentByYardId dto){
        List<ResponseDto> responseDtos=appointmentService.getAppointmentByYardId(principal,dto);
        return ResponseEntity.ok(responseDtos);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','STAFF')")
    @PatchMapping("/change/appointment/status")
    public ResponseEntity<JSONResponseDto> changeStatus(@AuthenticationPrincipal Principal principal, @RequestBody ChangeStatusDto dto){
        JSONResponseDto responseDto=appointmentService.changeAppointmentStatus(principal,dto);
        log.info("CHANGE_APPOINTMENT_STATUS | role={} | id={} | appointmentId={} | status={} ",
                principal.getRole(),
                principal.getId(),
                dto.getAppointmemtId(),
                dto.getStatus()
        );
        return ResponseEntity.ok(responseDto);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    @PostMapping("/staff/assign")
    public ResponseEntity<JSONResponseDto> staffAssigb(@AuthenticationPrincipal Principal principal, @RequestBody StaffAssignDto dto){
        JSONResponseDto responseDto=appointmentService.staffAssign(principal,dto);
        log.info("APPOINTMENT_STAFF_ASSIGN| staffId={} | appointmentId={} ",
                dto.getStaffId(),
                dto.getAppointmentId()
        );
        return ResponseEntity.ok(responseDto);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/get/appointment/by/date-for-admin")
    public ResponseEntity<List<ResponseDto>> getAppointmentForAdmin(@RequestBody GetAppointmentFromDateAToBRequestForAdminDto dto){
        List<ResponseDto> getlist=appointmentService.getAppointmenntForAdmins(dto);

        return ResponseEntity.ok(getlist);
    }

    @PreAuthorize("hasRole('STAFF')")
    @PostMapping("/get/appointment/by/date-for-staff")
    public ResponseEntity<List<ResponseDto>> getAppointmentsForStaff(@AuthenticationPrincipal Principal principal,@RequestBody GetAppointmentFromDateAToBRequestForAdminDto dto){
        List<ResponseDto> getlist=appointmentService.getAppointmentsForStaffByDate(principal,dto);

        return ResponseEntity.ok(getlist);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/remove/staff")
    public ResponseEntity<ResponseDto> removeStaffFromAppointment(@AuthenticationPrincipal Principal principal,@RequestBody RemoveAssignStaff dto){
        ResponseDto responseDto=appointmentService.removeAssignStaff(principal,dto);
        log.info("APPOINTMENT_STAFF_REMOVE | appointmentId={} ",
                dto.getAppointmentId()
        );
        return ResponseEntity.ok(responseDto);
    }


    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    @PatchMapping("/change/status")
    public ResponseEntity<JSONResponseDto> changeStatusByManagemenet(@AuthenticationPrincipal Principal principal,@RequestBody ChangeStatusByManagement dto){
        JSONResponseDto jsonResponseDto=appointmentService.changeAppointmentByManagemenet(principal,dto);
        log.info("APPOINTMENT_CHANGE_STATUS | appointmentId={} | status={} ",
                dto.getAppointmentId(),
                dto.getStatus()
        );
        return ResponseEntity.ok(jsonResponseDto);
    }


    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    @PatchMapping("/post-pone/appointment-by-management")
    public ResponseEntity<ResponseDto> postPoneAppointmentByManagement(@AuthenticationPrincipal Principal principal,@RequestBody PostPoneAppointmentDto dto){
        ResponseDto responseDto=appointmentService.postPoneAppointmentByManagement(principal,dto);
        log.info("APPOINTMENT_POSTPONE | appointmentId={} | newDate={} ",
                dto.getAppointmentId(),
                responseDto.getDateOfAppointment()
        );
        return ResponseEntity.ok(responseDto);
    }

    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    @PatchMapping("/user/missed-appointment")
    public ResponseEntity<JSONResponseDto> userMissedAppointment(@AuthenticationPrincipal Principal principal ,@RequestBody UserMissedAppointmentDto dto){
        JSONResponseDto jsonResponseDto=appointmentService.userMissedAppointment(principal,dto);
        log.info("APPOINTMENT_MISSED | appointmentId={}",
                dto.getAppointmentId()
        );
        return ResponseEntity.ok(jsonResponseDto);
    }

}


