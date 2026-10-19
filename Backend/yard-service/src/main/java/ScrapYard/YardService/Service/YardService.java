package ScrapYard.YardService.Service;


import ScrapYard.YardService.Dto.ResponseDto;
import ScrapYard.YardService.Dto.User.YardSearch;
import ScrapYard.YardService.Dto.YardCommunication.RequestDto;
import ScrapYard.YardService.Entity.YardEntity;
import ScrapYard.YardService.Enum.IndianCity;
import ScrapYard.YardService.Enum.IndianStates;
import ScrapYard.YardService.Enum.Status;
import ScrapYard.YardService.Exeptions.NotFoundException;
import ScrapYard.YardService.Mapping.YardMapping;
import ScrapYard.YardService.Repository.YardRepository;
import ScrapYard.YardService.Util.YardSpecification;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;




@Service
public class YardService {

    private final YardRepository yardRepository;

    public YardService(YardRepository yardRepository) {
        this.yardRepository = yardRepository;
    }


    public List<ResponseDto> findYard(YardSearch dto) {

        IndianCity city= Optional.ofNullable(dto.getCity()).map(c-> IndianCity.valueOf(c.trim().toUpperCase())).orElse(null);
        IndianStates state=Optional.ofNullable(dto.getState()).map(s-> IndianStates.valueOf(s.toUpperCase())).orElse(null);

        Specification<YardEntity> specification =
        Specification.where(YardSpecification.hasStatus(Status.ACTIVE))
                .and(YardSpecification.findByFilter(
                        dto.getName(),
                        city,
                        state,
                        dto.getPincode()
                ));


        List<YardEntity> yardEntityList = yardRepository.findAll(specification);

        return yardEntityList
                .stream()
                .map(YardMapping::toResponseDto)
                .collect(Collectors.toList());
    }

    public ScrapYard.YardService.Dto.YardCommunication.ResponseDto confirmYard(RequestDto dto){

        Optional<YardEntity> optionalYardEntity=yardRepository.findByIdAndStatus(dto.getId(),Status.ACTIVE);

        if (optionalYardEntity.isEmpty()){
            throw new NotFoundException("Yard not found .");
        }

        YardEntity yardEntity=optionalYardEntity.get();
        ScrapYard.YardService.Dto.YardCommunication.ResponseDto responseDto=new ScrapYard.YardService.Dto.YardCommunication.ResponseDto();
        responseDto.setIsValid(true);

        if (yardEntity.getName().isEmpty()){
            throw new NullPointerException("Error loading yard name  .");
        }

        if (yardEntity.getAdminId()==null){
            throw new NotFoundException("Yard Does not have a admin.");
        }
        responseDto.setAdminId(yardEntity.getAdminId());
        responseDto.setYardName(yardEntity.getName());

        return responseDto;
    }

    public ResponseDto findYardById(Long id){
        YardEntity yardEntity=findYard(id);

        if (yardEntity.getStatus()!=Status.ACTIVE){
            throw new NotFoundException("Yard Not Available");
        }

        return YardMapping.toResponseDto(yardEntity);
    }


    public List<ResponseDto> findAllYard(){
       List<YardEntity> yardEntityList=yardRepository.findByStatus(Status.ACTIVE);

       return yardEntityList.stream().map(YardMapping::toResponseDto).collect(Collectors.toList());
    }





    public YardEntity findYard(Long id){
        return yardRepository.findById(id)
                .orElseThrow(()-> new NotFoundException("Can't find a yard with proved id"));
    }

}
