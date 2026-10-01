package com.CarScrap.Booking_Service.FeignCommunication;

import com.CarScrap.Booking_Service.Dto.AuthComminication.RequestDto;
import com.CarScrap.Booking_Service.Dto.AuthComminication.ResponseDto;
import com.CarScrap.Booking_Service.Dto.AuthComminication.StaffRequstDto;
import com.CarScrap.Booking_Service.Dto.AuthComminication.StaffResponseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "AUTH-SERVICE")
public interface AuthCommunication {

    @PostMapping("/private/api/getEmail")
    ResponseDto respones(@RequestBody RequestDto dto);

@PostMapping("/private/api/staff/valid")
StaffResponseDto staffResponseDto(@RequestBody StaffRequstDto dto);


}
