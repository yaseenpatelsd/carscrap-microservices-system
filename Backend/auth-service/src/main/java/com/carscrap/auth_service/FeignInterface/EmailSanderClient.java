package com.carscrap.auth_service.FeignInterface;

import com.carscrap.auth_service.Dto.OtpRequest;
import com.carscrap.auth_service.Dto.OtpResponse;
import com.carscrap.auth_service.Dto.PasswordResetOtpRequestDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name="email-service")
public interface EmailSanderClient {

    @PostMapping("/email/otp")
    OtpResponse sandOtp(@RequestBody OtpRequest otpRequest);

    @PostMapping("/email/pass-reset-otp")
    OtpResponse passReset(@RequestBody PasswordResetOtpRequestDto passwordResetOtpRequestDto);
}
