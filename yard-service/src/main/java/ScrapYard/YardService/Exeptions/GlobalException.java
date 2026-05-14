package ScrapYard.YardService.Exeptions;

import ScrapYard.YardService.Dto.GlobalResponseDto;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.concurrent.CompletionException;

@ControllerAdvice
public class GlobalException {

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<GlobalResponseDto> notFound(NotFoundException nf,HttpServletRequest request){
        return build(HttpStatus.NOT_FOUND,"Yard Not Found",nf.getMessage(),request);
    }

    @ExceptionHandler(AdminAssignException.class)
    public ResponseEntity<GlobalResponseDto> notFound(AdminAssignException nf,HttpServletRequest request){
        return build(HttpStatus.NOT_ACCEPTABLE,"Admin related Error",nf.getMessage(),request);
    }

    @ExceptionHandler(NotManagementError.class)
    public ResponseEntity<GlobalResponseDto> notFound(NotManagementError nf,HttpServletRequest request){
        return build(HttpStatus.NOT_ACCEPTABLE,"Not Management",nf.getMessage(),request);
    }

    @ExceptionHandler(SomethingIsWrongException.class)
    public ResponseEntity<GlobalResponseDto> notFound(SomethingIsWrongException nf,HttpServletRequest request){
        return build(HttpStatus.INTERNAL_SERVER_ERROR,"Something went wrong",nf.getMessage(),request);
    }
 @ExceptionHandler(StatusRelatedError.class)
    public ResponseEntity<GlobalResponseDto> notFound(StatusRelatedError nf,HttpServletRequest request){
        return build(HttpStatus.MULTI_STATUS,"Something went wrong",nf.getMessage(),request);
    }
@ExceptionHandler(StaffNotFoundException.class)
    public ResponseEntity<GlobalResponseDto> notFound(StaffNotFoundException nf,HttpServletRequest request){
        return build(HttpStatus.NOT_FOUND,"Staff not found .",nf.getMessage(),request);
    }
@ExceptionHandler(StaffRelatedError.class)
    public ResponseEntity<GlobalResponseDto> notFound(StaffRelatedError nf,HttpServletRequest request){
        return build(HttpStatus.SERVICE_UNAVAILABLE,"Staff Related Errors .",nf.getMessage(),request);
    }

    @ExceptionHandler(StaffAlreadyExistException.class)
    public ResponseEntity<GlobalResponseDto> notFound(StaffAlreadyExistException nf,HttpServletRequest request){
        return build(HttpStatus.ALREADY_REPORTED,"Staff Exists  .",nf.getMessage(),request);
    }


    @ExceptionHandler(CarServiceException.class)
    public ResponseEntity<?> handleCarServiceException(CarServiceException ex){

        return ResponseEntity
                .status(ex.getStatus())
                .body(new GlobalResponseDto(
                        LocalDateTime.now(),
                        ex.getStatus(),
                        "External Service Error",
                        ex.getMessage(),
                        ""
                ));
    }
    @ExceptionHandler(AuthServiceExceptions.class)
    public ResponseEntity<?> handleCarServiceException(AuthServiceExceptions ex){

        return ResponseEntity
                .status(ex.getStatus())
                .body(new GlobalResponseDto(
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

        if (cause instanceof AuthServiceExceptions) {
            return handleCarServiceException((AuthServiceExceptions) cause);
        }

        return ResponseEntity.status(500)
                .body("Async error: " + cause.getMessage());
    }




    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<GlobalResponseDto> handleValidationException(
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

    public ResponseEntity<GlobalResponseDto> build(
            HttpStatus status,
            String error,
            String message,
            HttpServletRequest request
    ){

        GlobalResponseDto dto=new GlobalResponseDto(
                LocalDateTime.now(),
                status.value(),
                error,
                message,
                request.getRequestURI()
        );

        return ResponseEntity.status(status).body(dto);
    }
}
