package ScrapYard.YardService.Dto.User;

import ScrapYard.YardService.Enum.IndianCity;
import ScrapYard.YardService.Enum.IndianStates;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class YardSearch {
    private String name;
    private String city;
    private String state;
    private String pincode;
}
