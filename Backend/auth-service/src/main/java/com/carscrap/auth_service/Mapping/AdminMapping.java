package com.carscrap.auth_service.Mapping;

import com.carscrap.auth_service.Dto.AdminResponseDto;
import com.carscrap.auth_service.Entity.UserEntity;

public class AdminMapping {


    public static AdminResponseDto toAdminResponse(UserEntity entity){
        if (entity==null)return null;

        AdminResponseDto adminResponseDto=new AdminResponseDto();
        adminResponseDto.setId(entity.getId());
        adminResponseDto.setUsername(entity.getUsername());
        adminResponseDto.setEmail(entity.getEmail());

        return adminResponseDto;
    }
}
