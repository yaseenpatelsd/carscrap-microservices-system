package ScrapYard.YardService.Entity;

import ScrapYard.YardService.Enum.Country;
import ScrapYard.YardService.Enum.IndianCity;
import ScrapYard.YardService.Enum.IndianStates;
import ScrapYard.YardService.Enum.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@EnableJpaAuditing
public class YardEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name",nullable = false,unique = true)
    private String name;
    @Column(name = "city",nullable = false,unique = false)
    @Enumerated(EnumType.STRING)
    private IndianCity city;
    @Column(name = "state",nullable = false)
    @Enumerated(EnumType.STRING)
    private IndianStates state;
    @Column(name = "pincode",nullable = false)
    private String pincode;
    @Enumerated(EnumType.STRING)
    private Country country=Country.INDIA;
    @Column(name = "admin_id",unique = true,nullable = true)
    private Long adminId;

    @Column(name = "contactNo",unique = true,nullable = false)
    private String contactNo;
    @Column(name = "email", unique = true,nullable = false)
    private String email;
    @Column(name = "status",nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status;


    @ElementCollection
    @CollectionTable(name = "yard_staff_ids", joinColumns = @JoinColumn(name = "yard_id"))
    @Column(name = "staff_id")
    private List<Long> staffId = new ArrayList<>();
    @Column(name = "admin_username",unique = true)
    private String managerUsername;



    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
