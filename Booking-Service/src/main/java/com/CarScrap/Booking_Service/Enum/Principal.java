package com.CarScrap.Booking_Service.Enum;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Principal {
    private Long id;
    private String username;
    private String role;
}
