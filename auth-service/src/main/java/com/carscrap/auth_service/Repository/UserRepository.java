package com.carscrap.auth_service.Repository;

import com.carscrap.auth_service.Entity.UserEntity;
import com.carscrap.auth_service.Enum.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.management.relation.Role;
import java.util.List;
import java.util.Optional;
@Repository
public interface UserRepository extends JpaRepository<UserEntity,Long> {

  Optional<UserEntity> findByUsername(String username);
  Boolean existsByUsername(String username);
  Boolean existsByEmail(String email);
  List<UserEntity> findByRole(UserRole role);
  List<UserEntity> findAllById(Iterable<Long> ids);



}
