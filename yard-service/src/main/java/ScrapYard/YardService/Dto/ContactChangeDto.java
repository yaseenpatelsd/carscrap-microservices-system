package ScrapYard.YardService.Dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactChangeDto {
    @NotNull(message = "YardId required to process this api")
    private Long yardId;
    @NotBlank
    @Pattern(regexp = "^[0-9]{10}$", message = "Contact must be 10 digits")
    private String Contact;
    @Email
    @NotBlank
    private String email;
}
