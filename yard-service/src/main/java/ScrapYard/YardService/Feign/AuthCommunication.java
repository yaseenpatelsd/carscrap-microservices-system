package ScrapYard.YardService.Feign;

import ScrapYard.YardService.Dto.AppointmentCommunication.StaffVerifyResponseDto;
import ScrapYard.YardService.Dto.AuthCommunication.AdminRequest;
import ScrapYard.YardService.Dto.AuthCommunication.AdminResponse;
import ScrapYard.YardService.Dto.AuthCommunication.StaffVerifyingRequestDto;
import ScrapYard.YardService.Dto.AuthCommunication.StaffVerifyingResponseDto;
import org.springframework.cloud.openfeign.FeignClient;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "AUTH-SERVICE")
public interface AuthCommunication {

    @PostMapping("/private/api/verify")
    AdminResponse validAdmin(@RequestBody AdminRequest dto);

    @PostMapping("private/api/staff/valid")
    StaffVerifyingResponseDto validStaff(@RequestBody StaffVerifyingRequestDto dto);
}
