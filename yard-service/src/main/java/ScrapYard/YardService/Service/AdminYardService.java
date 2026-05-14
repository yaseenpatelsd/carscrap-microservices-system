package ScrapYard.YardService.Service;

import ScrapYard.YardService.Dto.*;
import ScrapYard.YardService.Dto.AppointmentCommunication.AppointmentManagementVerificationRequestDto;
import ScrapYard.YardService.Dto.AppointmentCommunication.AppointmentManagementVerificationResponseDto;
import ScrapYard.YardService.Dto.AppointmentCommunication.StaffVerifyRequestDto;
import ScrapYard.YardService.Dto.AppointmentCommunication.StaffVerifyResponseDto;
import ScrapYard.YardService.Dto.AuthCommunication.*;
import ScrapYard.YardService.Dto.GetYard.GetYardBYAdminId;
import ScrapYard.YardService.Dto.GetYard.GetYardByStatus;
import ScrapYard.YardService.Dto.User.YardSearch;
import ScrapYard.YardService.Entity.YardEntity;
import ScrapYard.YardService.Enum.*;
import ScrapYard.YardService.Exeptions.*;
import ScrapYard.YardService.Feign.AuthCommunication;
import ScrapYard.YardService.Mapping.YardMapping;
import ScrapYard.YardService.Repository.YardRepository;
import ScrapYard.YardService.Util.Principal;
import ScrapYard.YardService.Util.YardSpecification;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotAllowedException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdminYardService {

    private final YardRepository repository;
    private final AuthCommunication authCommunication;

    public AdminYardService(YardRepository repository, AuthCommunication authCommunication) {
        this.repository = repository;
        this.authCommunication = authCommunication;
    }


    public ResponseDto createYard(RequestDto dto) {


        YardEntity entity = YardMapping.toEntity(dto);
        YardEntity saved = repository.save(entity);

        return YardMapping.toResponseDto(saved);
    }


    @Transactional
    public ResponseDto editYard(EditYardDetails dto) {


        YardEntity yardEntity = findYard(dto.getYardId());

        if (dto.getName() != null) {
            yardEntity.setName(dto.getName());
        }
        if (dto.getEmail() != null) {
            yardEntity.setEmail(dto.getEmail());
        }
        if (dto.getContactNo() != null) {
            yardEntity.setContactNo(dto.getContactNo());
        }
        if (dto.getStatus() != null) {
            yardEntity.setStatus(Status.valueOf(dto.getStatus().toUpperCase()));
        }


        YardEntity saved = repository.save(yardEntity);

        return YardMapping.toResponseDto(saved);
    }


    public ResponseDto changeContact(ContactChangeDto dto) {
        YardEntity yardEntity=findYard(dto.getYardId());

        YardEntity saved=changeContactBuild(yardEntity, dto.getContact(), dto.getEmail());
        return YardMapping.toResponseDto(saved);
    }

    public ResponseDto changeContactByAdmin(Principal principal ,ChangeContactByAdmin dto){
        YardEntity yardEntity=findYardByAdminId(principal.getId());
        YardEntity saved=changeContactBuild(yardEntity,dto.getContact(), dto.getEmail());

        return YardMapping.toResponseDto(saved);
    }

    public YardEntity changeContactBuild(YardEntity yardEntity,String contact,String email){

        if (contact != null) {
            yardEntity.setContactNo(contact);
        }
        if (email != null) {
            yardEntity.setEmail(email);
        }

        YardEntity saved = repository.save(yardEntity);
        return saved;
    }

    public ResponseDto changeStatus(StatusChangeDto dto) {
        YardEntity saved=changeStatusBuilder(dto.getYardId(),dto.getStatus());

        return YardMapping.toResponseDto(saved);
    }

    public ResponseDto changeStatusByAdmin(Principal principal,StatusChangeByAdmin statusChangeByAdmin){
        if (principal==null){
            throw new SomethingIsWrongException("UnAuthorized! ");
        }
        YardEntity yardEntity=findByAdminIdOrStaffId(principal);

        ownerShipCheck(principal,yardEntity);

        YardEntity saved=changeStatusBuilder(yardEntity.getId(), statusChangeByAdmin.getStatus());

        return YardMapping.toResponseDto(saved);
    }

    public YardEntity changeStatusBuilder(Long yardId,Status status){
        YardEntity entity = findYard(yardId);

        if (status.equals(entity.getStatus())) {
            throw new StatusRelatedError("Status is already what you desire");
        }

        entity.setStatus(status);

        YardEntity saved = repository.save(entity);

        return saved;
    }


    public JSONResponse assignAdmin(AdminAssign dto) {


        YardEntity yardEntity = findYard(dto.getYardId());

        // ❌ If already assigned → throw
        if (yardEntity.getAdminId() != null) {
            throw new SomethingIsWrongException("Yard Already Has An Admin");
        }


        AdminRequest adminRequest = new AdminRequest();
        adminRequest.setAdminId(dto.getAdminId());

        AdminResponse adminResponse = authCommunication.validAdmin(adminRequest);

        // ❌ If admin invalid → throw
        if (!adminResponse.getValid()) {
            throw new NotFoundException("Admin not found");
        }


        // ✅ Assign admin
        yardEntity.setAdminId(dto.getAdminId());
        yardEntity.setManagerUsername(adminResponse.getUsername());

       repository.save(yardEntity);

        // ✅ Response
        JSONResponse jsonResponse = new JSONResponse();
        jsonResponse.setMessage("Admin Assigned Successfully");
        jsonResponse.setStamp(LocalDateTime.now());

        return jsonResponse;
    }

    public ResponseDto removeAdmin(RemoveAdminDto dto){

        YardEntity yardEntity=findYard(dto.getYardId());

        if (yardEntity.getAdminId()==null){
            throw new AdminAssignException("Yard don't have admin to remove");
        }

        yardEntity.setAdminId(null);
        yardEntity.setManagerUsername(null);

        YardEntity saved=repository.save(yardEntity);

        return YardMapping.toResponseDto(saved);
    }


    @Transactional
    public  JSONResponse staffAssignToYard(Principal principal ,StaffAssignDto dto){

        if (principal==null){
            throw new SomethingIsWrongException("Not Authorized !");
        }

        if (dto.getYardId()==null&& dto.getStaffId()==null){
            throw new StaffRelatedError("Yard or staff id is empty ");
        }
        YardEntity yardEntity = new YardEntity();
        try {
            yardEntity=findYard(dto.getYardId());
        }catch (Exception e){
            throw new SomethingIsWrongException(e.getMessage());
        }

        adminFilter(principal,yardEntity);

        StaffVerifyingRequestDto staffVerifyRequestDto=new StaffVerifyingRequestDto();
        staffVerifyRequestDto.setStaffId(dto.getStaffId());

        StaffVerifyingResponseDto staffVerifyingResponseDto=authCommunication.validStaff(staffVerifyRequestDto);

        if (!staffVerifyingResponseDto.getValid()){
            throw new StaffNotFoundException("Can't find staff .");
        }
        List<Long> staffList=yardEntity.getStaffId();
        if (staffList==null){
            staffList=new ArrayList<>();
        }

        if(staffList.contains(dto.getStaffId())){
            throw new StaffAlreadyExistException("Staff already assign .");
        }
        staffList.add(dto.getStaffId());

        yardEntity.setStaffId(staffList);

        try {
            repository.save(yardEntity);
        }catch (DataIntegrityViolationException e){
            throw new DataIntegrityViolationException(e.getLocalizedMessage());
        }

        JSONResponse jsonResponse=new JSONResponse();
        jsonResponse.setMessage("Staff id "+ dto.getStaffId()+ " is assign to Yard name "+ yardEntity.getName()+" yard id "+ yardEntity.getId());

        return jsonResponse;
    }

    @Transactional
    public JSONResponse removeStaff(Principal principal, RemoveStaffDto dto){

        JSONResponse jsonResponse=removeStaffBuilder(principal,dto.getYardId(), dto.getStaffId());

        return jsonResponse;
    }

    @Transactional
    public JSONResponse removeStaffByAdmin(Principal principal,RemoveStaffAdminRequest dto){
        YardEntity yardEntity=repository.findByAdminId(principal.getId()).orElseThrow(()-> new NotFoundException("Admin is not assign to any yard ."));
        JSONResponse jsonResponse=removeStaffBuilder(principal, yardEntity.getId(), dto.getStaffId());

        return jsonResponse;
    }


    public StaffVerifyResponseDto staffVerifyResponseDto(StaffVerifyRequestDto dto){
        YardEntity yardEntity=findYard(dto.getYardId());

        StaffVerifyResponseDto staffVerifyResponseDto=new StaffVerifyResponseDto();

        if (!yardEntity.getStaffId().contains(dto.getStaffId())){
            staffVerifyResponseDto.setValid(false);
        }else {
            staffVerifyResponseDto.setValid(true);
        }

        staffVerifyResponseDto.setAdminId(yardEntity.getAdminId());

        return staffVerifyResponseDto;
    }


    public AppointmentManagementVerificationResponseDto verifyStaffBelongsToYard(AppointmentManagementVerificationRequestDto dto){
        YardEntity yardEntity=findYard(dto.getYardId());

        AppointmentManagementVerificationResponseDto responseDto=new AppointmentManagementVerificationResponseDto();

        if (yardEntity.getStaffId().contains(dto.getManagementId())){
            responseDto.setValid(true);
        }else {
            responseDto.setValid(false);
        }
        return responseDto;
    }

    public AppointmentManagementVerificationResponseDto verifyAdminBelongsToYard(AppointmentManagementVerificationRequestDto dto){
        YardEntity yardEntity=findYard(dto.getYardId());

        AppointmentManagementVerificationResponseDto responseDto=new AppointmentManagementVerificationResponseDto();

        if (yardEntity.getAdminId()!=null && yardEntity.getAdminId().equals(dto.getManagementId())){
            responseDto.setValid(true);
        }else {
            responseDto.setValid(false);
        }
        return responseDto;
    }



    public List<ResponseDto> findAllYardByStatus(GetYardByStatus status){
        List<YardEntity> yardEntityList=repository.findByStatus(status.getStatus());

        return yardEntityList.stream().map(YardMapping::toResponseDto).collect(Collectors.toList());
    }


    public List<ResponseDto> findAllYardForAdmin(){
        List<YardEntity> yardEntityList=repository.findAll();

        return yardEntityList.stream().map(YardMapping::toResponseDto).collect(Collectors.toList());
    }

    public List<ResponseDto> findYard(YardSearch dto) {

        IndianCity city= Optional.ofNullable(dto.getCity()).map(c-> IndianCity.valueOf(c.trim().toUpperCase())).orElse(null);
        IndianStates state=Optional.ofNullable(dto.getState()).map(s-> IndianStates.valueOf(s.toUpperCase())).orElse(null);

        Specification<YardEntity> specification =
                YardSpecification.findByFilter(
                        dto.getName(),
                        city,
                        state,
                        dto.getPincode()
                );


        List<YardEntity> yardEntityList = repository.findAll(specification);

        return yardEntityList
                .stream()
                .map(YardMapping::toResponseDto)
                .collect(Collectors.toList());
    }


    public List<StaffIDsResponseDto> staffIDsRequest(Principal principal, YardIdRequestDto dto) {

        if (principal == null) {
            throw new SomethingIsWrongException("UnAuthorized!");
        }

        YardEntity yardEntity = findYard(dto.getYardId());

        if (principal.getRole().equals(Role.ADMIN)) {
            if (!principal.getId().equals(yardEntity.getAdminId())) {
                throw new SomethingIsWrongException("UnAuthorized !");
            }
        }

        // ✅ Get actual staff IDs from yard
        List<Long> staffIds = yardEntity.getStaffId();

        // ✅ Set in DTO
        StaffIDsResponseDto response = new StaffIDsResponseDto();
        response.setId(staffIds);

        // ✅ Return as list
        return Collections.singletonList(response);
    }



    public void addStaffToYardByAdmin(Principal principal, StaffAssignToYardByAdminRequestDto dto){
        if (principal==null){
            throw new SomethingIsWrongException("UnAuthorized!");
        }

        YardEntity yardEntity=findYard(dto.getYardId());

        if (yardEntity.getStaffId().contains(dto.getStaffId())){
            throw new StaffAlreadyExistException("Staff Already Assign to yard!");
        }

        List<Long>staffId=yardEntity.getStaffId();
        if (staffId==null){
            staffId=new ArrayList<>();
            staffId.add(dto.getStaffId());
        }
        if (!staffId.contains(dto.getStaffId())){
            staffId.add(dto.getStaffId());
        }


        repository.save(yardEntity);

    }

    public YardIdResponseDto yardIdResponse( GetYardBYAdminId getYardBYAdminId){
        YardEntity yardEntity=repository.findByAdminId(getYardBYAdminId.getAdminId()).orElseThrow(()-> new NotFoundException("Not found!"));

        YardIdResponseDto yardIdResponseDto=new YardIdResponseDto(yardEntity.getId());

        return yardIdResponseDto;
    }

    public List<StaffIDsResponseDto> yardStaffIdRespnseList(Principal principal){
        YardEntity yardEntity=repository.findByAdminId(principal.getId())
                .orElseThrow(()-> new NotFoundException("Can't find a admin account ."));

        if(yardEntity.getAdminId()==null){
            throw new SomethingIsWrongException("Yard does not have a admin .");
        }
        if (!yardEntity.getAdminId().equals(principal.getId())){
            throw new SomethingIsWrongException("UnAuthorized!");
        }

        if (yardEntity.getStaffId()==null || yardEntity.getStaffId().isEmpty()){
            throw new NotFoundException("Staff List is Empty .");
        }

       StaffIDsResponseDto staffIDsResponseDto=new StaffIDsResponseDto();
        staffIDsResponseDto.setId(yardEntity.getStaffId());

        List<StaffIDsResponseDto> responseDtos=new ArrayList<>();
        responseDtos.add(staffIDsResponseDto);

        return responseDtos;
    }


    @Transactional
    public StatusChangeByAdmin changeStatusByManagement(Principal principal){
        if (principal==null){
            throw new NotAllowedException("UnAuthorized!");
        }

       YardEntity yardEntity=findByAdminIdOrStaffId(principal);

        ownerShipCheck(principal,yardEntity);

        if (yardEntity.getStatus()==Status.ACTIVE){
            yardEntity.setStatus(Status.INACTIVE);
        }else if(yardEntity.getStatus()==Status.INACTIVE) {
            yardEntity.setStatus(Status.ACTIVE);
        }else {
            throw new SomethingIsWrongException("Cannot toggle when its Under Maintainence");
        }

        YardEntity saved=repository.save(yardEntity);

        StatusChangeByAdmin statusChangeByAdmin=new StatusChangeByAdmin(saved.getStatus());

        return statusChangeByAdmin;
    }


    public GetYardIdResponseDto responseYardIdForAdmin(Principal principal){
        YardEntity yardEntity=findYardByAdminId(principal.getId());

        GetYardIdResponseDto getYardIdResponseDto=new GetYardIdResponseDto(yardEntity.getId());

        return getYardIdResponseDto;
    }

    /*                                          Helping methhods                                                                      */


    public YardEntity findYard(Long id){
        return repository.findById(id)
                .orElseThrow(()-> new NotFoundException("Yard Not found By Id " +id ));
    }

    public void adminFilter(Principal principal,YardEntity yardEntity){
        if ("ADMIN".equals(principal.getRole())) {
            if (yardEntity.getAdminId() == null ||
                    !yardEntity.getAdminId().equals(principal.getId())) {
                throw new NotManagementError("Not Allowed To Perform This Task .");
            }
        }
    }

    public JSONResponse removeStaffBuilder(Principal principal,Long yardId,Long staffId){
        if (principal==null){
            throw new SomethingIsWrongException("UnAuthorized!");
        }
        YardEntity yardEntity= new YardEntity();

        try {
            yardEntity = findYard(yardId);
        }catch (Exception e){
            throw new StaffRelatedError(e.getMessage());
        }

        if (principal.getRole()!=null ) {
            adminFilter(principal, yardEntity);
        }


        List<Long> staffList=yardEntity.getStaffId();

        if ( staffList==null || staffList.isEmpty() || !staffList.contains(staffId)){
            throw new StaffNotFoundException("Staff does not exist in yard .");
        }

        staffList.remove(staffId);
        yardEntity.setStaffId(staffList);

        try {
            repository.save(yardEntity);
        }catch (DataIntegrityViolationException e){
            throw new DataIntegrityViolationException(e.getLocalizedMessage());
        }

        JSONResponse jsonResponse=new JSONResponse();
        jsonResponse.setMessage("Staff id "+ staffId+" has been removed from yard business by "+ principal.getUsername());
        jsonResponse.setStamp(LocalDateTime.now());

        return jsonResponse;
    }

    public YardEntity findYardByAdminId(Long adminId){
        return repository.findByAdminId(adminId)
                .orElseThrow(()-> new NotFoundException("Admin Not found"));
    }

    public YardEntity findYardByStaffId(Long staffId){
        return repository.findByStaffIdContains(staffId)
                .orElseThrow(()-> new NotFoundException("Staff Not found"));
    }

    public void ownerShipCheck(Principal principal,YardEntity yard){
        if (principal==null){
            throw new SomethingIsWrongException("UnAuthorized!");
        }

        if (principal.getRole().equals(Role.ADMIN.name())){

            if (yard.getAdminId()==null){
                throw new SomethingIsWrongException("Yard does not have Admin .");
            }

            if (!yard.getAdminId().equals(principal.getId())){
                throw new SomethingIsWrongException("ADMIN Does Not Belongs to "+ yard.getName());
            }
        }else if (principal.getRole().equals(Role.STAFF.name())){
            if (yard.getStaffId()==null || yard.getStaffId().isEmpty()){
                throw new SomethingIsWrongException("Yard Does Not Have Staff .");
            }

            if (!yard.getStaffId().contains(principal.getId())){
                throw new SomethingIsWrongException("Yard Does Not Belongs to "+ principal.getUsername());
            }
        }else {
            throw new SomethingIsWrongException("Role Does not match ");
        }
    }


    public YardEntity findByAdminIdOrStaffId(Principal principal){
        YardEntity yardEntity;

        if (principal.getRole().equals(Role.ADMIN.name())){
            yardEntity = findYardByAdminId(principal.getId());

        } else if (principal.getRole().equals(Role.STAFF.name())){
            yardEntity = findYardByStaffId(principal.getId());

        } else {
            throw new SomethingIsWrongException("Role not supported");
        }

        return yardEntity;
    }
}
