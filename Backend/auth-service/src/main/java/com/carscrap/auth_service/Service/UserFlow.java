package com.carscrap.auth_service.Service;

import com.carscrap.auth_service.Dto.*;
import com.carscrap.auth_service.Dto.AppointmentCommunication.RequestDto;
import com.carscrap.auth_service.Dto.AppointmentCommunication.ResponseDto;
import com.carscrap.auth_service.Entity.UserEntity;
import com.carscrap.auth_service.Enum.UserRole;
import com.carscrap.auth_service.EventBase.PasswordResetEvent;
import com.carscrap.auth_service.EventBase.RegisterEvent;
import com.carscrap.auth_service.GlobalException.GenericException;
import com.carscrap.auth_service.GlobalException.NotAllowed;
import com.carscrap.auth_service.GlobalException.OtpRelatedException;
import com.carscrap.auth_service.GlobalException.ResourceAlreadyExistException;
import com.carscrap.auth_service.Jwt.JwtGenerator;
import com.carscrap.auth_service.Repository.UserRepository;
import com.carscrap.auth_service.Util.OtpGenerate;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import jakarta.transaction.Transactional;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.time.LocalDateTime;
import lombok.extern.slf4j.Slf4j;
import io.github.resilience4j.retry.annotation.Retry;

@Slf4j
@Service
public class UserFlow {
        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final AuthenticationManager authenticationManager;
        private final JwtGenerator jwtGenerator;
        private final OtpGenerate otpGenerate;
        private final ApplicationEventPublisher applicationEventPublisher;

        public UserFlow(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtGenerator jwtGenerator, OtpGenerate otpGenerate, ApplicationEventPublisher applicationEventPublisher) {
            this.userRepository = userRepository;
            this.passwordEncoder = passwordEncoder;
            this.authenticationManager = authenticationManager;
            this.jwtGenerator = jwtGenerator;
            this.otpGenerate = otpGenerate;
            this.applicationEventPublisher = applicationEventPublisher;
        }

    @Transactional
        public ResponseJson register(RegisterDto dto){
            Boolean isExist=userRepository.existsByUsername(dto.getUsername());

            if (isExist){
                log.warn("REGISTER_FAIL_USERNAME_EXISTS | username={}",
                    dto.getUsername()
            );
                throw new ResourceAlreadyExistException("User already exists with this username");

            }
            if (userRepository.existsByEmail(dto.getEmail())){
                log.warn("REGISTER_FAIL_EMAIL_EXISTS | email={}",
                        dto.getEmail()
                );
                throw new NotAllowed("Email is already register");
            }

            UserEntity user=new UserEntity();

            user.setUsername(dto.getUsername());
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
            user.setEmail(dto.getEmail());
            user.setRole(UserRole.USER);

            String otp=otpGenerate.otpGenerator();

            user.setOtp(otp);

            Long expireTime = System.currentTimeMillis()+ 10 * 60 * 1000;
            user.setOtpExpiretime(expireTime);

            user.setValid(false);

            userRepository.save(user);
            RegisterEvent registerEvent=new RegisterEvent(user.getEmail(), user.getOtp());

            registerEmailSender(registerEvent);

            ResponseJson responseJson=new ResponseJson("Successfully registered. Please verify your account.",LocalDateTime.now());
            return responseJson;

        }

        public ResponseJson accountVerification(AccountVerificationDto dto){
            UserEntity user=findUser(dto.getUsername());

            if(user.getValid()){
                log.warn("ALREADY_VERIFIED | username={}",
                        dto.getUsername()
                        );
                throw new GenericException("Already verified.");
            }

            String savedOtp=user.getOtp();

            otpVerified(savedOtp,dto.getOtp(),user);

            user.setOtp(null);
            user.setOtpExpiretime(null);
            user.setValid(true);

            userRepository.save(user);

            ResponseJson responseJson=new ResponseJson("Account verified successfully",LocalDateTime.now());
            return responseJson;
        }

        public TokenDto logIn(LogInDto dto) throws Exception {

            UserEntity user=findUser(dto.getUsername());

            if (!user.getValid()){
                log.warn("ATTEMPT_TO_LOGIN_WHEN_ACCOUNT_IS_NOT_VERIFIED | username={}",
                        dto.getUsername());
                throw new GenericException("Account not verified. Please verify your account first.");
            }
            try {
                authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(dto.getUsername(),dto.getPassword()));
            } catch (Exception ex) {
                log.warn("INVALID_LOGIN_ATTEMPT | username={}",
                        dto.getUsername()
                );
                throw new GenericException(String.valueOf(ex));
            }


