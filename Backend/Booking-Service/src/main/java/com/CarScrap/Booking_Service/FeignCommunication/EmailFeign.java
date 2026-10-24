package com.CarScrap.Booking_Service.FeignCommunication;

import com.CarScrap.Booking_Service.Dto.ChangeStatusDto;
import com.CarScrap.Booking_Service.Dto.EmailCommunication.*;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "EMAIL-SERVICE")
public interface EmailFeign {

    @PostMapping("/email/cancel/appointment")
    void response(@RequestBody Request dto);

    @PostMapping("/email/booking/confirm")
    void BookingRequestDto(@RequestBody BookingRequestDto dto);
    @PostMapping("/email/booking/cancel/user")
    void cancelRequestDto(@RequestBody CancelRequestDto dto);
@PostMapping("/email/booking/status/update")
    void statusUpdateDto(@RequestBody StatusUpdateDto dto);

@PostMapping("/email/booking/postpone")
    void postponeUpdate(@RequestBody PostPoneAppointmentDto dto);

}
