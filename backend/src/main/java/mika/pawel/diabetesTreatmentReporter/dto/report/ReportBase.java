package mika.pawel.diabetesTreatmentReporter.dto.report;

import javax.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReportBase {
  @NotNull
  Integer year;
  @NotNull
  Integer month;
  @NotNull
  Integer avgSugarLevel;
  @NotNull
  Integer timeInTarget;
  @NotNull
  Integer timeBelowTarget;
  @NotNull
  Integer timeAboveTarget;
  @NotNull
  Integer bodyWeight;
}