            String token=jwtGenerator.jwtGenerator(user);

            return new TokenDto(token);
        }

         public ResponseJson requestOtp(OtpRequestForPasswordResetDto dto){
             UserEntity user=findUser(dto.getUsername());

             LocalDateTime lastOtpRequest=user.getLastTimeOtpRequest();
             if (lastOtpRequest!=null && lastOtpRequest.plusSeconds(60).isAfter(LocalDateTime.now())){
                 throw new NotAllowed("Wait for 60 seconds before requesting a otp");
             }

           ResponseJson responseJson=buildOtpSanderForPasswordReset(dto,user);

           return responseJson;

         }


         public ResponseJson passwordReset(PasswordReset passwordReset){
            UserEntity user=findUser(passwordReset.getUsername());

            String storeOtp=user.getOtp();

            otpVerified(storeOtp,passwordReset.getOtp(),user);

            user.setOtp(null);
            user.setOtpExpiretime(null);

            user.setPassword(passwordEncoder.encode(passwordReset.getPassword()));

            userRepository.save(user);

            ResponseJson responseJson =new ResponseJson("Password Change Successfully",LocalDateTime.now());
             log.info("PASSWORD_CHANGED_SUCCESSFULLY | username={}",
                     passwordReset.getUsername()
             );
            return responseJson;
         }

         //------------------------HELPER METHODS----------------------------------------//

          public ResponseDto sandEmail(RequestDto dto){
           UserEntity user=findUserById(dto.getId());


           ResponseDto dto1=new ResponseDto();
           dto1.setEmail(user.getEmail());

           return dto1;
         }


        public UserEntity findUser(String username){
            return userRepository.findByUsername(username)
                    .orElseThrow(()->new UsernameNotFoundException("User not found."));
        }
        public UserEntity findUserById(Long id){
            return userRepository.findById(id)
                    .orElseThrow(()->new UsernameNotFoundException("User not found."));
        }

    public void otpVerified(String savedOtp, String dtoOtp, UserEntity user) {

        if (dtoOtp == null || dtoOtp.trim().isEmpty()) {
            throw new OtpRelatedException("OTP cannot be null or empty.");
        }

        if (savedOtp == null || user.getOtpExpiretime() == null) {
            throw new OtpRelatedException("OTP not found. Please request a new one.");
        }

        if (Instant.now().toEpochMilli() > user.getOtpExpiretime()) {
            throw new OtpRelatedException("OTP expired.");
        }

        if (!savedOtp.equals(dtoOtp.trim())) {
            throw new OtpRelatedException("Invalid OTP.");
        }
    }


    public ResponseJson buildOtpSanderForPasswordReset(OtpRequestForPasswordResetDto dto,UserEntity user){


        user.setOtp(null);
        user.setOtpExpiretime(null);

        String newOtp=otpGenerate.otpGenerator();
        Long expiretime=otpGenerate.expireTime(10);

        user.setOtp(newOtp);
        user.setOtpExpiretime(expiretime);

        PasswordResetOtpRequestDto dto1=new PasswordResetOtpRequestDto();
        dto1.setOtp(newOtp);
        dto1.setEmail(user.getEmail());

        PasswordResetEvent passwordResetEvent=new PasswordResetEvent(newOtp, user.getEmail());

        passwordResetOtpEmail(passwordResetEvent);

        user.setLastTimeOtpRequest(LocalDateTime.now());
        userRepository.save(user);

        ResponseJson responseJson=new ResponseJson("OTP sent to your email",LocalDateTime.now());
        return responseJson;

    }



    @Retry(name = "email-service")
    @CircuitBreaker(name = "email-service",
                    fallbackMethod = "emailFallback")
    public void registerEmailSender(RegisterEvent registerEvent){
        applicationEventPublisher.publishEvent( registerEvent);
    }
    @Retry(name = "email-service")
    @CircuitBreaker(name = "email-service",
                    fallbackMethod = "emailFallback")
    public void passwordResetOtpEmail(PasswordResetEvent event){
        applicationEventPublisher.publishEvent( event);
    }

}