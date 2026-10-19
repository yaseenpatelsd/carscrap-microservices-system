package ScrapYard.YardService.Dto.GetYard;

import ScrapYard.YardService.Enum.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetYardByStatus {
    private Status status;
}
