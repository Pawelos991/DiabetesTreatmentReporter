package mika.pawel.diabetesTreatmentReporter.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(schema = "public", name = "role")
@Getter
@Setter
public class RoleEntity {
  private static final String GENERATOR_NAME = "role_generator";

  @Id
  @Column(name = "code", nullable = false)
  private Character code;

  @Column(name = "name", nullable = false)
  private String name;

}
