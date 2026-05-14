package ScrapYard.YardService.Controller;

import ScrapYard.YardService.Dto.*;
import ScrapYard.YardService.Dto.GetYard.GetYardByStatus;
import ScrapYard.YardService.Dto.User.YardSearch;
import ScrapYard.YardService.Service.AdminYardService;
import ScrapYard.YardService.Service.YardService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/yard")
public class YardController {

    private final AdminYardService adminYardService;
    private final YardService yardService;

    public YardController(AdminYardService adminYardService, YardService yardService) {
        this.adminYardService = adminYardService;
        this.yardService = yardService;
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PostMapping("/add")
    public ResponseEntity<ResponseDto> addYard(@RequestBody @Valid RequestDto dto){
        ResponseDto dto1= adminYardService.createYard(dto);
        log.info("SUCCESSFULLY_ADD_YARD | yardname={} | yardID={} ",
                dto1.getName(),
                dto1.getYardId()
                );
        return ResponseEntity.ok(dto1);
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PatchMapping("/edit")
    public ResponseEntity<ResponseDto> editYard(@RequestBody @Valid EditYardDetails details){
        ResponseDto dto= adminYardService.editYard(details);
        log.info("YARD_DETAILS_EDIT | yardChangeDetails={} ",
                details
                );
        return ResponseEntity.ok(dto);
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @GetMapping("/get/all")
    public ResponseEntity<List<ResponseDto>> getAllYardsForAdmin(){
        List<ResponseDto> dto= adminYardService.findAllYardForAdmin();
        log.info("SUPER_ADMIN_GET_ALL_YARDS");
        return ResponseEntity.ok(dto);
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @GetMapping("/search")
    public ResponseEntity<List<ResponseDto>> getYards(@RequestBody @Valid YardSearch yardSearch){
        List<ResponseDto> dto= adminYardService.findYard(yardSearch);
        log.info("SUPER_ADMIN_SEARCH_YARD | yardDetails={}",
                yardSearch
                );
        return ResponseEntity.ok(dto);
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PostMapping("/assign/admin")
    public ResponseEntity<JSONResponse> assignAdmin(@RequestBody @Valid AdminAssign dto){
        JSONResponse dto2= adminYardService.assignAdmin(dto);
        log.info("SUPER_ADMIN_ASSIGM_ADMIN_TO_YARD_SUCCESSFULLY | yardid={} | adminId={}",
                dto.getYardId(),
                dto.getAdminId()
                );
        return ResponseEntity.ok(dto2);
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PostMapping("/remove/admin")
    public ResponseEntity<ResponseDto> removeAdmin( @RequestBody @Valid RemoveAdminDto dto){
        ResponseDto responseDto=adminYardService.removeAdmin(dto);
        log.info("SUPER_ADMIN_REMOVE_ADMIN_FROM_YARD | yardId={} ",
                dto.getYardId()
                );
        return ResponseEntity.ok(responseDto);
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PostMapping("/all-By-status")
    public ResponseEntity<List<ResponseDto>> findByStatus(@RequestBody @Valid GetYardByStatus dto){
        List<ResponseDto> yards=adminYardService.findAllYardByStatus(dto);
        log.info("SUPER_ADMIN_SEARCH_YARDS_BY_STATUS | status={}",
                dto.getStatus()
                );
        return ResponseEntity.ok(yards);
    }


}
