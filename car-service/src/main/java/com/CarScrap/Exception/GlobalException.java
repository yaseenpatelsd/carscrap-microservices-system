package com.CarScrap.Exception;

import com.CarScrap.Dto.GlobalExceptionResponesDto;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalException {

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<GlobalExceptionResponesDto> notFoundExeption(NotFoundException ex,HttpServletRequest request){
        return build(HttpStatus.NOT_FOUND,"Resource not found",ex.getMessage(),request);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<GlobalExceptionResponesDto> handleValidationException(
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
    @ExceptionHandler(SomethingIsWrongException.class)
    public ResponseEntity<GlobalExceptionResponesDto> somethingIsWrong(SomethingIsWrongException ex,HttpServletRequest request){
        return build(HttpStatus.INTERNAL_SERVER_ERROR,"Something Went Wrong!",ex.getMessage(),request);
    }
    @ExceptionHandler(NotAllowedException.class)
    public ResponseEntity<GlobalExceptionResponesDto> notAlllowed(NotAllowedException ex,HttpServletRequest request){
        return build(HttpStatus.METHOD_NOT_ALLOWED,"Something seem like the entity dont belongs to you!",ex.getMessage(),request);
    }

    @ExceptionHandler(NotExpireException.class)
    public ResponseEntity<GlobalExceptionResponesDto> notExpire(NotExpireException ex,HttpServletRequest request){
        return build(HttpStatus.CONFLICT,"Seems like Vehicle is not expire!!",ex.getMessage(),request);
    }


    public ResponseEntity<GlobalExceptionResponesDto> build(
            HttpStatus status,
            String error,
            String message,
            HttpServletRequest request
    ){
        GlobalExceptionResponesDto dto=new GlobalExceptionResponesDto(
        LocalDateTime.now(),
                status.value(),
                error,
                message,
                request.getRequestURI()
        );

        return ResponseEntity.status(status).body(dto);
    }
}
