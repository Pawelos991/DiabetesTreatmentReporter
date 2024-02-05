package mika.pawel.diabetesTreatmentReporter.dto.error;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class ErrorResponse {
  private final boolean success = false;
  private final String message;
}
