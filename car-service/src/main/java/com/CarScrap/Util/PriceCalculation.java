package com.CarScrap.Util;

import com.CarScrap.Entity.CarEntity;
import com.CarScrap.Entity.MetalEntity;
import com.CarScrap.Enum.VehicleType;
import com.CarScrap.Exception.NotFoundException;
import com.CarScrap.Repository.MetalRepository;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class PriceCalculation {

    private final MetalRepository metalRepository;
    private final CalculateWeight calculateWeight;

    public PriceCalculation(MetalRepository metalRepository, CalculateWeight calculateWeight) {
        this.metalRepository = metalRepository;
        this.calculateWeight = calculateWeight;
    }

    public BigDecimal finalPrice(Double weight,Double metal, Double metalPrice){
        BigDecimal finalPrice=BigDecimal.valueOf(metal).multiply(BigDecimal.valueOf(metalPrice));
        return finalPrice;
    }

    public BigDecimal findPrice(CarEntity car){
        Double weight=calculateWeight.calculateWeight(car);
        Double steel=null;
        Double aluminum=null;
        Double copper=null;
        Double plastic=null;
        Double rubber=null;
        Double iron=null;
        Double lead=null;
        Double electronics=null;


        if (car.getVehicleType().equals(VehicleType.HATCHBACK)){
            iron=weight*0.15;
            steel=weight*0.50;
            aluminum=weight*0.10;
            copper=weight*0.02;
            lead=weight*0.01;
            plastic=weight*0.10;
            rubber=weight*0.05;
            electronics=weight*0.02;
        }
        if (car.getVehicleType().equals(VehicleType.SEDAN)){
            iron=weight*0.16;
            steel=weight*0.52;
            aluminum=weight*0.09;
            copper=weight*0.02;
            lead=weight*0.01;
            plastic=weight*0.10;
            rubber=weight*0.05;
            electronics=weight*0.02;
        }
        if (car.getVehicleType().equals(VehicleType.SUV)){
            steel=weight*0.52;
          iron=weight*0.17;
          aluminum=weight*0.11;
          copper=weight*0.02;
          lead=weight*0.02;
          plastic=weight*0.08;
          rubber=weight*0.05;
          electronics=weight*0.03;
        }

        MetalEntity metalEntity=metalRepository.findById(1l).orElseThrow(()-> new NotFoundException("Can't find metal price entity"));


        BigDecimal finalPriceIron=finalPrice(weight,iron,metalEntity.getIron());

       BigDecimal finalPriceSteal= finalPrice(weight,steel,metalEntity.getSteel());

        BigDecimal finalPricePlastic= finalPrice(weight,plastic,metalEntity.getPlastic());

        BigDecimal finalPriceRubber=finalPrice(weight,rubber,metalEntity.getRubber());


        BigDecimal finalPriceElectronics=finalPrice(weight,electronics,metalEntity.getElectronics());

        BigDecimal finalPriceAluminum=finalPrice(weight,aluminum,metalEntity.getAluminum());

        BigDecimal finalPriceCopper= finalPrice(weight,copper,metalEntity.getCopper());

        BigDecimal finalPriceLead=finalPrice(weight,lead,metalEntity.getLead());




        BigDecimal totalFinal=finalPriceIron.add(finalPriceAluminum).add(finalPriceCopper).add(finalPriceLead).add(finalPriceSteal).add(finalPricePlastic).add(finalPriceRubber).add(finalPriceElectronics);

        return totalFinal;
    }



}
