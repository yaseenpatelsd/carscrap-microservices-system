package CarScrap.com.Email_Service.Service;

import CarScrap.com.Email_Service.Dto.AppointmentCommunication.*;

import CarScrap.com.Email_Service.Dto.OtpReceive;
import CarScrap.com.Email_Service.Dto.OtpResponse;
import CarScrap.com.Email_Service.Dto.OtpSanderDto;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;


@Service
public class EmailSander {
    private final SpringTemplateEngine templateEngine;
    private final JavaMailSender javaMailSender;

    public EmailSander(
                       JavaMailSender javaMailSender,
                       SpringTemplateEngine templateEngine) {
        this.javaMailSender = javaMailSender;
        this.templateEngine = templateEngine;
    }


    private void sendEmail(String to,
                           String subject,
                           String templateName,
                           Context context) throws MessagingException {

        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setFrom("no-reply@carscrapy.com");

        String html = templateEngine.process(templateName, context);

        helper.setText(html, true);
        javaMailSender.send(message);
    }

    public void sendBookingSuccessEmail(BookingRequestDto dto) throws MessagingException {

        Context context = new Context();
        context.setVariable("username", dto.getUsername());
        context.setVariable("bookingId", dto.getBookingId());
        context.setVariable("vehicleName", dto.getName());
        context.setVariable("vehicleType", dto.getVehicleType());
        context.setVariable("fuelType", dto.getFuelType());
        context.setVariable("appointmentDate", dto.getDateOfAppointment());
        context.setVariable("status", dto.getStatus());
        context.setVariable("estimatePrice", dto.getEstimatePrice());

        sendEmail(
                dto.getEmail(),
                " Your CarScrapy booking is confirmed",
                "email/booking-email",
                context
        );
    }

    public void sendUserCancelEmail(CancelRequestDto dto) throws MessagingException {

        Context context = new Context();
        context.setVariable("appointmentId", dto.getAppointmentId());
        context.setVariable("username", dto.getUsername());
        context.setVariable("carName", dto.getCarName());
        context.setVariable("registrationYear", dto.getRegistrationYear());
        context.setVariable("vehicleType", dto.getVehicleType());
        context.setVariable("dateOfExpire", dto.getDateOfExpire());
        context.setVariable("fuelType", dto.getFuelType());
        context.setVariable("estimatePrice", dto.getEstimatePrice());
        context.setVariable("status", dto.getStatus());

        context.setVariable("reason",
                dto.getReason() != null ? dto.getReason() : "Not provided");


        sendEmail(
                dto.getEmail(),
                "❌ CarScrapy Booking Cancelled",
                "email/cancel-email",
                context
        );
    }



    public OtpResponse sendOtpEmail(OtpSanderDto dto) throws MessagingException {

        String otp= dto.getOtp();

        Context context = new Context();
        context.setVariable("otp", otp );

        sendEmail(
                dto.getEmail(),
                "🔐 Your CarScrapy verification code",
                "email/otp-email",
                context
        );
        OtpResponse otpResponse=new OtpResponse();
        otpResponse.setOtp(otp);

        return otpResponse;
    }

    public void sendAppointmentRequestEmail(BookingRequestDto dto) throws MessagingException {

        Context context = new Context();
        context.setVariable("username", dto.getUsername());
        context.setVariable("bookingId", dto.getBookingId());
        context.setVariable("vehicleName", dto.getName());
        context.setVariable("vehicleType", dto.getVehicleType());
        context.setVariable("fuelType", dto.getFuelType());
        context.setVariable("appointmentDate", dto.getDateOfAppointment());
        context.setVariable("status", dto.getStatus());
        context.setVariable("estimatePrice", dto.getEstimatePrice());

        sendEmail(
                dto.getEmail(),
                "📩 CarScrapy Appointment Request Received",
                "email/appointment-request-email",
                context
        );
    }




    public void sendOtpForPassowrd(OtpReceive dto) throws MessagingException {

        Context context = new Context();
        context.setVariable("otp", dto.getOtp());

        sendEmail(
                dto.getEmail(),
                "🔐 CarScrapy Password Reset Code",
                "email/password-otp-email",
                context
        );
    }


    public void sendManagementCancelEmail(RequestDto dto) throws MessagingException {

        Context context = new Context();

        // Map DTO → Thymeleaf variables
        context.setVariable("appointmentId", dto.getAppointmentId());
        context.setVariable("username", dto.getUsername());
        context.setVariable("carName", dto.getCarName());
        context.setVariable("registrationYear", dto.getRegistrationYear());
        context.setVariable("dateOfExpire", dto.getDateOfExpire());
        context.setVariable("vehicleType", dto.getVehicleType());
        context.setVariable("fuelType", dto.getFuelType());
        context.setVariable("estimatePrice", dto.getEstimatePrice());
        context.setVariable("status", dto.getStatus());
        context.setVariable("reason", dto.getReason());

        // Subject (important for UX)
        String subject = "❌ Appointment Cancelled by CarScrapy Team";

        // Call your existing method
        sendEmail(
                dto.getEmail(),
                subject,
                "email/management-cancel-email", // template path
                context
        );
    }


    public void sendStatusUpdateEmail(StatusUpdateDto dto) throws MessagingException {

        Context context = new Context();

        context.setVariable("appointmentId", dto.getAppointmentId());
        context.setVariable("username", dto.getUsername());
        context.setVariable("carName", dto.getCarName());
        context.setVariable("registrationYear", dto.getRegistrationYear());
        context.setVariable("dateOfExpire", dto.getDateOfExpire());
        context.setVariable("vehicleType", dto.getVehicleType());
        context.setVariable("fuelType", dto.getFuelType());
        context.setVariable("estimatePrice", dto.getEstimatePrice());
        context.setVariable("status", dto.getStatus());

        String subject = "📊 Your CarScrapy Appointment Status Updated";

        sendEmail(
                dto.getEmail(),
                subject,
                "email/status-update-email",
                context
        );
    }

    public void sendPostponeEmail(PostPoneAppointmentDto dto) throws MessagingException {

        Context context = new Context();

        context.setVariable("username", dto.getUsername());
        context.setVariable("appointmentId", dto.getAppointmentId());
        context.setVariable("carName", dto.getCarName());
        context.setVariable("registrationYear", dto.getRegistrationYear());
        context.setVariable("vehicleType", dto.getVehicleType());
        context.setVariable("fuelType", dto.getFuelType());
        context.setVariable("estimatePrice", dto.getEstimatePrice());

        context.setVariable("oldAppointmentDate", dto.getOldAppointmentDate());
        context.setVariable("newAppointmentDate", dto.getNewAppointmentDate());

        context.setVariable("status", dto.getStatus());

        sendEmail(
                dto.getEmail(),
                "Your CarScrapy Appointment Has Been Updated",
                "email/postpone-email",
                context
        );
    }
    }


