package CarScrap.com.Email_Service.Dto.AppointmentCommunication;

import CarScrap.com.Email_Service.Enum.FuelType;
import CarScrap.com.Email_Service.Enum.Status;
import CarScrap.com.Email_Service.Enum.VehicleType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingRequestDto {
    //username
    private String username;
    private String email;

    //cardetials
    private String name;
    private Integer registrationYear;
    private VehicleType vehicleType;
    private Long dateOfExpire;
    private FuelType fuelType;
    private BigDecimal estimatePrice;

    //booking
    private Long bookingId;
    private LocalDate dateOfAppointment;
    private Status status;
}
