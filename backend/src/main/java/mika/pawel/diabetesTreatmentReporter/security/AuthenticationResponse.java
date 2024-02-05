package mika.pawel.diabetesTreatmentReporter.security;

import javax.validation.constraints.NotNull;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import mika.pawel.diabetesTreatmentReporter.dto.user.UserResponse;

@RequiredArgsConstructor
@Getter
public class AuthenticationResponse {
  @NotNull
  private final boolean isAuthenticated;
  private final UserResponse userResponse;
  private final String tokenExpiryDate;
}
