package com.CarScrap.Controller;

import com.CarScrap.Dto.MetalRequestDto;
import com.CarScrap.Dto.MetalResponseDto;
import com.CarScrap.Service.MetalService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@Slf4j
@RestController
@RequestMapping("/metal")
public class MetalController {

    private final MetalService metalService;

    public MetalController(MetalService metalService) {
        this.metalService = metalService;
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PatchMapping("/change-metal-price")
    public ResponseEntity<MetalResponseDto> changePrice(@RequestBody MetalRequestDto dto){
        MetalResponseDto dto1=metalService.editPrice(dto);
        log.info("METAL_PRICE_CHANGE | details={}",
                dto
                );
        return ResponseEntity.ok(dto1);
    }

    @GetMapping("/get-metal-price")
    public ResponseEntity<MetalResponseDto> getMetalPrice(){


        return ResponseEntity.ok(  metalService.getMetalPrice());
    }
}
