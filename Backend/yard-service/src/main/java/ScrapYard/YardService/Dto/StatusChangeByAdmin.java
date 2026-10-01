package ScrapYard.YardService.Dto;

import ScrapYard.YardService.Enum.Status;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StatusChangeByAdmin {
    @NotNull(message = "status required to process this api")
    private Status status;
}
