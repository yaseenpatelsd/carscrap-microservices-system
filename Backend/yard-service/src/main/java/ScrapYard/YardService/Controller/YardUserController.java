package ScrapYard.YardService.Controller;

import ScrapYard.YardService.Dto.GetYard.GetYardByStatus;
import ScrapYard.YardService.Dto.ResponseDto;
import ScrapYard.YardService.Dto.User.YardSearch;
import ScrapYard.YardService.Service.YardService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/search")
public class YardUserController {
    private final YardService yardService;

    public YardUserController(YardService yardService) {
        this.yardService = yardService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseDto> findYardById(@PathVariable Long id){
        ResponseDto dto= yardService.findYardById(id);
        return ResponseEntity.ok(dto);
    }
    @PostMapping
    public ResponseEntity<List<ResponseDto>> findYards(@RequestBody @Valid YardSearch dto){
        List<ResponseDto> yards=yardService.findYard(dto);
        return ResponseEntity.ok(yards);
    }




    @GetMapping("/all")
    public ResponseEntity<List<ResponseDto>> findAllYard(){
        List<ResponseDto> yards=yardService.findAllYard();
        return ResponseEntity.ok(yards);
    }
}
