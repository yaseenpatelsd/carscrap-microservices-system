package ScrapYard.YardService.Controller;

import ScrapYard.YardService.Dto.*;
import ScrapYard.YardService.Dto.AuthCommunication.StaffAssignToYardByAdminRequestDto;
import ScrapYard.YardService.Dto.AuthCommunication.StaffIDsResponseDto;
import ScrapYard.YardService.Service.AdminYardService;
import ScrapYard.YardService.Util.Principal;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/management/yard")
public class YardManagementController {

    private final AdminYardService adminYardService;


    public YardManagementController(AdminYardService adminYardService) {
        this.adminYardService = adminYardService;
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN')")
    @PatchMapping("/edit/contact")
    public ResponseEntity<ResponseDto> edityardContent( @RequestBody @Valid ContactChangeDto details){
        ResponseDto dto= adminYardService.changeContact(details);
        log.info("SUPER_ADMIN_EDITS_YARD_DETAILS | details={} ",
                details
                );
        return ResponseEntity.ok(dto);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN')")
    @PatchMapping("/change/status")
    public ResponseEntity<ResponseDto> editYardStatus(@RequestBody  StatusChangeDto details){
        ResponseDto dto= adminYardService.changeStatus(details);
        log.info("SUPER_ADMIN_CHANGE_YARD_STATUS | yardId={} | status={} ",
                details.getYardId(),
                details.getStatus()
        );
        return ResponseEntity.ok(dto);
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @PatchMapping("/change/contact-by-admin")
    public ResponseEntity<ResponseDto> changeContactByAdmin(@AuthenticationPrincipal Principal principal,@RequestBody @Valid ChangeContactByAdmin details){
        ResponseDto dto= adminYardService.changeContactByAdmin(principal,details);
        log.info("ADMIN_EDIT_YARD_CONTACT_DETAILS | adminId={} | changes={}",
                principal.getId(),
                details
                );
        return ResponseEntity.ok(dto);
    }

    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    @PatchMapping("/change/status-by-admin")
    public ResponseEntity<ResponseDto> editYardStatus(@AuthenticationPrincipal Principal principal,@RequestBody @Valid StatusChangeByAdmin details){
        ResponseDto dto= adminYardService.changeStatusByAdmin(principal,details);
        log.info("CHANGE_STATUS | role={} | id={} | status={}",
                principal.getRole(),
                principal.getId(),
                details.getStatus()
        );
        return ResponseEntity.ok(dto);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN')")
    @PostMapping("/add/staff")
    public ResponseEntity<JSONResponse> staffAdd(@AuthenticationPrincipal Principal principal,@RequestBody StaffAssignDto dto){
        JSONResponse jsonResponse= adminYardService.staffAssignToYard(principal,dto);

        log.info("SUPER_ADMIN_ASSIGN_STAFF_TO_YARD | staffId={} | yardId={}",
                dto.getStaffId(),
                dto.getYardId()

        );
        return ResponseEntity.ok(jsonResponse);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN')")
    @PostMapping("/remove/staff")
    public ResponseEntity<JSONResponse> removeStaff(@AuthenticationPrincipal Principal principal,@RequestBody RemoveStaffDto dto){
        JSONResponse jsonResponse= adminYardService.removeStaff(principal,dto);
        log.info("SUPER_ADMIN_REMOVE_STAFF_TO_YARD | staffId={} | yardId={}",
                dto.getStaffId(),
                dto.getYardId()
        );
        return ResponseEntity.ok(jsonResponse);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN')")
    @PostMapping("/staff/details")
    public ResponseEntity<List<StaffIDsResponseDto>> getStaffsDetails(@AuthenticationPrincipal Principal principal,@RequestBody YardIdRequestDto dto){
        List<StaffIDsResponseDto> staffIDsRequestDtos = adminYardService.staffIDsRequest(principal,dto);

        return ResponseEntity.ok(staffIDsRequestDtos);
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @PostMapping("/staff/add")
    public void staffAddByAdmin(@AuthenticationPrincipal Principal principal,@RequestBody StaffAssignToYardByAdminRequestDto dto){
        adminYardService.addStaffToYardByAdmin(principal,dto);
        log.info("ADMIN_ASSIGN_STAFF_TO_YARD | staffId={} | yardId={}",
                dto.getStaffId(),
                dto.getYardId()

        );
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @DeleteMapping("/staff/remove")
    public ResponseEntity<JSONResponse> removeStaffByAdmin(@AuthenticationPrincipal Principal principal,@RequestBody RemoveStaffAdminRequest dto){
        JSONResponse jsonResponse=adminYardService.removeStaffByAdmin(principal,dto);
        log.info("ADMIN_REMOVE_STAFF_TO_YARD | staffId={}",
                dto.getStaffId()

        );
        return ResponseEntity.ok(jsonResponse);
    }

    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    @PatchMapping("/change/status-by-management")
    public ResponseEntity<StatusChangeByAdmin> changeStatusByManagement(@AuthenticationPrincipal Principal principal){
        StatusChangeByAdmin status=adminYardService.changeStatusByManagement(principal);
        log.info("STATUS_CHANGE | role={} |id={}  |status={}",
               principal.getRole(),
               principal.getId(),
               status.getStatus()


        );
        return ResponseEntity.ok(status);
    }
}
