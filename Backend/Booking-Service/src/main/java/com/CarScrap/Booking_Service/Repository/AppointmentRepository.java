package com.CarScrap.Booking_Service.Repository;

import com.CarScrap.Booking_Service.Entity.AppointmentBookingEntity;
import com.CarScrap.Booking_Service.Enum.Status;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AppointmentRepository extends JpaRepository<AppointmentBookingEntity,Long> {

    Boolean existsByUserIdAndCarDetailIdAndYardIdAndDateOfAppointment(Long userId, Long carDetailId, Long yardId,LocalDate dateOfAppointment);


    List<AppointmentBookingEntity> findByStatusAndUserId(Status status,Long userId);
    List<AppointmentBookingEntity> findByUserId(Long userId);
    List<AppointmentBookingEntity> findByDateOfAppointment(LocalDate dateOfAppointment);

    List<AppointmentBookingEntity> findByYardIdAndDateOfAppointmentGreaterThanEqualAndDateOfAppointmentLessThan(Long yardId,LocalDate start,
                                                                                                            LocalDate end);

    List<AppointmentBookingEntity> findByYardId(Long yardId);
    List<AppointmentBookingEntity> findByUserIdAndDateOfAppointment(Long yardId,LocalDate dateOfAppointment);
    Boolean existsByUserIdAndCarDetailIdAndDateOfAppointmentAndIdNot(Long userId,Long carDetailId,LocalDate dateOfAppointment,Long id);

    List<AppointmentBookingEntity>
    findByStaffIdAndDateOfAppointmentGreaterThanEqualAndDateOfAppointmentLessThan(
            Long staffId,
            LocalDate startDate,
            LocalDate endDate
    );}


