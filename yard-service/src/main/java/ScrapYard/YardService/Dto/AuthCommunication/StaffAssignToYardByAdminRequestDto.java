package ScrapYard.YardService.Dto.AuthCommunication;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StaffAssignToYardByAdminRequestDto {
    @NotNull
    private  Long yardId;
    @NotNull
    private Long staffId;
}
