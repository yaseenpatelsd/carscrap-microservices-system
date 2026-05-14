package com.CarScrap.Booking_Service.FeignCommunication;

import com.CarScrap.Booking_Service.Dto.GetYardIdResponseDto;
import com.CarScrap.Booking_Service.Dto.YardCommunication.*;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name
        = "yard-service")
public interface YardFeign {
    @PostMapping("/internal/api/check")
    YardResponseDto response(@RequestBody YardRequestDto dto);

    @PostMapping("/internal/api/staff/verify")
    StaffVerifyResponseDto staffResponse(@RequestBody StaffVerifyRequestDto dto);

    @PostMapping("/internal/api/staff/check")
    YardManagementResponseDto yardStaffManagementResponse(@RequestBody YardManagementRequestDto dto);

     @PostMapping("/internal/api/admin/check")
    YardManagementResponseDto yardAdminManagementResponse(@RequestBody YardManagementRequestDto dto);

     @GetMapping("/internal/api/get/admins/yard/id")
     GetYardIdResponseDto getYardIdResponse();
}
