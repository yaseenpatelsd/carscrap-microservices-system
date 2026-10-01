package ScrapYard.YardService.Dto;

import ScrapYard.YardService.Enum.Status;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatusChangeDto {
    @NotNull(message = "YardId required to process this api")
    private Long yardId;
    @NotNull(message = "status required to process this api")
    private Status status;
}
