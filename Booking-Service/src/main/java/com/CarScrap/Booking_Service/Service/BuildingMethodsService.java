package com.CarScrap.Booking_Service.Service;


import com.CarScrap.Booking_Service.Dto.AuthComminication.ResponseDto;
import com.CarScrap.Booking_Service.Dto.EmailCommunication.CancelRequestDto;
import com.CarScrap.Booking_Service.Dto.EmailCommunication.StatusUpdateDto;
import com.CarScrap.Booking_Service.Entity.AppointmentBookingEntity;
import com.CarScrap.Booking_Service.Enum.Principal;
import com.CarScrap.Booking_Service.Enum.Role;
import com.CarScrap.Booking_Service.Enum.Status;
import com.CarScrap.Booking_Service.Exceptions.*;
import com.CarScrap.Booking_Service.FeignCommunication.AuthCommunication;
import com.CarScrap.Booking_Service.Repository.AppointmentRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Set;
import java.util.concurrent.CompletableFuture;

@Service
public class BuildingMethodsService {
    private final AppointmentRepository appointmentRepository;
    private final AuthCommunication authCommunication;

    public BuildingMethodsService(AppointmentRepository appointmentRepository, AuthCommunication authCommunication) {
        this.appointmentRepository = appointmentRepository;
        this.authCommunication = authCommunication;
    }



    public void confirmManagementRole(Principal principal) {
        Set<Role> allowedRole = Set.of(Role.SUPER_ADMIN, Role.ADMIN, Role.STAFF);

        Role role=Role.valueOf(principal.getRole().trim());
        boolean isExist=allowedRole.contains(role);

        if (!isExist){
            throw new NotAllowedException("You are not Allowed to do this task");
        }
    }

    public AppointmentBookingEntity findAppointment(Long id){
        return appointmentRepository.findById(id)
                .orElseThrow(()-> new AppointmentDoesNotExistException("Can't Find Appointment ."));
    }

    @Transactional
    public AppointmentBookingEntity saveAppointment(AppointmentBookingEntity appointmentBookingEntity){
        return appointmentRepository.save(appointmentBookingEntity);
    }


    public void validateCancelable(AppointmentBookingEntity appointmentBookingEntity){
        if (appointmentBookingEntity.getStatus()==(Status.CANCEL)){
            throw new CantCancelException("Appointment is already cancel");
        }
        if (appointmentBookingEntity.getStatus()==(Status.SUCCESSFUL)){
            throw new CantCancelException("Appointment is already Successful");
        }
        LocalDate today = LocalDate.now(ZoneId.of("Asia/Kolkata"));

        if (appointmentBookingEntity.getDateOfAppointment().isBefore(today)){
            throw new CantCancelException("Appointment time is passed");
        }

    }


    public com.CarScrap.Booking_Service.Dto.AuthComminication.ResponseDto findEmailOfUser(Principal principal){
        com.CarScrap.Booking_Service.Dto.AuthComminication.RequestDto requestDto=new com.CarScrap.Booking_Service.Dto.AuthComminication.RequestDto();
        requestDto.setId(principal.getId());

        CompletableFuture<ResponseDto> emailSanderCompleteFuture=CompletableFuture.supplyAsync(()->authCommunication.respones(requestDto));

        ResponseDto response = emailSanderCompleteFuture.join();

        if (response.getEmail()==null || response.getEmail().isEmpty()){
            throw new EmailNotFoundException("Can't find a email!");
        }

        return response;
    }


    public CancelRequestDto cancelRequestDtoHelper(AppointmentBookingEntity saved){
        CancelRequestDto cancelRequestDto=new CancelRequestDto();
        cancelRequestDto.setAppointmentId(saved.getId());
        cancelRequestDto.setUsername(saved.getUsername());
        cancelRequestDto.setEmail(saved.getEmail());
        cancelRequestDto.setCarName(saved.getCarName());
        cancelRequestDto.setRegistrationYear(saved.getRegistrationYear());
        cancelRequestDto.setVehicleType(saved.getVehicleType());
        cancelRequestDto.setDateOfExpire(saved.getDateOfExpire());
        cancelRequestDto.setFuelType(saved.getFuelType());
        cancelRequestDto.setEstimatePrice(saved.getEstimatePrice());
        cancelRequestDto.setStatus(saved.getStatus());
        cancelRequestDto.setReason(saved.getCancelReason());
        return cancelRequestDto;
    }

    public StatusUpdateDto statusUpdateBuilder(AppointmentBookingEntity appointmentBookingEntity){
        StatusUpdateDto statusUpdateDto=new StatusUpdateDto();
        statusUpdateDto.setAppointmentId(appointmentBookingEntity.getId());
        statusUpdateDto.setEmail(appointmentBookingEntity.getEmail());
        statusUpdateDto.setUsername(appointmentBookingEntity.getUsername());
        statusUpdateDto.setCarName(appointmentBookingEntity.getCarName());
        statusUpdateDto.setFuelType(appointmentBookingEntity.getFuelType());

        statusUpdateDto.setVehicleType(appointmentBookingEntity.getVehicleType());
        statusUpdateDto.setRegistrationYear(appointmentBookingEntity.getRegistrationYear());
        statusUpdateDto.setEstimatePrice(appointmentBookingEntity.getEstimatePrice());
        statusUpdateDto.setStatus(appointmentBookingEntity.getStatus());

        return statusUpdateDto;
    }

    public void managementOwnerShip(Principal principal,AppointmentBookingEntity appointmentBookingEntity){
        if (principal.getRole().equals(Role.ADMIN.name())){

            if (appointmentBookingEntity.getAdminId()==null){
                throw new com.CarScrap.Booking_Service.Exceptions.NotFoundException("Appointment does not have admin");
            }
            if (!appointmentBookingEntity.getAdminId().equals(principal.getId())){
                throw new com.CarScrap.Booking_Service.Exceptions.NotFoundException("Appointment does not belongs to you !");
            }
        }else if (principal.getRole().equals(Role.STAFF.name())){
            if (appointmentBookingEntity.getStaffId()==null){
                throw new NotFoundException("Appointment does not have staff");
            }
            if (!appointmentBookingEntity.getStaffId().equals(principal.getId())){
                throw new NotAllowedException("Appointment does not belongs to you !");
            }
        }else {
            throw new NotAllowedException("Not Allowed to access this api");
        }

    }




}
