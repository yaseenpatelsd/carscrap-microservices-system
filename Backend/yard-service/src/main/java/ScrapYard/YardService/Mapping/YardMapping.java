package ScrapYard.YardService.Mapping;

import ScrapYard.YardService.Dto.RequestDto;
import ScrapYard.YardService.Dto.ResponseDto;
import ScrapYard.YardService.Entity.YardEntity;

public class YardMapping {

    public static YardEntity toEntity(RequestDto dto){
        if (dto==null)return null;

        YardEntity entity=new YardEntity();
        entity.setName(dto.getName());
        entity.setCity(dto.getCity());
        entity.setState(dto.getState());
        entity.setCountry(dto.getCountry());
        entity.setContactNo(dto.getContactNo());
        entity.setPincode(dto.getPincode());
        entity.setEmail(dto.getEmail());
        entity.setStatus(dto.getStatus());


        return entity;
    }

    public static ResponseDto toResponseDto(YardEntity entity){
        if (entity==null) return null;

        ResponseDto dto=new ResponseDto();
        dto.setYardId(entity.getId());
        dto.setName(entity.getName());

        dto.setCity(entity.getCity() != null ? entity.getCity().name() : null);
        dto.setState(entity.getState() != null ? entity.getState().name() : null);
        dto.setCountry(entity.getCountry() != null ? entity.getCountry().name() : null);

        dto.setPincode(entity.getPincode());
        dto.setContactNo(entity.getContactNo());

        dto.setManagedBy(entity.getManagerUsername());

        dto.setEmail(entity.getEmail());
        dto.setStatus(entity.getStatus() != null ? entity.getStatus().name() : null);

        return dto;
    }
}
