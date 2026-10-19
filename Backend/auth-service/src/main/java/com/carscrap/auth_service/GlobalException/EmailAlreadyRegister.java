package com.carscrap.auth_service.GlobalException;

public class EmailAlreadyRegister extends RuntimeException{

    public EmailAlreadyRegister(String message){
        super(message);
    }
}
