package ScrapYard.YardService.Controller;

import ScrapYard.YardService.Dto.AppointmentCommunication.*;
import ScrapYard.YardService.Dto.AuthCommunication.StaffIDsResponseDto;
import ScrapYard.YardService.Dto.AuthCommunication.YardIdResponseDto;
import ScrapYard.YardService.Dto.GetYard.GetYardBYAdminId;
import ScrapYard.YardService.Dto.GetYardIdResponseDto;
import ScrapYard.YardService.Dto.YardCommunication.RequestDto;
import ScrapYard.YardService.Dto.YardCommunication.ResponseDto;
import ScrapYard.YardService.Service.AdminYardService;
import ScrapYard.YardService.Service.YardService;
import ScrapYard.YardService.Util.Principal;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/internal/api")

public class InternalCommunicationController {
    private final YardService yardService;
    public final AdminYardService adminYardService;

    public InternalCommunicationController(YardService yardService, AdminYardService adminYardService) {
        this.yardService = yardService;
        this.adminYardService = adminYardService;
    }

    @PostMapping("/check")
    public ResponseEntity<ScrapYard.YardService.Dto.YardCommunication.ResponseDto> checkYard(@Valid @RequestBody RequestDto request){
        ResponseDto responseDto=yardService.confirmYard(request);
        return ResponseEntity.ok(responseDto);
    }

    @PostMapping("/staff/verify")
    public ResponseEntity<StaffVerifyResponseDto> checkYard(@RequestBody StaffVerifyRequestDto request){
        StaffVerifyResponseDto responseDto=adminYardService.staffVerifyResponseDto(request);
        return ResponseEntity.ok(responseDto);
    }
    @PostMapping("/staff/check")
    public ResponseEntity<AppointmentManagementVerificationResponseDto> checkStaffBelongsToYard(@RequestBody AppointmentManagementVerificationRequestDto dto){
        AppointmentManagementVerificationResponseDto responseDto=adminYardService.verifyStaffBelongsToYard(dto);
        return ResponseEntity.ok(responseDto);
    }
    @PostMapping("/admin/check")
    public ResponseEntity<AppointmentManagementVerificationResponseDto> checkAdminBelongsToYard(@RequestBody AppointmentManagementVerificationRequestDto dto){
        AppointmentManagementVerificationResponseDto responseDto=adminYardService.verifyAdminBelongsToYard(dto);
        return ResponseEntity.ok(responseDto);
    }


    @PostMapping("/admin/yard/id/check")
    public ResponseEntity<YardIdResponseDto> YardIdResponseDto(@RequestBody GetYardBYAdminId dto){
        YardIdResponseDto responseDto=adminYardService.yardIdResponse(dto);
        return ResponseEntity.ok(responseDto);
    }

    @GetMapping("/get/staff/ids")
    public ResponseEntity<List<StaffIDsResponseDto>> staffResponseIDsForAdmin(@AuthenticationPrincipal Principal principal){
        List<StaffIDsResponseDto> staffIDsResponseDtos=adminYardService.yardStaffIdRespnseList(principal);
        return ResponseEntity.ok(staffIDsResponseDtos);
    }


    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/get/admins/yard/id")
    public ResponseEntity<GetYardIdResponseDto> responseYardIdForAdmin(@AuthenticationPrincipal Principal principal){
        GetYardIdResponseDto getYardIdResponseDto=adminYardService.responseYardIdForAdmin(principal);
        return ResponseEntity.ok(getYardIdResponseDto);
    }


}
