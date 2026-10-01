package com.carscrap.auth_service.FeignInterface;

import com.carscrap.auth_service.Dto.AuthTOYardService.GetYardBYAdminId;
import com.carscrap.auth_service.Dto.AuthTOYardService.StaffAssignToYardByAdminRequestDto;
import com.carscrap.auth_service.Dto.AuthTOYardService.StaffIdsResponse;
import com.carscrap.auth_service.Dto.AuthTOYardService.YardIdResponseDto;
import com.carscrap.auth_service.Dto.Staff.StaffIdGetRequestDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@FeignClient(name = "yard-service")
public interface YardClient {

    @PostMapping("/management/staff/details")
    List<StaffIdsResponse> staffIdResponse(@RequestBody StaffIdGetRequestDto staffIdGetRequestDto);

    @PostMapping("/management/yard/staff/add")
    void staffAddByAdmin(@RequestBody StaffAssignToYardByAdminRequestDto dto);

    @PostMapping("/internal/api/admin/yard/id/check")
    YardIdResponseDto yardIdResponse(@RequestBody GetYardBYAdminId dto);

    @GetMapping("/internal/api/get/staff/ids")
    List<StaffIdsResponse>  getStaffIdsFromYard();
}
