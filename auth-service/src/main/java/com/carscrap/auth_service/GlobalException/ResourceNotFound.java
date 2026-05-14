package com.carscrap.auth_service.GlobalException;

public class ResourceNotFound extends RuntimeException{
    public ResourceNotFound(String message){
        super(message);
    }
}
