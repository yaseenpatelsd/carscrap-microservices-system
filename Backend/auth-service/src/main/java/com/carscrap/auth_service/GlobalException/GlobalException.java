package com.carscrap.auth_service.GlobalException;

import com.carscrap.auth_service.Dto.ExceptionHandlingResponseDto;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalException {


    @ExceptionHandler(GenericException.class)
    public ResponseEntity<ExceptionHandlingResponseDto> GenericException(GenericException g,HttpServletRequest request){
        return build(HttpStatus.INTERNAL_SERVER_ERROR,"Something is wrong! ",g.getMessage(),request);
    }

    @ExceptionHandler(NotAllowed.class)
    public ResponseEntity<ExceptionHandlingResponseDto> otpHandler(NotAllowed g,HttpServletRequest request){
        return build(HttpStatus.FORBIDDEN,"Something is wrong with OTP ",g.getMessage(),request);
    }

    @ExceptionHandler(OtpRelatedException.class)
    public ResponseEntity<ExceptionHandlingResponseDto> otpHandler(OtpRelatedException g,HttpServletRequest request){
        return build(HttpStatus.INTERNAL_SERVER_ERROR,"Something is wrong with OTP ",g.getMessage(),request);
    }

    @ExceptionHandler(ResourceNotFound.class)
    public ResponseEntity<ExceptionHandlingResponseDto> exeption(ResourceNotFound rs,HttpServletRequest request){
        return build(HttpStatus.NOT_FOUND , "Resource Not Found ", rs.getMessage(),request);
    }

    @ExceptionHandler(ResourceAlreadyExistException.class)
    public ResponseEntity<ExceptionHandlingResponseDto> resourceAlreeadyReported(ResourceAlreadyExistException ss,HttpServletRequest request){
        return build(HttpStatus.ALREADY_REPORTED,"Already Reported ",ss.getMessage(),request);
    }

    @ExceptionHandler(UnAuthorized.class)
    public ResponseEntity<ExceptionHandlingResponseDto> otpHandler(UnAuthorized g,HttpServletRequest request){
        return build(HttpStatus.UNAUTHORIZED,"Something is wrong with OTP ",g.getMessage(),request);
    }


    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ExceptionHandlingResponseDto> handleValidationException(
            MethodArgumentNotValidException ex,
            HttpServletRequest request
    ) {

        String message = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .findFirst()
                .orElse("Validation error");

        return build(
                HttpStatus.BAD_REQUEST,
                "Validation Failed",
                message,
                request
        );


    }
    public ResponseEntity<ExceptionHandlingResponseDto> build(
            HttpStatus status,
            String error,
            String message,
            HttpServletRequest request

    ){
       ExceptionHandlingResponseDto responseDto=new ExceptionHandlingResponseDto(
               LocalDateTime.now(),
               status.value(),
               error,
               message,
               request.getRequestURI()
       );
       return ResponseEntity.status(status).body(responseDto);
    }
}
