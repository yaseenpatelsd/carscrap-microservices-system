package com.carscrap.auth_service.GlobalException;

public class ResourceAlreadyExistException extends RuntimeException{
    public ResourceAlreadyExistException (String message){
        super(message);
    }
}
