package mika.pawel.diabetesTreatmentReporter.security;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public class UserAuthenticationResult {
  private final String token;
  private final String expiryDate;
}