package mika.pawel.diabetesTreatmentReporter.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Authority {
  ADMINISTRATOR("Administrator"),
  DOCTOR("Doctor"),
  PATIENT("Patient");

  private final String name;
}
