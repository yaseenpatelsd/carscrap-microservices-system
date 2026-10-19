package com.CarScrap.Exception;

public class SomethingIsWrongException extends RuntimeException{

    public SomethingIsWrongException(String message){
        super(message);
    }
}
