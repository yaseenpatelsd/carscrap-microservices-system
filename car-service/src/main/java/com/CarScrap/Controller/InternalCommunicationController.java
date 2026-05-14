package com.CarScrap.Controller;

import com.CarScrap.Dto.AppointmentCommunication.CarRequestDto;
import com.CarScrap.Dto.AppointmentCommunication.CarResposeDto;
import com.CarScrap.Enum.Principle;
import com.CarScrap.Service.CarService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/internal/api")
public class InternalCommunicationController {
    private final CarService carService;

    public InternalCommunicationController(CarService carService) {
        this.carService = carService;
    }

    @PostMapping("/confirm")
    public ResponseEntity<CarResposeDto> confirmCar( @RequestBody CarRequestDto dto){
        CarResposeDto carResposeDto=carService.confirmdetails(dto);
        return ResponseEntity.ok(carResposeDto);
    }
}
