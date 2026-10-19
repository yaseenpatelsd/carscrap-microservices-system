package ScrapYard.YardService.Dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RemoveStaffAdminRequest {
    @NotNull(message = "StaffId required to process this api")

    private Long staffId;
}
