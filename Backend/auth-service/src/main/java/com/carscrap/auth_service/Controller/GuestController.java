package com.carscrap.auth_service.Controller;

import com.carscrap.auth_service.Dto.TokenDto;
import com.carscrap.auth_service.Service.GuestService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/guest")
@RestController
public class GuestController {

    private final GuestService guestService;

    public GuestController(GuestService guestService) {
        this.guestService = guestService;
    }

    @PostMapping("/register")
    public TokenDto register(){
        TokenDto staffResponse= guestService.GuestRegister();
        return staffResponse;
    }
}