package mika.pawel.diabetesTreatmentReporter.dto;

public record BasicResponse(boolean success) {
  public static BasicResponse ok() {
    return new BasicResponse(true);
  }
}
