package ScrapYard.YardService.Repository;

import ScrapYard.YardService.Entity.YardEntity;
import ScrapYard.YardService.Enum.IndianCity;
import ScrapYard.YardService.Enum.IndianStates;
import ScrapYard.YardService.Enum.Status;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface YardRepository extends JpaRepository<YardEntity,Long>, JpaSpecificationExecutor<YardEntity> {

    boolean existsById(Long id);
    boolean existsByIdAndStatus(Long id , Status status);

    List<YardEntity> findByStatus(Status status);

    Optional<YardEntity> findByIdAndStatus(Long id,Status status);
    Optional<YardEntity> findByAdminId(Long adminId);
    Optional<YardEntity> findByStaffIdContains(Long staffId);
}
