package com.CarScrap.Service;

import com.CarScrap.Dto.AppointmentCommunication.CarRequestDto;
import com.CarScrap.Dto.AppointmentCommunication.CarResposeDto;
import com.CarScrap.Dto.GetCar;
import com.CarScrap.Dto.RequestDto;
import com.CarScrap.Dto.ResponseDto;
import com.CarScrap.Entity.CarEntity;
import com.CarScrap.Entity.MetalEntity;
import com.CarScrap.Enum.City;
import com.CarScrap.Enum.FuelType;
import com.CarScrap.Enum.Principle;
import com.CarScrap.Exception.*;
import com.CarScrap.Jwt.JwtExtract;
import com.CarScrap.Mapping.CarMapping;
import com.CarScrap.Repository.CarRepository;
import com.CarScrap.Repository.MetalRepository;
import com.CarScrap.Util.PriceCalculation;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class CarService {
    private final CarRepository carRepository;
    private final JwtExtract jwtExtract;
    private final MetalRepository metalRepository;
    private final PriceCalculation priceCalculation;

    public CarService(CarRepository carRepository, JwtExtract jwtExtract, MetalRepository metalRepository, PriceCalculation priceCalculation) {
        this.carRepository = carRepository;
        this.jwtExtract = jwtExtract;

        this.metalRepository = metalRepository;
        this.priceCalculation = priceCalculation;
    }

    public ResponseDto getCarPrice( Principle principle, RequestDto dto){
        CarEntity car=CarMapping.toEntity(dto);

        car.setUserId(principle.getId());


        int expirey=0;

        if (car.getCity().equals(City.DELHI) && car.getFuelType().equals(FuelType.DIESEL)){
          expirey=10;
        }else {
           expirey=15;
        }

        car.setDateOfExpire((long) (car.getRegistrationYear()+expirey));

        Long DateOfExpire= (long) (car.getRegistrationYear()+expirey);
        int localYear= LocalDate.now().getYear();

        if (DateOfExpire>localYear){
            car.setEligible(false);
        }else {
            car.setEligible(true);
        }

        if (!car.getEligible()){
            throw new NotExpireException("Not Expired till now!");
        }

      try {
          car.setEstimatePrice(priceCalculation.findPrice(car));
      }catch (Exception e){
          throw new SomethingIsWrongException(e.getMessage());
      }

        CarEntity savedCar=carRepository.save(car);

        return CarMapping.toResponseDto(savedCar);
    }




    public ResponseDto getCarDetails(GetCar carDto,Principle principle){
        CarEntity car=carRepository.findById(carDto.getId())
                .orElseThrow(()-> new NotFoundException("Car Not found By ID"));

        if (!car.getUserId().equals(principle.getId())){
            throw new NotAllowedException("Car Entity does not belongs to you.");
        }
        return CarMapping.toResponseDto(car);
    }

    public List<ResponseDto> getAllRequest(Principle principle){
        List<CarEntity> carEntities=carRepository.findByUserIdAndEligibleTrueAndDeletedFalse(principle.getId());

        return carEntities.stream().map(CarMapping::toResponseDto).collect(Collectors.toList());
    }





    public CarResposeDto confirmdetails( CarRequestDto dto){

        if (!carRepository.existsById(dto.getCarDetailId())){
            throw new CarEntityNotFound("Car Details does not exist by id.");
        }
       CarEntity car=carEntity(dto.getCarDetailId());

       if(!car.getUserId().equals(dto.getUserId())){
           throw new NotAllowedException("The Car Details not belongs to you");
       }
       if (car.getDeleted()){
           throw new ResourceNotAvailableException("Deleted Entity");
       }
       if (!car.getEligible()){
           throw new NotExpireException("Car is not expire to scrap");
       }



       CarResposeDto resposeDto=new CarResposeDto();
       resposeDto.setName(car.getName());
       resposeDto.setVehicleType(car.getVehicleType());
       resposeDto.setEstimatePrice(car.getEstimatePrice());
       resposeDto.setDateOfExpire(car.getDateOfExpire());
       resposeDto.setRegistrationYear(car.getRegistrationYear());
       resposeDto.setFuelType(car.getFuelType());
       resposeDto.setCity(String.valueOf(car.getCity()));
       resposeDto.setIsValid(true);

        System.out.println(resposeDto);

       return resposeDto;

    }





    public CarEntity carEntity(Long id){
        return carRepository.findById(id)
                .orElseThrow(()-> new NotFoundException("OOPS! Cant't find your car details"));
    }

    public MetalEntity findMetal(Long id){
        return metalRepository.findById(id)
                .orElseThrow(()-> new NotFoundException("OOPS! Cant't find Metal details"));
    }



}
