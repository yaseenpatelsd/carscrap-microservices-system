package ScrapYard.YardService.Dto;

import ScrapYard.YardService.Enum.Country;
import ScrapYard.YardService.Enum.IndianCity;
import ScrapYard.YardService.Enum.IndianStates;
import ScrapYard.YardService.Enum.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResponseDto {

    private Long yardId;
    private String name;
    private String city;
    private String state;
    private String country;
    private String pincode;
    private String managedBy;

    private String contactNo;
    private String email;
    private String status;


}
