package mika.pawel.diabetesTreatmentReporter.dto.report;

import javax.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReportResponse extends ReportBase {
  @NotNull
  Integer id;
  @NotNull
  String patientsName;
}
