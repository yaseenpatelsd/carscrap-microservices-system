package ScrapYard.YardService.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GlobalResponseDto {

    private LocalDateTime localDateTime;
    private int status;
    private String message;
    private String error;
    private String path;
}
