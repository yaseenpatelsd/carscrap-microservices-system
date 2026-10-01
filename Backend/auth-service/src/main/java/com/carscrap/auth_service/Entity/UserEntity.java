package com.carscrap.auth_service.Entity;

import com.carscrap.auth_service.Enum.UserRole;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "User")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "username",unique = true,nullable = false)
    private String username;
    @Column(name = "password",unique = true,nullable = false)
    private String password;
    @Column(name = "email",unique = true,nullable = false)
    private String email;
    @Column(name = "role",nullable = false)
    @Enumerated(EnumType.STRING)
    private UserRole role;


    private String otp;
    private Long otpExpiretime;
    private Boolean valid;

    private LocalDateTime lastTimeOtpRequest;


    //Staff Or Admin yard data
    private Long yardId;
}
