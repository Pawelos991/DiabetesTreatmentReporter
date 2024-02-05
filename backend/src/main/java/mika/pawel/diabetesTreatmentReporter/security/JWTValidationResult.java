package mika.pawel.diabetesTreatmentReporter.security;

public enum JWTValidationResult {
  VALID,
  INVALID_TOKEN,
  INVALID_SIGNATURE,
  EXPIRED_TOKEN,
  UNSUPPORTED_TOKEN,
  OTHER_ERROR
}