package com.CarScrap.Controller;

import com.CarScrap.Dto.GetCar;
import com.CarScrap.Dto.RequestDto;
import com.CarScrap.Dto.ResponseDto;
import com.CarScrap.Enum.Principle;
import com.CarScrap.Service.CarService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@Slf4j
@RestController
@RequestMapping("/car")
public class CarController {

    private final CarService carService;

    public CarController(CarService carService) {
        this.carService = carService;
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/get-price")
    public ResponseEntity<ResponseDto> findCarEstimatePrice(@AuthenticationPrincipal Principle principle, @RequestBody @Valid RequestDto dto) {
        ResponseDto dto1 = carService.getCarPrice(principle,dto);
        log.info("GET_PRICE_SUCCESSFULLY | userId={} | carName={}| estimateprice={} ",
                principle.getId(),
                dto1.getName(),
                dto1.getEstimatePrice()
                );
        return ResponseEntity.ok(dto1);
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/get-detail")
    public ResponseEntity<ResponseDto> seeCarDetails(@AuthenticationPrincipal Principle principle ,@RequestBody @Valid GetCar car){
        ResponseDto dto1=carService.getCarDetails(car,principle);
        return ResponseEntity.ok(dto1);
    }




    @GetMapping("/all-request")
    public ResponseEntity<List<ResponseDto>> responseEntity(@AuthenticationPrincipal Principle principle){
        List<ResponseDto> dtos=carService.getAllRequest(principle);

        return ResponseEntity.ok(dtos);
    }


}
