package com.carscrap.auth_service.Controller;

import com.carscrap.auth_service.Dto.AuthTOYardService.RequestDto;
import com.carscrap.auth_service.Dto.AuthTOYardService.ResponseDto;
import com.carscrap.auth_service.Dto.Staff.StaffVerificationResponseDto;
import com.carscrap.auth_service.Dto.Staff.StaffVerifiedRequestDto;
import com.carscrap.auth_service.Service.AdminFlow;
import com.carscrap.auth_service.Service.StaffService;
import com.carscrap.auth_service.Service.UserFlow;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/private/api")
public class PrivateApiController {

    private final AdminFlow adminFlow;
    private final UserFlow userFlow;
    private final StaffService staffService;

    public PrivateApiController(AdminFlow adminFlow, UserFlow userFlow, StaffService staffService) {
        this.adminFlow = adminFlow;
        this.userFlow = userFlow;
        this.staffService = staffService;
    }

    @PostMapping("/verify")
    public ResponseEntity<ResponseDto> check(@RequestBody RequestDto dto){
        ResponseDto dto1= adminFlow.validAdmin(dto);

        return ResponseEntity.ok(dto1);
    }

    @PostMapping("/getEmail")
    public ResponseEntity<com.carscrap.auth_service.Dto.AppointmentCommunication.ResponseDto> sandEmail(@RequestBody com.carscrap.auth_service.Dto.AppointmentCommunication.RequestDto dto){
        com.carscrap.auth_service.Dto.AppointmentCommunication.ResponseDto dto1=userFlow.sandEmail(dto);
        return ResponseEntity.ok(dto1);
    }

    @PostMapping("/staff/valid")
    public ResponseEntity<StaffVerificationResponseDto> responseEntity(@RequestBody StaffVerifiedRequestDto dto){
        StaffVerificationResponseDto responseDto= staffService.verificationResponseDto(dto);
        return ResponseEntity.ok(responseDto);
    }
}
