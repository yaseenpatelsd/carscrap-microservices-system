package com.CarScrap.Repository;

import com.CarScrap.Entity.CarEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CarRepository extends JpaRepository<CarEntity,Long> {

    List<CarEntity> findByUserIdAndEligibleTrueAndDeletedFalse(Long userId);
}
