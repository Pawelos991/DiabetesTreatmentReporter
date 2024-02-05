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
@Table(schema = "public", name = "report")
@Getter
@Setter
public class ReportEntity {
  private static final String GENERATOR_NAME = "report_generator";

  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = GENERATOR_NAME)
  @SequenceGenerator(
      name = GENERATOR_NAME,
      sequenceName = "report_seq",
      schema = "public",
      allocationSize = 1)
  @Column(name = "id", nullable = false)
  private Integer id;

  @ManyToOne
  @JoinColumn(name = "user_id", nullable = false)
  private UserEntity user;

  @Column(name = "year", nullable = false)
  private Integer year;

  @Column(name = "month", nullable = false)
  private Integer month;

  @Column(name = "avg_sugar_level", nullable = false)
  private Integer avgSugarLevel;

  @Column(name = "time_in_target", nullable = false)
  private Integer timeInTarget;

  @Column(name = "time_below_target", nullable = false)
  private Integer timeBelowTarget;

  @Column(name = "time_above_target", nullable = false)
  private Integer timeAboveTarget;

  @Column(name = "body_weight", nullable = false)
  private Integer bodyWeight;

  @Column(name = "deleted", nullable = false)
  private Boolean deleted;

}
