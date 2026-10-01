package com.carscrap.auth_service.Controller;

import com.carscrap.auth_service.Dto.AdminFlowResponseDto;
import com.carscrap.auth_service.Dto.AdminRegister;
import com.carscrap.auth_service.Dto.AdminResponseDto;
import com.carscrap.auth_service.Service.AdminFlow;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/admin")
public class AdminController {
    private final AdminFlow adminFlow;


    public AdminController(AdminFlow adminFlow) {
        this.adminFlow = adminFlow;
    }


    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PostMapping("/register")
    public ResponseEntity<AdminFlowResponseDto> adminRegister(@Valid @RequestBody AdminRegister adminRegister){
        AdminFlowResponseDto adminRegisterResponse=adminFlow.registerAdmin(adminRegister);
        log.info("SUPER_ADMIN_REGISTER_ADMIN | username={}",
                adminRegister.getUsername()
                );
        return ResponseEntity.ok(adminRegisterResponse);
    }



    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @GetMapping("/getAll")
    public ResponseEntity<List<AdminResponseDto>> adminRegister(){
        List<AdminResponseDto> adminRegisterResponse=adminFlow.getAllAdminResponse();
        return ResponseEntity.ok(adminRegisterResponse);
    }

}
