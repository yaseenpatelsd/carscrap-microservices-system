package ScrapYard.YardService.Dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RemoveStaffDto {
    @NotNull(message = "YardId required to process this api")

    private Long yardId;
    @NotNull(message = "StaffId required to process this api")

    private Long staffId;
}
