package com.CarScrap.Exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class CarServiceExeption extends RuntimeException{
    private Integer status;

    public CarServiceExeption(int status, String message) {
        super(message);
        this.status = status;
    }

    public int getStatus() {
        return status;
    }
}
