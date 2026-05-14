package ScrapYard.YardService.Dto.AppointmentCommunication;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StaffVerifyResponseDto {
    private Boolean valid;
    private Long adminId;
}
