package com.CarScrap.Booking_Service.Exceptions;

import com.CarScrap.Booking_Service.Dto.GEResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletionException;

@RestControllerAdvice
public class GlobalException {

    @ExceptionHandler(CantCancelException.class)
    public ResponseEntity<GEResponse> cantCancelExeption(CantCancelException c,HttpServletRequest request){
        return build(HttpStatus.CONFLICT,"Can't Cancel Appointment At This Moment .",c.getMessage(),request);
    }
    @ExceptionHandler(CarDetailsNotFound.class)
    public ResponseEntity<GEResponse> cantCancelExeption(CarDetailsNotFound c,HttpServletRequest request){
        return build(HttpStatus.NOT_FOUND,"Can't Find Car Entity Details .",c.getMessage(),request);
    }
    @ExceptionHandler(DublicateBookingException.class)
    public ResponseEntity<GEResponse> cantCancelExeption(DublicateBookingException c,HttpServletRequest request){
        return build(HttpStatus.BAD_REQUEST,"Multiple Booking Detected On Same Day . .",c.getMessage(),request);
    }
    @ExceptionHandler(EmailNotFoundException.class)
    public ResponseEntity<GEResponse> cantCancelExeption(EmailNotFoundException c,HttpServletRequest request){
        return build(HttpStatus.NOT_FOUND,"Can't Find Email .",c.getMessage(),request);
    }
    @ExceptionHandler(NotAllowedException.class)
    public ResponseEntity<GEResponse> cantCancelExeption(NotAllowedException c,HttpServletRequest request){
        return build(HttpStatus.FORBIDDEN,"Not Allowed To Do This . .",c.getMessage(),request);
    }
    @ExceptionHandler(NotBelongsException.class)
    public ResponseEntity<GEResponse> cantCancelExeption(NotBelongsException c,HttpServletRequest request){
        return build(HttpStatus.FORBIDDEN,"Entity Not Belongs To You . .",c.getMessage(),request);
    }
    @ExceptionHandler(YardNotFound.class)
    public ResponseEntity<GEResponse> cantCancelExeption(YardNotFound c,HttpServletRequest request){
        return build(HttpStatus.NOT_FOUND,"Can't Find Yard . .",c.getMessage(),request);
    }

    @ExceptionHandler(AppointmentDoesNotExistException.class)
    public ResponseEntity<GEResponse> cantCancelExeption(AppointmentDoesNotExistException c,HttpServletRequest request){
        return build(HttpStatus.NOT_FOUND,"Can't Find Appointment . .",c.getMessage(),request);
    }

    @ExceptionHandler(StaffAlreadyAssignToAppointmentExcepttion.class)
    public ResponseEntity<GEResponse> cantCancelExeption(StaffAlreadyAssignToAppointmentExcepttion c,HttpServletRequest request){
        return build(HttpStatus.CONFLICT,"Staff Already Assign . .",c.getMessage(),request);
    }
    @ExceptionHandler(StaffDoesNotExist.class)
    public ResponseEntity<GEResponse> cantCancelExeption(StaffDoesNotExist c,HttpServletRequest request){
        return build(HttpStatus.NOT_FOUND,"Staff Not Found . .",c.getMessage(),request);
    }

    @ExceptionHandler(AdminDoesNotBelongsToYardException.class)
    public ResponseEntity<GEResponse> cantCancelExeption(AdminDoesNotBelongsToYardException c,HttpServletRequest request){
        return build(HttpStatus.FORBIDDEN,"Admin Does Not Belongs To Yard . .",c.getMessage(),request);
    }
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<GEResponse> cantCancelExeption(NotFoundException c,HttpServletRequest request){
        return build(HttpStatus.NOT_FOUND,"Not Found . .",c.getMessage(),request);
    }


    @ExceptionHandler(CarServiceException.class)
    public ResponseEntity<?> handleCarServiceException(CarServiceException ex){

        return ResponseEntity
                .status(ex.getStatus())
                .body(new GEResponse(
                        LocalDateTime.now(),
                        ex.getStatus(),
                        "External Service Error",
                        ex.getMessage(),
                        ""
                ));
    }
   @ExceptionHandler(YardServiceException.class)
    public ResponseEntity<?> handleCarServiceException(YardServiceException ex){

       return ResponseEntity
               .status(ex.getStatus())
               .body(new GEResponse(
                       LocalDateTime.now(),
                       ex.getStatus(),
                       "External Service Error",
                       ex.getMessage(),
                       ""
               ));
    }
    @ExceptionHandler(CompletionException.class)
    public ResponseEntity<?> handleCompletionException(CompletionException ex) {

        Throwable cause = ex.getCause();

        if (cause instanceof CarServiceException) {
            return handleCarServiceException((CarServiceException) cause);
        }

        if (cause instanceof YardServiceException) {
            return handleCarServiceException((YardServiceException) cause);
        }

        return ResponseEntity.status(500)
                .body("Async error: " + cause.getMessage());
    }

    public ResponseEntity<GEResponse> build(
            HttpStatus status,
            String error,
            String message,
            HttpServletRequest request
    ){
        GEResponse geResponse=new GEResponse(
                LocalDateTime.now(),
                status.value(),
                error,
                message,
                request.getRequestURI()
        );
        return ResponseEntity.status(status).body(geResponse);
    }
}
