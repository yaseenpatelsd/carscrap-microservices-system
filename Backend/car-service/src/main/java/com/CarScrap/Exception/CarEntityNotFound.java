package com.CarScrap.Exception;

public class CarEntityNotFound extends RuntimeException{
    public CarEntityNotFound(String message){
        super(message);
    }
}
