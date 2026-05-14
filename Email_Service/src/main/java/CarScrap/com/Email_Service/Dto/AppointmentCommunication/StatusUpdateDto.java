package CarScrap.com.Email_Service.Dto.AppointmentCommunication;

import CarScrap.com.Email_Service.Enum.FuelType;
import CarScrap.com.Email_Service.Enum.Status;
import CarScrap.com.Email_Service.Enum.VehicleType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatusUpdateDto {
    private Long appointmentId;

    private String email;
    private String username;

    private String carName;
    private Integer registrationYear;
    private VehicleType vehicleType;
    private Long dateOfExpire;
    private FuelType fuelType;
    private BigDecimal estimatePrice;
    private Status status;
}
