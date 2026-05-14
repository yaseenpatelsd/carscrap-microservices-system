package ScrapYard.YardService.Dto.AuthCommunication;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminRequest {
    @NotNull(message = "AdminId required to process this api")

    private Long adminId;
}
