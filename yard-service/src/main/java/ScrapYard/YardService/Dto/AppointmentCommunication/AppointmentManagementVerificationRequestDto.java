package ScrapYard.YardService.Dto.AppointmentCommunication;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AppointmentManagementVerificationRequestDto {
    @NotNull(message = "YardId required to process this api")
    private Long yardId;
    private Long managementId;
}
