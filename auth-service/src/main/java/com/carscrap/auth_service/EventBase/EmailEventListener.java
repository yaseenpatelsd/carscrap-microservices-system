package com.carscrap.auth_service.EventBase;

import com.carscrap.auth_service.Dto.OtpRequest;
import com.carscrap.auth_service.Dto.PasswordResetOtpRequestDto;
import com.carscrap.auth_service.FeignInterface.EmailSanderClient;
import com.carscrap.auth_service.GlobalException.GenericException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;


@Slf4j
@Component
public class EmailEventListener {
    private final EmailSanderClient emailSanderClient;
    public EmailEventListener(EmailSanderClient emailSanderClient) {
        this.emailSanderClient = emailSanderClient;
    }


    @Async
    @EventListener
    public void RegisterEvent(RegisterEvent event){
        OtpRequest otpRequest=new OtpRequest(event.getEmail(), event.getOtp());
        try {
            emailSanderClient.sandOtp(otpRequest);
            log.info("SUCCESSFULLY_EMAIL_SEND_FOR_REGISTER | email={}",
                    event.getEmail()
            );
        }catch (Exception ex){
            log.error("EMAIL_SENDING_FAILS | email={}",
                    event.getEmail(),
                    ex
                    );

            throw new GenericException("Email Service Fails");
        }


    }

    @Async
    @EventListener
    public void PasswordResetEvent(PasswordResetEvent passwordResetEvent){
        PasswordResetOtpRequestDto passwordResetOtpRequestDto=new PasswordResetOtpRequestDto(passwordResetEvent.getOtp(),passwordResetEvent.getEmail());
        try {
            emailSanderClient.passReset(passwordResetOtpRequestDto);
            log.info("SUCCESSFULLY_PASSWORD_RESET_EMAIL_SEND | email={}",
                    passwordResetEvent.getEmail()
            );
        }catch (Exception ex){
            log.error("EMAIL_SENDING_FAILS | email={}",
                    passwordResetEvent.getEmail(),
                    ex
            );
        }

        throw new GenericException("Email Service Fails");

    }
}
