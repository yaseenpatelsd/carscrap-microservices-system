package com.CarScrap.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GlobalExceptionResponesDto {

    private LocalDateTime localDateTime;
    private int status;
    private String error;
    private String message;
    private String path;
}
