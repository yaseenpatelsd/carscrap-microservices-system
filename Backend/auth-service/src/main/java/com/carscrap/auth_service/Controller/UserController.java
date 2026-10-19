package com.carscrap.auth_service.Controller;

import com.carscrap.auth_service.Dto.*;
import com.carscrap.auth_service.Service.UserFlow;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;


@Slf4j
@RestController
@RequestMapping("/auth")
public class UserController {

    private final UserFlow userService;

    public UserController(UserFlow userService) {
        this.userService = userService;
    }


    @PostMapping("/register")
    public ResponseEntity<ResponseJson> register(@RequestBody @Valid RegisterDto dto){
        ResponseJson responseJso=userService.register(dto);
        log.info("REGISTER_SUCCESS | username={} | email={}",
                dto.getUsername(),
                dto.getEmail());
        return ResponseEntity.ok(responseJso);
    }

    @PostMapping("/account-verified")
    public ResponseEntity<ResponseJson> accountVerification(@RequestBody @Valid AccountVerificationDto dto){
        ResponseJson responseJson=userService.accountVerification(dto);
        log.info("ACCOUNT_VERIFY | username={}",
                 dto.getUsername()
                );
        return ResponseEntity.ok(responseJson);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LogInDto dto) throws Exception {
        TokenDto dto1=userService.logIn(dto);
        log.info("LOGIN_SUCCESS | username={} ",
                dto.getUsername()
                );
        return ResponseEntity.ok(dto1);
    }

    @PostMapping("/otp-request")
    public ResponseEntity<ResponseJson> otpRequest(@RequestBody @Valid OtpRequestForPasswordResetDto dto){
        ResponseJson responseJson=userService.requestOtp(dto);
        log.info("OTP_REQUEST | username={} ",
                dto.getUsername()

                );
        return ResponseEntity.ok(responseJson);
    }

    @PostMapping("/otp-request-password-reset")
    public ResponseEntity<ResponseJson> otpRequestForPasswordReset(@RequestBody @Valid OtpRequestForPasswordResetDto dto){
        ResponseJson responseJson=userService.requestOtp(dto);
        log.info("OTP_REQUEST_FOR_PASSWORD_RESET | username={}",
                dto.getUsername()
        );
        return ResponseEntity.ok(responseJson);
    }

    @PostMapping("/password-change")
    public ResponseEntity<ResponseJson> changePassword(@RequestBody @Valid PasswordReset passwordReset){
       ResponseJson responseJson= userService.passwordReset(passwordReset);
        log.info("CHANGE_PASSWORD | username={}",
                passwordReset.getUsername()
        );
        return ResponseEntity.ok(responseJson);
    }
}
