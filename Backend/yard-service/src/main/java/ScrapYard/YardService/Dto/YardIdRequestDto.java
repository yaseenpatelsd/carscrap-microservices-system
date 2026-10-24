package ScrapYard.YardService.Dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class YardIdRequestDto {
    @NotNull(message = "yard id is required ")
    private Long yardId;
}
