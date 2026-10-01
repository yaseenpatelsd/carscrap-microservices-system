package com.carscrap.auth_service.Util;
import org.springframework.stereotype.Component;

import java.util.Random;

@Component
public class UserNameANDPasswordGenerate {

    private final OtpGenerate otpGenerate;

    public UserNameANDPasswordGenerate(OtpGenerate otpGenerate) {
        this.otpGenerate = otpGenerate;
    }


    public String getUsername(String username){
        return "Guast"+ otpGenerate.otpGenerator();
    }


    public String getPassword(String password){
        String character="asdffghjklqwertyuiopzxcvbnm"+"@@#$%^&*"+"12358473638";

        Random random=new Random();

        StringBuilder p=new StringBuilder();

        for (int i = 0; i < 8; i++) {
            int index = random.nextInt(character.length());
            p.append(character.charAt(index));
        }

        return p.toString();
    }

    public String getEmail(String email){
        return "Guest"+otpGenerate.otpGenerator()+"@"+"gmail.com";
    }


}
