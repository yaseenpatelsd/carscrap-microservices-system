package com.CarScrap.Booking_Service.Entity;

import com.CarScrap.Booking_Service.Enum.FuelType;
import com.CarScrap.Booking_Service.Enum.Status;
import com.CarScrap.Booking_Service.Enum.VehicleType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@EntityListeners(AuditingEntityListener.class)
public class AppointmentBookingEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "user_id",nullable = false)
    private Long userId;
    @Column(name = "user_detail_id",unique = true,nullable = false)
    private Long carDetailId;
    @Column(name = "yard_id",nullable = false)
    private Long yardId;
    @Column(name = "staff_id")
    private Long staffId;
    @Column(name = "adminid")
    public Long adminId;
   @Column(name = "staff_username")
    private String staffUsername;
    @Column(name = "date_of_appointment",nullable = false)
    private LocalDate dateOfAppointment;
    @Column(name = "status",nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status=Status.PENDING;
    @Column(name = "user_mobile_no",nullable = false)
    private String userMobileNo;

    @Column(name = "email")
    private String email;
    private String username;
    //cardetials
    private String carName;
    private String city;
    private String yardName;
    private Integer registrationYear;
    private VehicleType vehicleType;
    private Long dateOfExpire;
    private FuelType fuelType;
    private BigDecimal estimatePrice;



    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime updatedAt;



    //

    @Column(name = "cancel_name")
    private String cancelReason;
    private LocalDateTime cancelTime;
    private Long userMissedAppointmentCount;
    private LocalDate userMissedDay;


}
