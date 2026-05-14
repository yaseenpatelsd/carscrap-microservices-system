package com.carscrap.auth_service.Mapping;

import com.carscrap.auth_service.Dto.AdminResponseDto;
import com.carscrap.auth_service.Dto.AuthTOYardService.GetStaffByIdsResponse;
import com.carscrap.auth_service.Dto.AuthTOYardService.StaffIdsResponse;
import com.carscrap.auth_service.Dto.Staff.StaffGetByRoleResponseDto;
import com.carscrap.auth_service.Dto.Staff.StaffResponse;
import com.carscrap.auth_service.Entity.UserEntity;

public class StaffMapping {

    public static StaffGetByRoleResponseDto toResponse(UserEntity entity){
        if (entity==null)return null;

        StaffGetByRoleResponseDto staffGetByRoleResponseDto=new StaffGetByRoleResponseDto();
        staffGetByRoleResponseDto.setId(entity.getId());
        staffGetByRoleResponseDto.setUsername(entity.getUsername());
        staffGetByRoleResponseDto.setEmail(entity.getEmail());

        return staffGetByRoleResponseDto;
    }

    public static GetStaffByIdsResponse toGetYardStaffResponse(UserEntity entity){
        if (entity==null)return null;

        GetStaffByIdsResponse staffGetByRoleResponseDto=new GetStaffByIdsResponse();
        staffGetByRoleResponseDto.setId(entity.getId());
        staffGetByRoleResponseDto.setUsername(entity.getUsername());
        staffGetByRoleResponseDto.setEmail(entity.getEmail());

        return staffGetByRoleResponseDto;
    }
    }
