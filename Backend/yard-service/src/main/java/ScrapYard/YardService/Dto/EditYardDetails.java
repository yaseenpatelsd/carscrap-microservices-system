package ScrapYard.YardService.Dto;

import ScrapYard.YardService.Enum.Country;
import ScrapYard.YardService.Enum.IndianCity;
import ScrapYard.YardService.Enum.IndianStates;
import ScrapYard.YardService.Enum.Status;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EditYardDetails {
    @NotNull(message = "YardId required to process this api")
    private Long yardId;

    private String name;

    @Pattern(regexp = "^[0-9]{10}$", message = "Contact must be 10 digits")
    private String contactNo;
    @Email
    private String email;

    private String status;
}
