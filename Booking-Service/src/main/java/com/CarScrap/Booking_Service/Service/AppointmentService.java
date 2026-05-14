package com.CarScrap.Booking_Service.Service;

import com.CarScrap.Booking_Service.Dto.*;
import com.CarScrap.Booking_Service.Dto.AuthComminication.StaffRequstDto;
import com.CarScrap.Booking_Service.Dto.AuthComminication.StaffResponseDto;
import com.CarScrap.Booking_Service.Dto.CarCommunication.CarRequestDto;
import com.CarScrap.Booking_Service.Dto.CarCommunication.CarResponseDto;
import com.CarScrap.Booking_Service.Dto.EmailCommunication.BookingRequestDto;
import com.CarScrap.Booking_Service.Dto.EmailCommunication.CancelRequestDto;
import com.CarScrap.Booking_Service.Dto.EmailCommunication.StatusUpdateDto;
import com.CarScrap.Booking_Service.Dto.GetAppointment.*;
import com.CarScrap.Booking_Service.Dto.YardCommunication.*;
import com.CarScrap.Booking_Service.Entity.AppointmentBookingEntity;
import com.CarScrap.Booking_Service.Enum.Principal;
import com.CarScrap.Booking_Service.Enum.Status;
import com.CarScrap.Booking_Service.EventBase.*;
import com.CarScrap.Booking_Service.Exceptions.*;
import com.CarScrap.Booking_Service.FeignCommunication.AuthCommunication;
import com.CarScrap.Booking_Service.FeignCommunication.CarFeign;
import com.CarScrap.Booking_Service.FeignCommunication.EmailFeign;
import com.CarScrap.Booking_Service.Mapping.AppointmentBookingMapping;
import com.CarScrap.Booking_Service.Mapping.EventHandlerMapping;
import com.CarScrap.Booking_Service.Mapping.PostponeEmailHandlingMapping;
import com.CarScrap.Booking_Service.Repository.AppointmentRepository;
import com.CarScrap.Booking_Service.FeignCommunication.YardFeign;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import jakarta.ws.rs.NotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;
import com.CarScrap.Booking_Service.Dto.EmailCommunication.PostPoneAppointmentDto;

