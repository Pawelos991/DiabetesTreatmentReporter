package mika.pawel.diabetesTreatmentReporter.dto.report;

import javax.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReportRequest {
  @NotNull
  private ReportBase reportBase;
  @NotNull
  private String checksum;
}
