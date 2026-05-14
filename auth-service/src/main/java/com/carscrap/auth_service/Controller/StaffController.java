package com.carscrap.auth_service.Controller;

import com.carscrap.auth_service.Dto.AuthTOYardService.GetStaffByIdsResponse;
import com.carscrap.auth_service.Dto.Staff.*;
import com.carscrap.auth_service.Enum.Principle;
import com.carscrap.auth_service.Service.StaffService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;


@Slf4j

@RestController
@RequestMapping("/staff")
public class StaffController {


    private final StaffService staffService;


    public StaffController(StaffService staffService) {
        this.staffService = staffService;
    }


    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    @PostMapping("/register")
    public ResponseEntity<StaffResponse> createStaff(@AuthenticationPrincipal Principle principle,@Valid @RequestBody StaffRequest staffRequest){
        StaffResponse staffResponse=staffService.createStaff(principle,staffRequest);

        log.info(
                "STAFF_REGISTER | createdByRole={} | createdBy={} | username={} | email={}",
                principle.getRole(),
                principle.getUsername(),
                staffRequest.getUsername(),
                staffRequest.getEmail()
        );
        return ResponseEntity.ok(staffResponse);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    @GetMapping("/getAll")
    public ResponseEntity<List<StaffGetByRoleResponseDto>> adminRegister(){
        List<StaffGetByRoleResponseDto> adminRegisterResponse=staffService.getAllStaff();
        return ResponseEntity.ok(adminRegisterResponse);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    @PostMapping("/get/yard/staffs")
    public ResponseEntity<List<GetStaffByIdsResponse>> adminRegister( @RequestBody StaffIdGetRequestDto dto){
        List<GetStaffByIdsResponse> adminRegisterResponse=staffService.listofStaffInAYard(dto);

        return ResponseEntity.ok(adminRegisterResponse);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/register/by/admin")
    public ResponseEntity<StaffResponse> staffRegisterByAdmin(@AuthenticationPrincipal Principle principle, @RequestBody StaffAddByAdminRequestDto dto){
        StaffResponse staffResponse=staffService.createStaffAndAssignToYard(principle,dto);

        log.info("STAFF_REGISTER_SUCCESSFUL_BY_ADMIN | username={} ",
                dto.getUsername()
                );
        return ResponseEntity.ok(staffResponse);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/staff/List")
    public ResponseEntity<List<GetStaffByIdsResponse>> listOfStaffInYardForAdmin(){
        List<GetStaffByIdsResponse> responses=staffService.listOfStaffInYardForAdmin();
        log.info("ADMIN_GET_STAFF_LIST | timeStamp={}",
                LocalDateTime.now()
        );
        return ResponseEntity.ok(responses);
    }

}
