package ScrapYard.YardService.Dto.YardCommunication;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponseDto {
    @NotEmpty
    private Boolean isValid;
    @NotBlank(message = "yard name can't be empty .")
    private String yardName;
    @NotNull(message = "Admin Id must Not Be Null")
    private Long adminId;

}
