package com.carscrap.auth_service.Service;

import com.carscrap.auth_service.Dto.AdminFlowResponseDto;
import com.carscrap.auth_service.Dto.AdminRegister;
import com.carscrap.auth_service.Dto.AdminResponseDto;
import com.carscrap.auth_service.Dto.AuthTOYardService.RequestDto;
import com.carscrap.auth_service.Dto.AuthTOYardService.ResponseDto;
import com.carscrap.auth_service.Entity.UserEntity;
import com.carscrap.auth_service.Enum.UserRole;
import com.carscrap.auth_service.GlobalException.*;
import com.carscrap.auth_service.Mapping.AdminMapping;
import com.carscrap.auth_service.Repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class AdminFlow {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    public AdminFlow(UserRepository userRepository, PasswordEncoder passwordEncoder ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;

    }

    public AdminFlowResponseDto registerAdmin( AdminRegister dto){

        if (userRepository.existsByUsername(dto.getUsername())){
            log.warn("TRY_TO_USE_USERNAME_WHICH_IS_ALREADY_USED | username={}",
                    dto.getUsername()
            );
            throw new UsernameNotAvailable("Username already taken .");
        }

        if(userRepository.existsByEmail(dto.getEmail())){
            log.warn("TRY_TO_USE_EMAIL_WHICH_IS_ALREADY_USED | username={}",
                    dto.getUsername()
            );
            throw new EmailAlreadyRegister("Email Already register to other account .");
        }


        UserEntity admin=new UserEntity();



        admin.setUsername(dto.getUsername());
        admin.setPassword(passwordEncoder.encode(dto.getPassword()));
        admin.setRole(UserRole.ADMIN);
        admin.setEmail(dto.getEmail());
        admin.setValid(true);


        userRepository.save(admin);

        AdminFlowResponseDto dto1=new AdminFlowResponseDto();
        dto1.setId(admin.getId());
        dto1.setUsername(dto.getUsername());
        dto1.setPassword(dto.getPassword());
        dto1.setEmail(admin.getEmail());
        dto1.setNote("Please keep this safe as it is provided only once.");

        return dto1;
    }

    public ResponseDto validAdmin(RequestDto dto){

        if (dto.getAdminId()==null){
            throw new NullPointerException("Admin id is null .");
        }
       try {
            UserEntity admin = findUserById(dto.getAdminId());

            ResponseDto dto1 = new ResponseDto();
            if (userRepository.existsByUsername(admin.getUsername())) {

                log.warn("INTERNAL_VALIDATION_SUCCESS | adminId={}",
                        dto.getAdminId());

                dto1.setValid(true);
            } else {
                dto1.setValid(false);

                log.warn("INTERNAL_VALIDATION_FAIL | adminId={}",
                        dto.getAdminId());
            }
            dto1.setUsername(admin.getUsername());
            return dto1;
        }catch (Exception e){
           log.error("FAILED ",e);
           throw new RuntimeException(e.getMessage());
       }
    }


    public List<AdminResponseDto> getAllAdminResponse(){
     List<UserEntity> admins=userRepository.findByRole(UserRole.ADMIN);

        List<AdminResponseDto> adminResponseDtos = admins.stream()
                .map(AdminMapping::toAdminResponse)
                .collect(Collectors.toList());


        return adminResponseDtos;
    }






    public UserEntity findUser(String username){
        return userRepository.findByUsername(username)
                .orElseThrow(()-> new NotFound("Account not found."));
    }
    public UserEntity findUserById(Long id){
        return userRepository.findById(id)
                .orElseThrow(()-> new NotFound("Account not found."));
    }

    public void roleCheck(UserEntity user, UserRole role){
        if (!user.getValid()){
            throw new NotAllowed("Account is not verified.");
        }

        if (!user.getRole().equals(role)){
            throw new UnAuthorized("Permission denied.");
        }
    }
}
