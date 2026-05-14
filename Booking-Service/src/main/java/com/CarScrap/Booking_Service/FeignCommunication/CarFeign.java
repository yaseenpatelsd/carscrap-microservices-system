package com.CarScrap.Booking_Service.FeignCommunication;

import com.CarScrap.Booking_Service.Dto.CarCommunication.CarRequestDto;
import com.CarScrap.Booking_Service.Dto.CarCommunication.CarResponseDto;
import jakarta.validation.Valid;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "CAR-SERVICE"

)
public interface CarFeign {
    @PostMapping("/internal/api/confirm")
    CarResponseDto response(@Valid  @RequestBody CarRequestDto dto);
}
