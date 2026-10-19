package ScrapYard.YardService.Dto.AuthCommunication;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StaffIDsResponseDto {
    private List<Long> id;
}
