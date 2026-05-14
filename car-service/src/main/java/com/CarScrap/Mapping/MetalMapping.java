package com.CarScrap.Mapping;

import com.CarScrap.Dto.MetalRequestDto;
import com.CarScrap.Dto.MetalResponseDto;
import com.CarScrap.Entity.MetalEntity;
import org.springframework.stereotype.Component;

public class MetalMapping {
    public static MetalEntity toEntity(MetalRequestDto dto){
        if (dto==null)return null;

        MetalEntity entity=new MetalEntity();
        entity.setSteel(dto.getSteel());
        entity.setAluminum(dto.getAluminum());
        entity.setCopper(dto.getCopper());
        entity.setPlastic(dto.getPlastic());
        entity.setRubber(dto.getRubber());
        entity.setIron(dto.getIron());
        entity.setLead(dto.getLead());
        entity.setElectronics(dto.getElectronics());
        return entity;
    }

    public static MetalResponseDto toResponse(MetalEntity entity){
        if (entity==null)return null;

        MetalResponseDto dto=new MetalResponseDto();
        dto.setSteel(entity.getSteel());
        dto.setAluminum(entity.getAluminum());
        dto.setCopper(entity.getCopper());
        dto.setPlastic(entity.getPlastic());
        dto.setRubber(entity.getRubber());
        dto.setIron(entity.getIron());
        dto.setLead(entity.getLead());
        dto.setElectronics(entity.getElectronics());

        return dto;
    }
}
