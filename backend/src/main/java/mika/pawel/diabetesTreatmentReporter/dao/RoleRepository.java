package mika.pawel.diabetesTreatmentReporter.dao;

import mika.pawel.diabetesTreatmentReporter.model.RoleEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<RoleEntity, Character> {
}
