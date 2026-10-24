package com.CarScrap.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "metal_price")

public class MetalEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "steal_price",nullable = false)
    private Double steel;
    @Column(name = "aluminum_price",nullable = false)
    private Double aluminum;
    @Column(name = "copper_price",nullable = false)
    private Double copper;
    @Column(name = "plastic_price",nullable = false)
    private Double plastic;
    @Column(name = "rubber_price",nullable = false)
    private Double rubber;
    @Column(name = "iron_price",nullable = false)
    private Double iron;
    @Column(name = "lead_price",nullable = false)
    private Double lead;
    @Column(name = "electronics_price",nullable = false)
    private Double electronics;

    private LocalDateTime createdAt;

    @PrePersist
    public void setCreatedAt(){
        this.createdAt=LocalDateTime.now();
    }
}
