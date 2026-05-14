package com.carscrap.auth_service.GlobalException;

public class UsernameNotAvailable extends RuntimeException{
    public UsernameNotAvailable(String  message){
        super(message);
    }
}
