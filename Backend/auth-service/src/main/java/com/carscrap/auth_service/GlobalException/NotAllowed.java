package com.carscrap.auth_service.GlobalException;

public class NotAllowed extends RuntimeException{
    public NotAllowed(String message){
        super(message);
    }
}
