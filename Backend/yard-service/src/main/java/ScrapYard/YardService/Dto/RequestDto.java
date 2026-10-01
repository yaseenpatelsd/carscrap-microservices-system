package ScrapYard.YardService.Dto;

import ScrapYard.YardService.Enum.Country;
import ScrapYard.YardService.Enum.IndianCity;
import ScrapYard.YardService.Enum.IndianStates;
import ScrapYard.YardService.Enum.Status;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RequestDto {
    @NotBlank
    private String name;
    @NotNull
    private IndianCity city;
    @NotNull
    private IndianStates state;
    @NotNull
    private String pincode;
    @NotNull
    private Country country;

    @NotNull
    @Pattern(regexp = "^[0-9]{10}$", message = "Contact must be 10 digits")
    private String contactNo;
    @NotBlank
    @Email
    private String email;
    @NotNull
    private Status status;
}
