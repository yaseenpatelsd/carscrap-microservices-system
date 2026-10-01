package ScrapYard.YardService.Dto.AppointmentCommunication;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StaffVerifyRequestDto {
    @NotNull(message = "YardId required to process this api")
    private Long yardId;
    @NotNull(message = "StaffID required to process this api")
    private Long staffId;
}
