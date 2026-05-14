package com.carscrap.auth_service.Util;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Component
public class OtpGenerate {

    private static final SecureRandom secureRandom=new SecureRandom();
    public String otpGenerator(){
        int otp=100000+ secureRandom.nextInt(900000);
        return String.valueOf(otp);
    }

    public Long expireTime(int ExpireTime){
        return Instant.now()
                .plus(ExpireTime, ChronoUnit.MINUTES)
                .toEpochMilli();

    }


}
