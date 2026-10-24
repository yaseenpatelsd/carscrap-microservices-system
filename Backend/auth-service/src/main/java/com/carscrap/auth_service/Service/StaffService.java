package com.carscrap.auth_service.Service;



import com.carscrap.auth_service.Dto.AuthTOYardService.*;
import com.carscrap.auth_service.Dto.Staff.*;
import com.carscrap.auth_service.Entity.UserEntity;
import com.carscrap.auth_service.Enum.Principle;
import com.carscrap.auth_service.Enum.UserRole;
import com.carscrap.auth_service.FeignInterface.YardClient;
import com.carscrap.auth_service.GlobalException.EmailAlreadyRegister;
import com.carscrap.auth_service.GlobalException.NotAllowed;
import com.carscrap.auth_service.GlobalException.UnAuthorized;
import com.carscrap.auth_service.GlobalException.UsernameNotAvailable;
import com.carscrap.auth_service.Mapping.StaffMapping;
import com.carscrap.auth_service.Repository.UserRepository;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;



@Service
public class StaffService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final YardClient yardClient;

    public StaffService(UserRepository userRepository, PasswordEncoder passwordEncoder, YardClient yardClient) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.yardClient = yardClient;
    }

    @Transactional
    public StaffResponse createStaff(Principle principle ,StaffRequest dto){
        authenticationFilter(principle,UserRole.SUPER_ADMIN);
        StaffResponse staffResponse=registerStaffBuilder(dto.getUsername(), dto.getEmail(), dto.getPassword());

        return staffResponse;
    }


    @Transactional
    public StaffResponse createStaffAndAssignToYard(Principle principle,StaffAddByAdminRequestDto dto){
        StaffResponse staffResponse=registerStaffBuilder(dto.getUsername(), dto.getPassword(), dto.getPassword());


        authenticationFilter(principle,UserRole.ADMIN);

        GetYardBYAdminId getYardBYAdminId=new GetYardBYAdminId(principle.getId());


        YardIdResponseDto yardIdResponseDto=yardClient.yardIdResponse(getYardBYAdminId);

        StaffAssignToYardByAdminRequestDto staffAssignToYardByAdminRequestDto=new StaffAssignToYardByAdminRequestDto(staffResponse.getId(), yardIdResponseDto.getYardId());
        yardClient.staffAddByAdmin(staffAssignToYardByAdminRequestDto);



        return staffResponse;
    }


    public StaffVerificationResponseDto verificationResponseDto(StaffVerifiedRequestDto dto){
        StaffVerificationResponseDto responseDto = new StaffVerificationResponseDto();

        Optional<UserEntity> userOpt = userRepository.findById(dto.getStaffId());

        if (userOpt.isPresent()) {
            UserEntity user = userOpt.get();
            responseDto.setValid(true);
            responseDto.setUsername(user.getUsername());
        } else {
            responseDto.setValid(false);
            responseDto.setUsername(null);
        }

        return responseDto;

    }


    public List<StaffGetByRoleResponseDto> getAllStaff(){
        List<UserEntity> userEntities=userRepository.findByRole(UserRole.STAFF);

        List<StaffGetByRoleResponseDto> staffGetByRoleResponseDto=userEntities.stream().map(StaffMapping::toResponse).collect(Collectors.toList());

        return staffGetByRoleResponseDto;
    }


    public List<GetStaffByIdsResponse> listofStaffInAYard(StaffIdGetRequestDto dto) {


        List<StaffIdsResponse> response = yardClient.staffIdResponse(dto);

        List<Long> staffIds = response.stream()
                .map(StaffIdsResponse::getId)
                .flatMap(List::stream)
                .collect(Collectors.toList());

        List<UserEntity> users = userRepository.findAllById(staffIds);

       return users.stream().map(StaffMapping::toGetYardStaffResponse).collect(Collectors.toList());
    }


    public List<GetStaffByIdsResponse> listOfStaffInYardForAdmin(){

        List<StaffIdsResponse>  staffIdsResponse=yardClient.getStaffIdsFromYard();


        List<Long> staffIds = staffIdsResponse.stream()
                .map(StaffIdsResponse::getId)
                .flatMap(List::stream)
                .collect(Collectors.toList());

        List<UserEntity> staffs=userRepository.findAllById(staffIds);

        return staffs.stream().map(StaffMapping::toGetYardStaffResponse).collect(Collectors.toList());
    }




    public void authenticationFilter(Principle principle,UserRole role){
        if (principle==null){
            throw new UnAuthorized("UnAuthorized!");
        }

        if (!principle.getRole().equals(role.name())){
            throw new NotAllowed("UnAuthorized Role Not Match To Access This Api");
        }

    }
    public UserEntity findUser(String username){
        return userRepository.findByUsername(username)
                .orElseThrow(()->new NotFoundException("User not found with the given username."));
    }
    public UserEntity findUserById(Long id){
        return userRepository.findById(id)
                .orElseThrow(()->new NotFoundException("User not found with the given id."));
    }

    public StaffResponse registerStaffBuilder(String username,String email,String password){
        if (userRepository.existsByUsername(username)){
            throw new UsernameNotAvailable("Username is already register .");
        }

        if (userRepository.existsByEmail(email)){
            throw new EmailAlreadyRegister("Email Already registered .");
        }

        UserEntity staff=new UserEntity();
        staff.setUsername(username);
        staff.setPassword(passwordEncoder.encode(password));
        staff.setEmail(email);
        staff.setRole(UserRole.STAFF);
        staff.setValid(true);


        userRepository.save(staff);

        StaffResponse staffResponse=new StaffResponse();
        staffResponse.setId(staff.getId());
        staffResponse.setUsername(username);
        staffResponse.setPassword(password);
        staffResponse.setEmail(staff.getEmail());
        staffResponse.setRole(staff.getRole());


        return staffResponse;
    }

    public void roleCheck(UserEntity user, UserRole role,UserRole role1){
        if (!user.getRole().equals(role) && !user.equals(role1)){
            throw new NotAllowed("Not authorized.");
        }
    }
}

