package com.CarScrap.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MetalResponseDto {
    private Double steel;
    private Double aluminum;
    private Double copper;
    private Double iron;
    private Double plastic;
    private Double rubber;
    private Double electronics;
    private Double lead;
}
