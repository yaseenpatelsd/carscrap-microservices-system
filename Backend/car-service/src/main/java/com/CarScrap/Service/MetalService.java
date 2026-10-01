package com.CarScrap.Service;


import com.CarScrap.Dto.MetalRequestDto;
import com.CarScrap.Dto.MetalResponseDto;
import com.CarScrap.Entity.MetalEntity;
import com.CarScrap.Exception.NotFoundException;
import com.CarScrap.Mapping.MetalMapping;
import com.CarScrap.Repository.MetalRepository;
import org.springframework.stereotype.Service;

@Service
public class MetalService {

    private final MetalRepository metalRepository;

    public MetalService(MetalRepository metalRepository) {
        this.metalRepository = metalRepository;
    }


    public MetalResponseDto editPrice(MetalRequestDto dto){
        MetalEntity metalEntity=metalRepository.findById(1l)
                .orElseThrow(()->new NotFoundException("Can't find metal entity something wrong in db"));

        if (dto.getIron()!=null){
            metalEntity.setIron(dto.getIron());
        }
        if (dto.getAluminum()!=null){
            metalEntity.setAluminum(dto.getAluminum());
        }
        if (dto.getCopper()!=null){
            metalEntity.setCopper(dto.getCopper());
        }
        if (dto.getLead()!=null){
            metalEntity.setLead(dto.getLead());
        }
        if (dto.getSteel()!=null){
            metalEntity.setSteel(dto.getSteel());
        }
        if (dto.getRubber()!=null){
            metalEntity.setRubber(dto.getRubber());
        }
        if (dto.getPlastic()!=null){
            metalEntity.setPlastic(dto.getPlastic());
        }
        if (dto.getElectronics()!=null){
            metalEntity.setElectronics(dto.getElectronics());
        }
        if (dto.getCopper()!=null){
            metalEntity.setCopper(dto.getCopper());
        }

        MetalEntity metalEntity1=metalRepository.save(metalEntity);

        return MetalMapping.toResponse(metalEntity1);
    }


    public MetalResponseDto getMetalPrice(){
        MetalEntity metalEntity=metalRepository.findById(1l).orElseThrow(()->new NotFoundException("Can't find metal prices ."));

        return MetalMapping.toResponse(metalEntity);
    }
}
