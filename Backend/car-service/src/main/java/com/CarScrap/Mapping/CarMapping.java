package com.CarScrap.Mapping;

import com.CarScrap.Dto.RequestDto;
import com.CarScrap.Dto.ResponseDto;
import com.CarScrap.Entity.CarEntity;
import com.CarScrap.Enum.City;
import com.CarScrap.Enum.FuelType;
import com.CarScrap.Enum.VehicleType;

import java.util.Optional;

public class CarMapping {

    public static CarEntity toEntity(RequestDto dto){
        if(dto==null)return null;

        City city= Optional.ofNullable(dto.getCity()).map(c->City.valueOf(dto.getCity().trim().toUpperCase())).orElse(null);
        VehicleType vehicleType= Optional.ofNullable(dto.getVehicleType()).map(c->VehicleType.valueOf(dto.getVehicleType().trim().toUpperCase())).orElse(null);
        FuelType fuelType = Optional.ofNullable(dto.getFuelType()).map(c->FuelType.valueOf(dto.getFuelType().trim().toUpperCase())).orElse(null);


        CarEntity entity=new CarEntity();
        entity.setName(dto.getName());
        entity.setRegistrationYear(dto.getRegistrationYear());
        entity.setVehicleType(vehicleType);
        entity.setCity(city);
        entity.setFuelType(fuelType);


        return entity;
    }


    public static ResponseDto toResponseDto(CarEntity entity){
        if(entity==null)return null ;

        ResponseDto dto=new ResponseDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setRegistrationYear(entity.getRegistrationYear());
        dto.setVehicleType(entity.getVehicleType());
        dto.setDateOfExpire(entity.getDateOfExpire());
        dto.setCity(entity.getCity());
        dto.setEstimatePrice(entity.getEstimatePrice());
        dto.setEligible(entity.getEligible());
        dto.setFuelType(entity.getFuelType());


        return dto;
    }
}
