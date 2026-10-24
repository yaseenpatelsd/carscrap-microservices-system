package CarScrap.com.Email_Service;

import CarScrap.com.Email_Service.Dto.AppointmentCommunication.*;
import CarScrap.com.Email_Service.Dto.OtpReceive;
import CarScrap.com.Email_Service.Dto.OtpResponse;
import CarScrap.com.Email_Service.Dto.OtpSanderDto;
import CarScrap.com.Email_Service.Service.EmailSander;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@Slf4j
@RestController
@RequestMapping("/email")
public class Controller {

    private final EmailSander emailSander;

    public Controller(EmailSander emailSander) {
        this.emailSander = emailSander;
    }


    @PostMapping("/otp")
    public ResponseEntity<?> otpSander(@RequestBody @Valid OtpSanderDto dto) throws MessagingException {
        OtpResponse otp=emailSander.sendOtpEmail(dto);
        log.info("OTP_SEND_SUCCESS | email={}",
                dto.getEmail()
                );
        return ResponseEntity.ok(otp);
    }

    @PostMapping("/pass-reset-otp")
    public void passReset(@RequestBody @Valid OtpReceive dto) throws MessagingException{
        emailSander.sendOtpForPassowrd(dto);
        log.info("PASS_RESET_OTP_SEND_SUCCESS | email={}",
                dto.getEmail()
        );
    }

    @PostMapping("/cancel/appointment")
    public void   cancelAppointmentMail(@RequestBody RequestDto dto) throws MessagingException{
        emailSander.sendManagementCancelEmail(dto);
        log.info("CANCEL_APPOINTMENT_EMAIL_BY_MANAGEMENT | email={}",
                dto.getEmail()
        );
    }

    @PostMapping("/booking/confirm")
    public void  bookingConfirmEmail(@RequestBody BookingRequestDto dto)throws MessagingException{
        emailSander.sendBookingSuccessEmail(dto);
        log.info("CONFIRM_APPOINTMENT_EMAIL_SUCCESS | email={}",
                dto.getEmail()
        );
    }

    @PostMapping("/booking/cancel/user")
    public void  bookingCancelByUser(@RequestBody CancelRequestDto dto)throws MessagingException{
        emailSander.sendUserCancelEmail(dto);
        log.info("CANCEL_APPOINTMENT_EMAIL_BY_USER | username={} |email={}",
                dto.getUsername(),
                dto.getEmail()
        );
    }

    @PostMapping("/booking/status/update")
    public void  sendStatusUpdateEmail(@RequestBody StatusUpdateDto dto)throws MessagingException{
        emailSander.sendStatusUpdateEmail(dto);
        log.info("APPOINTMENT_STATUS_CHANGE_EMAIL | email={}",
                dto.getEmail()
        );
    }
    @PostMapping("/booking/postpone")
    public void sendPostponeNotification(@RequestBody PostPoneAppointmentDto requestDto)throws MessagingException{
        emailSander.sendPostponeEmail(requestDto);
        log.info("APPOINTMENT_POSTPONE_EMAIL |username={} | email={}",
                requestDto.getUsername(),
                requestDto.getEmail()
        );
    }
}
