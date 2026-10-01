package com.CarScrap.Entity;

import com.CarScrap.Enum.City;
import com.CarScrap.Enum.FuelType;
import com.CarScrap.Enum.VehicleType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class CarEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "user_id",nullable = false)
    private Long userId;
    @Column(name = "name",nullable = false)
    private String name;
    @Column(name = "registrationYear")
    private Integer registrationYear;
    @Enumerated(value = EnumType.STRING)
    @Column(name = "Vehicle_type",nullable = false)
    private VehicleType vehicleType;
    @Column(name = "fuel_category",nullable = false)
    private FuelType fuelType;
    @Column(name = "city",nullable = false)
    @Enumerated(value = EnumType.STRING)
    private City city;
    @Column(name = "estimatePrice",nullable = true)
    private BigDecimal estimatePrice;
    @Column(name = "eligible",nullable = false)
    private Boolean eligible=true;
    @Column(name = "deleted",nullable = false)
    private Boolean deleted=false;

    @Column(name = "Year of Expire",nullable = false)
    private Long dateOfExpire;



    private LocalDateTime createdAt;


    @PrePersist
    public void setCreatedAt() {
        this.createdAt=LocalDateTime.now();
    }
}
