package ScrapYard.YardService.Dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminAssign {

    @NotNull(message = "YardId required to process this api")
    private Long yardId;
    @NotNull
    private Long adminId;
}
