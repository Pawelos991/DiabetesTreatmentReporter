package mika.pawel.diabetesTreatmentReporter.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(schema = "public", name = "user")
@Getter
@Setter
public class UserEntity {
  private static final String GENERATOR_NAME = "user_generator";

  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = GENERATOR_NAME)
  @SequenceGenerator(
      name = GENERATOR_NAME,
      sequenceName = "user_seq",
      schema = "public",
      allocationSize = 1)
  @Column(name = "id", nullable = false)
  private Integer id;

  @Column(name = "username", nullable = false)
  private String username;

  @Column(name = "password", nullable = false)
  private String password;

  @Column(name = "salt", nullable = false)
  private String salt;

  @ManyToOne
  @JoinColumn(name = "user_role", nullable = false)
  private RoleEntity role;

  @Column(name = "name", nullable = false)
  private String name;

  @Column(name = "surname", nullable = false)
  private String surname;

  @ManyToOne
  @JoinColumn(name = "doctor")
  private UserEntity doctor;

  public String getFullName() {
    return name + " " + surname;
  }

}
