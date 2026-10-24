package com.CarScrap.Repository;

import com.CarScrap.Entity.MetalEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MetalRepository extends JpaRepository<MetalEntity,Long> {
}
