package com.carscrap.auth_service.Service;

import com.carscrap.auth_service.Dto.ResponseJson;
import com.carscrap.auth_service.Dto.Staff.StaffResponse;
import com.carscrap.auth_service.Dto.TokenDto;
import com.carscrap.auth_service.Entity.UserEntity;
import com.carscrap.auth_service.Enum.UserRole;
import com.carscrap.auth_service.GlobalException.EmailAlreadyRegister;
import com.carscrap.auth_service.GlobalException.GenericException;
import com.carscrap.auth_service.GlobalException.UsernameNotAvailable;
import com.carscrap.auth_service.Jwt.JwtGenerator;
import com.carscrap.auth_service.Repository.UserRepository;
import com.carscrap.auth_service.Util.UserNameANDPasswordGenerate;
import jakarta.transaction.Transactional;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class GuestService {
    private final JwtGenerator jwtGenerator;

    private final UserNameANDPasswordGenerate userNameANDPasswordGenerate;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    public GuestService(AuthenticationManager authenticationManager, JwtGenerator jwtGenerator, UserNameANDPasswordGenerate userNameANDPasswordGenerate, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.jwtGenerator = jwtGenerator;
        this.userNameANDPasswordGenerate = userNameANDPasswordGenerate;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public TokenDto GuestRegister(){
        TokenDto staffResponse= registerStaffBuilder();

        ResponseJson responseJson=new ResponseJson();
        responseJson.setMessage("Register as Guest");
        responseJson.setTimestamp(LocalDateTime.now());

       return staffResponse;
    }


    @Transactional
    public TokenDto registerStaffBuilder(){
        String username = null;
        String password=null;
        String email=null;
        username=userNameANDPasswordGenerate.getUsername(username);
        password=userNameANDPasswordGenerate.getPassword(password);
        email=userNameANDPasswordGenerate.getEmail(email);

        if (userRepository.existsByUsername(username)){
            throw new UsernameNotAvailable("Username is already register .");
        }

        if (userRepository.existsByEmail(email)){
            throw new EmailAlreadyRegister("Email Already registered .");
        }

        UserEntity guest=new UserEntity();
        guest.setUsername(username);
        guest.setPassword(passwordEncoder.encode(password));
        guest.setEmail(email);
        guest.setRole(UserRole.GUEST);
        guest.setValid(true);


        userRepository.save(guest);

        StaffResponse staffResponse=new StaffResponse();
        staffResponse.setId(guest.getId());
        staffResponse.setUsername(username);
        staffResponse.setPassword(password);
        staffResponse.setEmail(guest.getEmail());
        staffResponse.setRole(guest.getRole());



        TokenDto tokenDto=new TokenDto();
        tokenDto.setToken(jwtGenerator.jwtGenerator(guest));

        return tokenDto;
    }
}
