package mika.pawel.diabetesTreatmentReporter.dao;

import java.util.List;
import java.util.Optional;
import mika.pawel.diabetesTreatmentReporter.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity, Integer> {
  Optional<UserEntity> findByUsername(String username);
  List<UserEntity> findAllByDoctorId(Integer id);
  List<UserEntity> findAllByRoleCode(Character code);
}
