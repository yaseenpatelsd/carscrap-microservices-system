package com.carscrap.auth_service.GlobalException;

public class NotFound extends RuntimeException{
    public NotFound(String message){
        super(message);
    }
}