@Service
@Slf4j
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final YardFeign yardFeign;
    private final CarFeign carFeign;
    private final EmailFeign emailFeign;
    private final AuthCommunication authCommunication;
    private final ApplicationEventPublisher applicationEventPublisher;
    private final BuildingMethodsService buildingMethodsService;

    public AppointmentService(AppointmentRepository appointmentRepository, YardFeign yardFeign, CarFeign carFeign, EmailFeign emailFeign, AuthCommunication authCommunication, ApplicationEventPublisher applicationEventPublisher, BuildingMethodsService buildingMethodsService) {
        this.appointmentRepository = appointmentRepository;
        this.yardFeign = yardFeign;
        this.carFeign = carFeign;
        this.emailFeign = emailFeign;
        this.authCommunication = authCommunication;
        this.applicationEventPublisher = applicationEventPublisher;
        this.buildingMethodsService = buildingMethodsService;
    }


    public ResponseDto createAppointment(Principal principal, RequestDto dto){

        if (principal==null){
            throw new NotAllowedException("UnAuthorized");
        }

        Boolean isAlreadyBook=appointmentRepository.existsByUserIdAndCarDetailIdAndYardIdAndDateOfAppointment(principal.getId(), dto.getCarDetailId(),dto.getYardId(), dto.getDateOfAppointment());

        if (isAlreadyBook){
            throw new DublicateBookingException("Multiple Appointment Detected!");
        }

        //check if user car detail id exist
        CarRequestDto carDetailRequest=new CarRequestDto();
        carDetailRequest.setCarDetailId(dto.getCarDetailId());
        carDetailRequest.setUserId(principal.getId());

        if (carDetailRequest.getCarDetailId()==null){
            throw new CarDetailsNotFound("Can't find car by id ");
        }

        CompletableFuture<CarResponseDto> completeFutureCarResponse =
                CompletableFuture.supplyAsync(() -> carFeign.response(carDetailRequest));

        CarResponseDto carResponse = completeFutureCarResponse.join();


        if (!carResponse.getIsValid()){
            throw new CarDetailsNotFound("Car Detail not found");
        }
        if (dto.getDateOfAppointment().isBefore(LocalDate.now())){
            throw new NotAllowedException("Appointments cannot be scheduled before "+LocalDate.now() );
        }

       //checking if yard exist
        YardRequestDto yardRequestDto=new YardRequestDto();
        yardRequestDto.setId(dto.getYardId());
        YardResponseDto responseDto= yardFeign.response(yardRequestDto);

        if (!responseDto.getIsValid()){
            throw new YardNotFound("Yard not found");
        }

        AppointmentBookingEntity appointmentBookingEntity= AppointmentBookingMapping.toEntity(dto);

        appointmentBookingEntity.setStatus(Status.PENDING);
        appointmentBookingEntity.setUserId(principal.getId());



        com.CarScrap.Booking_Service.Dto.AuthComminication.ResponseDto responseDto1=buildingMethodsService.findEmailOfUser(principal);



        BookingRequestDto requestDto=new BookingRequestDto();
        requestDto.setUsername(principal.getUsername());
        requestDto.setEmail(responseDto1.getEmail());

        requestDto.setName(carResponse.getName());
        requestDto.setRegistrationYear(carResponse.getRegistrationYear());
        requestDto.setVehicleType(carResponse.getVehicleType());
        requestDto.setDateOfExpire(carResponse.getDateOfExpire());
        requestDto.setFuelType(carResponse.getFuelType());
        requestDto.setEstimatePrice(carResponse.getEstimatePrice());



        appointmentBookingEntity.setEmail(requestDto.getEmail());
        appointmentBookingEntity.setUserId(principal.getId());
        appointmentBookingEntity.setUsername(principal.getUsername());
        appointmentBookingEntity.setCarName(carResponse.getName());
        appointmentBookingEntity.setRegistrationYear(requestDto.getRegistrationYear());
        appointmentBookingEntity.setVehicleType(requestDto.getVehicleType());
        appointmentBookingEntity.setDateOfExpire(requestDto.getDateOfExpire());
        appointmentBookingEntity.setFuelType(requestDto.getFuelType());
        appointmentBookingEntity.setEstimatePrice(requestDto.getEstimatePrice());
        appointmentBookingEntity.setCity(carResponse.getCity());
        appointmentBookingEntity.setAdminId(responseDto.getAdminId());

        if(responseDto.getYardName()==null){
            throw new NullPointerException("Yard name is null  ");
        }
        appointmentBookingEntity.setYardName(responseDto.getYardName());


        AppointmentBookingEntity saved=buildingMethodsService.saveAppointment(appointmentBookingEntity);



        requestDto.setBookingId(saved.getId());
        requestDto.setDateOfAppointment(saved.getDateOfAppointment());
        requestDto.setStatus(saved.getStatus());

        emailSending(requestDto);

        log.info(principal.getUsername()+" book appointment id "+ saved.getId());

        return AppointmentBookingMapping.toResponse(saved);
    }




    public ResponseDto cancelAppointment(Principal principal, UserAppointmentCancel dto){
        AppointmentBookingEntity appointmentBookingEntity=buildingMethodsService.findAppointment(dto.getId());


        if (!appointmentBookingEntity.getUserId().equals(principal.getId())){
            throw new NotBelongsException("Not Belongs");

        }


        buildingMethodsService.validateCancelable(appointmentBookingEntity);



        appointmentBookingEntity.setStatus(Status.CANCEL);
        appointmentBookingEntity.setCancelReason(dto.getReason());

        AppointmentBookingEntity saved=buildingMethodsService.saveAppointment(appointmentBookingEntity);

        CancelRequestDto cancelRequestDto=buildingMethodsService.cancelRequestDtoHelper(saved);



        cancelEmailsander(cancelRequestDto);

        return AppointmentBookingMapping.toResponse(saved);
    }



    public ResponseDto postponeAppointment(Principal principal, com.CarScrap.Booking_Service.Dto.PostPoneAppointmentDto dto){
        AppointmentBookingEntity appointmentBookingEntity=buildingMethodsService.findAppointment(dto.getAppointmentId());
        
        if (!appointmentBookingEntity.getUserId().equals(principal.getId())){
            throw new NotBelongsException("Can't change this Appointment its Does Not Belongs to you");
        }

        return postponeAppointmentBuilder(appointmentBookingEntity,principal,dto.getDate());

    }

    public ResponseDto postPoneAppointmentByManagement(Principal principal, com.CarScrap.Booking_Service.Dto.PostPoneAppointmentDto postPoneAppointmentDto){

        AppointmentBookingEntity appointmentBookingEntity=buildingMethodsService.findAppointment(postPoneAppointmentDto.getAppointmentId());

        buildingMethodsService.managementOwnerShip(principal,appointmentBookingEntity);


        return postponeAppointmentBuilder(appointmentBookingEntity,principal,postPoneAppointmentDto.getDate());
    }


    public ResponseDto postponeAppointmentBuilder(AppointmentBookingEntity appointmentBookingEntity ,Principal principal,LocalDate date){

        Boolean isValid=appointmentRepository.existsByUserIdAndCarDetailIdAndDateOfAppointmentAndIdNot(appointmentBookingEntity.getUserId(), appointmentBookingEntity.getCarDetailId(), date,appointmentBookingEntity.getId());

        LocalDate originalDate = appointmentBookingEntity.getDateOfAppointment();

        if (date.isBefore(LocalDate.now())) {
            throw new NotAllowedException("Can't postpone appointment in past date");
        }

        if (date.isAfter(originalDate.plusMonths(1))) {
            throw new NotAllowedException("Can't postpone appointment more than a month from the original date");
        }

        if (isValid){
            throw new DublicateBookingException("You Already have Appointment on the following date");
        }
        buildingMethodsService.validateCancelable(appointmentBookingEntity);

        appointmentBookingEntity.setDateOfAppointment(date);

        PostPoneAppointmentDto request= new PostPoneAppointmentDto();
        request.setAppointmentId(appointmentBookingEntity.getId());
        request.setUsername(appointmentBookingEntity.getUsername());
        request.setEmail(appointmentBookingEntity.getEmail());

        request.setCarName(appointmentBookingEntity.getCarName());
        request.setRegistrationYear(appointmentBookingEntity.getRegistrationYear());
        request.setVehicleType(appointmentBookingEntity.getVehicleType());
        request.setDateOfExpire(appointmentBookingEntity.getDateOfExpire());
        request.setFuelType(appointmentBookingEntity.getFuelType());
        request.setEstimatePrice(appointmentBookingEntity.getEstimatePrice());
        request.setStatus(appointmentBookingEntity.getStatus());

        request.setOldAppointmentDate(appointmentBookingEntity.getDateOfAppointment());

        request.setNewAppointmentDate(date);



        PostPoneEmailHandler postPoneEmailHandler= PostponeEmailHandlingMapping.mapToPostponeEmailHandler(request);

        applicationEventPublisher.publishEvent(postPoneEmailHandler);

        AppointmentBookingEntity appointmentBooking=buildingMethodsService.saveAppointment(appointmentBookingEntity);

        return AppointmentBookingMapping.toResponse(appointmentBooking);
    }



    public JSONResponseDto userMissedAppointment(Principal principal,UserMissedAppointmentDto dto){

        AppointmentBookingEntity appointmentBookingEntity=buildingMethodsService.findAppointment(dto.getAppointmentId());

        System.out.println("STATUS = " + appointmentBookingEntity.getStatus());
        if (appointmentBookingEntity.getUserMissedDay() != null && appointmentBookingEntity.getUserMissedDay().isEqual(LocalDate.now())) {
            throw new NotAllowedException("Already marked missed today");
        }

        if (appointmentBookingEntity.getStatus().equals(Status.CANCEL) || appointmentBookingEntity.getStatus().equals(Status.SUCCESSFUL)) {
            throw new NotAllowedException("Can't missed appointment at this stage .");
        }

        buildingMethodsService.managementOwnerShip(principal,appointmentBookingEntity);

        Long current = appointmentBookingEntity.getUserMissedAppointmentCount();
        if (current == null) current = 0L;

        appointmentBookingEntity.setUserMissedAppointmentCount(current + 1);
        appointmentBookingEntity.setUserMissedDay(LocalDate.now());



        if (appointmentBookingEntity.getUserMissedAppointmentCount()>=3){
            appointmentBookingEntity.setStatus(Status.CANCEL);




            appointmentBookingEntity.setCancelReason("Don't show up for Appointment .");
            appointmentBookingEntity.setCancelTime(LocalDateTime.now());


            CancelRequestDto cancelRequestDto=buildingMethodsService.cancelRequestDtoHelper(appointmentBookingEntity);
            emailFeign.cancelRequestDto(cancelRequestDto);

            JSONResponseDto jsonResponseDto=new JSONResponseDto("Appointment canceled .",LocalDateTime.now());
            return jsonResponseDto;
        }
        appointmentRepository.save(appointmentBookingEntity);

         JSONResponseDto jsonResponseDto=new JSONResponseDto();
        jsonResponseDto.setMessage(appointmentBookingEntity.getUsername()+ " has missed "+LocalDate.now() +" Appointment ");
        jsonResponseDto.setStamp(LocalDateTime.now());
        return jsonResponseDto;
    }


    //Staff Methods

    public JSONResponseDto cancelByManagement(Principal principal, ManagementAppointmentCancelDto dto){

        AppointmentBookingEntity appointmentBookingEntity=buildingMethodsService.findAppointment(dto.getId());

        buildingMethodsService.managementOwnerShip(principal,appointmentBookingEntity);

        buildingMethodsService.validateCancelable(appointmentBookingEntity);


        //GET EMAIL FROM AUTH
        com.CarScrap.Booking_Service.Dto.AuthComminication.RequestDto requestDto=new com.CarScrap.Booking_Service.Dto.AuthComminication.RequestDto();
        requestDto.setId(appointmentBookingEntity.getUserId());
        com.CarScrap.Booking_Service.Dto.AuthComminication.ResponseDto dto1=authCommunication.respones(requestDto);

        if (dto1.getEmail()==null || dto1.getEmail().isEmpty()){
            throw new com.CarScrap.Booking_Service.Exceptions.NotFoundException("Can't find register email of user");
        }
        appointmentBookingEntity.setEmail(dto1.getEmail());
        appointmentBookingEntity.setCancelReason(dto.getReason());

        appointmentBookingEntity.setStatus(Status.CANCEL);

       AppointmentBookingEntity saved= buildingMethodsService.saveAppointment(appointmentBookingEntity);


        //SAND EMAIL

        CancelRequestDto request=buildingMethodsService.cancelRequestDtoHelper(saved);


        try {
            cancelEmailByManagementsander(request);
        }catch (Exception ex){
            log.error("Email Service failed reason "+ ex.getMessage());
        }

        JSONResponseDto jsonResponseDto=new JSONResponseDto();
        jsonResponseDto.setMessage("Appointment  id "+ appointmentBookingEntity.getId() +"is cancelled ");
        jsonResponseDto.setStamp(LocalDateTime.now());

        return jsonResponseDto;

    }




    public JSONResponseDto changeAppointmentStatus(Principal principal, ChangeStatusDto dto){
        AppointmentBookingEntity appointmentBookingEntity=buildingMethodsService.findAppointment(dto.getAppointmemtId());

        JSONResponseDto jsonResponseDto=changeAppointmentStatusBuilder(principal,appointmentBookingEntity,dto.getStatus());

        return jsonResponseDto;
    }

    public JSONResponseDto changeAppointmentByManagemenet(Principal principal,ChangeStatusByManagement dto){
        if (principal==null){
            throw new NotAllowedException("UnAuthorized! ");
        }

        AppointmentBookingEntity appointmentBookingEntity=buildingMethodsService.findAppointment(dto.getAppointmentId());

        if(appointmentBookingEntity.getStatus().equals(Status.SUCCESSFUL) || appointmentBookingEntity.getStatus().equals(Status.CANCEL)){
            throw new NotAllowedException("Can't Change Appointment at This Stage");
        }

        if (appointmentBookingEntity.getStatus().equals(dto.getStatus())){
            throw new NotAllowedException("Appointment Status Already is "+ appointmentBookingEntity.getStatus());
        }

        System.out.println("Principal ID: " + principal.getId());
        System.out.println("Principal Role: " + principal.getRole());
        System.out.println("Admin ID: " + appointmentBookingEntity.getAdminId());
        System.out.println("Equal? " + appointmentBookingEntity.getAdminId().equals(principal.getId()));
        buildingMethodsService.managementOwnerShip(principal,appointmentBookingEntity);

        appointmentBookingEntity.setStatus(dto.getStatus());

        buildingMethodsService.saveAppointment(appointmentBookingEntity);

        JSONResponseDto jsonResponseDto=new JSONResponseDto();
        jsonResponseDto.setStamp(LocalDateTime.now());
        jsonResponseDto.setMessage("Appointment id "+appointmentBookingEntity.getId()+" Status is change into "+ appointmentBookingEntity.getStatus());


        return jsonResponseDto;

    }
    public JSONResponseDto changeAppointmentStatusBuilder(Principal principal ,AppointmentBookingEntity appointmentBookingEntity,Status status){
        buildingMethodsService.confirmManagementRole(principal);

        buildingMethodsService.validateCancelable(appointmentBookingEntity);

        appointmentBookingEntity.setStatus(status);

        AppointmentBookingEntity appointmentBooking=buildingMethodsService.saveAppointment(appointmentBookingEntity);


        StatusUpdateDto statusUpdateDto=buildingMethodsService.statusUpdateBuilder(appointmentBooking);

        try {
            statusUpdateEmailSander(statusUpdateDto);
        }catch (Exception e){
            log.error("Email service failed Reason  "+ e.getMessage());
        }


        JSONResponseDto jsonResponseDto=new JSONResponseDto();
        jsonResponseDto.setStamp(LocalDateTime.now());
        jsonResponseDto.setMessage("Appointment id "+appointmentBooking.getId()+" Status is change into "+ status);


        return jsonResponseDto;
    }


    public JSONResponseDto staffAssign(Principal principal ,StaffAssignDto dto){
        AppointmentBookingEntity appointmentBookingEntity=buildingMethodsService.findAppointment(dto.getAppointmentId());

        buildingMethodsService.validateCancelable(appointmentBookingEntity);

        StaffVerifyRequestDto requestDto=new StaffVerifyRequestDto();
        requestDto.setStaffId(dto.getStaffId());
        requestDto.setYardId(appointmentBookingEntity.getYardId());

        StaffVerifyResponseDto staffVerifyResponseDto=yardFeign.staffResponse(requestDto);


        StaffRequstDto requstDto=new StaffRequstDto(dto.getStaffId());

        StaffResponseDto staffResponseDto=authCommunication.staffResponseDto(requstDto);


        if (staffResponseDto.getUsername()==null){
            throw new StaffDoesNotExist("Can't find staff username .");
        }



        if (!staffVerifyResponseDto.getValid()){
            throw new StaffDoesNotExist("Staff does not belongs in the respected yard");
        }

        if (staffVerifyResponseDto.getAdminId()==null){
            throw new NotFoundException("Seems like yard does not have a admin try to contact the super admin .");
        }

       if (principal.getRole().equals("ADMIN")){
           if (!principal.getId().equals(staffVerifyResponseDto.getAdminId())){
               throw new AdminDoesNotBelongsToYardException("Seems Like You Are Not Belongs to Yard Id "+ appointmentBookingEntity.getYardId());
           }
       }

        if (appointmentBookingEntity.getStaffId()!=null){
            throw new StaffAlreadyAssignToAppointmentExcepttion("Staff is already Assign to the Appointment .");
        }



        StaffRequstDto staffRequstDto=new StaffRequstDto();
        staffRequstDto.setStaffId(dto.getStaffId());

        StaffResponseDto responseDto=authCommunication.staffResponseDto(staffRequstDto);

        if (!responseDto.getValid()){
            throw new StaffDoesNotExist("Staff does not exist .");
        }

        appointmentBookingEntity.setStaffUsername(responseDto.getUsername());
        appointmentBookingEntity.setStaffId(dto.getStaffId());
        appointmentBookingEntity.setStatus(Status.CONFIRM);
        buildingMethodsService.saveAppointment(appointmentBookingEntity);


        JSONResponseDto jsonResponseDto=new JSONResponseDto();
        jsonResponseDto.setMessage("Staff Id "+dto.getStaffId()+" Assign to Appointment Id "+ dto.getAppointmentId());

        return jsonResponseDto;

    }

    public ResponseDto removeAssignStaff(Principal principal,RemoveAssignStaff dto){
        AppointmentBookingEntity appointmentBookingEntity=appointmentRepository.findById(dto.getAppointmentId())
                .orElseThrow(()->new AppointmentDoesNotExistException("Appointment not exist "));


        if(appointmentBookingEntity.getStatus().equals(Status.SUCCESSFUL)){
            throw new NotAllowedException("Can't remove staff After Appointment Successful");
        }else if(appointmentBookingEntity.getStatus().equals(Status.CANCEL)){
            throw new NotAllowedException("Can't remove staff After Appointment Cancel");
        }
        if (appointmentBookingEntity.getAdminId() == null) {
            throw new NotAllowedException("Appointment has no admin assigned.");
        }
        if (!principal.getId().equals(appointmentBookingEntity.getAdminId())) {
            throw new NotAllowedException("Entity does not belongs to you.");
        }

        if (appointmentBookingEntity.getStaffId()==null){
            throw new NotAllowedException("Appointment don't have staff to remove ");
        }

        appointmentBookingEntity.setStaffId(null);
        appointmentBookingEntity.setStaffUsername(null);
        appointmentBookingEntity.setStatus(Status.PENDING);

        AppointmentBookingEntity saved=appointmentRepository.save(appointmentBookingEntity);

        return AppointmentBookingMapping.toResponse(saved);
    }

    //-------------------------------------------GET METHODS----------------------------------------------------//

    public List<ResponseDto> GetAppointmentByDate(Principal principal, GetAppointmentByYardIdAndDate dto){
        if (principal==null){
            throw new NotAllowedException("UnAuthorized !");
        }
        buildingMethodsService.confirmManagementRole(principal);

        List<AppointmentBookingEntity> appointmentBookingEntities=appointmentRepository.findByYardIdAndDateOfAppointmentGreaterThanEqualAndDateOfAppointmentLessThan(dto.getYardId(), dto.getStart(),dto.getEnds());


        return appointmentBookingEntities.stream().map(AppointmentBookingMapping::toResponse).collect(Collectors.toList());
    }

    public List<ResponseDto> getAppointmentByYardId(Principal principal, GetAppointmentByYardId getAppointmentByYardId){
        buildingMethodsService.confirmManagementRole(principal);

        List<AppointmentBookingEntity> appointmentBookingEntities=appointmentRepository.findByYardId(getAppointmentByYardId.getYardId());

        return appointmentBookingEntities.stream().map(AppointmentBookingMapping::toResponse).collect(Collectors.toList());
    }

    //USER get Appointment

    public ResponseDto getAppointmentForUser(Principal principal, GetAppointmentDto dto){
        AppointmentBookingEntity appointmentBookingEntity=buildingMethodsService.findAppointment(dto.getId());

        if (!appointmentBookingEntity.getUserId().equals(principal.getId())){
            throw new NotBelongsException("Appointment not belongs to User");
        }

        return AppointmentBookingMapping.toResponse(appointmentBookingEntity);
    }

    public List<ResponseDto> getAllAppointment(Principal principal){
        List<AppointmentBookingEntity> appointmentBookingEntities=appointmentRepository.findByUserId(principal.getId());

        return appointmentBookingEntities.stream().map(AppointmentBookingMapping::toResponse).collect(Collectors.toList());
    }

    public List<ResponseDto> getAppointmentByStatus(Principal principal, GetAppointmentByStatus dto){
        List<AppointmentBookingEntity> appointmentBookingEntities=appointmentRepository.findByStatusAndUserId(dto.getStatus(),principal.getId());

        return appointmentBookingEntities.stream().map(AppointmentBookingMapping::toResponse).collect(Collectors.toList());
    }

    public List<ResponseDto> userGetAppointmentByDate(Principal principal, GetAppointmentByDateByUser dto){
        List<AppointmentBookingEntity>appointmentBookingEntities=appointmentRepository.findByUserIdAndDateOfAppointment(principal.getId(),dto.getDate());

        return appointmentBookingEntities.stream().map(AppointmentBookingMapping::toResponse).collect(Collectors.toList());
    }


    public BookingDetailsResponseDto getBookingDetails(Principal principal, BookingDetailsRequestDto dto){
        AppointmentBookingEntity appointmentBookingEntity=appointmentRepository.findById(dto.getId())
                .orElseThrow(()-> new AppointmentDoesNotExistException("Can't find apppointment ."));

        if (!principal.getId().equals(appointmentBookingEntity.getUserId())){
            throw new NotBelongsException("Entity does not belongs to you .");
        }

        BookingDetailsResponseDto responseDto=new BookingDetailsResponseDto();
        responseDto.setCarname(appointmentBookingEntity.getCarName());
        responseDto.setCity(appointmentBookingEntity.getCity());
        responseDto.setExpireYear(String.valueOf(appointmentBookingEntity.getDateOfExpire()));
        responseDto.setYardName(appointmentBookingEntity.getYardName());


        return responseDto;
    }


    public List<ResponseDto> getAppointmenntForAdmins(GetAppointmentFromDateAToBRequestForAdminDto dto){

        if (dto.getEnds()==null){
            dto.setEnds(LocalDate.now());
        }

        GetYardIdResponseDto getYardIdResponseDto=yardFeign.getYardIdResponse();

        List<AppointmentBookingEntity> list=appointmentRepository.findByYardIdAndDateOfAppointmentGreaterThanEqualAndDateOfAppointmentLessThan(getYardIdResponseDto.getYardId(),dto.getStart(),dto.getEnds());

        return list.stream().map(AppointmentBookingMapping::toResponse).collect(Collectors.toList());
    }


    public List<ResponseDto> getAppointmentsForStaffByDate(Principal principal,GetAppointmentFromDateAToBRequestForAdminDto dto){
       List<AppointmentBookingEntity> list=appointmentRepository.findByStaffIdAndDateOfAppointmentGreaterThanEqualAndDateOfAppointmentLessThan(principal.getId(), dto.getStart(),dto.getEnds());

       return list.stream().map(AppointmentBookingMapping::toResponse).collect(Collectors.toList());
    }




    //--------------------------------------------------Helping methods-------------------------------------------//




    @Retry(name = "EMAIL-SERVICE")
    @CircuitBreaker(name = "EMAIL-SERVICE",
            fallbackMethod = "emailFallback"
    )
    public void emailSending(BookingRequestDto dto){
        EmailEvent event= EventHandlerMapping.toEmailEvent(dto);

        applicationEventPublisher.publishEvent(event);
    }

    @Retry(name = "EMAIL-SERVICE")
    @CircuitBreaker(name = "EMAIL-SERVICE",
            fallbackMethod = "emailFallback"
    )
    public void cancelEmailsander(CancelRequestDto dto){
        CancelEmailSenderEvent cancelEmailSenderEvent=new CancelEmailSenderEvent(dto.getAppointmentId(),
                dto.getEmail(),
                dto.getUsername(),
                dto.getCarName(),
                dto.getRegistrationYear(),
                dto.getVehicleType(),
                dto.getDateOfExpire(),
                dto.getFuelType(),
                dto.getEstimatePrice(), dto.getStatus(),
                dto.getReason());

        applicationEventPublisher.publishEvent(cancelEmailSenderEvent);
    }


    @Retry(name = "EMAIL-SERVICE")
    @CircuitBreaker(name = "EMAIL-SERVICE",
            fallbackMethod = "emailFallback"
    )
    public void cancelEmailByManagementsander(CancelRequestDto dto){
        CancelAppointmentByManagementEvent event=new CancelAppointmentByManagementEvent(dto.getAppointmentId(),
                dto.getEmail(),
                dto.getUsername(),
                dto.getCarName(),
                dto.getRegistrationYear(),
                dto.getVehicleType(),
                dto.getDateOfExpire(),
                dto.getFuelType(),
                dto.getEstimatePrice(), dto.getStatus(),
                dto.getReason());

        applicationEventPublisher.publishEvent(event);
    }



    @Retry(name = "EMAIL-SERVICE")
    @CircuitBreaker(name = "EMAIL-SERVICE",
            fallbackMethod = "emailFallback"
    )
    public void statusUpdateEmailSander(StatusUpdateDto dto){
        StatusUpdateEvent statusUpdateEvent=new StatusUpdateEvent(dto.getAppointmentId(),
                dto.getEmail(),
                dto.getUsername(),
                dto.getCarName(),
                dto.getRegistrationYear(),
                dto.getVehicleType(),
                dto.getDateOfExpire(),
                dto.getFuelType(),
                dto.getEstimatePrice(), dto.getStatus());

        applicationEventPublisher.publishEvent(statusUpdateEvent);
    }

}
